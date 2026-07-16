'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth as authApi, profile as profileApi, getToken, setToken, clearToken } from '@/libs/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount, if a token exists, hydrate the session.
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
    const prof = await profileApi.get().catch(() => null);
    setProfile(prof);
    return data.user;
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
    return data.user;
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
    router.push('/login');
  }, [router]);

  const refreshProfile = useCallback(async () => {
    const prof = await profileApi.get().catch(() => null);
    setProfile(prof);
    return prof;
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
