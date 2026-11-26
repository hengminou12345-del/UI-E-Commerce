import api, { USE_MOCK_DATA, delay, slugify, unwrapLaravelData } from './api';
import { mockProducts } from '../data/mockProducts';
import { getCategories } from './categoryService';

const STORAGE_KEY = 'veloce_products_v2';
const ORDER_SEQ_KEY = 'veloce_order_seq_v1';

function readStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  return [...mockProducts];
}

function writeStoredProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function resetProductsStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  return [...mockProducts];
}

export async function getProducts(params = {}) {
  if (!USE_MOCK_DATA) {
    const res = await api.get('/products', { params });
    return unwrapLaravelData(res);
  }
  await delay(120);
  const [products, categories] = await Promise.all([
    Promise.resolve(readStoredProducts()),
    getCategories(),
  ]);
  const catMap = new Map(categories.map((c) => [Number(c.id), c]));

  let enriched = products.map((p) => ({
    ...p,
    category: p.category || catMap.get(Number(p.category_id)) || null,
  }));

  if (params.category_id) {
    enriched = enriched.filter(
      (p) => Number(p.category_id) === Number(params.category_id)
    );
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    enriched = enriched.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q)
    );
  }
  return enriched;
}

export async function getProductById(id) {
  if (!USE_MOCK_DATA) {
    const res = await api.get(`/products/${id}`);
    return unwrapLaravelData(res);
  }
  await delay(100);
  const products = await getProducts();
  return products.find((p) => Number(p.id) === Number(id)) || null;
}

export async function createProduct(payload) {
  if (!USE_MOCK_DATA) {
    const res = await api.post('/products', payload);
    return unwrapLaravelData(res);
  }
  await delay(120);
  const list = readStoredProducts();
  const nextId = list.reduce((max, p) => Math.max(max, Number(p.id)), 0) + 1;
  const now = new Date().toISOString();
  const item = {
    id: nextId,
    category_id: Number(payload.category_id),
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    sku: payload.sku || `PRD-${String(nextId).padStart(4, '0')}`,
    description: payload.description || '',
    price: Number(payload.price),
    original_price: payload.original_price
      ? Number(payload.original_price)
      : null,
    stock: Number(payload.stock ?? 0),
    image_url: payload.image_url || '',
    rating: Number(payload.rating ?? 4.8),
    is_featured: Boolean(payload.is_featured),
    is_active: payload.is_active !== false,
    created_at: now,
    updated_at: now,
  };
  writeStoredProducts([...list, item]);
  return item;
}

export async function updateProduct(id, payload) {
  if (!USE_MOCK_DATA) {
    const res = await api.put(`/products/${id}`, payload);
    return unwrapLaravelData(res);
  }
  await delay(120);
  const list = readStoredProducts();
  const updated = list.map((p) =>
    Number(p.id) === Number(id)
      ? {
          ...p,
          ...payload,
          category_id: Number(payload.category_id ?? p.category_id),
          price: Number(payload.price ?? p.price),
          original_price: payload.original_price
            ? Number(payload.original_price)
            : null,
          stock: Number(payload.stock ?? p.stock),
          slug: payload.slug || slugify(payload.name || p.name),
          updated_at: new Date().toISOString(),
        }
      : p
  );
  writeStoredProducts(updated);
  return updated.find((p) => Number(p.id) === Number(id));
}

export async function deleteProduct(id) {
  if (!USE_MOCK_DATA) {
    await api.delete(`/products/${id}`);
    return true;
  }
  await delay(100);
  const list = readStoredProducts().filter((p) => Number(p.id) !== Number(id));
  writeStoredProducts(list);
  return true;
}

function getNextSequentialOrderId() {
  let next = 1;
  try {
    const current = Number(localStorage.getItem(ORDER_SEQ_KEY) || '0');
    next = Number.isFinite(current) && current >= 0 ? current + 1 : 1;
    localStorage.setItem(ORDER_SEQ_KEY, String(next));
  } catch {
    next = 1;
  }
  return {
    id: next,
    orderNumber: `ORD-${String(next).padStart(4, '0')}`,
  };
}

export async function createOrder(payload) {
  if (!USE_MOCK_DATA) {
    const res = await api.post('/orders', payload);
    return unwrapLaravelData(res);
  }
  await delay(200);
  const { id, orderNumber } = getNextSequentialOrderId();
  return {
    id,
    order_number: orderNumber,
    order_date: new Date().toISOString(),
    status: 'Pending',
    ...payload,
  };
}
