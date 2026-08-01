'use client';
 
// components/applications/ReadyToApplyPanel.jsx
//
// FIXED: two real lifecycle bugs from the previous version.
//
// BUG 1 (duplicate creation): React 18 Strict Mode intentionally double-
// invokes effects in development (mount -> cleanup -> mount again) to catch
// exactly this class of problem -- an effect with side effects that isn't
// safe to run twice. startPreparing() had no memory of "already started",
// so it fired both create() calls a second time. FIX: a `startedRef` guard
// makes the effect idempotent regardless of how many times it's invoked --
// this is the correct fix, not disabling Strict Mode, which would only hide
// this bug class instead of preventing it.
//
// BUG 2 (stuck "still working"): the effect's cleanup called
// clearInterval(pollRef.current) but never reset pollRef.current to null.
// After Strict Mode's cleanup+remount cycle, the still-non-null (but
// already-cleared) ref made beginPolling()'s guard think polling was
// already active, so it silently skipped starting a new interval -- the
// displayed (second, duplicate) resume version/cover letter then never got
// polled again, freezing the UI on "generating" even after the server
// resolved to ready/failed. FIX: explicitly null the ref on cleanup.
//
// Neither fix touches WHY cover letters/resumes end up 'failed' -- that's
// almost certainly the AI provider call failing (unfunded credits), which
// has no fallback path in generation the way Phase 6 matching does. Check
// `generation_error` on a failed row to confirm the real provider error.
 
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText, Mail, Download, Copy, Check, ExternalLink,
  Loader2, AlertCircle, ChevronRight,
} from 'lucide-react';
import {
  resumeVersions as resumeVersionsApi,
  coverLetters as coverLettersApi,
  applications as applicationsApi,
  resume as resumeApi,
} from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
 
