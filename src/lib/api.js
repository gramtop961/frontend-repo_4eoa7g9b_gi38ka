const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${errText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  listVehicles: async (status) => {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/api/vehicles${q}`);
  },
  createVehicle: async (data) => request('/api/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  logEvent: async (data) => request('/api/events', { method: 'POST', body: JSON.stringify(data) }),
  registerPart: async (data) => request('/api/parts', { method: 'POST', body: JSON.stringify(data) }),
  sync: async (envelope) => request('/api/sync', { method: 'POST', body: JSON.stringify(envelope) }),
  vehicleHistory: async (vehicleId) => request(`/api/vehicles/${vehicleId}/history`),
};
