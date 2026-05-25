import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Filter,
  Flame,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Star,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { MenuItem, MenuCategory } from '../types';
import clsx from 'clsx';

const CATEGORIES: (MenuCategory | 'All')[] = ['All', 'Appetizers', 'Mains', 'Desserts', 'Beverages', 'Specials', 'Sides'];

const SPICE_LABELS = ['None', 'Mild', 'Medium', 'Hot'];
const SPICE_COLORS = ['text-gray-400', 'text-yellow-500', 'text-orange-500', 'text-red-500'];

type EditPriceProps = {
  item: MenuItem;
  onSave: (price: number) => void;
  onCancel: () => void;
};

function EditPriceInline({ item, onSave, onCancel }: EditPriceProps) {
  const [val, setVal] = useState(item.price.toFixed(2));

  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500">$</span>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-20 border border-brand-400 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-brand-400"
        step="0.10"
        min="0"
        autoFocus
      />
      <button
        onClick={() => {
          const p = parseFloat(val);
          if (!isNaN(p) && p >= 0) onSave(p);
        }}
        className="text-emerald-600 hover:text-emerald-700"
      >
        <Check size={16} />
      </button>
      <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </div>
  );
}

type MenuItemRowProps = {
  item: MenuItem;
  onToggle: () => void;
  onPriceEdit: () => void;
  onPriceSave: (price: number) => void;
  onPriceCancel: () => void;
  editingPrice: boolean;
  sym: string;
};

