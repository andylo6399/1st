import { useLocation } from 'react-router-dom';
import { Clock, Wifi, Battery, Signal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tables': 'Table Management',
  '/order': 'Order Taking',
  '/kitchen': 'Kitchen Display',
  '/menu': 'Menu Management',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings',
};

function Clock24() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-gray-600">
      <Clock size={14} className="text-gray-400" />
      <span className="text-sm font-mono font-medium tabular-nums">
        {time.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </span>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const { settings, orders, tables } = useStore();

  const pathBase = '/' + location.pathname.split('/')[1];
  const title = PAGE_TITLES[pathBase] ?? 'FlavorOS';

  const activeOrders = orders.filter(
    (o) => !['paid', 'cancelled'].includes(o.status)
  ).length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const totalTables = tables.length;

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0 z-10 shadow-sm">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
        <p className="text-xs text-gray-400 hidden sm:block">{settings.name}</p>
      </div>

      {/* Live stats */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">{activeOrders}</span>
          <span className="text-gray-400">active orders</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <span className="font-medium">{occupiedTables}</span>
          <span className="text-gray-400">/ {totalTables} tables</span>
        </div>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* System indicators */}
      <div className="flex items-center gap-3">
        <Clock24 />
        <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
          <Wifi size={14} />
          <Signal size={14} />
          <Battery size={14} />
        </div>
      </div>
    </header>
  );
}
