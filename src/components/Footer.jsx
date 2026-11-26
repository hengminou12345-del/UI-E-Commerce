import { Link } from 'react-router-dom';
import { Database, ExternalLink, Sparkles } from 'lucide-react';
import { API_BASE_URL, USE_MOCK_DATA } from '../services/api';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Veloce Market
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Modern React E-Commerce UI &amp; 5-table relational schema designed
              for seamless Laravel API &amp; Seeder integration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900">Navigation</h4>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li>
                  <Link to="/" className="hover:text-slate-900">
                    Storefront
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-slate-900">
                    Manage Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/checkout" className="hover:text-slate-900">
                    Checkout
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Architecture</h4>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li>
                  <Link
                    to="/erd"
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    <Database className="h-3.5 w-3.5" />
                    5-Table ERD
                  </Link>
                </li>
                <li>
                  <a
                    href="https://app.diagrams.net/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    diagrams.net
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                API Connection
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  USE_MOCK_DATA
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    USE_MOCK_DATA ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                {USE_MOCK_DATA ? 'Mock Mode · Laravel Ready' : 'Live Laravel API'}
              </span>
            </div>
            <p className="mt-2 truncate font-mono text-xs text-slate-600">
              {API_BASE_URL}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Set <code className="rounded bg-slate-200/70 px-1">VITE_USE_MOCK_DATA=false</code> in Step 6 to switch to live Laravel endpoints.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Veloce Market. Built with React &amp; Tailwind CSS.</p>
          <p>Step 1 &amp; Step 2 · Ready for Laravel API Steps 3–6</p>
        </div>
      </div>
    </footer>
  );
}
