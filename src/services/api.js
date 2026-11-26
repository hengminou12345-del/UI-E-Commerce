import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const USE_MOCK_DATA =
  (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') !== 'false';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Unwraps Laravel API Resource / Pagination responses (`{ data: ... }`)
 * as well as raw JSON arrays/objects.
 */
export function unwrapLaravelData(response) {
  const payload = response?.data;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  return payload;
}

export function slugify(text = '') {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default api;
