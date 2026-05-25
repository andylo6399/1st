import { MenuItem, Table, Order, Staff, DailyStat, RestaurantSettings } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Appetizers (6 items)
  {
    id: 'a1', name: 'Spring Rolls', category: 'Appetizers', price: 8.90,
    description: 'Crispy vegetable spring rolls with sweet chili dipping sauce',
    emoji: '🥢', available: true, prepTime: 8, allergens: ['gluten', 'soy'],
    calories: 220, popular: true, spiceLevel: 0,
    modifierGroups: [{
      id: 'mg1', name: 'Dipping Sauce', required: false, multiSelect: false,
      options: [
        { id: 'm1', name: 'Sweet Chili', price: 0 },
        { id: 'm2', name: 'Peanut Sauce', price: 0.50 },
        { id: 'm3', name: 'Soy Sauce', price: 0 },
      ]
    }]
  },
  {
    id: 'a2', name: 'Chicken Satay', category: 'Appetizers', price: 12.90,
    description: 'Grilled chicken skewers with peanut sauce and cucumber relish',
    emoji: '🍢', available: true, prepTime: 12, allergens: ['nuts', 'gluten'],
    calories: 320, popular: true, spiceLevel: 1,
  },
  {
    id: 'a3', name: 'Crispy Calamari', category: 'Appetizers', price: 14.90,
    description: 'Lightly battered squid rings with aioli and lemon',
    emoji: '🦑', available: true, prepTime: 10, allergens: ['gluten', 'seafood'],
    calories: 380, popular: false, spiceLevel: 0,
  },
  {
    id: 'a4', name: 'Tom Yum Soup', category: 'Appetizers', price: 10.90,
    description: 'Hot and sour soup with prawns, mushrooms and lemongrass',
    emoji: '🍲', available: true, prepTime: 8, allergens: ['seafood'],
    calories: 180, popular: true, spiceLevel: 2,
  },
  {
    id: 'a5', name: 'Nachos', category: 'Appetizers', price: 11.90,
    description: 'Tortilla chips with cheese, jalapeños, salsa and sour cream',
    emoji: '🧀', available: true, prepTime: 6, allergens: ['dairy', 'gluten'],
    calories: 520, popular: false, spiceLevel: 1,
  },
  {
    id: 'a6', name: 'Edamame', category: 'Appetizers', price: 6.90,
    description: 'Steamed salted edamame beans',
    emoji: '🫘', available: true, prepTime: 5, allergens: ['soy'],
    calories: 120, popular: false, spiceLevel: 0,
  },

  // Mains (8 items)
  {
    id: 'm1', name: 'Grilled Salmon', category: 'Mains', price: 28.90,
    description: 'Pan-seared Atlantic salmon with lemon butter, asparagus and new potatoes',
    emoji: '🐟', available: true, prepTime: 20, allergens: ['fish', 'dairy'],
    calories: 520, popular: true, spiceLevel: 0,
    modifierGroups: [{
      id: 'mg2', name: 'Cooking Preference', required: true, multiSelect: false,
      options: [
        { id: 'm10', name: 'Medium', price: 0 },
        { id: 'm11', name: 'Well Done', price: 0 },
      ]
    }, {
      id: 'mg3', name: 'Sides', required: false, multiSelect: true, maxSelections: 2,
      options: [
        { id: 'm12', name: 'Extra Asparagus', price: 2.50 },
        { id: 'm13', name: 'Mashed Potato', price: 2.00 },
        { id: 'm14', name: 'House Salad', price: 2.00 },
      ]
    }]
  },
  {
    id: 'm2', name: 'Wagyu Beef Burger', category: 'Mains', price: 24.90,
    description: 'Wagyu beef patty, aged cheddar, truffle mayo, caramelized onions, brioche bun',
    emoji: '🍔', available: true, prepTime: 18, allergens: ['gluten', 'dairy', 'eggs'],
    calories: 780, popular: true, spiceLevel: 0,
    modifierGroups: [{
      id: 'mg4', name: 'Doneness', required: true, multiSelect: false,
      options: [
        { id: 'm20', name: 'Medium Rare', price: 0 },
        { id: 'm21', name: 'Medium', price: 0 },
        { id: 'm22', name: 'Well Done', price: 0 },
      ]
    }]
  },
  {
    id: 'm3', name: 'Pad Thai', category: 'Mains', price: 16.90,
    description: 'Stir-fried rice noodles with eggs, bean sprouts, peanuts and lime',
    emoji: '🍜', available: true, prepTime: 15, allergens: ['nuts', 'eggs', 'soy'],
    calories: 620, popular: true, spiceLevel: 1,
    modifierGroups: [{
      id: 'mg5', name: 'Protein', required: true, multiSelect: false,
      options: [
        { id: 'm30', name: 'Tofu', price: 0 },
        { id: 'm31', name: 'Chicken', price: 2.00 },
        { id: 'm32', name: 'Prawns', price: 4.00 },
        { id: 'm33', name: 'Mixed Seafood', price: 5.00 },
      ]
    }]
  },
  {
    id: 'm4', name: 'Ribeye Steak 300g', category: 'Mains', price: 48.90,
    description: 'Prime Australian ribeye with chimichurri, roasted garlic and fries',
    emoji: '🥩', available: true, prepTime: 25, allergens: ['gluten'],
    calories: 820, popular: true, spiceLevel: 0,
    modifierGroups: [{
      id: 'mg6', name: 'Doneness', required: true, multiSelect: false,
      options: [
        { id: 'm40', name: 'Rare', price: 0 },
        { id: 'm41', name: 'Medium Rare', price: 0 },
        { id: 'm42', name: 'Medium', price: 0 },
        { id: 'm43', name: 'Well Done', price: 0 },
      ]
    }]
  },
  {
    id: 'm5', name: 'Margherita Pizza', category: 'Mains', price: 18.90,
    description: 'San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil',
    emoji: '🍕', available: true, prepTime: 20, allergens: ['gluten', 'dairy'],
    calories: 680, popular: false, spiceLevel: 0,
  },
  {
    id: 'm6', name: 'Green Curry', category: 'Mains', price: 19.90,
    description: 'Thai green curry with coconut milk, vegetables, jasmine rice',
    emoji: '🍛', available: true, prepTime: 15, allergens: ['nuts'],
    calories: 560, popular: true, spiceLevel: 3,
    modifierGroups: [{
      id: 'mg7', name: 'Protein', required: true, multiSelect: false,
      options: [
        { id: 'm50', name: 'Tofu', price: 0 },
        { id: 'm51', name: 'Chicken', price: 2.00 },
        { id: 'm52', name: 'Beef', price: 3.00 },
      ]
    }]
  },
  {
    id: 'm7', name: 'Caesar Salad', category: 'Mains', price: 15.90,
    description: 'Romaine, parmesan, house-made dressing, croutons, anchovies',
    emoji: '🥗', available: true, prepTime: 8, allergens: ['gluten', 'dairy', 'fish'],
    calories: 380, popular: false, spiceLevel: 0,
  },
  {
    id: 'm8', name: 'Fish & Chips', category: 'Mains', price: 22.90,
    description: 'Beer-battered barramundi with thick-cut chips, mushy peas and tartar sauce',
    emoji: '🐠', available: true, prepTime: 18, allergens: ['gluten', 'fish'],
    calories: 720, popular: false, spiceLevel: 0,
  },

  // Desserts (4 items)
  {
    id: 'd1', name: 'Chocolate Lava Cake', category: 'Desserts', price: 12.90,
    description: 'Warm chocolate cake with molten center, vanilla bean ice cream',
    emoji: '🍫', available: true, prepTime: 12, allergens: ['gluten', 'dairy', 'eggs'],
    calories: 560, popular: true, spiceLevel: 0,
  },
  {
    id: 'd2', name: 'Mango Sticky Rice', category: 'Desserts', price: 9.90,
    description: 'Sweet glutinous rice with fresh mango and coconut cream',
    emoji: '🥭', available: true, prepTime: 5, allergens: [],
    calories: 340, popular: true, spiceLevel: 0,
  },
  {
    id: 'd3', name: 'Tiramisu', category: 'Desserts', price: 11.90,
    description: 'Classic Italian tiramisu with espresso, mascarpone and cocoa',
    emoji: '☕', available: true, prepTime: 5, allergens: ['gluten', 'dairy', 'eggs'],
    calories: 420, popular: false, spiceLevel: 0,
  },
  {
    id: 'd4', name: 'Crème Brûlée', category: 'Desserts', price: 10.90,
    description: 'Vanilla custard with caramelized sugar crust',
    emoji: '🍮', available: true, prepTime: 5, allergens: ['dairy', 'eggs'],
    calories: 380, popular: false, spiceLevel: 0,
  },

  // Beverages (8 items)
  {
    id: 'b1', name: 'Fresh Coconut', category: 'Beverages', price: 6.90,
    description: 'Young green coconut served fresh',
    emoji: '🥥', available: true, prepTime: 2, allergens: [],
    calories: 80, popular: true, spiceLevel: 0,
  },
  {
    id: 'b2', name: 'Craft Lemonade', category: 'Beverages', price: 5.90,
    description: 'Freshly squeezed lemonade with mint and honey',
    emoji: '🍋', available: true, prepTime: 3, allergens: [],
    calories: 120, popular: true, spiceLevel: 0,
    modifierGroups: [{
      id: 'mg8', name: 'Sugar Level', required: false, multiSelect: false,
      options: [
        { id: 'm60', name: 'Less Sweet', price: 0 },
        { id: 'm61', name: 'Normal', price: 0 },
        { id: 'm62', name: 'Extra Sweet', price: 0 },
      ]
    }]
  },
  {
    id: 'b3', name: 'Thai Iced Tea', category: 'Beverages', price: 5.50,
    description: 'Creamy sweet Thai tea with evaporated milk',
    emoji: '🧋', available: true, prepTime: 3, allergens: ['dairy'],
    calories: 220, popular: true, spiceLevel: 0,
  },
  {
    id: 'b4', name: 'Cold Brew Coffee', category: 'Beverages', price: 7.90,
    description: 'Slow-steeped cold brew with oat milk',
    emoji: '☕', available: true, prepTime: 2, allergens: [],
    calories: 80, popular: true, spiceLevel: 0,
  },
  {
    id: 'b5', name: 'Sparkling Water', category: 'Beverages', price: 3.90,
    description: 'San Pellegrino sparkling mineral water 500ml',
    emoji: '💧', available: true, prepTime: 1, allergens: [],
    calories: 0, popular: false, spiceLevel: 0,
  },
  {
    id: 'b6', name: 'Craft Beer', category: 'Beverages', price: 9.90,
    description: 'Rotating selection of local craft beers on tap',
    emoji: '🍺', available: true, prepTime: 1, allergens: ['gluten'],
    calories: 180, popular: false, spiceLevel: 0,
  },
  {
    id: 'b7', name: 'House Red Wine', category: 'Beverages', price: 12.90,
    description: 'Glass of house Cabernet Sauvignon',
    emoji: '🍷', available: true, prepTime: 1, allergens: ['sulphites'],
    calories: 160, popular: false, spiceLevel: 0,
  },
  {
    id: 'b8', name: 'Mocktail of the Day', category: 'Beverages', price: 8.90,
    description: "Ask your server for today's special non-alcoholic creation",
    emoji: '🍹', available: true, prepTime: 4, allergens: [],
    calories: 140, popular: true, spiceLevel: 0,
  },

  // Specials (3 items)
  {
    id: 's1', name: "Chef's Tasting Menu", category: 'Specials', price: 68.00,
    description: "5-course chef's selection — changes daily. Ask your server.",
    emoji: '⭐', available: true, prepTime: 60, allergens: [],
    calories: 0, popular: true, spiceLevel: 0,
  },
  {
    id: 's2', name: 'Weekend Brunch Set', category: 'Specials', price: 32.00,
    description: 'Eggs any style + sides + unlimited coffee/tea (weekends only)',
    emoji: '🍳', available: false, prepTime: 15, allergens: ['gluten', 'dairy', 'eggs'],
    calories: 680, popular: false, spiceLevel: 0,
  },
  {
    id: 's3', name: 'Catch of the Day', category: 'Specials', price: 34.90,
    description: "Today's freshest fish, prepared as the chef recommends",
    emoji: '🎣', available: true, prepTime: 22, allergens: ['fish'],
    calories: 0, popular: true, spiceLevel: 0,
  },

  // Sides (3 items)
  {
    id: 'si1', name: 'Steamed Rice', category: 'Sides', price: 2.50,
    description: 'Fragrant jasmine rice',
    emoji: '🍚', available: true, prepTime: 5, allergens: [],
    calories: 200, popular: false, spiceLevel: 0,
  },
  {
    id: 'si2', name: 'Garlic Bread', category: 'Sides', price: 4.90,
    description: 'Toasted sourdough with herb butter',
    emoji: '🥖', available: true, prepTime: 5, allergens: ['gluten', 'dairy'],
    calories: 240, popular: false, spiceLevel: 0,
  },
  {
    id: 'si3', name: 'Side Salad', category: 'Sides', price: 5.90,
    description: 'Mixed greens with house vinaigrette',
    emoji: '🥬', available: true, prepTime: 3, allergens: [],
    calories: 80, popular: false, spiceLevel: 0,
  },
];

