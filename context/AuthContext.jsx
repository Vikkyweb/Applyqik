'use client';

// The onboarding rule in one place:
//   - Onboarding status lives on the SERVER (profile.onboarding), so it survives
//     closed tabs, new browsers, and new devices. We never read it from localStorage.
//   - resolveDestination() is the ONLY function that decides where an authenticated
//     user belongs. Every guard and post-login/register redirect calls it, so the
//     rule can never drift between pages.

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth as authApi, profile as profileApi, getToken, setToken, clearToken } from '@/libs/api';

const AuthContext = createContext(null);

  
// Single source of truth for "where should this authenticated user go?"
// Returns a path string. Pure function — easy to reason about and reuse.
export function resolveDestination(profile) {
  // No profile yet (brand-new account, or fetch failed): send to onboarding.
  // Onboarding itself will get-or-create the profile on the server.
  if (!profile) return '/onboarding';
  const ob = profile.onboarding;
  if (ob?.is_complete) return '/overview';
  return '/onboarding';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount, if a token exists, hydrate BOTH the user and their profile.
  // The profile carries onboarding status, so guards can act immediately.
  useEffect(() => {
    let active = true;
    async function hydrate() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const [me, prof] = await Promise.all([
          authApi.me(),
          profileApi.get().catch(() => null),
        ]);
        if (active) {
          setUser(me);
          setProfile(prof);
        }
      } catch {
        clearToken();
      } finally {
        if (active) setLoading(false);
      }
    }
    hydrate();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    // Fetch profile so the caller can route by onboarding status immediately.
    const prof = await profileApi.get().catch(() => null);
    setProfile(prof);
    return { user: data.user, profile: prof };
  }, []);
 

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({
      name,
      email,
      password,
      password_confirmation: password,
    });
    setToken(data.token);
    setUser(data.user);
    // A brand-new account: fetch (get-or-create) the profile so we have a real
    // onboarding.step ('role') to start from.
    const prof = await profileApi.get().catch(() => null);
    setProfile(prof);
    return { user: data.user, profile: prof };
  }, []);
 
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // even if the network call fails, drop local session
    }
    clearToken();
    setUser(null);
    setProfile(null);
    router.push('/signin');
  }, [router]);

  const refreshProfile = useCallback(async () => {
    const prof = await profileApi.get().catch(() => null);
    setProfile(prof);
    return prof;
  }, []);

    // Persist a single onboarding step to the server and update local state.
  // Called by the onboarding page each time the user advances, so progress
  // is durable the instant it happens — not only at the end.
  const saveOnboardingStep = useCallback(async (payload) => {
    const prof = await profileApi.update(payload);
    setProfile(prof);
    return prof;
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    // Derived onboarding helpers so components don't dig into the shape.
    onboardingComplete: !!profile?.onboarding?.is_complete,
    onboardingStep: profile?.onboarding?.step ?? 'role',
    onboardingRole: profile?.onboarding?.role ?? null,
    login,
    register,
    logout,
    refreshProfile,
    saveOnboardingStep,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