function MenuItemRow({ item, onToggle, onPriceEdit, onPriceSave, onPriceCancel, editingPrice, sym }: MenuItemRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={clsx(
      'border rounded-xl overflow-hidden transition-all',
      item.available ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-75'
    )}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Emoji + name */}
        <span className="text-2xl">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={clsx('font-semibold text-sm', item.available ? 'text-gray-900' : 'text-gray-400')}>
              {item.name}
            </p>
            {item.popular && <Flame size={12} className="text-orange-400 shrink-0" />}
            {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
              <span className={clsx('text-xs', SPICE_COLORS[item.spiceLevel])}>
                {'🌶'.repeat(item.spiceLevel)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{item.description}</p>
        </div>

        {/* Allergens badge */}
        {item.allergens.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            <AlertTriangle size={11} className="text-amber-400 shrink-0" />
            <span className="text-[10px] text-amber-600 truncate max-w-[80px]">
              {item.allergens.slice(0, 2).join(', ')}{item.allergens.length > 2 ? '...' : ''}
            </span>
          </div>
        )}

        {/* Calories */}
        <div className="hidden lg:block text-xs text-gray-400 w-16 text-right">
          {item.calories > 0 ? `${item.calories} cal` : '—'}
        </div>

        {/* Prep time */}
        <div className="hidden lg:block text-xs text-gray-400 w-12 text-right">
          {item.prepTime}m
        </div>

        {/* Price */}
        <div className="w-28 text-right">
          {editingPrice ? (
            <EditPriceInline item={item} onSave={onPriceSave} onCancel={onPriceCancel} />
          ) : (
            <button
              onClick={onPriceEdit}
              className="group flex items-center gap-1 ml-auto hover:text-brand-600 transition-colors"
            >
              <span className="text-base font-bold text-gray-900 group-hover:text-brand-600">
                {sym}{item.price.toFixed(2)}
              </span>
              <Edit3 size={12} className="text-gray-300 group-hover:text-brand-400" />
            </button>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={clsx(
            'transition-colors',
            item.available ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 hover:text-gray-400'
          )}
          title={item.available ? 'Mark Unavailable' : 'Mark Available'}
        >
          {item.available
            ? <ToggleRight size={28} />
            : <ToggleLeft size={28} />
          }
        </button>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prep Time</span>
                <span className="font-medium">{item.prepTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Calories</span>
                <span className="font-medium">{item.calories > 0 ? `${item.calories} kcal` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Spice Level</span>
                <span className={clsx('font-medium', SPICE_COLORS[item.spiceLevel ?? 0])}>
                  {SPICE_LABELS[item.spiceLevel ?? 0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Popular</span>
                <span className="font-medium">{item.popular ? '⭐ Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div>
            {item.allergens.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Allergens</h4>
                <div className="flex flex-wrap gap-1">
                  {item.allergens.map((a) => (
                    <span key={a} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full capitalize">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.modifierGroups && item.modifierGroups.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Modifier Groups</h4>
                <div className="space-y-1">
                  {item.modifierGroups.map((g) => (
                    <div key={g.id} className="text-xs bg-gray-50 rounded-lg p-2">
                      <p className="font-medium text-gray-700">{g.name} {g.required && <span className="text-red-500">*</span>}</p>
                      <p className="text-gray-400">{g.options.map((o) => o.name).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Quick stats by category
function CategoryStats({ items }: { items: MenuItem[] }) {
  const cats = ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Specials', 'Sides'] as MenuCategory[];
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {cats.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        const available = catItems.filter((i) => i.available).length;
        return (
          <div key={cat} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{catItems.length}</p>
            <p className="text-[10px] font-semibold text-gray-600 truncate">{cat}</p>
            <p className="text-[10px] text-gray-400">{available} active</p>
          </div>
        );
      })}
    </div>
  );
}

export default function MenuManagement() {
  const { menuItems, toggleItemAvailability, updateMenuItemPrice, settings, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MenuCategory | 'All'>('All');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('category');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);

  const sym = settings.currencySymbol;

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    return menuItems
      .filter((i) => {
        const matchCat = category === 'All' || i.category === category;
        const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
        const matchAvail =
          filterAvailability === 'all' ||
          (filterAvailability === 'available' && i.available) ||
          (filterAvailability === 'unavailable' && !i.available);
        return matchCat && matchSearch && matchAvail;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortField === 'price') cmp = a.price - b.price;
        else cmp = a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [menuItems, category, search, filterAvailability, sortField, sortDir]);

  const availableCount = menuItems.filter((i) => i.available).length;
  const popularCount = menuItems.filter((i) => i.popular).length;
  const avgPrice = menuItems.reduce((s, i) => s + i.price, 0) / menuItems.length;

  function handleToggle(item: MenuItem) {
    toggleItemAvailability(item.id);
    addToast(
      `${item.name} marked ${item.available ? 'unavailable' : 'available'}`,
      item.available ? 'warning' : 'success'
    );
  }

  function handlePriceSave(item: MenuItem, price: number) {
    updateMenuItemPrice(item.id, price);
    setEditingPriceId(null);
    addToast(`${item.name} price updated to ${sym}${price.toFixed(2)}`, 'success');
  }

  function handleBulkToggle(makeAvailable: boolean) {
    filtered.forEach((item) => {
      if (item.available !== makeAvailable) toggleItemAvailability(item.id);
    });
    addToast(`${filtered.length} items marked ${makeAvailable ? 'available' : 'unavailable'}`, 'info');
  }

  return (
    <div className="p-6 space-y-5">
      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
          <p className="text-xs text-gray-500">Total Items</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{availableCount}</p>
          <p className="text-xs text-gray-500">Available</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
            <Flame size={18} /> {popularCount}
          </p>
          <p className="text-xs text-gray-500">Popular</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand-600">{sym}{avgPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Avg Price</p>
        </div>
      </div>

      {/* Category stats */}
      <CategoryStats items={menuItems} />

      {/* Filters & controls */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-44">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MenuCategory | 'All')}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Availability */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(['all', 'available', 'unavailable'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterAvailability(f)}
                className={clsx(
                  'px-3 py-2 text-xs font-medium capitalize transition-colors',
                  filterAvailability === f ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-gray-400" />
            {(['name', 'price', 'category'] as const).map((f) => (
              <button
                key={f}
                onClick={() => toggleSort(f)}
                className={clsx(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors flex items-center gap-0.5',
                  sortField === f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {f}
                {sortField === f && (sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
              </button>
            ))}
          </div>

          {/* Bulk actions */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleBulkToggle(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Check size={12} /> Enable All
            </button>
            <button
              onClick={() => handleBulkToggle(false)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <X size={12} /> Disable All
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors"
            >
              <Plus size={12} /> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} items</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Star size={11} className="text-amber-400" /> = Popular item
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <Search size={32} className="mx-auto mb-3" />
            <p>No items match your filters</p>
          </div>
        ) : (
          filtered.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              sym={sym}
              onToggle={() => handleToggle(item)}
              onPriceEdit={() => setEditingPriceId(item.id)}
              onPriceSave={(price) => handlePriceSave(item, price)}
              onPriceCancel={() => setEditingPriceId(null)}
              editingPrice={editingPriceId === item.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
