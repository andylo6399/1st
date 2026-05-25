import { useState } from 'react';
import {
  Store,
  DollarSign,
  Clock,
  FileText,
  Users,
  Shield,
  Bell,
  Printer,
  Save,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Staff, StaffRole } from '../types';
import clsx from 'clsx';

type Section = 'restaurant' | 'taxes' | 'hours' | 'receipt' | 'staff' | 'notifications' | 'security' | 'printing';

const SECTIONS: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'restaurant', label: 'Restaurant Info', icon: Store, description: 'Name, address, contact' },
  { id: 'taxes', label: 'Tax & Pricing', icon: DollarSign, description: 'Tax rates, currency' },
  { id: 'hours', label: 'Opening Hours', icon: Clock, description: 'Service hours' },
  { id: 'receipt', label: 'Receipt Settings', icon: FileText, description: 'Receipt footer, format' },
  { id: 'staff', label: 'Staff Management', icon: Users, description: 'Manage staff & roles' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences' },
  { id: 'security', label: 'Security', icon: Shield, description: 'PIN, access control' },
  { id: 'printing', label: 'Printing', icon: Printer, description: 'Printer configuration' },
];

const ROLE_COLORS: Record<StaffRole, string> = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-brand-100 text-brand-700',
  waiter: 'bg-blue-100 text-blue-700',
  cashier: 'bg-emerald-100 text-emerald-700',
  kitchen: 'bg-orange-100 text-orange-700',
};

// --- Sub-sections ---

function RestaurantSection() {
  const { settings, updateSettings, addToast } = useStore();
  const [form, setForm] = useState({ ...settings });

  function save() {
    updateSettings(form);
    addToast('Restaurant settings saved', 'success');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Restaurant Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'name', label: 'Restaurant Name', type: 'text' },
          { key: 'phone', label: 'Phone Number', type: 'tel' },
          { key: 'address', label: 'Address', type: 'text' },
        ].map(({ key, label, type }) => (
          <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
        ))}
      </div>
      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Changes
      </button>
    </div>
  );
}

