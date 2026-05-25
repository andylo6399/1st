export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type TableShape = 'square' | 'round' | 'rectangle';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type ItemStatus = 'pending' | 'preparing' | 'ready' | 'served';
export type PaymentMethod = 'cash' | 'card' | 'e-wallet' | 'split';
export type StaffRole = 'admin' | 'manager' | 'waiter' | 'cashier' | 'kitchen';
export type MenuCategory = 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages' | 'Specials' | 'Sides';

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  maxSelections?: number;
  options: Modifier[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  emoji: string;
  available: boolean;
  modifierGroups?: ModifierGroup[];
  prepTime: number;
  allergens: string[];
  calories: number;
  popular: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: Modifier[];
  notes: string;
  status: ItemStatus;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableNumber?: number;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  waiterId?: string;
  waiterName?: string;
  notes: string;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
  guestCount: number;
}

export interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: TableStatus;
  shape: TableShape;
  section: string;
  x: number;
  y: number;
  width: number;
  height: number;
  activeOrderId?: string;
  reservedFor?: string;
  reservedAt?: Date;
  occupiedSince?: Date;
  guestCount?: number;
}

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  pin: string;
  active: boolean;
  avatar: string;
}

export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  taxRate: number;
  currency: string;
  currencySymbol: string;
  receiptFooter: string;
  openTime: string;
  closeTime: string;
  tableCount: number;
}

export interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
  covers: number;
  avgOrderValue: number;
}
