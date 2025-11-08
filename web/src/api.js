// Minimal API helper for the frontend
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function login(username, password) {
  return request('/auth/login', { method: 'POST', body: { username, password } });
}

export async function faceAuthLogin(imageB64) {
  return request('/faceauth/authenticate', { method: 'POST', body: { image_b64: imageB64 } });
}

export async function getMetrics(token) {
  return request('/api/metrics', { token });
}

export async function getPredictions(token) {
  return request('/api/predictions', { token });
}

export async function listExperiments(token) {
  return request('/api/experiments', { token });
}

export async function startExperiment(name, token) {
  return request('/api/experiments/start', { method: 'POST', body: { name }, token });
}

export default { login, getMetrics, getPredictions, listExperiments, startExperiment };