export const TABLES: Table[] = [
  // Main Dining Section
  { id: 't1', number: 1, name: 'Table 1', capacity: 2, status: 'occupied', shape: 'square', section: 'Main', x: 60, y: 80, width: 80, height: 80, activeOrderId: 'o1', occupiedSince: new Date(Date.now() - 45 * 60000), guestCount: 2 },
  { id: 't2', number: 2, name: 'Table 2', capacity: 2, status: 'available', shape: 'square', section: 'Main', x: 200, y: 80, width: 80, height: 80 },
  { id: 't3', number: 3, name: 'Table 3', capacity: 4, status: 'occupied', shape: 'rectangle', section: 'Main', x: 340, y: 80, width: 120, height: 80, activeOrderId: 'o2', occupiedSince: new Date(Date.now() - 20 * 60000), guestCount: 3 },
  { id: 't4', number: 4, name: 'Table 4', capacity: 4, status: 'reserved', shape: 'rectangle', section: 'Main', x: 530, y: 80, width: 120, height: 80, reservedFor: 'Johnson Party', reservedAt: new Date(Date.now() + 30 * 60000) },
  { id: 't5', number: 5, name: 'Table 5', capacity: 6, status: 'occupied', shape: 'rectangle', section: 'Main', x: 60, y: 240, width: 160, height: 80, activeOrderId: 'o3', occupiedSince: new Date(Date.now() - 62 * 60000), guestCount: 5 },
  { id: 't6', number: 6, name: 'Table 6', capacity: 4, status: 'available', shape: 'rectangle', section: 'Main', x: 290, y: 240, width: 120, height: 80 },
  { id: 't7', number: 7, name: 'Table 7', capacity: 4, status: 'cleaning', shape: 'rectangle', section: 'Main', x: 480, y: 240, width: 120, height: 80 },
  { id: 't8', number: 8, name: 'Table 8', capacity: 2, status: 'available', shape: 'round', section: 'Main', x: 680, y: 200, width: 80, height: 80 },

  // Terrace Section
  { id: 't9', number: 9, name: 'Table 9', capacity: 2, status: 'available', shape: 'round', section: 'Terrace', x: 60, y: 440, width: 80, height: 80 },
  { id: 't10', number: 10, name: 'Table 10', capacity: 2, status: 'occupied', shape: 'round', section: 'Terrace', x: 200, y: 440, width: 80, height: 80, activeOrderId: 'o4', occupiedSince: new Date(Date.now() - 15 * 60000), guestCount: 2 },
  { id: 't11', number: 11, name: 'Table 11', capacity: 4, status: 'available', shape: 'square', section: 'Terrace', x: 340, y: 420, width: 100, height: 100 },
  { id: 't12', number: 12, name: 'Table 12', capacity: 6, status: 'occupied', shape: 'rectangle', section: 'Terrace', x: 500, y: 430, width: 160, height: 80, activeOrderId: 'o5', occupiedSince: new Date(Date.now() - 35 * 60000), guestCount: 6 },

  // Private Dining
  { id: 't13', number: 13, name: 'Private 1', capacity: 8, status: 'available', shape: 'rectangle', section: 'Private', x: 60, y: 600, width: 200, height: 100 },
  { id: 't14', number: 14, name: 'Private 2', capacity: 12, status: 'reserved', shape: 'rectangle', section: 'Private', x: 330, y: 600, width: 240, height: 100, reservedFor: 'Corporate Dinner', reservedAt: new Date(Date.now() + 2 * 3600000) },
  { id: 't15', number: 15, name: 'Bar Seating', capacity: 8, status: 'occupied', shape: 'rectangle', section: 'Bar', x: 60, y: 760, width: 300, height: 60, activeOrderId: 'o6', occupiedSince: new Date(Date.now() - 80 * 60000), guestCount: 4 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1', orderNumber: '#0124', tableId: 't1', tableNumber: 1,
    type: 'dine-in', status: 'preparing',
    items: [
      { id: 'oi1', menuItemId: 'a1', menuItem: MENU_ITEMS[0], quantity: 2, selectedModifiers: [], notes: '', status: 'preparing', unitPrice: 8.90, totalPrice: 17.80 },
      { id: 'oi2', menuItemId: 'm2', menuItem: MENU_ITEMS[7], quantity: 1, selectedModifiers: [{ id: 'm21', name: 'Medium', price: 0 }], notes: 'No onions', status: 'preparing', unitPrice: 24.90, totalPrice: 24.90 },
      { id: 'oi3', menuItemId: 'b4', menuItem: MENU_ITEMS[20], quantity: 2, selectedModifiers: [], notes: '', status: 'served', unitPrice: 7.90, totalPrice: 15.80 },
    ],
    createdAt: new Date(Date.now() - 45 * 60000), updatedAt: new Date(Date.now() - 5 * 60000),
    subtotal: 58.50, taxRate: 0.08, taxAmount: 4.68, discountPercent: 0, discountAmount: 0, total: 63.18,
    waiterId: 's2', waiterName: 'Alice', notes: '', guestCount: 2,
  },
  {
    id: 'o2', orderNumber: '#0125', tableId: 't3', tableNumber: 3,
    type: 'dine-in', status: 'pending',
    items: [
      { id: 'oi4', menuItemId: 'm3', menuItem: MENU_ITEMS[9], quantity: 2, selectedModifiers: [{ id: 'm31', name: 'Chicken', price: 2.00 }], notes: 'Extra spicy', status: 'pending', unitPrice: 18.90, totalPrice: 37.80 },
      { id: 'oi5', menuItemId: 'a4', menuItem: MENU_ITEMS[3], quantity: 1, selectedModifiers: [], notes: '', status: 'pending', unitPrice: 10.90, totalPrice: 10.90 },
      { id: 'oi6', menuItemId: 'b1', menuItem: MENU_ITEMS[18], quantity: 3, selectedModifiers: [], notes: '', status: 'pending', unitPrice: 6.90, totalPrice: 20.70 },
    ],
    createdAt: new Date(Date.now() - 20 * 60000), updatedAt: new Date(Date.now() - 20 * 60000),
    subtotal: 69.40, taxRate: 0.08, taxAmount: 5.55, discountPercent: 0, discountAmount: 0, total: 74.95,
    waiterId: 's3', waiterName: 'Bob', notes: 'Nut allergy at table', guestCount: 3,
  },
  {
    id: 'o3', orderNumber: '#0123', tableId: 't5', tableNumber: 5,
    type: 'dine-in', status: 'served',
    items: [
      { id: 'oi7', menuItemId: 'm4', menuItem: MENU_ITEMS[10], quantity: 2, selectedModifiers: [{ id: 'm41', name: 'Medium Rare', price: 0 }], notes: '', status: 'served', unitPrice: 48.90, totalPrice: 97.80 },
      { id: 'oi8', menuItemId: 'd1', menuItem: MENU_ITEMS[14], quantity: 2, selectedModifiers: [], notes: '', status: 'served', unitPrice: 12.90, totalPrice: 25.80 },
      { id: 'oi9', menuItemId: 'b7', menuItem: MENU_ITEMS[25], quantity: 4, selectedModifiers: [], notes: '', status: 'served', unitPrice: 12.90, totalPrice: 51.60 },
    ],
    createdAt: new Date(Date.now() - 62 * 60000), updatedAt: new Date(Date.now() - 10 * 60000),
    subtotal: 175.20, taxRate: 0.08, taxAmount: 14.02, discountPercent: 10, discountAmount: 17.52, total: 171.70,
    waiterId: 's2', waiterName: 'Alice', notes: 'Anniversary dinner', guestCount: 5,
  },
  {
    id: 'o4', orderNumber: '#0126', tableId: 't10', tableNumber: 10,
    type: 'dine-in', status: 'preparing',
    items: [
      { id: 'oi10', menuItemId: 'a2', menuItem: MENU_ITEMS[1], quantity: 1, selectedModifiers: [], notes: '', status: 'preparing', unitPrice: 12.90, totalPrice: 12.90 },
      { id: 'oi11', menuItemId: 'b3', menuItem: MENU_ITEMS[19], quantity: 2, selectedModifiers: [], notes: '', status: 'served', unitPrice: 5.50, totalPrice: 11.00 },
    ],
    createdAt: new Date(Date.now() - 15 * 60000), updatedAt: new Date(Date.now() - 3 * 60000),
    subtotal: 23.90, taxRate: 0.08, taxAmount: 1.91, discountPercent: 0, discountAmount: 0, total: 25.81,
    waiterId: 's3', waiterName: 'Bob', notes: '', guestCount: 2,
  },
  {
    id: 'o5', orderNumber: '#0122', tableId: 't12', tableNumber: 12,
    type: 'dine-in', status: 'ready',
    items: [
      { id: 'oi12', menuItemId: 'm1', menuItem: MENU_ITEMS[6], quantity: 3, selectedModifiers: [{ id: 'm10', name: 'Medium', price: 0 }], notes: '', status: 'ready', unitPrice: 28.90, totalPrice: 86.70 },
      { id: 'oi13', menuItemId: 'm5', menuItem: MENU_ITEMS[11], quantity: 2, selectedModifiers: [], notes: 'One with extra cheese', status: 'ready', unitPrice: 18.90, totalPrice: 37.80 },
      { id: 'oi14', menuItemId: 'a3', menuItem: MENU_ITEMS[2], quantity: 1, selectedModifiers: [], notes: '', status: 'ready', unitPrice: 14.90, totalPrice: 14.90 },
      { id: 'oi15', menuItemId: 'b6', menuItem: MENU_ITEMS[23], quantity: 6, selectedModifiers: [], notes: '', status: 'ready', unitPrice: 9.90, totalPrice: 59.40 },
    ],
    createdAt: new Date(Date.now() - 35 * 60000), updatedAt: new Date(Date.now() - 2 * 60000),
    subtotal: 198.80, taxRate: 0.08, taxAmount: 15.90, discountPercent: 0, discountAmount: 0, total: 214.70,
    waiterId: 's2', waiterName: 'Alice', notes: '', guestCount: 6,
  },
  {
    id: 'o6', orderNumber: '#0121', tableId: 't15', tableNumber: 15,
    type: 'dine-in', status: 'preparing',
    items: [
      { id: 'oi16', menuItemId: 'b6', menuItem: MENU_ITEMS[23], quantity: 4, selectedModifiers: [], notes: '', status: 'served', unitPrice: 9.90, totalPrice: 39.60 },
      { id: 'oi17', menuItemId: 'a5', menuItem: MENU_ITEMS[4], quantity: 2, selectedModifiers: [], notes: '', status: 'preparing', unitPrice: 11.90, totalPrice: 23.80 },
    ],
    createdAt: new Date(Date.now() - 80 * 60000), updatedAt: new Date(Date.now() - 15 * 60000),
    subtotal: 63.40, taxRate: 0.08, taxAmount: 5.07, discountPercent: 0, discountAmount: 0, total: 68.47,
    waiterId: 's4', waiterName: 'Carol', notes: '', guestCount: 4,
  },
];

