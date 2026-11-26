import { Download, ExternalLink } from 'lucide-react';

const TABLES = [
  {
    name: 'customers',
    columns: [
      { key: 'PK', name: 'id', type: 'bigint' },
      { key: '', name: 'first_name', type: 'varchar(100)' },
      { key: '', name: 'last_name', type: 'varchar(100)' },
      { key: 'UK', name: 'email', type: 'varchar(255)' },
      { key: '', name: 'phone', type: 'varchar(30)' },
      { key: '', name: 'address', type: 'text' },
      { key: '', name: 'created_at / updated_at', type: 'timestamp' },
    ],
  },
  {
    name: 'categories',
    columns: [
      { key: 'PK', name: 'id', type: 'bigint' },
      { key: '', name: 'name', type: 'varchar(255)' },
      { key: 'UK', name: 'slug', type: 'varchar(255)' },
      { key: '', name: 'description', type: 'text' },
      { key: '', name: 'image_url', type: 'varchar(500)' },
      { key: '', name: 'created_at / updated_at', type: 'timestamp' },
    ],
  },
  {
    name: 'products',
    columns: [
      { key: 'PK', name: 'id', type: 'bigint' },
      { key: 'FK', name: 'category_id', type: 'bigint → categories.id' },
      { key: '', name: 'name', type: 'varchar(255)' },
      { key: 'UK', name: 'slug', type: 'varchar(255)' },
      { key: 'UK', name: 'sku', type: 'varchar(80)' },
      { key: '', name: 'description', type: 'text' },
      { key: '', name: 'price', type: 'decimal(10,2)' },
      { key: '', name: 'stock', type: 'int' },
      { key: '', name: 'image_url', type: 'varchar(500)' },
      { key: '', name: 'rating', type: 'decimal(2,1)' },
      { key: '', name: 'is_featured / is_active', type: 'boolean' },
      { key: '', name: 'created_at / updated_at', type: 'timestamp' },
    ],
  },
  {
    name: 'orders',
    columns: [
      { key: 'PK', name: 'id', type: 'bigint' },
      { key: 'FK', name: 'customer_id', type: 'bigint → customers.id' },
      { key: 'UK', name: 'order_number', type: 'varchar(50)' },
      { key: '', name: 'order_date', type: 'datetime' },
      { key: '', name: 'shipping_method', type: 'varchar(50)' },
      { key: '', name: 'shipping_cost', type: 'decimal(10,2)' },
      { key: '', name: 'subtotal', type: 'decimal(10,2)' },
      { key: '', name: 'total_amount', type: 'decimal(10,2)' },
      { key: '', name: 'status', type: 'enum(Pending..Delivered)' },
      { key: '', name: 'created_at / updated_at', type: 'timestamp' },
    ],
  },
  {
    name: 'order_items',
    columns: [
      { key: 'PK', name: 'id', type: 'bigint' },
      { key: 'FK', name: 'order_id', type: 'bigint → orders.id' },
      { key: 'FK', name: 'product_id', type: 'bigint → products.id' },
      { key: '', name: 'quantity', type: 'int' },
      { key: '', name: 'unit_price', type: 'decimal(10,2)' },
      { key: '', name: 'subtotal', type: 'decimal(10,2)' },
      { key: '', name: 'created_at / updated_at', type: 'timestamp' },
    ],
  },
];

const RELATIONS = [
  { from: 'customers.id', to: 'orders.customer_id', label: 'places (1 : 0..N)' },
  { from: 'categories.id', to: 'products.category_id', label: 'contains (1 : 0..N)' },
  { from: 'orders.id', to: 'order_items.order_id', label: 'includes (1 : 1..N)' },
  { from: 'products.id', to: 'order_items.product_id', label: 'ordered_in (1 : 0..N)' },
];

export default function ErdPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[0.14em] text-stone-400 uppercase">
            Database Schema · 5 Tables
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-neutral-950">
            E-Commerce Order Database ERD
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Open <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">docs/ecommerce-erd.drawio</code> in{' '}
            <strong>app.diagrams.net</strong> to inspect or export the diagram.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={`${import.meta.env.BASE_URL}ecommerce-erd.drawio`}
            download="ecommerce-erd.drawio"
            className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-4 py-2.5 text-xs font-medium tracking-wide text-white transition hover:bg-neutral-800"
          >
            <Download className="h-3.5 w-3.5" />
            Download .drawio
          </a>
          <a
            href="https://app.diagrams.net/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-xs font-medium text-neutral-900 transition hover:border-neutral-900"
          >
            Open app.diagrams.net
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RELATIONS.map((rel) => (
          <div
            key={rel.from}
            className="rounded-md border border-stone-200 bg-[#FAFAFA] px-3.5 py-2.5 text-xs"
          >
            <p className="font-mono font-medium text-neutral-950">
              {rel.from} → {rel.to}
            </p>
            <p className="mt-0.5 text-stone-500">{rel.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {TABLES.map((tbl) => (
          <div
            key={tbl.name}
            className="overflow-hidden rounded-md border border-stone-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-stone-200 bg-neutral-950 px-4 py-3 text-white">
              <span className="font-mono text-sm font-semibold">{tbl.name}</span>
              <span className="text-[11px] text-stone-300">
                {tbl.columns.length} cols
              </span>
            </div>
            <div className="divide-y divide-stone-100">
              {tbl.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between gap-2 px-4 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex w-7 justify-center rounded px-1 py-0.5 text-[10px] font-semibold ${
                        col.key === 'PK'
                          ? 'bg-neutral-900 text-white'
                          : col.key === 'FK'
                            ? 'bg-stone-200 text-neutral-900'
                            : col.key === 'UK'
                              ? 'border border-stone-300 text-stone-700'
                              : 'text-transparent'
                      }`}
                    >
                      {col.key || '-'}
                    </span>
                    <span className="font-mono font-medium text-neutral-950">
                      {col.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500">
                    {col.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
