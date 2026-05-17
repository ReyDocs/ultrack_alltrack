import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';

const ACCESS_TOKEN_KEY = 'ultrack_access_token';
const REFRESH_TOKEN_KEY = 'ultrack_refresh_token';

const AuthContext = createContext(null);

function buildUser(profile, supabaseUser = null) {
  if (profile) {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.username || profile.email?.split('@')[0] || 'User',
      avatarUrl: profile.avatar_url || null,
      isHydrated: true
    };
  }
  if (supabaseUser) {
    const metadata = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: metadata.full_name || metadata.name || supabaseUser.email?.split('@')[0] || 'User',
      avatarUrl: metadata.avatar_url || metadata.picture || null,
      isHydrated: false
    };
  }
  return null;
}

function saveSessionTokens(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

function clearSessionTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    clearSessionTokens();
  }, []);

  const hydrateProfile = useCallback(async (token, supabaseUser) => {
    try {
      // Set fallback user immediately to unblock the UI
      setUser(buildUser(null, supabaseUser));
      
      const profile = await authApi.fetchMe(token);
      setUser(buildUser(profile));
    } catch (error) {
      console.warn('Backend hydration failed, staying with fallback:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (!session) {
        setLoading(false);
        return;
      }

      await hydrateProfile(session.access_token, session.user);
    } catch (err) {
      console.error('Restore session failed:', err);
      setLoading(false);
    }
  }, [hydrateProfile]);

  useEffect(() => {
    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth Event: ${event}`);
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.access_token) {
          await hydrateProfile(session.access_token, session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [restoreSession, hydrateProfile]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.session) {
        await hydrateProfile(data.session.access_token, data.session.user);
      }
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [hydrateProfile]);

  const signup = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return await login({ email, password });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [login]);

  const googleLogin = useCallback(async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Google login trigger failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      try {
        await authApi.logout();
      } catch {
        // Backend logout may be best-effort; continue clearing local state.
      }
      await supabase.auth.signOut();
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  const updateProfile = useCallback(async (updates) => {
    try {
      const profile = await usersApi.updateMe({
        username: updates.name,
      });
      setUser(buildUser(profile));
      return profile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    try {
      const data = await usersApi.uploadAvatar(file);
      // After upload, we should refresh the user profile to get the new avatarUrl
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const profile = await authApi.fetchMe(accessToken);
      setUser(buildUser(profile));
      return data.avatar_url;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
