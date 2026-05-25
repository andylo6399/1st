import { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, Bell, RefreshCw, Filter, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Order, OrderStatus, ItemStatus } from '../types';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import clsx from 'clsx';

const KITCHEN_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready'];

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; headerBg: string; text: string; btnColor: string; nextStatus: OrderStatus | null }> = {
  pending: {
    label: 'New Orders',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    headerBg: 'bg-amber-400',
    text: 'text-amber-900',
    btnColor: 'bg-amber-500 hover:bg-amber-600',
    nextStatus: 'preparing',
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    headerBg: 'bg-blue-500',
    text: 'text-blue-900',
    btnColor: 'bg-blue-500 hover:bg-blue-600',
    nextStatus: 'preparing',
  },
  preparing: {
    label: 'Preparing',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    headerBg: 'bg-orange-500',
    text: 'text-orange-900',
    btnColor: 'bg-orange-500 hover:bg-orange-600',
    nextStatus: 'ready',
  },
  ready: {
    label: 'Ready',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    headerBg: 'bg-emerald-500',
    text: 'text-emerald-900',
    btnColor: 'bg-emerald-500 hover:bg-emerald-600',
    nextStatus: 'served',
  },
};

function ElapsedTimer({ since }: { since: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => setElapsed(differenceInSeconds(new Date(), since));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [since]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const isUrgent = mins >= 20;
  const isWarning = mins >= 10;

  return (
    <span
      className={clsx(
        'font-mono text-sm font-bold tabular-nums',
        isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-600'
      )}
    >
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

const ITEM_STATUS_CONFIG: Record<ItemStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  preparing: { label: 'Preparing', color: 'text-orange-700', bg: 'bg-orange-100' },
  ready: { label: 'Ready', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  served: { label: 'Served', color: 'text-gray-500', bg: 'bg-gray-100' },
};

type KDSCardProps = {
  order: Order;
  onBump: (orderId: string) => void;
  onRecall: (orderId: string) => void;
  onItemStatusChange: (orderId: string, itemId: string, status: ItemStatus) => void;
};

function KDSCard({ order, onBump, onItemStatusChange }: KDSCardProps) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const mins = differenceInMinutes(new Date(), order.createdAt);
  const isUrgent = mins >= 25;

  const allItemsReady = order.items.every((i) => i.status === 'ready' || i.status === 'served');

  return (
    <div
      className={clsx(
        'rounded-2xl border-2 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow',
        cfg.border,
        cfg.bg,
        order.status === 'pending' && 'kds-new',
        isUrgent && 'ring-2 ring-red-400'
      )}
    >
      {/* Card Header */}
      <div className={clsx('px-4 py-3 flex items-center justify-between', cfg.headerBg)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T{order.tableNumber ?? '?'}</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{order.orderNumber}</p>
            <p className="text-white/80 text-[10px]">{order.waiterName} · {order.guestCount} guests</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-0.5">
            <Clock size={10} className="text-white" />
            <ElapsedTimer since={order.createdAt} />
          </div>
          {isUrgent && (
            <div className="flex items-center gap-0.5 bg-red-600 rounded px-1.5 py-0.5">
              <AlertTriangle size={9} className="text-white" />
              <span className="text-white text-[9px] font-bold">URGENT</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 p-3 space-y-2">
        {order.items.map((item) => {
          const itemCfg = ITEM_STATUS_CONFIG[item.status];
          const cycleStatus = (): ItemStatus => {
            const cycle: ItemStatus[] = ['pending', 'preparing', 'ready', 'served'];
            const idx = cycle.indexOf(item.status);
            return cycle[(idx + 1) % cycle.length];
          };

          return (
            <div
              key={item.id}
              className={clsx(
                'flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer hover:opacity-80 transition-opacity',
                item.status === 'served' ? 'opacity-50 border-gray-200 bg-white/50' : 'border-white bg-white shadow-sm'
              )}
              onClick={() => onItemStatusChange(order.id, item.id, cycleStatus())}
              title="Click to advance status"
            >
              <span className="text-2xl shrink-0">{item.menuItem.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={clsx(
                    'font-semibold text-sm',
                    item.status === 'served' ? 'text-gray-400 line-through' : 'text-gray-900'
                  )}>
                    ×{item.quantity} {item.menuItem.name}
                  </p>
                  <span className={clsx('text-[10px] px-1.5 py-0.5 rounded font-medium', itemCfg.bg, itemCfg.color)}>
                    {itemCfg.label}
                  </span>
                </div>
                {item.selectedModifiers.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.selectedModifiers.map((m) => m.name).join(' · ')}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-amber-700 mt-0.5 font-medium">⚠ {item.notes}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">{item.menuItem.prepTime} min prep</p>
              </div>
            </div>
          );
        })}

        {order.notes && (
          <div className="mt-1 bg-amber-100 border border-amber-200 rounded-xl p-2 text-xs text-amber-800">
            📋 {order.notes}
          </div>
        )}
      </div>

      {/* Bump Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => onBump(order.id)}
          className={clsx(
            'w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2',
            cfg.btnColor,
            allItemsReady && order.status === 'preparing' && 'ring-2 ring-emerald-300'
          )}
        >
          <CheckCircle2 size={16} />
          {order.status === 'pending' && 'Accept Order'}
          {order.status === 'confirmed' && 'Start Preparing'}
          {order.status === 'preparing' && 'Mark Ready'}
          {order.status === 'ready' && 'Order Served'}
        </button>
      </div>
    </div>
  );
}

export default function KitchenDisplay() {
  const { orders, updateOrderStatus, updateOrderItemStatus, addToast } = useStore();
  const [filterSection, setFilterSection] = useState<string>('all');
  const [, forceUpdate] = useState(0);

  // Tick every 10s to refresh timers display
  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const kitchenOrders = orders.filter((o) => KITCHEN_STATUSES.includes(o.status));

  function handleBump(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const next = STATUS_CONFIG[order.status]?.nextStatus;
    if (!next) return;

    updateOrderStatus(orderId, next);
    const msg =
      next === 'preparing' ? `${order.orderNumber} is now being prepared` :
      next === 'ready' ? `${order.orderNumber} is ready for service!` :
      next === 'served' ? `${order.orderNumber} served` : '';
    if (msg) addToast(msg, next === 'ready' ? 'success' : 'info');
  }

  function handleRecall(_orderId: string) {
    // Would show recalled order again
    addToast('Recalled order displayed', 'info');
  }

  function handleItemStatus(orderId: string, itemId: string, status: ItemStatus) {
    updateOrderItemStatus(orderId, itemId, status);
  }

  const columns: { status: OrderStatus; orders: Order[] }[] = KITCHEN_STATUSES.map((s) => ({
    status: s,
    orders: kitchenOrders.filter((o) => o.status === s),
  }));

  const totalActive = kitchenOrders.length;
  const urgentCount = kitchenOrders.filter((o) => differenceInMinutes(new Date(), o.createdAt) >= 20).length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-900">
      {/* KDS Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center gap-4 shrink-0 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <ChefHat size={22} className="text-orange-400" />
          <span className="text-white font-bold text-lg">Kitchen Display</span>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div className="flex items-center gap-1.5 bg-gray-700 rounded-lg px-3 py-1.5">
            <span className="text-white font-bold">{totalActive}</span>
            <span className="text-gray-400 text-sm">orders</span>
          </div>
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-600 rounded-lg px-3 py-1.5 animate-pulse">
              <AlertTriangle size={14} className="text-white" />
              <span className="text-white font-bold">{urgentCount} urgent</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setFilterSection('all')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filterSection === 'all' ? 'bg-brand-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            )}
          >
            <Filter size={12} className="inline mr-1" /> All
          </button>
          <button
            className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
            title="Refresh"
            onClick={() => forceUpdate((n) => n + 1)}
          >
            <RefreshCw size={14} />
          </button>
          {kitchenOrders.filter((o) => o.status === 'ready').length > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-600 rounded-lg px-3 py-1.5">
              <Bell size={14} className="text-white" />
              <span className="text-white text-sm font-bold">
                {kitchenOrders.filter((o) => o.status === 'ready').length} ready
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-0 overflow-hidden">
        {columns.map(({ status, orders: colOrders }) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <div key={status} className="flex flex-col overflow-hidden border-r border-gray-800 last:border-r-0">
              {/* Column header */}
              <div className={clsx('px-4 py-2.5 flex items-center justify-between shrink-0', cfg.headerBg)}>
                <span className="text-white font-bold text-sm">{cfg.label}</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-gray-700" />
                    <p className="text-sm">No orders</p>
                  </div>
                ) : (
                  colOrders
                    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                    .map((order) => (
                      <KDSCard
                        key={order.id}
                        order={order}
                        onBump={handleBump}
                        onRecall={handleRecall}
                        onItemStatusChange={handleItemStatus}
                      />
                    ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
