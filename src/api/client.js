// =========================================
// EternalVow — API Client
// =========================================

const API_BASE = '/api';

/**
 * Get the stored auth token
 */
function getToken() {
  return localStorage.getItem('eternalvow_token');
}

/**
 * Make an authenticated API request
 */
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ------------------------------------------
// Auth
// ------------------------------------------

export async function register(name, email, password) {
  const data = await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem('eternalvow_token', data.token);
  localStorage.setItem('eternalvow_user', JSON.stringify(data.user));
  localStorage.setItem('eternalvow_wedding_id', data.weddingId);
  return data;
}

export async function login(email, password) {
  const data = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('eternalvow_token', data.token);
  localStorage.setItem('eternalvow_user', JSON.stringify(data.user));
  if (data.weddingId) {
    localStorage.setItem('eternalvow_wedding_id', data.weddingId);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('eternalvow_token');
  localStorage.removeItem('eternalvow_user');
  localStorage.removeItem('eternalvow_wedding_id');
}

export async function getMe() {
  return fetchAPI('/auth/me');
}

export function getStoredUser() {
  const json = localStorage.getItem('eternalvow_user');
  return json ? JSON.parse(json) : null;
}

export function getStoredWeddingId() {
  return localStorage.getItem('eternalvow_wedding_id');
}

export function isAuthenticated() {
  return !!getToken();
}

// ------------------------------------------
// Weddings
// ------------------------------------------

export async function getMyWedding() {
  return fetchAPI('/weddings/mine');
}

export async function saveWedding(weddingId, data) {
  return fetchAPI(`/weddings/${weddingId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getPublicWedding(weddingId) {
  return fetchAPI(`/weddings/${weddingId}/public`);
}

// ------------------------------------------
// RSVP / Guests
// ------------------------------------------

export async function submitRSVP(weddingId, rsvpData) {
  return fetchAPI(`/weddings/${weddingId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify(rsvpData),
  });
}

export async function getGuests(weddingId) {
  return fetchAPI(`/weddings/${weddingId}/guests`);
}

export async function getStats(weddingId) {
  return fetchAPI(`/weddings/${weddingId}/stats`);
}

export async function updateGuest(guestId, data) {
  return fetchAPI(`/guests/${guestId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteGuest(guestId) {
  return fetchAPI(`/guests/${guestId}`, {
    method: 'DELETE',
  });
}

// ------------------------------------------
// Events
// ------------------------------------------

export async function getEvents(weddingId) {
  return fetchAPI(`/weddings/${weddingId}/events`);
}

export async function createEvent(weddingId, eventData) {
  return fetchAPI(`/weddings/${weddingId}/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

export async function updateEvent(eventId, data) {
  return fetchAPI(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(eventId) {
  return fetchAPI(`/events/${eventId}`, {
    method: 'DELETE',
  });
}
