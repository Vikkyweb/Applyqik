'use client';

// app/(app)/preferences/page.jsx
//
// Surfaces Phase 3's backend (GET/POST/PUT/DELETE /preferences) on the
// frontend for the first time -- until now, the only way a preference row
// got created was the one-shot seed during onboarding. This page is where
// a user manages their actual "multi-target hunt" list: several roles,
// each with its own work style and priority, up to the backend's 10-cap.
//
// FIELD-NAME ASSUMPTION FLAGGED: built against desired_title / work_preference
// / preferred_country / priority, matching what's been used consistently
// elsewhere in this build (onboarding's refine step, prefsApi.create calls).
// If your real JobPreference schema differs, this needs a quick pass to match.

import { useEffect, useState, useCallback } from 'react';
import {
  Target, Plus, Trash2, Pencil, X, Check, Loader2, AlertCircle,
} from 'lucide-react';
import { preferences as prefsApi } from '@/libs/api';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

const MAX_PREFERENCES = 10;

const WORK_PREFS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'any', label: 'Any' },
];

const EMPTY_FORM = { desired_title: '', work_preference: 'any', preferred_country: '', priority: 1 };

export default function PreferencesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating new
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(null); // holds an id, or null

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await prefsApi.list();
      // Tolerate either a bare array or a { preferences: [...] } envelope --
      // Phase 3's exact response shape isn't something I have in front of me
      // to confirm with certainty.
      setItems(Array.isArray(res) ? res : res?.preferences ?? []);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(pref) {
    setForm({
      desired_title: pref.desired_title ?? '',
      work_preference: pref.work_preference ?? 'any',
      preferred_country: pref.preferred_country ?? '',
      priority: pref.priority ?? 1,
    });
    setEditingId(pref.id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function save() {
    if (!form.desired_title.trim()) {
      toast('Enter a role to search for.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        desired_title: form.desired_title.trim(),
        work_preference: form.work_preference,
        preferred_country: form.preferred_country.trim() || null,
        priority: Number(form.priority) || 1,
      };

      if (editingId) {
        const updated = await prefsApi.update(editingId, payload);
        setItems((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        toast('Preference updated');
      } else {
        const created = await prefsApi.create(payload);
        setItems((prev) => [...prev, created]);
        toast('Preference added -- matching will pick this up on the next run');
      }
      closeForm();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    try {
      await prefsApi.remove(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      toast('Preference removed');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setConfirmingDelete(null);
    }
  }

  const atCap = items.length >= MAX_PREFERENCES;

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-black/5 py-6 ">
        <div className="mx-auto">
          <div className="flex items-center gap-2.5">
            <Target className="h-6 w-6 text-foreground" strokeWidth={2.25} />
            <h1 className="font-display text-[26px] font-bold leading-none text-foreground sm:text-[30px]">
              Job preferences
            </h1>
          </div>
          <p className="mt-1.5 text-[13.5px] text-slate">
            The roles Applyqik actively hunts for you. Matching uses these, alongside your
            resume, to score every job.
          </p>
        </div>
      </div>

      <div className="mx-auto space-y-4 py-6 sm:py-8">
        {/* Cap indicator + add button */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-slate">
            {items.length} of {MAX_PREFERENCES} used
          </span>
          {!formOpen && (
            <Button
              variant="accent"
              onClick={openCreate}
              disabled={atCap}
              className="rounded-xl px-5 py-2.5 text-[14px] font-semibold flex"
            >
              <Plus className="h-5 w-5" />
              Add preference
            </Button>
          )}
        </div>

        {atCap && !formOpen && (
          <div className="flex items-start gap-3 rounded-2xl border border-line bg-card p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
            <p className="text-[13px] text-slate">
              You've reached the limit of {MAX_PREFERENCES} active preferences. Remove one to add
              another.
            </p>
          </div>
        )}

        {/* Inline add/edit form */}
        {formOpen && (
          <div className="rounded-xl ring-1 ring-black/5 bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[16px] font-bold text-foreground">
                {editingId ? 'Edit preference' : 'New preference'}
              </h2>
              <button
                onClick={closeForm}
                className="cursor-pointer rounded-full p-1.5 text-slate-soft hover:bg-line-soft hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                  Role
                </label>
                <input
                  autoFocus
                  value={form.desired_title}
                  onChange={(e) => setForm((f) => ({ ...f, desired_title: e.target.value }))}
                  placeholder="e.g. Backend Engineer"
                  className="w-full rounded-xl ring-black/5 bg-background px-4 py-3 text-[15px] text-foreground outline-none transition-all placeholder:text-slate-soft focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>

              <div>
                <p className="mb-2 text-[13px] font-semibold text-foreground">Work preference</p>
                <div className="flex flex-wrap gap-2">
                  {WORK_PREFS.map((w) => {
                    const selected = form.work_preference === w.value;
                    return (
                      <button
                        key={w.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setForm((f) => ({ ...f, work_preference: w.value }))}
                        className={`bg-card rounded-xl ring-1 ring-black/5 px-5 py-2 text-[14px] font-medium transition-colors duration-150 ${
                          selected
                            ? 'bg-secondary text-white ring-secondary/5'
                            : 'text-foreground hover:ring-secondary/50 hover:text-secondary'
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                    Preferred country <span className="font-normal text-slate-soft">&middot; optional</span>
                  </label>
                  <input
                    value={form.preferred_country}
                    onChange={(e) => setForm((f) => ({ ...f, preferred_country: e.target.value }))}
                    placeholder="Anywhere"
                    className="w-full rounded-xl ring-1 ring-black/5 bg-background px-4 py-3 text-[15px] text-foreground outline-none transition-all placeholder:text-slate-soft focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={form.priority}
                      onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                      className="w-full cursor-pointer appearance-none rounded-xl ring-1 ring-black/5 bg-background px-4 py-3 pr-10 text-[15px] text-foreground outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10"
                    >
                      <option value={1}>1 &mdash; Highest</option>
                      <option value={2}>2</option>
                      <option value={3}>3 &mdash; Lowest</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <Button
                variant="ghost"
                onClick={closeForm}
                className="rounded-xl px-5 py-2.5 text-[14px] font-medium text-foreground hover:bg-[#F6F5F1]/50"
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={save}
                loading={saving}
                className="rounded-xl px-6 py-2.5 text-[14px] font-semibold"
              >
                {editingId ? 'Save changes' : 'Add preference'}
              </Button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl bg-card p-5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="mt-2 h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-3">
            {items.map((pref) => (
              <div key={pref.id} className="rounded-xl bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[16px] font-bold text-foreground">
                        {pref.desired_title}
                      </h3>
                      <span className="rounded-xl bg-secondary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-soft">
                        Priority {pref.priority ?? 1}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-xl px-3 py-1 text-[12.5px] font-medium capitalize text-slate">
                        {pref.work_preference ?? 'any'}
                      </span>
                      {pref.preferred_country && (
                        <span className="rounded-xl px-3 py-1 text-[12.5px] font-medium text-slate">
                          {pref.preferred_country}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openEdit(pref)}
                      className="cursor-pointer rounded-xl p-2 text-slate-soft transition-colors hover:bg-[#F6F5F1]/50 hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {confirmingDelete === pref.id ? (
                      <button
                        onClick={() => remove(pref.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-danger px-3 py-1.5 text-[12.5px] font-semibold text-white"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Confirm
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmingDelete(pref.id)}
                        className="cursor-pointer rounded-xl p-2 text-slate-soft transition-colors hover:bg-[#FBECEA]/50 hover:text-danger"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !formOpen && (
            <div className="rounded-[28px] bg-card p-2 sm:p-4">
              <EmptyState
                icon={Target}
                title="No preferences set yet"
                description="Add the roles you want Applyqik to hunt for -- matching gets sharper the more specific you are."
                action={
                  <Button
                    variant="accent"
                    onClick={openCreate}
                    className="rounded-xl px-6 py-3 text-[15px] font-semibold"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first preference
                  </Button>
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}