import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const list = await getProducts();
        if (!active) return;
        setProducts(list);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-3 border-b border-stone-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[0.14em] text-stone-400 uppercase">
            Hardware Collection
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-neutral-950">
            Essential Desk Setup
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          {products.length} curated items available
        </p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-md bg-stone-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
              <div className="h-9 w-full animate-pulse rounded-md bg-stone-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
