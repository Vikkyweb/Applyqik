'use client';

// components/applications/ReadyToApplyPanel.jsx
//
// The piece connecting "AI generated a tailored resume/cover letter" to
// "user actually has something to submit on the employer's real site."
//
// FLOW THIS IMPLEMENTS
//   1. User clicks "Prepare application" on a job (trigger lives on the
//      calling page/card, not here -- this panel is what opens once
//      preparation has started).
//   2. This panel creates a resume version + cover letter FOR THAT JOB ONLY
//      (Phase 9's endpoints are per-job by design -- generation never fires
//      for all matches at once; that would burn AI spend on artifacts
//      nobody reads).
//   3. Polls both until ready/draft.
//   4. User reviews, can approve each independently.
//   5. Once approved: copy cover letter text, download resume as a real PDF.
//   6. "Apply on employer site" opens job.apply_url in a new tab -- manual,
//      exactly like the existing JobCard Apply button. Nothing is
//      auto-submitted anywhere.
//   7. "Mark as applied" attaches the approved artifacts to the application
//      record, then flips its status to 'applied'.

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

const TONES = [
  { value: 'conversational', label: 'Conversational' },
  { value: 'formal', label: 'Formal' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'concise', label: 'Concise' },
];

export default function ReadyToApplyPanel({ job, applicationId, onClose, onApplied }) {
  const { toast } = useToast();

  const [resumeVersion, setResumeVersion] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [tone, setTone] = useState('conversational');
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [marking, setMarking] = useState(false);
  const pollRef = useRef(null);

  // Kick off generation for THIS job only, the moment the panel opens.
  useEffect(() => {
    startPreparing();
    return () => pollRef.current && clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startPreparing() {
    setStarting(true);
    try {
      // Needs the user's own parsed resume as the source -- fetch it fresh
      // rather than assuming the caller already has it.
      const resumes = await resumeApi.list().catch(() => []);
      const parsedResume = (resumes ?? []).find((r) => r.status === 'parsed');

      const tasks = [];

      if (parsedResume) {
        tasks.push(
          resumeVersionsApi.create(parsedResume.id, job.id).then((v) => setResumeVersion(v))
        );
      }
      tasks.push(
        coverLettersApi.create({ job_listing_id: job.id, tone }).then((l) => setCoverLetter(l))
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

      if (resumeVersion && !['ready', 'approved', 'failed'].includes(resumeVersion.status)) {
        try {
          const fresh = await resumeVersionsApi.get(resumeVersion.id);
          setResumeVersion(fresh);
          if (!['ready', 'approved', 'failed'].includes(fresh.status)) stillWorking = true;
        } catch {
          stillWorking = true;
        }
      }

      if (coverLetter && !['draft', 'approved', 'used', 'failed'].includes(coverLetter.status)) {
        try {
          const fresh = await coverLettersApi.get(coverLetter.id);
          setCoverLetter(fresh);
          if (!['draft', 'approved', 'used', 'failed'].includes(fresh.status)) stillWorking = true;
        } catch {
          stillWorking = true;
        }
      }

      if (!stillWorking) {
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
      // Attach whatever's approved BEFORE flipping status, so the application
      // record always knows exactly which artifacts were actually used.
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

  // Both artifacts are optional independently (a user might not have a
  // resume uploaded yet, or might skip the letter) -- "ready to apply" only
  // requires that nothing is still actively generating.
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
                  className="rounded-full border-line px-4 py-2 text-[13px] font-medium text-ink hover:bg-[#F6F5F1]"
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
                  className="rounded-full border-line px-4 py-2 text-[13px] font-medium text-ink hover:bg-[#F6F5F1]/50"
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
            className="cursor-pointer rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-semibold text-foreground hover:bg-white/50"
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