function TaxSection() {
  const { settings, updateSettings, addToast } = useStore();
  const [taxRate, setTaxRate] = useState(settings.taxRate.toString());
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);

  function save() {
    const rate = parseFloat(taxRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      addToast('Invalid tax rate', 'error');
      return;
    }
    updateSettings({ taxRate: rate, currency, currencySymbol });
    addToast('Tax settings saved', 'success');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Tax & Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            min="0" max="100" step="0.5"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
          <p className="text-xs text-gray-400 mt-1">Applied to all orders as GST/VAT</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          >
            {['SGD', 'USD', 'EUR', 'GBP', 'AUD', 'MYR', 'THB'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
          <input
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {/* Tax preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">Preview</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{currencySymbol}100.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">GST ({taxRate}%)</span>
            <span>{currencySymbol}{(parseFloat(taxRate) || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-200 pt-1">
            <span>Total</span>
            <span>{currencySymbol}{(100 + (parseFloat(taxRate) || 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Changes
      </button>
    </div>
  );
}

function HoursSection() {
  const { settings, updateSettings, addToast } = useStore();
  const [open, setOpen] = useState(settings.openTime);
  const [close, setClose] = useState(settings.closeTime);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [closedDays, setClosedDays] = useState<Set<string>>(new Set());

  function toggleClosed(day: string) {
    setClosedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function save() {
    updateSettings({ openTime: open, closeTime: close });
    addToast('Hours saved', 'success');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Opening Hours</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
          <input
            type="time"
            value={open}
            onChange={(e) => setOpen(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
          <input
            type="time"
            value={close}
            onChange={(e) => setClose(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Closed Days</p>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggleClosed(day)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                closedDays.has(day)
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              )}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
        {closedDays.size > 0 && (
          <p className="text-xs text-red-500 mt-1">Closed: {[...closedDays].join(', ')}</p>
        )}
      </div>
      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Hours
      </button>
    </div>
  );
}

function ReceiptSection() {
  const { settings, updateSettings, addToast } = useStore();
  const [footer, setFooter] = useState(settings.receiptFooter);
  const [showLogo, setShowLogo] = useState(true);
  const [showTax, setShowTax] = useState(true);
  const [showServer, setShowServer] = useState(true);

  function save() {
    updateSettings({ receiptFooter: footer });
    addToast('Receipt settings saved', 'success');
  }

  const toggleRow = (label: string, val: boolean, setter: (v: boolean) => void) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
      </div>
      <button onClick={() => setter(!val)} className={val ? 'text-emerald-500' : 'text-gray-300'}>
        {val ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Receipt Settings</h2>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Show on Receipt</h3>
        {toggleRow('Restaurant Logo', showLogo, setShowLogo)}
        {toggleRow('Tax Breakdown', showTax, setShowTax)}
        {toggleRow('Server Name', showServer, setShowServer)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Footer Message</label>
        <textarea
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 resize-none"
          placeholder="Thank you for dining with us..."
        />
      </div>

      {/* Receipt preview */}
      <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-white font-mono text-xs max-w-xs">
        <div className="text-center mb-2">
          <p className="font-bold text-sm">{settings.name}</p>
          <p className="text-gray-500">{settings.address}</p>
          <p className="text-gray-500">{settings.phone}</p>
        </div>
        <div className="border-t border-dashed border-gray-300 my-2" />
        <p>Table: 5 · Order: #0127</p>
        {showServer && <p>Server: Alice</p>}
        <div className="border-t border-dashed border-gray-300 my-2" />
        <p>2x Wagyu Burger    $49.80</p>
        <p>1x Tom Yum Soup    $10.90</p>
        <div className="border-t border-dashed border-gray-300 my-2" />
        <p>Subtotal:          $60.70</p>
        {showTax && <p>GST ({settings.taxRate}%):      ${(60.70 * settings.taxRate / 100).toFixed(2)}</p>}
        <p className="font-bold">Total:            ${(60.70 * (1 + settings.taxRate / 100)).toFixed(2)}</p>
        <div className="border-t border-dashed border-gray-300 my-2" />
        <p className="text-center text-gray-500">{footer}</p>
      </div>

      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Settings
      </button>
    </div>
  );
}

function StaffSection() {
  const { staff, addToast } = useStore();
  const [showPins, setShowPins] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localStaff, setLocalStaff] = useState<Staff[]>(staff);

  function togglePin(id: string) {
    setShowPins((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleActive(id: string) {
    setLocalStaff((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
    addToast('Staff status updated', 'info');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Staff Management</h2>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={14} /> Add Staff
        </button>
      </div>

      <div className="space-y-2">
        {localStaff.map((member) => (
          <div
            key={member.id}
            className={clsx(
              'card p-4 flex items-center gap-4 transition-opacity',
              !member.active && 'opacity-60'
            )}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900">{member.name}</p>
                <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium capitalize', ROLE_COLORS[member.role])}>
                  {member.role}
                </span>
                {!member.active && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">PIN:</span>
                <span className="text-xs font-mono font-medium text-gray-600">
                  {showPins.has(member.id) ? member.pin : '••••'}
                </span>
                <button
                  onClick={() => togglePin(member.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPins.has(member.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(member.id)}
                className={member.active ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 hover:text-gray-400'}
              >
                {member.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
              <button
                onClick={() => setEditingId(editingId === member.id ? null : member.id)}
                className="text-gray-400 hover:text-brand-600 transition-colors p-1"
              >
                <ChevronRight size={16} />
              </button>
              <button className="text-gray-300 hover:text-red-500 transition-colors p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSection() {
  const { addToast } = useStore();
  const [prefs, setPrefs] = useState({
    newOrder: true,
    orderReady: true,
    tableTurnover: false,
    lowStock: true,
    dailySummary: false,
    urgentOrders: true,
  });

  const labels: Record<keyof typeof prefs, { label: string; desc: string }> = {
    newOrder: { label: 'New Order', desc: 'Alert when a new order is placed' },
    orderReady: { label: 'Order Ready', desc: 'Alert when order is ready for service' },
    tableTurnover: { label: 'Table Turnover', desc: 'Alert when table is ready for new guests' },
    lowStock: { label: 'Low Stock', desc: 'Alert when menu items run low' },
    dailySummary: { label: 'Daily Summary', desc: 'End of day revenue report' },
    urgentOrders: { label: 'Urgent Orders', desc: 'Alert for orders over 20 minutes' },
  };

  function save() {
    addToast('Notification preferences saved', 'success');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Notification Settings</h2>
      <div className="card divide-y divide-gray-100">
        {(Object.entries(prefs) as [keyof typeof prefs, boolean][]).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-gray-800">{labels[key].label}</p>
              <p className="text-xs text-gray-400">{labels[key].desc}</p>
            </div>
            <button
              onClick={() => setPrefs((p) => ({ ...p, [key]: !val }))}
              className={val ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 hover:text-gray-400'}
            >
              {val ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
        ))}
      </div>
      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Preferences
      </button>
    </div>
  );
}

function SecuritySection() {
  const { addToast } = useStore();
  const [requirePin, setRequirePin] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [lockMins, setLockMins] = useState('5');

  function save() {
    addToast('Security settings saved', 'success');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>

      <div className="card divide-y divide-gray-100">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-800">Require PIN for all actions</p>
            <p className="text-xs text-gray-400">Staff must enter PIN before each transaction</p>
          </div>
          <button onClick={() => setRequirePin(!requirePin)} className={requirePin ? 'text-emerald-500' : 'text-gray-300'}>
            {requirePin ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-800">Auto-lock screen</p>
            <p className="text-xs text-gray-400">Lock after inactivity</p>
          </div>
          <button onClick={() => setAutoLock(!autoLock)} className={autoLock ? 'text-emerald-500' : 'text-gray-300'}>
            {autoLock ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
        {autoLock && (
          <div className="px-4 py-3.5">
            <label className="text-sm font-medium text-gray-700 block mb-1">Lock after (minutes)</label>
            <input
              type="number"
              value={lockMins}
              onChange={(e) => setLockMins(e.target.value)}
              min="1" max="60"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none focus:border-brand-400"
            />
          </div>
        )}
      </div>

      <div className="card p-4 border-l-4 border-l-amber-400 bg-amber-50">
        <p className="text-sm text-amber-800 font-medium">Manager Override</p>
        <p className="text-xs text-amber-700 mt-1">
          Managers can override any action using their PIN. Ensure manager PINs are secure.
        </p>
      </div>

      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Security Settings
      </button>
    </div>
  );
}

function PrintingSection() {
  const { addToast } = useStore();
  const [kitchenPrinter, setKitchenPrinter] = useState(true);
  const [receiptPrinter, setReceiptPrinter] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);

  function save() {
    addToast('Printer settings saved', 'success');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Printing Configuration</h2>

      <div className="card divide-y divide-gray-100">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-800">Kitchen Ticket Printer</p>
            <p className="text-xs text-gray-400">192.168.1.101 — Star TSP143III</p>
            <span className="text-xs text-emerald-600 font-medium">● Connected</span>
          </div>
          <button onClick={() => setKitchenPrinter(!kitchenPrinter)} className={kitchenPrinter ? 'text-emerald-500' : 'text-gray-300'}>
            {kitchenPrinter ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-800">Receipt Printer</p>
            <p className="text-xs text-gray-400">192.168.1.102 — Epson TM-T88VI</p>
            <span className="text-xs text-emerald-600 font-medium">● Connected</span>
          </div>
          <button onClick={() => setReceiptPrinter(!receiptPrinter)} className={receiptPrinter ? 'text-emerald-500' : 'text-gray-300'}>
            {receiptPrinter ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-800">Auto-print receipt on payment</p>
            <p className="text-xs text-gray-400">Automatically prints receipt when order is paid</p>
          </div>
          <button onClick={() => setAutoPrint(!autoPrint)} className={autoPrint ? 'text-emerald-500' : 'text-gray-300'}>
            {autoPrint ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => addToast('Test ticket sent to kitchen printer', 'info')}
          className="btn-secondary text-sm flex items-center gap-2">
          <Printer size={14} /> Test Kitchen Printer
        </button>
        <button onClick={() => addToast('Test receipt printed', 'info')}
          className="btn-secondary text-sm flex items-center gap-2">
          <Printer size={14} /> Test Receipt Printer
        </button>
      </div>

      <button onClick={save} className="btn-primary flex items-center gap-2">
        <Save size={14} /> Save Printer Settings
      </button>
    </div>
  );
}

const SECTION_COMPONENTS: Record<Section, React.ComponentType> = {
  restaurant: RestaurantSection,
  taxes: TaxSection,
  hours: HoursSection,
  receipt: ReceiptSection,
  staff: StaffSection,
  notifications: NotificationsSection,
  security: SecuritySection,
  printing: PrintingSection,
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState<Section>('restaurant');
  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar nav */}
      <aside className="w-64 bg-white border-r border-gray-100 overflow-y-auto shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="font-bold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-400">Configure your POS system</p>
        </div>
        <nav className="p-2">
          {SECTIONS.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={clsx(
                'w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl transition-all mb-0.5',
                activeSection === id
                  ? 'bg-brand-50 border border-brand-200'
                  : 'hover:bg-gray-50 border border-transparent'
              )}
            >
              <Icon size={18} className={activeSection === id ? 'text-brand-600 mt-0.5' : 'text-gray-400 mt-0.5'} />
              <div>
                <p className={clsx('text-sm font-medium', activeSection === id ? 'text-brand-700' : 'text-gray-700')}>
                  {label}
                </p>
                <p className="text-[11px] text-gray-400">{description}</p>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
