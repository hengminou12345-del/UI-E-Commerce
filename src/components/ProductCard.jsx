import { useCart } from '../context/CartContext';
import { FALLBACK_PRODUCT_IMAGE } from '../data/mockProducts';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex flex-col">
      <div className="aspect-[4/4] overflow-hidden rounded-md bg-[#F4F4F2]">
        <img
          src={product.image_url || FALLBACK_PRODUCT_IMAGE}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-[15px] font-semibold tracking-tight text-neutral-950">
            {product.name}
          </h2>
          <span className="tabular-nums text-[15px] font-semibold text-neutral-950">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-stone-500">
          {product.description}
        </p>

        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          className="mt-4 w-full rounded-md border border-neutral-900 bg-white px-4 py-2.5 text-xs font-medium tracking-wide text-neutral-950 transition hover:bg-neutral-950 hover:text-white active:scale-[0.99]"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
