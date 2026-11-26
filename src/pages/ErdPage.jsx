import { Database, Download, ExternalLink, Link2 } from 'lucide-react';

const TABLES = [
  {
    name: 'customers',
    accent: 'bg-slate-900',
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
    accent: 'bg-sky-700',
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
    accent: 'bg-blue-700',
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
    accent: 'bg-indigo-700',
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
    accent: 'bg-teal-700',
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Database className="h-3.5 w-3.5" />
              Database Design · 5 Tables
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              E-Commerce Order Database ERD
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
              Open <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">docs/ecommerce-erd.drawio</code> in{' '}
              <strong>app.diagrams.net</strong> to view or export the full diagram.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="/ecommerce-erd.drawio"
              download="ecommerce-erd.drawio"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Download .drawio
            </a>
            <a
              href="https://app.diagrams.net/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open app.diagrams.net
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {RELATIONS.map((rel) => (
            <div
              key={rel.from}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs"
            >
              <Link2 className="h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <p className="font-mono font-semibold text-slate-900">
                  {rel.from} → {rel.to}
                </p>
                <p className="text-slate-500">{rel.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {TABLES.map((tbl) => (
          <div
            key={tbl.name}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className={`${tbl.accent} flex items-center justify-between px-4 py-3 text-white`}>
              <span className="font-mono text-sm font-bold">{tbl.name}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                {tbl.columns.length} cols
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {tbl.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between gap-2 px-4 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex w-8 justify-center rounded px-1 py-0.5 text-[10px] font-bold ${
                        col.key === 'PK'
                          ? 'bg-blue-100 text-blue-700'
                          : col.key === 'FK'
                            ? 'bg-amber-100 text-amber-800'
                            : col.key === 'UK'
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-transparent'
                      }`}
                    >
                      {col.key || '-'}
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {col.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
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
