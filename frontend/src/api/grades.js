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

export async function fetchCourses() {
  return request('/api/v1/grades/');
}

export async function createCourse(course) {
  return request('/api/v1/grades/', {
    method: 'POST',
    body: JSON.stringify(course),
  });
}

export async function updateCourse(courseId, course) {
  return request(`/api/v1/grades/${courseId}/`, {
    method: 'PATCH',
    body: JSON.stringify(course),
  });
}

export async function deleteCourse(courseId) {
  return request(`/api/v1/grades/${courseId}/`, {
    method: 'DELETE',
  });
}

export async function fetchGWA() {
  return request('/api/v1/grades/gwa/');
}

export async function computeGWA(courses) {
  return request('/api/v1/grades/compute/', {
    method: 'POST',
    body: JSON.stringify({ courses }),
  });
}
