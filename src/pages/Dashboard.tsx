import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChefHat,
  AlertCircle,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useStore } from '../store/useStore';
import { DAILY_STATS } from '../data/mockData';
import { format, differenceInMinutes } from 'date-fns';
import clsx from 'clsx';

function StatCard({
  title,
  value,
  sub,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  sub?: string;
  change?: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="card p-5 flex gap-4 items-start">
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', color)}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {sub && <span className="text-xs text-gray-400">{sub}</span>}
          {change !== undefined && (
            <span
              className={clsx(
                'flex items-center gap-0.5 text-xs font-medium',
                change >= 0 ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  served: { label: 'Served', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  paid: { label: 'Paid', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600', dot: 'bg-red-400' },
} as const;

export default function Dashboard() {
  const { orders, tables, settings } = useStore();
  const navigate = useNavigate();

  const sym = settings.currencySymbol;

  // Today's metrics
  const today = DAILY_STATS[DAILY_STATS.length - 1];
  const yesterday = DAILY_STATS[DAILY_STATS.length - 2];

  const revenueChange = Math.round(((today.revenue - yesterday.revenue) / yesterday.revenue) * 100);
  const ordersChange = Math.round(((today.orders - yesterday.orders) / yesterday.orders) * 100);

  const activeOrders = orders.filter((o) => !['paid', 'cancelled'].includes(o.status));
  const readyOrders = activeOrders.filter((o) => o.status === 'ready');
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const availableTables = tables.filter((t) => t.status === 'available').length;

  // Chart data — last 14 days
  const chartData = DAILY_STATS.slice(-14).map((d) => ({
    date: format(new Date(d.date), 'dd MMM'),
    revenue: d.revenue,
    orders: d.orders,
  }));

  // Top items from today's orders (mock from all orders)
  const itemSales: Record<string, { name: string; emoji: string; qty: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemSales[item.menuItemId]) {
        itemSales[item.menuItemId] = {
          name: item.menuItem.name,
          emoji: item.menuItem.emoji,
          qty: 0,
          revenue: 0,
        };
      }
      itemSales[item.menuItemId].qty += item.quantity;
      itemSales[item.menuItemId].revenue += item.totalPrice;
    });
  });
  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={`${sym}${today.revenue.toLocaleString()}`}
          sub="vs yesterday"
          change={revenueChange}
          icon={DollarSign}
          color="bg-brand-600"
        />
        <StatCard
          title="Orders Today"
          value={today.orders.toString()}
          sub="vs yesterday"
          change={ordersChange}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Covers Served"
          value={today.covers.toString()}
          sub={`avg ${sym}${today.avgOrderValue}/order`}
          icon={Users}
          color="bg-emerald-500"
        />
        <StatCard
          title="Active Tables"
          value={`${occupiedTables}/${tables.length}`}
          sub={`${availableTables} available`}
          icon={TrendingUp}
          color="bg-amber-500"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Revenue Trend</h2>
              <p className="text-xs text-gray-400">Last 14 days</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-600">
                {sym}{(DAILY_STATS.slice(-7).reduce((s, d) => s + d.revenue, 0)).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${sym}${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                formatter={(value: number) => [`${sym}${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2.5} fill="url(#colorRev)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order volume bar */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900">Order Volume</h2>
            <p className="text-xs text-gray-400">Last 14 days</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value: number) => [value, 'Orders']}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="orders" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Active Orders */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <ChefHat size={18} className="text-brand-600" />
              Active Orders
              {readyOrders.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {readyOrders.length} ready!
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate('/kitchen')}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              View KDS →
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-300" />
                <p className="text-sm">All caught up!</p>
              </div>
            ) : (
              activeOrders.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const mins = differenceInMinutes(new Date(), order.createdAt);
                const isLate = mins > 30;
                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/order/${order.tableId}`)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gray-600">T{order.tableNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900">{order.orderNumber}</span>
                        <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', cfg.color)}>
                          <span className={clsx('inline-block w-1.5 h-1.5 rounded-full mr-1', cfg.dot)} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {order.items.length} items · {order.waiterName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {sym}{order.total.toFixed(2)}
                      </p>
                      <p className={clsx('text-xs', isLate ? 'text-red-500 font-medium' : 'text-gray-400')}>
                        {isLate && <AlertCircle size={10} className="inline mr-0.5" />}
                        {mins}m ago
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top selling items */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-500" />
            Top Items Today
          </h2>
          <div className="space-y-3">
            {topItems.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {idx + 1}
                </div>
                <span className="text-lg shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.qty} sold</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 shrink-0">
                  {sym}{item.revenue.toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock size={11} /> Avg table turn
              </span>
              <span className="font-semibold text-gray-700">48 min</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Avg covers/table</span>
              <span className="font-semibold text-gray-700">3.2</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">GST collected</span>
              <span className="font-semibold text-gray-700">
                {sym}{(today.revenue * (settings.taxRate / (100 + settings.taxRate))).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
