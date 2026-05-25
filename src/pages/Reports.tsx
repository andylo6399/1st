import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStore } from '../store/useStore';
import { DAILY_STATS } from '../data/mockData';
import { format } from 'date-fns';
import clsx from 'clsx';

type DateRange = '7d' | '14d' | '30d';

const COLORS = ['#9333ea', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CATEGORY_EMOJI: Record<string, string> = {
  Appetizers: '🥢',
  Mains: '🍽️',
  Desserts: '🍰',
  Beverages: '🥤',
  Specials: '⭐',
  Sides: '🥗',
};

function StatKPI({
  label, value, sub, change, icon: Icon, color,
}: {
  label: string; value: string; sub?: string; change?: number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      {change !== undefined && (
        <div className={clsx('flex items-center gap-1 mt-2 text-xs font-medium', change >= 0 ? 'text-emerald-600' : 'text-red-500')}>
          {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}% vs prior period
        </div>
      )}
    </div>
  );
}

export default function Reports() {
  const { orders, settings } = useStore();
  const [dateRange, setDateRange] = useState<DateRange>('14d');

  const sym = settings.currencySymbol;
  const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;

  const stats = DAILY_STATS.slice(-days);
  const prevStats = DAILY_STATS.slice(-(days * 2), -days);

  const totalRevenue = stats.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = stats.reduce((s, d) => s + d.orders, 0);
  const totalCovers = stats.reduce((s, d) => s + d.covers, 0);
  const avgOrderVal = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const prevRevenue = prevStats.reduce((s, d) => s + d.revenue, 0);
  const prevOrders = prevStats.reduce((s, d) => s + d.orders, 0);

  const revenueChange = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;
  const ordersChange = prevOrders > 0 ? Math.round(((totalOrders - prevOrders) / prevOrders) * 100) : 0;

  // Revenue chart data
  const revenueChartData = stats.map((d) => ({
    date: format(new Date(d.date), 'dd MMM'),
    revenue: d.revenue,
    orders: d.orders,
    covers: d.covers,
  }));

  // Category breakdown from orders
  const catRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.menuItem.category;
        map[cat] = (map[cat] ?? 0) + item.totalPrice;
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value), emoji: CATEGORY_EMOJI[name] ?? '📦' }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  // Top items by revenue
  const itemRevenue = useMemo(() => {
    const map: Record<string, { name: string; emoji: string; qty: number; revenue: number; category: string }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const id = item.menuItemId;
        if (!map[id]) {
          map[id] = { name: item.menuItem.name, emoji: item.menuItem.emoji, qty: 0, revenue: 0, category: item.menuItem.category };
        }
        map[id].qty += item.quantity;
        map[id].revenue += item.totalPrice;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [orders]);

  // Hourly distribution (simulated)
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 11; // 11am - 10pm
    const isPeak = hour >= 12 && hour <= 14 || hour >= 18 && hour <= 21;
    return {
      hour: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`,
      orders: isPeak ? Math.floor(15 + Math.random() * 20) : Math.floor(3 + Math.random() * 10),
    };
  });

  // Day of week performance
  const dowData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
    const isWeekend = i >= 5;
    return {
      day,
      revenue: Math.round((isWeekend ? 3800 : 2200) + Math.random() * 800 - 200),
    };
  });

  // Payment method breakdown
  const paymentData = [
    { name: 'Card', value: 58 },
    { name: 'Cash', value: 22 },
    { name: 'E-Wallet', value: 15 },
    { name: 'Split', value: 5 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">{settings.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range picker */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(['7d', '14d', '30d'] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  dateRange === r ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatKPI
          label="Total Revenue"
          value={`${sym}${totalRevenue.toLocaleString()}`}
          sub={`${days}-day period`}
          change={revenueChange}
          icon={DollarSign}
          color="bg-brand-600"
        />
        <StatKPI
          label="Total Orders"
          value={totalOrders.toString()}
          sub={`${Math.round(totalOrders / days)} / day avg`}
          change={ordersChange}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatKPI
          label="Total Covers"
          value={totalCovers.toLocaleString()}
          sub={`${Math.round(totalCovers / totalOrders * 10) / 10} per order`}
          icon={Users}
          color="bg-emerald-500"
        />
        <StatKPI
          label="Avg Order Value"
          value={`${sym}${avgOrderVal.toFixed(2)}`}
          sub="per transaction"
          icon={TrendingUp}
          color="bg-amber-500"
        />
      </div>

      {/* Revenue Area Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-600" />
            Revenue & Orders
          </h2>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-brand-500 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block border-dashed border-t" /> Orders</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${sym}${(v / 1000).toFixed(1)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              formatter={(value: number, name: string) => [
                name === 'revenue' ? `${sym}${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders',
              ]}
            />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2.5} fill="url(#gRev)" dot={false} />
            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={1.5} fill="none" strokeDasharray="4 2" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Day of week */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-brand-500" /> Day Performance
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dowData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                formatter={(v: number) => [`${sym}${v.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="revenue" fill="#9333ea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={catRevenue} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" strokeWidth={2}>
                  {catRevenue.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [`${sym}${v}`, 'Revenue']}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {catRevenue.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-600 flex-1 truncate">{cat.emoji} {cat.name}</span>
                  <span className="text-xs font-bold text-gray-800">{sym}{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {paymentData.map((p, i) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{p.name}</span>
                  <span className="font-semibold text-gray-800">{p.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${p.value}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Hourly Distribution</h3>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={hourlyData} margin={{ top: 2, right: 0, left: -35, bottom: 0 }} barSize={8}>
                <XAxis dataKey="hour" tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => [v, 'Orders']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '10px' }}
                />
                <Bar dataKey="orders" fill="#9333ea" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Items Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Top Menu Items</h2>
          <span className="text-xs text-gray-400">by revenue</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-2 pr-4 text-xs text-gray-500 font-medium">#</th>
                <th className="pb-2 pr-4 text-xs text-gray-500 font-medium">Item</th>
                <th className="pb-2 pr-4 text-xs text-gray-500 font-medium">Category</th>
                <th className="pb-2 pr-4 text-xs text-gray-500 font-medium text-right">Qty Sold</th>
                <th className="pb-2 text-xs text-gray-500 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {itemRevenue.map((item, idx) => {
                const maxRev = itemRevenue[0]?.revenue ?? 1;
                const pct = (item.revenue / maxRev) * 100;
                return (
                  <tr key={item.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <div className="h-1 bg-gray-100 rounded mt-1 w-24">
                            <div className="h-1 bg-brand-500 rounded" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-right font-medium text-gray-700">{item.qty}</td>
                    <td className="py-2.5 text-right font-bold text-gray-900">{sym}{item.revenue.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={3} className="pt-3 text-sm font-semibold text-gray-700">Total</td>
                <td className="pt-3 text-right font-semibold text-gray-700">
                  {itemRevenue.reduce((s, i) => s + i.qty, 0)}
                </td>
                <td className="pt-3 text-right font-bold text-brand-600">
                  {sym}{itemRevenue.reduce((s, i) => s + i.revenue, 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Best Day</p>
            <p className="text-xs text-gray-500">
              {format(new Date(stats.reduce((best, d) => d.revenue > best.revenue ? d : best, stats[0]).date), 'EEE, dd MMM')}
              {' '}· {sym}{Math.max(...stats.map((d) => d.revenue)).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <TrendingDown size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Quietest Day</p>
            <p className="text-xs text-gray-500">
              {format(new Date(stats.reduce((min, d) => d.revenue < min.revenue ? d : min, stats[0]).date), 'EEE, dd MMM')}
              {' '}· {sym}{Math.min(...stats.map((d) => d.revenue)).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Users size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Avg Covers / Day</p>
            <p className="text-xs text-gray-500">
              {Math.round(totalCovers / days)} covers · {sym}{(totalRevenue / totalCovers).toFixed(2)} / cover
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
