// Central API client for the Applyqik Laravel backend.
// Every call goes through apiFetch, which handles the auth token, the
// standard { success, message, data|errors } envelope, and error shaping
// so components never touch fetch() directly or parse envelopes themselves.

const BASE_URL = 'https://api.applyqik.com/api/v1';

const TOKEN_KEY = 'applyqik_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  setToken(null);
}

// A thrown ApiError always carries the backend's message + field errors,
// so a form can show them inline without guessing at the response shape.
export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message || 'Something went wrong.');
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || null;
  }
}

async function apiFetch(path, { method = 'GET', body, auth = true, isForm = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (!isForm) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // fetch only rejects on network failure, not HTTP errors
    throw new ApiError('Can\'t reach the server. Check your connection and try again.', {
      status: 0,
    });
  }

  // 204 No Content and empty bodies
  const text = await res.text();
  const json = text ? safeParse(text) : null;

  if (!res.ok) {
    throw new ApiError(json?.message || `Request failed (${res.status}).`, {
      status: res.status,
      errors: json?.errors || null,
    });
  }

  // Backend wraps everything in { success, message, data }
  //
// with the block below. Non-paginated endpoints (login, profile, single
// resource fetches) are completely unaffected -- `meta` simply won't be
// present on those responses, so nothing gets attached. Paginated
// endpoints now carry `.meta` as a property on the returned data itself
// (arrays and objects can both hold extra properties in JS), so every
// existing call site that expects apiFetch to return the resource directly
// keeps working exactly as before -- callers just gain the ability to read
// `result.meta` when it's there.
 
  // return json?.data !== undefined ? json.data : json;
  if (json?.data !== undefined) {
    if (json.meta !== undefined && json.data && typeof json.data === 'object') {
      json.data.meta = json.meta;
    }
    return json.data;
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}


// ─── Auth ────────────────────────────────────────────────────────────
export const auth = {
  register: (payload) => apiFetch('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => apiFetch('/auth/login', { method: 'POST', body: payload, auth: false }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/auth/user'),
};

// ─── Profile (also the onboarding-progress write path) ───────────────
export const profile = {
  get: () => apiFetch('/profile'),
  update: (payload) => apiFetch('/profile', { method: 'PUT', body: payload }),
 
  // Onboarding convenience wrappers — thin, self-documenting calls the
  // onboarding page uses so its intent reads clearly.
  saveOnboardingStep: (step, extra = {}) =>
    apiFetch('/profile', { method: 'PUT', body: { onboarding_step: step, ...extra } }),
  completeOnboarding: (extra = {}) =>
    apiFetch('/profile', { method: 'PUT', body: { onboarding_complete: true, ...extra } }),
};

// ─── Job Preferences ─────────────────────────────────────────────────
export const preferences = {
  list: () => apiFetch('/preferences'),
  create: (payload) => apiFetch('/preferences', { method: 'POST', body: payload }),
  update: (id, payload) => apiFetch(`/preferences/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiFetch(`/preferences/${id}`, { method: 'DELETE' }),
};

// ─── Resume ──────────────────────────────────────────────────────────
export const resume = {
  list: () => apiFetch('/resume'),
  get: (id) => apiFetch(`/resume/${id}`),
  upload: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return apiFetch('/resume/upload', { method: 'POST', body: form, isForm: true });
  },
};

// ── Resume versions (new on the frontend -- Phase 9 backend existed, this
//    was never wired up client-side) ─────────────────────────────────────
export const resumeVersions = {
  create: (resumeId, jobListingId) =>
    apiFetch(`/resume/${resumeId}/versions`, { method: 'POST', body: { gig_id: jobListingId } }),
  list: (resumeId) => apiFetch(`/resume/${resumeId}/versions`),
  get: (versionId) => apiFetch(`/resume-versions/${versionId}`),
  approve: (versionId) => apiFetch(`/resume-versions/${versionId}`, { method: 'PATCH', body: { status: 'approved' } }),
 
  // PDF download needs raw bytes, not the JSON-envelope path apiFetch expects --
  // it bypasses apiFetch and hits fetch() directly so we can read a blob.
  download: async (versionId, filenameHint) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/resume-versions/${versionId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new ApiError('Could not download this resume.', { status: res.status });
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenameHint || 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};

// ─── Jobs (Phase 5 output) ───────────────────────────────────────────
export const jobs = {
  list: (params = {}) => apiFetch(`/jobs${toQuery(params)}`),
  get: (id) => apiFetch(`/jobs/${id}`),
  stats: () => apiFetch('/jobs/stats'),
  // Manual sync trigger — the "run the hunt now" button while auto-sync
  // (scheduler) isn't the user-facing story yet.
  sync: () => apiFetch('/jobs/sync', { method: 'POST' }),
};

// ─── Matches (Phase 6) ───────────────────────────────────────────────
export const matches = {
  list: (params = {}) => apiFetch(`/matches${toQuery(params)}`),
  refresh: () => apiFetch('/matches/refresh', { method: 'POST' }),
};

// ─── Saved jobs (Phase 7) ────────────────────────────────────────────
export const savedJobs = {
  list: (params = {}) => apiFetch(`/saved-jobs${toQuery(params)}`),
  save: (jobListingId) => apiFetch('/saved-jobs', { method: 'POST', body: { gig_id: jobListingId } }),
  remove: (id) => apiFetch(`/saved-jobs/${id}`, { method: 'DELETE' }),
};

// ─── Applications (Phase 7) ──────────────────────────────────────────
export const applications = {
  list: (params = {}) => apiFetch(`/applications${toQuery(params)}`),
  get: (id) => apiFetch(`/applications/${id}`),
  create: (jobId, payload = {}) => apiFetch(`/applications/${jobId}`, { method: 'POST', body: payload }),
  updateStatus: (id, status, notes) =>
    apiFetch(`/applications/${id}/status`, { method: 'PATCH', body: { status, notes } }),
  attachArtifacts: (applicationId, { resumeVersionId, coverLetterId } = {}) =>
  apiFetch(`/applications/${applicationId}/artifacts`, {
    method: 'PATCH',
    body: {
      ...(resumeVersionId !== undefined && { resume_version_id: resumeVersionId }),
      ...(coverLetterId !== undefined && { cover_letter_id: coverLetterId }),
    },
  }),
};

// ─── Cover letters (Phase 9) ──────────────────────────────────────────
export const coverLetters = {
  create: ({ gig_id, tone = 'conversational' }) =>
    apiFetch('/cover-letters', { method: 'POST', body: { gig_id, tone } }),
 
  list: (params = {}) => apiFetch(`/cover-letters${toQuery(params)}`),
 
  get: (id) => apiFetch(`/cover-letters/${id}`),
 
  update: (id, payload) => apiFetch(`/cover-letters/${id}`, { method: 'PATCH', body: payload }),
 
  // Convenience wrapper over update() -- moves draft -> approved.
  approve: (id) => apiFetch(`/cover-letters/${id}`, { method: 'PATCH', body: { status: 'approved' } }),
 
  remove: (id) => apiFetch(`/cover-letters/${id}`, { method: 'DELETE' }),
};

function toQuery(params) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

export default apiFetch;
