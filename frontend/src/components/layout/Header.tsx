import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Menu, Bell, Search, X, AlertTriangle, PackageX, Boxes, Package, Briefcase, Users } from 'lucide-react';
import { extractListData } from '../../services/api';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { supplierService } from '../../services/supplierService';
import { userService } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

const LOW_STOCK_THRESHOLD = 5;
const REFRESH_INTERVAL = 30000;

interface SearchDomain {
  key: string;
  icon: typeof Boxes;
  color: string;
  path: string;
}

const SEARCH_DOMAINS: SearchDomain[] = [
  { key: 'products', icon: Boxes, color: 'text-lion-blue', path: '/products' },
  { key: 'categories', icon: Package, color: 'text-lion-gold', path: '/categories' },
  { key: 'suppliers', icon: Briefcase, color: 'text-emerald-500', path: '/suppliers' },
  { key: 'users', icon: Users, color: 'text-violet-500', path: '/users' },
];

interface DomainMap {
  type: string;
  label: string;
  sub: (item: Record<string, unknown>) => string;
}

const domainMap: Record<string, DomainMap> = {
  products: { type: 'Produto', label: 'name', sub: (p) => `SKU: ${(p as { sku?: string }).sku}` },
  categories: { type: 'Categoria', label: 'name', sub: (c) => (c as { description?: string }).description || '' },
  suppliers: { type: 'Fornecedor', label: 'name', sub: (s) => (s as { contactName?: string; email?: string }).contactName || (s as { email?: string }).email || '' },
  users: { type: 'Usuário', label: 'name', sub: (u) => (u as { email?: string }).email || '' },
};

const domainFilters: Record<string, (q: string) => (item: Record<string, unknown>) => boolean> = {
  products: (q: string) => (p: Record<string, unknown>) => {
    const name = (p as { name?: string }).name?.toLowerCase();
    const sku = (p as { sku?: string }).sku?.toLowerCase();
    return (name?.includes(q) ?? false) || (sku?.includes(q) ?? false);
  },
  categories: (q: string) => (c: Record<string, unknown>) => {
    const name = (c as { name?: string }).name?.toLowerCase();
    return name?.includes(q) ?? false;
  },
  suppliers: (q: string) => (s: Record<string, unknown>) => {
    const name = (s as { name?: string }).name?.toLowerCase();
    const contactName = (s as { contactName?: string }).contactName?.toLowerCase();
    return (name?.includes(q) ?? false) || (contactName?.includes(q) ?? false);
  },
  users: (q: string) => (u: Record<string, unknown>) => {
    const name = (u as { name?: string }).name?.toLowerCase();
    const email = (u as { email?: string }).email?.toLowerCase();
    return (name?.includes(q) ?? false) || (email?.includes(q) ?? false);
  },
};

interface SearchResult {
  type: string;
  label: string;
  sub: string;
  path: string;
  item: Record<string, unknown>;
}

interface AlertItem {
  _id: string;
  name: string;
  quantity?: number;
}

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [search, setSearch] = useState('');
  const [allData, setAllData] = useState<Record<string, Record<string, unknown>[]>>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const [products, categories, suppliers, users] = await Promise.all([
      productService.getAll().then((r) => extractListData(r, [])).catch(() => []),
      categoryService.getAll().then((r) => extractListData(r, [])).catch(() => []),
      supplierService.getAll().then((r) => extractListData(r, [])).catch(() => []),
      userService.getAll().then((r) => extractListData(r, [])).catch(() => []),
    ]);
    setAllData({ products, categories, suppliers, users });
    setAlerts(products as AlertItem[]);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    const onFocus = () => fetchData();
    const onStockUpdate = () => fetchData();
    window.addEventListener('focus', onFocus);
    window.addEventListener('stock-updated', onStockUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('stock-updated', onStockUpdate);
    };
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) { setResults([]); return; }
    const q = search.toLowerCase();
    const out: SearchResult[] = [];
    SEARCH_DOMAINS.forEach(({ key }) => {
      (allData[key] || []).filter(domainFilters[key](q)).forEach((item) => {
        const def = domainMap[key];
        const domain = SEARCH_DOMAINS.find((d) => d.key === key);
        out.push({ type: def.type, label: String(item[def.label] || ''), sub: def.sub(item), path: domain?.path || '', item });
      });
    });
    setResults(out.slice(0, 10));
  }, [search, allData]);

  useEffect(() => { setShowResults(results.length > 0); }, [results]);

  const outOfStock = alerts.filter((p) => (p.quantity ?? 0) <= 0);
  const lowStock = alerts.filter((p) => {
    const q = p.quantity ?? 0;
    return q > 0 && q <= LOW_STOCK_THRESHOLD;
  });
  const notifCount = outOfStock.length + lowStock.length;

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm text-slate-500">Sistema de Gestão de Estoque</p>
          <h1 className="text-lg font-semibold text-slate-900">LionStock</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-44 bg-transparent text-sm outline-none" placeholder="Buscar..." value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} onFocus={() => { if (results.length) setShowResults(true); }} />
            {search && (
              <button onClick={() => { setSearch(''); setShowResults(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showResults && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white py-2 shadow-soft">
              {results.map((item, i) => {
                const domain = SEARCH_DOMAINS.find((d) => d.path === item.path);
                const Icon = domain?.icon || Search;
                const color = domain?.color || 'text-slate-400';
                return (
                  <button key={`${item.type}-${i}`}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => { navigate(item.path); setSearch(''); setShowResults(false); }}>
                    <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                    <div className="min-w-0 text-left">
                      <p className="truncate font-medium text-slate-900">{item.label}</p>
                      <p className="truncate text-xs text-slate-400">{item.sub}</p>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider text-slate-400">{item.type}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotif(!showNotif)}
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
            <Bell className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notifCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white py-2 shadow-soft">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Alertas de Estoque</div>
              {notifCount === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">Nenhum alerta no momento.</div>
              ) : (
                <>
                  {outOfStock.length > 0 && (
                    <div className="px-4 py-2">
                      <p className="mb-1 text-xs font-semibold text-red-600">Sem estoque</p>
                      <div className="space-y-1">
                        {outOfStock.map((p) => (
                          <div key={p._id} className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                            <PackageX className="h-4 w-4 shrink-0" /><span>{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {lowStock.length > 0 && (
                    <div className="px-4 py-2">
                      <p className="mb-1 text-xs font-semibold text-amber-600">Estoque baixo</p>
                      <div className="space-y-1">
                        {lowStock.map((p) => (
                          <div key={p._id} className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
                            <AlertTriangle className="h-4 w-4 shrink-0" /><span>{p.name} ({p.quantity} unid.)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;