export const STAFF: Staff[] = [
  { id: 's1', name: 'Manager', role: 'manager', pin: '1234', active: true, avatar: '👨‍💼' },
  { id: 's2', name: 'Alice', role: 'waiter', pin: '1111', active: true, avatar: '👩‍🍳' },
  { id: 's3', name: 'Bob', role: 'waiter', pin: '2222', active: true, avatar: '👨‍🍳' },
  { id: 's4', name: 'Carol', role: 'cashier', pin: '3333', active: true, avatar: '👩‍💼' },
  { id: 's5', name: 'Dave', role: 'kitchen', pin: '4444', active: true, avatar: '👨‍🍽️' },
  { id: 's6', name: 'Eve', role: 'waiter', pin: '5555', active: false, avatar: '👩‍🍽️' },
];

export const RESTAURANT_SETTINGS: RestaurantSettings = {
  name: 'The Garden Bistro',
  address: '123 Orchard Road, Singapore 238858',
  phone: '+65 6123 4567',
  taxRate: 8,
  currency: 'SGD',
  currencySymbol: '$',
  receiptFooter: 'Thank you for dining with us! Please visit us again.',
  openTime: '11:00',
  closeTime: '22:30',
  tableCount: 15,
};

// Generate 30 days of daily stats
export const DAILY_STATS: DailyStat[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const base = isWeekend ? 3800 : 2200;
  const revenue = base + Math.random() * 1200 - 200;
  const orders = Math.floor(revenue / 45 + Math.random() * 10);
  const covers = Math.floor(orders * 2.3 + Math.random() * 20);
  return {
    date: date.toISOString().split('T')[0],
    revenue: Math.round(revenue),
    orders,
    covers,
    avgOrderValue: Math.round(revenue / orders),
  };
});
