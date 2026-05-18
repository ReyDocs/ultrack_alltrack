import { supabase } from '../config/supabase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

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
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  
  const headers = {
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
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

/**
 * Update the current user's profile.
 * Expects fields like { username: "..." }
 */
export async function updateMe(updates) {
  return request('/api/v1/users/me/', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Upload a new profile avatar.
 * Expects a File object.
 */
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/api/v1/users/me/avatar/', {
    method: 'POST',
    body: formData,
  });
}
