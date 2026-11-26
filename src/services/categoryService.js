import api, { USE_MOCK_DATA, delay, slugify, unwrapLaravelData } from './api';
import { mockCategories } from '../data/mockCategories';

const STORAGE_KEY = 'veloce_categories_v2';

function readStoredCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
  return [...mockCategories];
}

function writeStoredCategories(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function resetCategoriesStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
  return [...mockCategories];
}

export async function getCategories() {
  if (!USE_MOCK_DATA) {
    const res = await api.get('/categories');
    return unwrapLaravelData(res);
  }
  await delay(100);
  return readStoredCategories();
}

export async function createCategory(payload) {
  if (!USE_MOCK_DATA) {
    const res = await api.post('/categories', payload);
    return unwrapLaravelData(res);
  }
  await delay(120);
  const list = readStoredCategories();
  const nextId = list.reduce((max, c) => Math.max(max, Number(c.id)), 0) + 1;
  const now = new Date().toISOString();
  const item = {
    id: nextId,
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    description: payload.description || '',
    image_url: payload.image_url || '',
    created_at: now,
    updated_at: now,
  };
  writeStoredCategories([...list, item]);
  return item;
}

export async function updateCategory(id, payload) {
  if (!USE_MOCK_DATA) {
    const res = await api.put(`/categories/${id}`, payload);
    return unwrapLaravelData(res);
  }
  await delay(120);
  const list = readStoredCategories();
  const updated = list.map((cat) =>
    Number(cat.id) === Number(id)
      ? {
          ...cat,
          ...payload,
          slug: payload.slug || slugify(payload.name || cat.name),
          updated_at: new Date().toISOString(),
        }
      : cat
  );
  writeStoredCategories(updated);
  return updated.find((cat) => Number(cat.id) === Number(id));
}

export async function deleteCategory(id) {
  if (!USE_MOCK_DATA) {
    await api.delete(`/categories/${id}`);
    return true;
  }
  await delay(100);
  const list = readStoredCategories().filter(
    (cat) => Number(cat.id) !== Number(id)
  );
  writeStoredCategories(list);
  return true;
}
