import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  FolderKanban,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  getCategories,
  resetCategoriesStorage,
  updateCategory,
} from '../services/categoryService';
import {
  createProduct,
  deleteProduct,
  getProducts,
  resetProductsStorage,
  updateProduct,
} from '../services/productService';
import { USE_MOCK_DATA, slugify } from '../services/api';
import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';
import { FALLBACK_CATEGORY_IMAGE } from '../data/mockCategories';

const EMPTY_PRODUCT = {
  category_id: 1,
  name: '',
  slug: '',
  sku: '',
  description: '',
  price: '',
  original_price: '',
  stock: 10,
  image_url: '',
  rating: 4.8,
  is_featured: false,
  is_active: true,
};

const EMPTY_CATEGORY = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
};

export default function AdminCatalogPage() {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
    const inventoryValue = products.reduce(
      (sum, p) => sum + Number(p.price) * Number(p.stock),
      0
    );
    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      lowStock,
      inventoryValue,
    };
  }, [products, categories]);

  // Product Modal Handlers
  const openCreateProduct = () => {
    setEditingProductId(null);
    setProductForm({
      ...EMPTY_PRODUCT,
      category_id: categories[0]?.id || 1,
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      category_id: product.category_id,
      name: product.name,
      slug: product.slug || '',
      sku: product.sku || '',
      description: product.description || '',
      price: product.price,
      original_price: product.original_price ?? '',
      stock: product.stock,
      image_url: product.image_url || '',
      rating: product.rating ?? 4.8,
      is_featured: Boolean(product.is_featured),
      is_active: product.is_active !== false,
    });
    setProductModalOpen(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      slug: productForm.slug || slugify(productForm.name),
      price: Number(productForm.price),
      original_price: productForm.original_price
        ? Number(productForm.original_price)
        : null,
      stock: Number(productForm.stock),
      category_id: Number(productForm.category_id),
    };
    if (editingProductId) {
      await updateProduct(editingProductId, payload);
      showToast('Product updated');
    } else {
      await createProduct(payload);
      showToast('Product created');
    }
    setProductModalOpen(false);
    await loadData();
  };

  const handleDeleteProduct = async (id, name) => {
    await deleteProduct(id);
    showToast(`Deleted "${name}"`);
    await loadData();
  };

  // Category Modal Handlers
  const openCreateCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm(EMPTY_CATEGORY);
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
    });
    setCategoryModalOpen(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    const payload = {
      ...categoryForm,
      slug: categoryForm.slug || slugify(categoryForm.name),
    };
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, payload);
      showToast('Category updated');
    } else {
      await createCategory(payload);
      showToast('Category created');
    }
    setCategoryModalOpen(false);
    await loadData();
  };

  const handleDeleteCategory = async (id, name) => {
    await deleteCategory(id);
    showToast(`Deleted category "${name}"`);
    await loadData();
  };

  const handleResetDemo = async () => {
    resetCategoriesStorage();
    resetProductsStorage();
    await loadData();
    showToast('Demo catalog restored to defaults');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Catalog Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            CRUD interface mapped to <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs">/api/products</code> and{' '}
            <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-xs">/api/categories</code> for Laravel Steps 3–6.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {USE_MOCK_DATA && (
            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Demo Data
            </button>
          )}
          <button
            type="button"
            onClick={
              activeTab === 'products' ? openCreateProduct : openCreateCategory
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'products' ? 'Add Product' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Products
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats.totalProducts}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Categories
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats.totalCategories}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 uppercase">
            <AlertTriangle className="h-3.5 w-3.5" />
            Low Stock (≤5)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats.lowStock}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Inventory Value
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            ${stats.inventoryValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'products'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          Products ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'categories'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          Categories ({categories.length})
        </button>
      </div>

      {/* Table Area */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading catalog...
          </div>
        ) : activeTab === 'products' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">SKU</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || FALLBACK_PRODUCT_IMAGE}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                          }}
                          alt={p.name}
                          className="h-11 w-11 rounded-xl border border-slate-100 object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{p.name}</p>
                          <p className="font-mono text-xs text-slate-400">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                      {p.sku}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {p.category?.name || `#${p.category_id}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image_url || FALLBACK_CATEGORY_IMAGE}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_CATEGORY_IMAGE;
                          }}
                          alt={cat.name}
                          className="h-10 w-10 rounded-xl border border-slate-100 object-cover"
                        />
                        <span className="font-semibold text-slate-900">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                      {cat.slug}
                    </td>
                    <td className="max-w-md px-5 py-3.5 text-slate-600">
                      <p className="line-clamp-1">{cat.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCategory(cat)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProductId ? 'Edit Product' : 'Create Product'}
              </h2>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveProduct} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Category (`category_id`)
                </label>
                <select
                  value={productForm.category_id}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      category_id: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  SKU
                </label>
                <input
                  required
                  type="text"
                  value={productForm.sku}
                  onChange={(e) =>
                    setProductForm({ ...productForm, sku: e.target.value })
                  }
                  placeholder="ELC-1099"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Stock
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image_url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.is_featured}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      is_featured: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300"
                />
                Featured product
              </label>

              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategoryId ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveCategory} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Category Name
                </label>
                <input
                  required
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Slug
                </label>
                <input
                  required
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 font-mono text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={categoryForm.image_url}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
