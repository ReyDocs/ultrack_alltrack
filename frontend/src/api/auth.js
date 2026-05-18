import { supabase } from "../config/supabase";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

if (!BACKEND_URL && import.meta.env.PROD) {
  console.warn('VITE_BACKEND_URL is not defined. API calls will likely fail in production.');
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    const message = data?.detail || data?.message || (typeof data === 'string' ? data : response.statusText) || 'Request failed.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export function normalizeUserFromBackend(profile) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.username || profile.email?.split('@')[0] || 'User',
    avatarUrl: profile.avatar_url || null,
  };
}

export async function login(credentials) {
  return request('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function signup(credentials) {
  return request('/api/v1/auth/signup/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function googleLogin() {
  const origin = window.location.origin.replace(/\/$/, '');
  const redirectTo = `${origin}/auth/callback/`;
  
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });
}

export async function logout() {
  return request('/api/v1/auth/logout/', {
    method: 'POST',
  });
}

export async function fetchMe(accessToken) {
  return request('/api/v1/users/me/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
