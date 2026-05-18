import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';

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

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
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

  useEffect(() => {
    let mounted = true;

    // The listener handles the initial session and all subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.access_token) {
          await hydrateProfile(session.access_token, session.user);
        } else {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [hydrateProfile]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // onAuthStateChange handles the state update and hydration
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

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
    console.log('[AuthDebug] googleLogin triggered from context');
    try {
      await authApi.googleLogin();
    } catch (error) {
      console.error('[AuthDebug] Google login trigger failed:', error);
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
      
      // Refresh user profile with correct token retrieval
      const { data: { session } } = await supabase.auth.getSession();
      const profile = await authApi.fetchMe(session?.access_token);
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
