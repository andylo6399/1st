import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Send,
  CreditCard,
  MessageSquare,
  Tag,
  Flame,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MenuItem, MenuCategory, Modifier, ModifierGroup, OrderItem } from '../types';
import PaymentModal from '../components/payment/PaymentModal';
import clsx from 'clsx';

const CATEGORIES: MenuCategory[] = ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Specials', 'Sides'];

const SPICE_ICONS = ['', '🌶', '🌶🌶', '🌶🌶🌶'];

// --- Modifier Modal ---
type ModifierModalProps = {
  item: MenuItem;
  onAdd: (selectedModifiers: Modifier[], notes: string) => void;
  onClose: () => void;
};

function ModifierModal({ item, onAdd, onClose }: ModifierModalProps) {
  const [selections, setSelections] = useState<Record<string, Modifier[]>>({});
  const [notes, setNotes] = useState('');

  function toggleModifier(group: ModifierGroup, modifier: Modifier) {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.multiSelect) {
        const exists = current.find((m) => m.id === modifier.id);
        if (exists) {
          return { ...prev, [group.id]: current.filter((m) => m.id !== modifier.id) };
        }
        const max = group.maxSelections ?? Infinity;
        if (current.length >= max) return prev;
        return { ...prev, [group.id]: [...current, modifier] };
      } else {
        const exists = current.find((m) => m.id === modifier.id);
        return { ...prev, [group.id]: exists ? [] : [modifier] };
      }
    });
  }

  function isSelected(groupId: string, modifierId: string) {
    return (selections[groupId] ?? []).some((m) => m.id === modifierId);
  }

  function canSubmit() {
    if (!item.modifierGroups) return true;
    return item.modifierGroups
      .filter((g) => g.required)
      .every((g) => (selections[g.id] ?? []).length > 0);
  }

  function handleAdd() {
    const allSelected = Object.values(selections).flat();
    onAdd(allSelected, notes);
  }

  const totalExtra = Object.values(selections).flat().reduce((s, m) => s + m.price, 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-start gap-4">
          <span className="text-4xl">{item.emoji}</span>
          <div className="flex-1">
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p className="text-sm text-gray-500">{item.description}</p>
            {item.allergens.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle size={11} className="text-amber-500" />
                <span className="text-xs text-amber-600">{item.allergens.join(', ')}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {item.modifierGroups?.map((group) => {
            return (
              <div key={group.id}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-gray-800">{group.name}</h3>
                  <div className="flex gap-1">
                    {group.required && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Required</span>
                    )}
                    {group.multiSelect && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                        Max {group.maxSelections ?? '∞'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {group.options.map((opt) => {
                    const sel = isSelected(group.id, opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleModifier(group, opt)}
                        className={clsx(
                          'w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-sm',
                          sel
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={clsx(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                            sel ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                          )}>
                            {sel && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        {opt.price > 0 && (
                          <span className={clsx('font-medium', sel ? 'text-brand-600' : 'text-gray-500')}>
                            +${opt.price.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Notes */}
          <div>
            <h3 className="font-semibold text-sm text-gray-800 mb-2">Special Requests</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. no onions, extra spicy, allergies..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-brand-400"
              rows={2}
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleAdd}
            disabled={!canSubmit()}
            className={clsx(
              'w-full py-3 rounded-xl font-semibold text-base transition-all',
              canSubmit()
                ? 'bg-brand-600 hover:bg-brand-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            Add to Order
            {totalExtra > 0 && <span className="ml-1 font-normal text-sm">(+${totalExtra.toFixed(2)})</span>}
          </button>
          {!canSubmit() && (
            <p className="text-xs text-red-500 text-center mt-1">Please select all required options</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Order Taking Page ---
export default function OrderTaking() {
  useParams<{ tableId?: string }>();
  const navigate = useNavigate();
  const {
    orders, menuItems, settings,
    activeOrderId, setActiveOrder,
    addItemToOrder, removeItemFromOrder,
    updateItemQuantity, updateOrderStatus, addNoteToOrder,
    applyDiscount, addToast,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modifierItem, setModifierItem] = useState<MenuItem | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const sym = settings.currencySymbol;

  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  const activeTablesOrders = useMemo(() => {
    return orders.filter((o) => !['paid', 'cancelled'].includes(o.status));
  }, [orders]);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  function handleSelectMenuItem(item: MenuItem) {
    if (!item.available) {
      addToast(`${item.name} is currently unavailable`, 'warning');
      return;
    }
    if (!activeOrder) {
      addToast('Please select a table first', 'warning');
      return;
    }
    if (item.modifierGroups && item.modifierGroups.length > 0) {
      setModifierItem(item);
    } else {
      addToOrderDirect(item, [], '');
    }
  }

  function addToOrderDirect(item: MenuItem, modifiers: Modifier[], notes: string) {
    if (!activeOrder) return;
    const modifierTotal = modifiers.reduce((s, m) => s + m.price, 0);
    const unitPrice = item.price + modifierTotal;
    const newItem: OrderItem = {
      id: `oi_${Date.now()}`,
      menuItemId: item.id,
      menuItem: item,
      quantity: 1,
      selectedModifiers: modifiers,
      notes,
      status: 'pending',
      unitPrice,
      totalPrice: unitPrice,
    };
    addItemToOrder(activeOrder.id, newItem);
    addToast(`${item.name} added`, 'success');
  }

  function handleModifierConfirm(modifiers: Modifier[], notes: string) {
    if (!modifierItem) return;
    addToOrderDirect(modifierItem, modifiers, notes);
    setModifierItem(null);
  }

  function handleSendToKitchen() {
    if (!activeOrder) return;
    if (activeOrder.items.length === 0) {
      addToast('Order is empty', 'warning');
      return;
    }
    updateOrderStatus(activeOrder.id, 'preparing');
    addToast(`${activeOrder.orderNumber} sent to kitchen!`, 'success');
    navigate('/kitchen');
  }

  function handleApplyDiscount() {
    if (!activeOrder) return;
    const val = parseFloat(discountValue);
    if (isNaN(val) || val < 0 || val > 100) {
      addToast('Enter a valid discount (0-100%)', 'error');
      return;
    }
    applyDiscount(activeOrder.id, val);
    setShowDiscountInput(false);
    setDiscountValue('');
    addToast(`${val}% discount applied`, 'success');
  }

  function handleSaveNote() {
    if (!activeOrder) return;
    addNoteToOrder(activeOrder.id, noteText);
    setShowNoteInput(false);
    addToast('Note saved', 'info');
  }

  function toggleItemExpand(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectOrderFromTable(orderId: string) {
    setActiveOrder(orderId);
  }

  const itemCountInCategory: Record<string, number> = {};
  CATEGORIES.forEach((cat) => {
    itemCountInCategory[cat] = menuItems.filter((i) => i.category === cat && i.available).length;
  });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Table Selector + Menu */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Table selector bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap mr-1">Active:</span>
          {activeTablesOrders.map((o) => (
            <button
              key={o.id}
              onClick={() => handleSelectOrderFromTable(o.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all',
                activeOrder?.id === o.id
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              )}
            >
              <span>T{o.tableNumber ?? '?'}</span>
              <span className={clsx(activeOrder?.id === o.id ? 'text-brand-200' : 'text-gray-400')}>{o.orderNumber}</span>
            </button>
          ))}
          <button
            onClick={() => navigate('/tables')}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 whitespace-nowrap"
          >
            <Plus size={12} /> New Table
          </button>
        </div>

        {/* Category tabs + search */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-40 focus:outline-none focus:border-brand-400"
            />
          </div>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              selectedCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
              <span className={clsx('ml-1', selectedCategory === cat ? 'text-brand-200' : 'text-gray-400')}>
                ({itemCountInCategory[cat] ?? 0})
              </span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Search size={28} className="mb-2" />
              <p>No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectMenuItem(item)}
                  className={clsx(
                    'relative text-left p-3 rounded-xl border-2 transition-all hover:shadow-md active:scale-95',
                    item.available
                      ? 'bg-white border-gray-200 hover:border-brand-400 cursor-pointer'
                      : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                  )}
                >
                  {item.popular && (
                    <div className="absolute top-2 right-2">
                      <Flame size={12} className="text-orange-400" />
                    </div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 rounded-xl bg-gray-50/70 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded-full border">
                        Unavailable
                      </span>
                    </div>
                  )}
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">{item.name}</p>
                  {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                    <p className="text-xs mb-1">{SPICE_ICONS[item.spiceLevel]}</p>
                  )}
                  <div className="flex items-end justify-between mt-auto">
                    <p className="text-base font-bold text-brand-600">
                      {sym}{item.price.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-gray-400">{item.prepTime}m</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart/Order Panel */}
      <div className="w-80 xl:w-96 bg-white border-l border-gray-100 flex flex-col overflow-hidden shadow-xl">
        {/* Order Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          {activeOrder ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">
                  {activeOrder.orderNumber}
                  {activeOrder.tableNumber && (
                    <span className="ml-2 text-sm font-normal text-gray-500">Table {activeOrder.tableNumber}</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  {activeOrder.guestCount} guest{activeOrder.guestCount !== 1 ? 's' : ''} · {activeOrder.waiterName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{activeOrder.items.length} items</p>
                <p className="text-sm font-bold text-brand-600">{sym}{activeOrder.total.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">No active order</p>
              <button
                onClick={() => navigate('/tables')}
                className="mt-1 text-xs text-brand-600 hover:underline"
              >
                Select a table →
              </button>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto">
          {!activeOrder || activeOrder.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
              <div className="text-5xl">🍽️</div>
              <p className="text-sm">Add items from the menu</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {activeOrder.items.map((item) => {
                const expanded = expandedItems.has(item.id);
                return (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{item.menuItem.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.menuItem.name}</p>
                        {item.selectedModifiers.length > 0 && (
                          <p className="text-xs text-gray-400 truncate">
                            {item.selectedModifiers.map((m) => m.name).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-amber-600 truncate">📝 {item.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleItemExpand(item.id)}
                        className="text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateItemQuantity(activeOrder.id, item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(activeOrder.id, item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {sym}{item.totalPrice.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItemFromOrder(activeOrder.id, item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Note */}
        {activeOrder && (
          <div className="px-3">
            {showNoteInput ? (
              <div className="border border-gray-200 rounded-xl p-2 mb-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Order note..."
                  className="w-full text-xs resize-none focus:outline-none"
                  rows={2}
                />
                <div className="flex gap-1 mt-1">
                  <button onClick={handleSaveNote} className="text-xs bg-brand-600 text-white px-2 py-1 rounded-lg">Save</button>
                  <button onClick={() => setShowNoteInput(false)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              activeOrder.notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 mb-2">
                  <p className="text-xs text-amber-700">📝 {activeOrder.notes}</p>
                </div>
              )
            )}
          </div>
        )}

        {/* Order Summary */}
        {activeOrder && activeOrder.items.length > 0 && (
          <div className="border-t border-gray-100 px-4 pt-3 pb-2 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{sym}{activeOrder.subtotal.toFixed(2)}</span>
            </div>
            {activeOrder.discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({activeOrder.discountPercent}%)</span>
                <span>−{sym}{activeOrder.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>GST ({activeOrder.taxRate}%)</span>
              <span>{sym}{activeOrder.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5 text-base">
              <span>Total</span>
              <span className="text-brand-600">{sym}{activeOrder.total.toFixed(2)}</span>
            </div>

            {/* Discount input */}
            {showDiscountInput && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0"
                  min="0" max="100"
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-brand-400"
                />
                <span className="text-gray-500 text-sm">%</span>
                <button onClick={handleApplyDiscount} className="text-xs bg-brand-600 text-white px-2 py-1.5 rounded-lg">Apply</button>
                <button onClick={() => setShowDiscountInput(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {activeOrder && (
          <div className="p-3 space-y-2 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => { setShowNoteInput(!showNoteInput); setNoteText(activeOrder.notes); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
              >
                <MessageSquare size={14} /> Note
              </button>
              <button
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
              >
                <Tag size={14} /> Discount
              </button>
            </div>
            <button
              onClick={handleSendToKitchen}
              disabled={activeOrder.items.length === 0}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all',
                activeOrder.items.length > 0
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <Send size={16} /> Send to Kitchen
            </button>
            <button
              onClick={() => setShowPayment(true)}
              disabled={activeOrder.items.length === 0}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all',
                activeOrder.items.length > 0
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <CreditCard size={16} /> Charge {sym}{activeOrder.total.toFixed(2)}
            </button>
          </div>
        )}
      </div>

      {/* Modifier Modal */}
      {modifierItem && (
        <ModifierModal
          item={modifierItem}
          onAdd={handleModifierConfirm}
          onClose={() => setModifierItem(null)}
        />
      )}

      {/* Payment Modal */}
      {showPayment && activeOrder && (
        <PaymentModal
          order={activeOrder}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            navigate('/tables');
          }}
        />
      )}
    </div>
  );
}
