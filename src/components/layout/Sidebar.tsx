import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  ShoppingCart,
  ChefHat,
  BookOpen,
  BarChart2,
  Settings,
  Utensils,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tables', icon: Grid3X3, label: 'Tables' },
  { to: '/order', icon: ShoppingCart, label: 'Order' },
  { to: '/kitchen', icon: ChefHat, label: 'Kitchen' },
  { to: '/menu', icon: BookOpen, label: 'Menu' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { orders, currentStaff } = useStore();
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready').length;

  return (
    <aside className="w-20 bg-brand-900 flex flex-col items-center py-4 gap-1 shrink-0 z-10 shadow-xl">
      {/* Logo */}
      <div className="mb-4 flex flex-col items-center">
        <div className="w-11 h-11 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <Utensils size={22} className="text-white" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'relative w-full flex flex-col items-center gap-1 py-3 px-1 rounded-xl transition-all text-xs font-medium',
                isActive
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'text-brand-300 hover:bg-brand-800 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} />
                <span className="text-[10px] leading-none">{label}</span>
                {label === 'Kitchen' && pendingCount > 0 && (
                  <span
                    className={clsx(
                      'absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center',
                      isActive ? 'bg-white text-brand-600' : 'bg-red-500 text-white'
                    )}
                  >
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Current staff */}
      {currentStaff && (
        <div className="mt-auto flex flex-col items-center pb-2">
          <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center text-xl cursor-pointer hover:bg-brand-600 transition-colors">
            <span title={currentStaff.name}>{currentStaff.avatar}</span>
          </div>
          <span className="text-[9px] text-brand-400 mt-1 truncate max-w-[64px] text-center">
            {currentStaff.name}
          </span>
        </div>
      )}
    </aside>
  );
}
