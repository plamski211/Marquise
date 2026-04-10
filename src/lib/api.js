const API_BASE = import.meta.env.VITE_API_URL || '';

async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  if (options.body && !isFormData) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw Object.assign(new Error(error.message), {
      status: res.status,
      errors: error.errors,
    });
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get:    (path) => apiFetch(path),
  post:   (path, body) => apiFetch(path, { method: 'POST', body }),
  put:    (path, body) => apiFetch(path, { method: 'PUT', body }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
  upload: (path, formData) => apiFetch(path, { method: 'POST', body: formData }),
};
