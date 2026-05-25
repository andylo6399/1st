import { create } from 'zustand';
import { Table, Order, MenuItem, Staff, OrderItem, RestaurantSettings, OrderStatus, TableStatus } from '../types';
import { TABLES, INITIAL_ORDERS, STAFF, MENU_ITEMS, RESTAURANT_SETTINGS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface POSStore {
  // Core data
  tables: Table[];
  orders: Order[];
  menuItems: MenuItem[];
  staff: Staff[];
  settings: RestaurantSettings;

  // UI state
  currentStaff: Staff | null;
  activeOrderId: string | null;
  selectedTableId: string | null;
  toasts: Toast[];

  // Actions
  setCurrentStaff: (staff: Staff | null) => void;
  setSelectedTable: (tableId: string | null) => void;
  setActiveOrder: (orderId: string | null) => void;

  // Table actions
  updateTableStatus: (tableId: string, status: TableStatus) => void;

  // Order actions
  createOrder: (tableId: string, tableNumber: number, type: Order['type'], guestCount: number) => Order;
  addItemToOrder: (orderId: string, item: OrderItem) => void;
  removeItemFromOrder: (orderId: string, itemId: string) => void;
  updateItemQuantity: (orderId: string, itemId: string, quantity: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  applyDiscount: (orderId: string, discountPercent: number) => void;
  addNoteToOrder: (orderId: string, note: string) => void;
  completePayment: (orderId: string, method: Order['paymentMethod']) => void;
  voidOrder: (orderId: string) => void;

  // Menu actions
  toggleItemAvailability: (itemId: string) => void;
  updateMenuItemPrice: (itemId: string, price: number) => void;

  // Settings actions
  updateSettings: (settings: Partial<RestaurantSettings>) => void;

  // Toast actions
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const calculateOrderTotals = (items: OrderItem[], taxRate: number, discountPercent: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;
  return { subtotal, discountAmount, taxAmount, total };
};

let orderCounter = 127;

export const useStore = create<POSStore>((set, get) => ({
  tables: TABLES,
  orders: INITIAL_ORDERS,
  menuItems: MENU_ITEMS,
  staff: STAFF,
  settings: RESTAURANT_SETTINGS,
  currentStaff: STAFF[0],
  activeOrderId: null,
  selectedTableId: null,
  toasts: [],

  setCurrentStaff: (staff) => set({ currentStaff: staff }),
  setSelectedTable: (tableId) => set({ selectedTableId: tableId }),
  setActiveOrder: (orderId) => set({ activeOrderId: orderId }),

  updateTableStatus: (tableId, status) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId ? { ...t, status } : t
      ),
    })),

  createOrder: (tableId, tableNumber, type, guestCount) => {
    const { settings } = get();
    const newOrder: Order = {
      id: `o${Date.now()}`,
      orderNumber: `#0${++orderCounter}`,
      tableId,
      tableNumber,
      type,
      status: 'pending',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      subtotal: 0,
      taxRate: settings.taxRate,
      taxAmount: 0,
      discountPercent: 0,
      discountAmount: 0,
      total: 0,
      waiterId: get().currentStaff?.id,
      waiterName: get().currentStaff?.name,
      notes: '',
      guestCount,
    };
    set((state) => ({
      orders: [...state.orders, newOrder],
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, status: 'occupied' as TableStatus, activeOrderId: newOrder.id, occupiedSince: new Date(), guestCount }
          : t
      ),
      activeOrderId: newOrder.id,
    }));
    return newOrder;
  },

  addItemToOrder: (orderId, item) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;
      const existingItem = order.items.find(
        (i) =>
          i.menuItemId === item.menuItemId &&
          JSON.stringify(i.selectedModifiers) === JSON.stringify(item.selectedModifiers) &&
          i.notes === item.notes
      );
      let updatedItems: OrderItem[];
      if (existingItem) {
        updatedItems = order.items.map((i) =>
          i.id === existingItem.id
            ? { ...i, quantity: i.quantity + item.quantity, totalPrice: (i.quantity + item.quantity) * i.unitPrice }
            : i
        );
      } else {
        updatedItems = [...order.items, item];
      }
      const totals = calculateOrderTotals(updatedItems, order.taxRate, order.discountPercent);
      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, items: updatedItems, ...totals, updatedAt: new Date() } : o
        ),
      };
    }),

  removeItemFromOrder: (orderId, itemId) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;
      const updatedItems = order.items.filter((i) => i.id !== itemId);
      const totals = calculateOrderTotals(updatedItems, order.taxRate, order.discountPercent);
      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, items: updatedItems, ...totals, updatedAt: new Date() } : o
        ),
      };
    }),

  updateItemQuantity: (orderId, itemId, quantity) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;
      const updatedItems =
        quantity <= 0
          ? order.items.filter((i) => i.id !== itemId)
          : order.items.map((i) =>
              i.id === itemId ? { ...i, quantity, totalPrice: quantity * i.unitPrice } : i
            );
      const totals = calculateOrderTotals(updatedItems, order.taxRate, order.discountPercent);
      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, items: updatedItems, ...totals, updatedAt: new Date() } : o
        ),
      };
    }),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
      ),
    })),

  updateOrderItemStatus: (orderId, itemId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((i) => (i.id === itemId ? { ...i, status } : i)),
              updatedAt: new Date(),
            }
          : o
      ),
    })),

  applyDiscount: (orderId, discountPercent) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;
      const totals = calculateOrderTotals(order.items, order.taxRate, discountPercent);
      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, discountPercent, ...totals, updatedAt: new Date() } : o
        ),
      };
    }),

  addNoteToOrder: (orderId, notes) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, notes, updatedAt: new Date() } : o
      ),
    })),

  completePayment: (orderId, method) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;
      return {
        orders: state.orders.map((o) =>
          o.id === orderId
            ? { ...o, status: 'paid' as OrderStatus, paymentMethod: method, paidAt: new Date(), updatedAt: new Date() }
            : o
        ),
        tables: state.tables.map((t) =>
          t.id === order.tableId
            ? {
                ...t,
                status: 'cleaning' as TableStatus,
                activeOrderId: undefined,
                occupiedSince: undefined,
                guestCount: undefined,
              }
            : t
        ),
      };
    }),

  voidOrder: (orderId) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date() } : o
        ),
        tables: state.tables.map((t) =>
          t.id === order?.tableId
            ? {
                ...t,
                status: 'available' as TableStatus,
                activeOrderId: undefined,
                occupiedSince: undefined,
                guestCount: undefined,
              }
            : t
        ),
      };
    }),

  toggleItemAvailability: (itemId) =>
    set((state) => ({
      menuItems: state.menuItems.map((i) =>
        i.id === itemId ? { ...i, available: !i.available } : i
      ),
    })),

  updateMenuItemPrice: (itemId, price) =>
    set((state) => ({
      menuItems: state.menuItems.map((i) =>
        i.id === itemId ? { ...i, price } : i
      ),
    })),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  addToast: (message, type) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