export default function ReadyToApplyPanel({ job, applicationId, onClose, onApplied }) {
  const { toast } = useToast();
 
  const [resumeVersion, setResumeVersion] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [marking, setMarking] = useState(false);
  const pollRef = useRef(null);
 
  // BUG 1 FIX: survives Strict Mode's mount/cleanup/remount cycle within the
  // same component instance, so startPreparing() runs exactly once no
  // matter how many times the effect itself fires.
  const startedRef = useRef(false);
 
  // BUG 3 FIX (found while re-deriving the polling fix -- this one likely
  // predates today's other two bugs): setInterval's callback closes over
  // whatever `resumeVersion`/`coverLetter` were AT THE MOMENT beginPolling()
  // was first called. Calling setResumeVersion(fresh) later schedules a
  // re-render, but does NOT retroactively update the variable that
  // long-lived closure already captured -- so a naive "if (resumeVersion...)"
  // check inside the interval keeps reading stale data forever. Refs don't
  // have this problem: they're mutable and read fresh on every access,
  // regardless of which render/closure is doing the reading.
  const resumeVersionRef = useRef(null);
  const coverLetterRef = useRef(null);
 
  useEffect(() => {
    resumeVersionRef.current = resumeVersion;
  }, [resumeVersion]);
 
  useEffect(() => {
    coverLetterRef.current = coverLetter;
  }, [coverLetter]);
 
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startPreparing();
 
    // BUG 2 FIX: explicitly null the ref after clearing, not just stop the
    // interval. A stale non-null ref was tricking beginPolling()'s guard
    // into thinking polling was already active when it wasn't.
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  async function startPreparing() {
    setStarting(true);
    try {
      const resumes = await resumeApi.list().catch(() => []);
      const parsedResume = (resumes ?? []).find((r) => r.status === 'parsed');
 
      const tasks = [];
 
      if (parsedResume) {
        tasks.push(
          resumeVersionsApi.create(parsedResume.id, job.id).then((v) => {
            resumeVersionRef.current = v;
            setResumeVersion(v);
          })
        );
      }
      tasks.push(
        coverLettersApi.create({ gig_id: job.id, tone: 'conversational' }).then((l) => {
          coverLetterRef.current = l;
          setCoverLetter(l);
        })
      );
 
      await Promise.all(tasks);
      beginPolling();
    } catch (err) {
      toast(err.message || 'Could not start preparing your application.', 'error');
    } finally {
      setStarting(false);
    }
  }
 
  function beginPolling() {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      let stillWorking = false;
 
      // Read from refs, not the closured `resumeVersion`/`coverLetter`
      // state variables -- see BUG 3 FIX comment above for why that matters.
      const currentResume = resumeVersionRef.current;
      if (currentResume && !['ready', 'approved', 'failed'].includes(currentResume.status)) {
        try {
          const fresh = await resumeVersionsApi.get(currentResume.id);
          resumeVersionRef.current = fresh; // update immediately, don't wait for the effect
          setResumeVersion(fresh);
          if (!['ready', 'approved', 'failed'].includes(fresh.status)) stillWorking = true;
        } catch {
          stillWorking = true;
        }
      }
 
      const currentLetter = coverLetterRef.current;
      if (currentLetter && !['draft', 'approved', 'used', 'failed'].includes(currentLetter.status)) {
        try {
          const fresh = await coverLettersApi.get(currentLetter.id);
          coverLetterRef.current = fresh;
          setCoverLetter(fresh);
          if (!['draft', 'approved', 'used', 'failed'].includes(fresh.status)) stillWorking = true;
        } catch {
          stillWorking = true;
        }
      }
 
      if (!stillWorking && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 2500);
  }
 
  async function approveResume() {
    try {
      const updated = await resumeVersionsApi.approve(resumeVersion.id);
      setResumeVersion(updated);
      toast('Resume approved');
    } catch (err) {
      toast(err.message, 'error');
    }
  }
 
  async function approveCoverLetter() {
    try {
      const updated = await coverLettersApi.approve(coverLetter.id);
      setCoverLetter(updated);
      toast('Cover letter approved');
    } catch (err) {
      toast(err.message, 'error');
    }
  }
 
  async function downloadResume() {
    try {
      const filename = `${job.company_name || 'Resume'}_${job.title || ''}`.replace(/[^A-Za-z0-9]+/g, '_') + '.pdf';
      await resumeVersionsApi.download(resumeVersion.id, filename);
    } catch (err) {
      toast(err.message, 'error');
    }
  }
 
  async function copyCoverLetter() {
    try {
      await navigator.clipboard.writeText(coverLetter.content || '');
      setCopied(true);
      toast('Cover letter copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Could not copy -- select and copy the text manually.', 'error');
    }
  }
 
  async function markApplied() {
    setMarking(true);
    try {
      if (applicationId) {
        await applicationsApi.attachArtifacts(applicationId, {
          resumeVersionId: resumeVersion?.status === 'approved' ? resumeVersion.id : undefined,
          coverLetterId: coverLetter?.status === 'approved' ? coverLetter.id : undefined,
        });
        await applicationsApi.updateStatus(applicationId, 'applied');
      }
      toast("Marked as applied -- you're all set.");
      onApplied?.();
      onClose?.();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setMarking(false);
    }
  }
 
  const resumeReady = resumeVersion && ['ready', 'approved'].includes(resumeVersion.status);
  const resumeApproved = resumeVersion?.status === 'approved';
  const letterReady = coverLetter && ['draft', 'approved', 'used'].includes(coverLetter.status);
  const letterApproved = coverLetter?.status === 'approved';
 
  const anyStillGenerating =
    (resumeVersion && !['ready', 'approved', 'failed'].includes(resumeVersion.status)) ||
    (coverLetter && !['draft', 'approved', 'used', 'failed'].includes(coverLetter.status));
 
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-card p-6 sm:rounded-[28px] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[20px] font-bold leading-tight text-foreground">
              Prepare your application
            </h2>
            <p className="mt-1 text-[13.5px] text-slate">
              {job.title} &middot; {job.company_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-xl p-1.5 text-slate-soft hover:bg-line-soft hover:text-ink"
          >
            &times;
          </button>
        </div>

        {starting && !resumeVersion && !coverLetter ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="mt-3 text-[14px] text-slate">Starting generation&hellip;</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Resume artifact */}
            <ArtifactRow
              icon={FileText}
              label="Tailored resume"
              missing={!resumeVersion}
              missingText="Upload a parsed resume in your profile to generate a tailored version."
              status={resumeVersion?.status}
              onApprove={approveResume}
              approved={resumeApproved}
              ready={resumeReady}
            >
              {resumeReady && (
                <Button
                  variant="outline"
                  onClick={downloadResume}
                  className="rounded-xl flex gap-2 item-center border-line px-4 py-2 text-[13px] font-medium text-ink hover:bg-[#F6F5F1]/50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              )}
            </ArtifactRow>

            {/* Cover letter artifact */}
            <ArtifactRow
              icon={Mail}
              label="Cover letter"
              status={coverLetter?.status}
              onApprove={approveCoverLetter}
              approved={letterApproved}
              ready={letterReady}
            >
              {letterReady && (
                <Button
                  variant="outline"
                  onClick={copyCoverLetter}
                  className="rounded-xl border-line flex gap-2 px-4 py-2 text-[13px] font-medium text-ink hover:bg-[#F6F5F1]/50"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy text'}
                </Button>
              )}
            </ArtifactRow>

            {letterReady && (
              <div className="max-h-40 overflow-y-auto rounded-2xl border-border bg-background p-4 text-[13px] leading-relaxed text-ink-soft">
                {coverLetter.content}
              </div>
            )}

            {anyStillGenerating && (
              <p className="flex items-center gap-2 text-[13px] text-slate">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Still working &mdash; this usually takes 30-60 seconds.
              </p>
            )}

            <div className="border-t border-border pt-5">
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:brightness-105"
              >
                Apply on {job.source || 'employer site'}
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="mt-2 text-center text-[12px] text-slate-soft">
                Opens the real application in a new tab &mdash; nothing is submitted for you.
              </p>

              <Button
                variant="ghost"
                onClick={markApplied}
                loading={marking}
                className="mt-3 w-full justify-center rounded-xl py-3 text-[14px] font-semibold text-ink hover:bg-[#F6F5F1]/50"
              >
                I've applied &mdash; mark as applied
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArtifactRow({ icon: Icon, label, status, ready, approved, onApprove, missing, missingText, children }) {
  if (missing) {
    return (
      <div className="flex items-start gap-3 rounded-2xl ring-1 ring-black/5 bg-background p-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
        <p className="text-[13px] text-slate">{missingText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl ring-1 ring-black/5 bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-ink" />
          <span className="text-[14px] font-semibold text-ink">{label}</span>
          <StatusPill status={status} />
        </div>
        {ready && !approved && (
          <button
            onClick={onApprove}
            className="rounded-xl bg-secondary px-3.5 py-1.5 text-[12.5px] font-semibold text-foreground hover:bg-white/50"
          >
            Approve
          </button>
        )}
      </div>
      {ready && <div className="mt-3 flex gap-2">{children}</div>}
      {status === 'failed' && (
        <p className="mt-2 text-[12.5px] text-danger">
          Generation failed. Try preparing this application again.
        </p>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  if (!status) return null;
  const styles = {
    generating: 'bg-line-soft text-slate',
    ready: 'bg-[#FBF3E3] text-[#9A6B12]',
    draft: 'bg-[#FBF3E3] text-[#9A6B12]',
    approved: 'bg-accent-soft text-accent-ink',
    used: 'bg-accent-soft text-accent-ink',
    failed: 'bg-[#FBECEA] text-danger',
  };
  const labels = {
    generating: 'Generating',
    ready: 'Needs review',
    draft: 'Needs review',
    approved: 'Approved',
    used: 'Approved',
    failed: 'Failed',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[status] ?? 'bg-line-soft text-slate'}`}>
      {labels[status] ?? status}
    </span>
  );
}