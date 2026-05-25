import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Clock, RefreshCw, CheckCircle, XCircle, Circle, Square } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Table, TableStatus } from '../types';
import { differenceInMinutes, format } from 'date-fns';
import clsx from 'clsx';

const STATUS_STYLES: Record<TableStatus, { bg: string; border: string; text: string; label: string; dot: string }> = {
  available: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Available', dot: 'bg-emerald-400' },
  occupied: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', label: 'Occupied', dot: 'bg-red-400' },
  reserved: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: 'Reserved', dot: 'bg-amber-400' },
  cleaning: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', label: 'Cleaning', dot: 'bg-blue-400' },
};

function TableShape({ table, style }: { table: Table; style: typeof STATUS_STYLES[TableStatus] }) {
  const baseClass = clsx(
    'flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-150',
    'border-2 font-semibold hover:scale-105 hover:shadow-md',
    style.bg,
    style.border,
    style.text
  );

  const content = (
    <>
      <span className="text-base font-bold">{table.number}</span>
      {table.guestCount && (
        <span className="text-[10px] flex items-center gap-0.5 mt-0.5">
          <Users size={8} />
          {table.guestCount}
        </span>
      )}
      {table.occupiedSince && (
        <span className="text-[9px] mt-0.5">
          {differenceInMinutes(new Date(), table.occupiedSince)}m
        </span>
      )}
    </>
  );

  if (table.shape === 'round') {
    return (
      <div
        className={clsx(baseClass, 'rounded-full')}
        style={{ width: table.width, height: table.height }}
      >
        {content}
      </div>
    );
  }

  if (table.shape === 'rectangle') {
    return (
      <div
        className={clsx(baseClass, 'rounded-xl')}
        style={{ width: table.width, height: table.height }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={clsx(baseClass, 'rounded-xl')}
      style={{ width: table.width, height: table.height }}
    >
      {content}
    </div>
  );
}

type GuestModalProps = {
  table: Table;
  onClose: () => void;
  onConfirm: (guestCount: number) => void;
};

function GuestModal({ table, onClose, onConfirm }: GuestModalProps) {
  const [guests, setGuests] = useState(2);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold mb-1">Open Table {table.number}</h2>
        <p className="text-sm text-gray-500 mb-5">How many guests?</p>
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center transition-colors"
          >−</button>
          <span className="text-5xl font-bold text-brand-600 w-16 text-center tabular-nums">{guests}</span>
          <button
            onClick={() => setGuests(Math.min(table.capacity, guests + 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center transition-colors"
          >+</button>
        </div>
        <p className="text-xs text-center text-gray-400 mb-5">Capacity: {table.capacity} seats</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => onConfirm(guests)} className="btn-primary flex-1">
            Open & Order
          </button>
        </div>
      </div>
    </div>
  );
}

type TableDetailProps = {
  table: Table;
  onClose: () => void;
  onOpenOrder: () => void;
  onMarkClean: () => void;
  onMarkAvailable: () => void;
};

function TableDetail({ table, onClose, onOpenOrder, onMarkClean, onMarkAvailable }: TableDetailProps) {
  const { orders, settings } = useStore();
  const order = orders.find((o) => o.id === table.activeOrderId);
  const sym = settings.currencySymbol;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{table.name}</h2>
            <p className="text-sm text-gray-500">{table.section} · {table.capacity} seats</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <XCircle size={22} />
          </button>
        </div>

        <div className="space-y-3 mb-5">
          {table.status === 'occupied' && order && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order</span>
                  <span className="font-semibold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Guests</span>
                  <span className="font-semibold">{table.guestCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Seated</span>
                  <span className="font-semibold">
                    {table.occupiedSince
                      ? `${differenceInMinutes(new Date(), table.occupiedSince)} min ago`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <span className="font-semibold">{order.items.length}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="font-bold text-brand-600">{sym}{order.total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={onOpenOrder} className="btn-primary w-full">
                View / Modify Order
              </button>
            </>
          )}

          {table.status === 'reserved' && (
            <div className="bg-amber-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reserved for</span>
                <span className="font-semibold">{table.reservedFor}</span>
              </div>
              {table.reservedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time</span>
                  <span className="font-semibold">{format(table.reservedAt, 'HH:mm')}</span>
                </div>
              )}
            </div>
          )}

          {table.status === 'cleaning' && (
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 text-center">
              Table is being cleaned
            </div>
          )}

          {table.status === 'available' && (
            <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-700 text-center">
              Table is available
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {table.status === 'available' && (
            <button onClick={onOpenOrder} className="btn-primary flex-1">
              <Plus size={14} className="inline mr-1" /> New Order
            </button>
          )}
          {table.status === 'cleaning' && (
            <button onClick={onMarkAvailable} className="btn-success flex-1">
              <CheckCircle size={14} className="inline mr-1" /> Mark Clean
            </button>
          )}
          {table.status === 'occupied' && (
            <button onClick={onMarkClean} className="btn-secondary flex-1">
              Mark for Cleaning
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function TableManagement() {
  const { tables, orders, updateTableStatus, createOrder, setActiveOrder, addToast } = useStore();
  const navigate = useNavigate();

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [guestModalTableId, setGuestModalTableId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TableStatus | 'all'>('all');

  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null;
  const guestTable = tables.find((t) => t.id === guestModalTableId) ?? null;

  const sections = [...new Set(tables.map((t) => t.section))];

  const counts: Record<TableStatus, number> = {
    available: 0,
    occupied: 0,
    reserved: 0,
    cleaning: 0,
  };
  tables.forEach((t) => counts[t.status]++);

  function handleTableClick(table: Table) {
    setSelectedTableId(table.id);
  }

  function handleOpenOrder(table: Table) {
    setSelectedTableId(null);
    if (table.status === 'occupied' && table.activeOrderId) {
      setActiveOrder(table.activeOrderId);
      navigate(`/order/${table.id}`);
    } else if (table.status === 'available') {
      setGuestModalTableId(table.id);
    }
  }

  function handleGuestConfirm(guestCount: number) {
    if (!guestTable) return;
    const order = createOrder(guestTable.id, guestTable.number, 'dine-in', guestCount);
    setGuestModalTableId(null);
    addToast(`Table ${guestTable.number} opened — ${order.orderNumber}`, 'success');
    navigate(`/order/${guestTable.id}`);
  }

  function handleMarkClean(tableId: string) {
    updateTableStatus(tableId, 'cleaning');
    setSelectedTableId(null);
    addToast('Table marked for cleaning', 'info');
  }

  function handleMarkAvailable(tableId: string) {
    updateTableStatus(tableId, 'available');
    setSelectedTableId(null);
    addToast('Table is now available', 'success');
  }

  // Canvas dimensions
  const canvasW = 820;
  const canvasH = 870;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Floor Plan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Legend / filter */}
        <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All ({tables.length})
          </button>
          {(Object.entries(STATUS_STYLES) as [TableStatus, typeof STATUS_STYLES[TableStatus]][]).map(([st, cfg]) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                filterStatus === st
                  ? clsx(cfg.bg, cfg.border, cfg.text)
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <span className={clsx('w-2 h-2 rounded-full', cfg.dot)} />
              {cfg.label} ({counts[st]})
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {/* Section labels + tables */}
          <div className="relative" style={{ width: canvasW, height: canvasH }}>
            {/* Section backgrounds */}
            <div className="absolute rounded-2xl bg-white/70 border border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-widest p-2"
              style={{ left: 40, top: 40, width: 730, height: 340 }}>
              Main Dining
            </div>
            <div className="absolute rounded-2xl bg-amber-50/70 border border-amber-100 text-xs font-semibold text-amber-400 uppercase tracking-widest p-2"
              style={{ left: 40, top: 400, width: 730, height: 160 }}>
              Terrace
            </div>
            <div className="absolute rounded-2xl bg-purple-50/70 border border-purple-100 text-xs font-semibold text-purple-400 uppercase tracking-widest p-2"
              style={{ left: 40, top: 575, width: 570, height: 140 }}>
              Private Dining
            </div>
            <div className="absolute rounded-2xl bg-gray-100/70 border border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-widest p-2"
              style={{ left: 40, top: 730, width: 380, height: 90 }}>
              Bar
            </div>

            {/* Tables */}
            {tables.map((table) => {
              const style = STATUS_STYLES[table.status];
              const isFiltered = filterStatus !== 'all' && table.status !== filterStatus;
              return (
                <div
                  key={table.id}
                  className={clsx('absolute transition-opacity', isFiltered && 'opacity-20 pointer-events-none')}
                  style={{ left: table.x, top: table.y }}
                  onClick={() => handleTableClick(table)}
                >
                  <TableShape table={table} style={style} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Table List */}
      <div className="w-72 bg-white border-l border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Table Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">{sections.join(' · ')}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {tables.map((table) => {
            const style = STATUS_STYLES[table.status];
            const order = orders.find((o) => o.id === table.activeOrderId);
            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={clsx(
                  'w-full text-left p-3 rounded-xl border transition-all hover:shadow-sm',
                  selectedTableId === table.id
                    ? clsx(style.bg, style.border, 'shadow-sm')
                    : 'border-gray-100 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold', style.bg, style.text)}>
                      {table.shape === 'round' ? <Circle size={12} /> : <Square size={12} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{table.name}</p>
                      <p className="text-[10px] text-gray-400">{table.section} · {table.capacity} seats</p>
                    </div>
                  </div>
                  <span className={clsx('text-[10px] px-1.5 py-0.5 rounded-full font-medium', style.bg, style.text)}>
                    {style.label}
                  </span>
                </div>
                {table.status === 'occupied' && order && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-0.5">
                      <Users size={10} /> {table.guestCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} />
                      {table.occupiedSince ? differenceInMinutes(new Date(), table.occupiedSince) : 0}m
                    </span>
                    <span className="font-semibold text-gray-700">${order.total.toFixed(0)}</span>
                  </div>
                )}
                {table.status === 'reserved' && (
                  <p className="mt-1 text-[10px] text-amber-600">
                    {table.reservedFor}{table.reservedAt ? ` @ ${format(table.reservedAt, 'HH:mm')}` : ''}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(Object.entries(counts) as [TableStatus, number][]).map(([st, c]) => (
              <div key={st} className={clsx('rounded-lg p-2 text-center', STATUS_STYLES[st].bg)}>
                <p className={clsx('font-bold text-base', STATUS_STYLES[st].text)}>{c}</p>
                <p className={clsx('capitalize', STATUS_STYLES[st].text)}>{STATUS_STYLES[st].label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              tables.filter((t) => t.status === 'cleaning').forEach((t) => {
                updateTableStatus(t.id, 'available');
              });
              addToast('All clean tables marked available', 'success');
            }}
            className="w-full btn-secondary text-xs flex items-center justify-center gap-1"
          >
            <RefreshCw size={12} /> Clear All Cleaning
          </button>
        </div>
      </div>

      {/* Table detail modal */}
      {selectedTable && (
        <TableDetail
          table={selectedTable}
          onClose={() => setSelectedTableId(null)}
          onOpenOrder={() => handleOpenOrder(selectedTable)}
          onMarkClean={() => handleMarkClean(selectedTable.id)}
          onMarkAvailable={() => handleMarkAvailable(selectedTable.id)}
        />
      )}

      {/* Guest count modal */}
      {guestTable && (
        <GuestModal
          table={guestTable}
          onClose={() => setGuestModalTableId(null)}
          onConfirm={handleGuestConfirm}
        />
      )}
    </div>
  );
}
