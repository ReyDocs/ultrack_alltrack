import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';

const ACCESS_TOKEN_KEY = 'ultrack_access_token';
const REFRESH_TOKEN_KEY = 'ultrack_refresh_token';

const AuthContext = createContext(null);

function buildUser(profile) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.username || profile.email?.split('@')[0] || 'User',
    avatarUrl: profile.avatar_url || null,
  };
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

  const restoreSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await authApi.fetchMe(token);
      setUser(buildUser(profile));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const token = session?.access_token;
        if (token) {
          try {
            const profile = await authApi.fetchMe(token);
            setUser(buildUser(profile));
          } catch (error) {
            console.error('Failed to sync user profile:', error);
          } finally {
            setLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [restoreSession]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      
      // Manually set the session in the Supabase client so it 'reads' the backend auth
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) throw sessionError;

      // Profile is fetched via onAuthStateChange listener or manually here
      const profile = await authApi.fetchMe(data.access_token);
      setUser(buildUser(profile));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      await authApi.signup({ email, password });
      // After signup, we log in
      return await login({ email, password });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
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
