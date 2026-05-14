const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';
const ACCESS_TOKEN_KEY = 'ultrack_access_token';

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
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
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

export async function fetchTransactions() {
  return request('/api/v1/finances');
}

export async function fetchBalance() {
  return request('/api/v1/finances/balance');
}

export async function createTransaction(transaction) {
  return request('/api/v1/finances', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

export async function updateTransaction(transactionId, transaction) {
  return request(`/api/v1/finances/${transactionId}`, {
    method: 'PATCH',
    body: JSON.stringify(transaction),
  });
}

export async function deleteTransaction(transactionId) {
  return request(`/api/v1/finances/${transactionId}`, {
    method: 'DELETE',
  });
}

export async function updateBalance(newBalance) {
  // Update users.base_balance via the users endpoint
  return request('/api/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ base_balance: newBalance }),
  });
}
