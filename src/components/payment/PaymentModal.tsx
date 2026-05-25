import { useState } from 'react';
import { X, CreditCard, Banknote, Wallet, SplitSquareHorizontal, CheckCircle, Printer, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Order, PaymentMethod } from '../../types';
import clsx from 'clsx';

type PaymentModalProps = {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
};

type Step = 'method' | 'cash' | 'split' | 'complete';

const METHOD_CONFIG: { method: PaymentMethod; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { method: 'card', label: 'Card', icon: CreditCard, desc: 'Debit / Credit / Tap', color: 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' },
  { method: 'cash', label: 'Cash', icon: Banknote, desc: 'Count & give change', color: 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' },
  { method: 'e-wallet', label: 'E-Wallet', icon: Wallet, desc: 'PayNow / GrabPay / PayLah!', color: 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100' },
  { method: 'split', label: 'Split Bill', icon: SplitSquareHorizontal, desc: 'Multiple payment methods', color: 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100' },
];

const QUICK_CASH = [50, 100, 150, 200];

function CashStep({
  order,
  sym,
  onPay,
  onBack,
}: {
  order: Order;
  sym: string;
  onPay: (method: PaymentMethod) => void;
  onBack: () => void;
}) {
  const [tendered, setTendered] = useState('');
  const total = order.total;
  const tenderedNum = parseFloat(tendered) || 0;
  const change = Math.max(0, tenderedNum - total);
  const sufficient = tenderedNum >= total;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={18} />
        </button>
        <h3 className="font-bold text-gray-900">Cash Payment</h3>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">Amount Due</p>
        <p className="text-4xl font-bold text-gray-900 mt-1">{sym}{total.toFixed(2)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cash Tendered</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">{sym}</span>
          <input
            type="number"
            value={tendered}
            onChange={(e) => setTendered(e.target.value)}
            placeholder="0.00"
            className="w-full border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 text-xl font-bold focus:outline-none focus:border-brand-400"
            step="0.01"
            min={total}
          />
        </div>
        <div className="flex gap-2 mt-2">
          {QUICK_CASH.filter((v) => v >= total).map((v) => (
            <button
              key={v}
              onClick={() => setTendered(v.toString())}
              className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
            >
              {sym}{v}
            </button>
          ))}
          <button
            onClick={() => setTendered(Math.ceil(total).toString())}
            className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
          >
            Exact
          </button>
        </div>
      </div>

      {sufficient && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-sm text-emerald-600">Change Due</p>
          <p className="text-3xl font-bold text-emerald-700">{sym}{change.toFixed(2)}</p>
        </div>
      )}

      <button
        onClick={() => onPay('cash')}
        disabled={!sufficient}
        className={clsx(
          'w-full py-4 rounded-xl font-bold text-lg transition-all',
          sufficient
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        )}
      >
        {sufficient ? `Confirm Payment · Change ${sym}${change.toFixed(2)}` : `Need ${sym}${(total - tenderedNum).toFixed(2)} more`}
      </button>
    </div>
  );
}

function SplitStep({
  order,
  sym,
  onPay,
  onBack,
}: {
  order: Order;
  sym: string;
  onPay: (method: PaymentMethod) => void;
  onBack: () => void;
}) {
  const [splits, setSplits] = useState(2);
  const perPerson = order.total / splits;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={18} />
        </button>
        <h3 className="font-bold text-gray-900">Split Bill</h3>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">Total to Split</p>
        <p className="text-3xl font-bold text-gray-900">{sym}{order.total.toFixed(2)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Split Between</label>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setSplits(Math.max(2, splits - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
          >−</button>
          <span className="text-4xl font-bold text-brand-600 w-12 text-center">{splits}</span>
          <button
            onClick={() => setSplits(Math.min(order.guestCount, splits + 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
          >+</button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-1">up to {order.guestCount} guests</p>
      </div>

      <div className="bg-brand-50 rounded-xl p-4 text-center">
        <p className="text-sm text-brand-600">Each Person Pays</p>
        <p className="text-3xl font-bold text-brand-700">{sym}{perPerson.toFixed(2)}</p>
        <p className="text-xs text-brand-400 mt-1">{splits} × {sym}{perPerson.toFixed(2)}</p>
      </div>

      <button
        onClick={() => onPay('split')}
        className="w-full py-4 rounded-xl font-bold text-lg bg-brand-600 hover:bg-brand-700 text-white transition-all"
      >
        Process Split Payment
      </button>
    </div>
  );
}

function CompleteStep({
  order,
  sym,
  method,
  onClose,
}: {
  order: Order;
  sym: string;
  method: PaymentMethod;
  onClose: () => void;
}) {
  const methodLabels: Record<PaymentMethod, string> = {
    card: 'Card Payment',
    cash: 'Cash Payment',
    'e-wallet': 'E-Wallet Payment',
    split: 'Split Payment',
  };

  return (
    <div className="text-center space-y-5">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle size={40} className="text-emerald-500" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">Payment Complete!</h3>
        <p className="text-gray-500 mt-1">{order.orderNumber} · Table {order.tableNumber}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>{sym}{order.subtotal.toFixed(2)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span>−{sym}{order.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">GST ({order.taxRate}%)</span>
          <span>{sym}{order.taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
          <span>Total Paid</span>
          <span className="text-emerald-600">{sym}{order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 border-t border-gray-100 pt-2">
          <span>Payment Method</span>
          <span>{methodLabels[method]}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          <Printer size={16} /> Print Receipt
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function PaymentModal({ order, onClose, onSuccess }: PaymentModalProps) {
  const { completePayment, addToast, settings } = useStore();
  const [step, setStep] = useState<Step>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const sym = settings.currencySymbol;

  function handleMethodSelect(method: PaymentMethod) {
    setSelectedMethod(method);
    if (method === 'cash') setStep('cash');
    else if (method === 'split') setStep('split');
    else handlePay(method);
  }

  function handlePay(method: PaymentMethod) {
    completePayment(order.id, method);
    setSelectedMethod(method);
    setStep('complete');
    addToast(`Payment of ${sym}${order.total.toFixed(2)} received`, 'success');
  }

  function handleComplete() {
    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        {step !== 'complete' && (
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Checkout</h2>
              <p className="text-sm text-gray-500">{order.orderNumber} · {order.items.length} items</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={22} />
            </button>
          </div>
        )}

        <div className="p-5">
          {/* Method selection */}
          {step === 'method' && (
            <div className="space-y-4">
              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-1.5 text-sm">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="truncate flex-1">{item.quantity}× {item.menuItem.name}</span>
                      <span className="ml-2">{sym}{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-gray-400 text-xs">+{order.items.length - 3} more items</p>
                  )}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm">
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({order.discountPercent}%)</span>
                      <span>−{sym}{order.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>GST</span>
                    <span>{sym}{order.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-1">
                    <span>Total</span>
                    <span className="text-brand-600">{sym}{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700">Select Payment Method</h3>

              <div className="grid grid-cols-2 gap-3">
                {METHOD_CONFIG.map(({ method, label, icon: Icon, desc, color }) => (
                  <button
                    key={method}
                    onClick={() => handleMethodSelect(method)}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md active:scale-95',
                      color
                    )}
                  >
                    <Icon size={28} />
                    <div className="text-center">
                      <p className="font-bold text-sm">{label}</p>
                      <p className="text-[10px] opacity-70 mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cash step */}
          {step === 'cash' && (
            <CashStep
              order={order}
              sym={sym}
              onPay={handlePay}
              onBack={() => setStep('method')}
            />
          )}

          {/* Split step */}
          {step === 'split' && (
            <SplitStep
              order={order}
              sym={sym}
              onPay={handlePay}
              onBack={() => setStep('method')}
            />
          )}

          {/* Complete step */}
          {step === 'complete' && selectedMethod && (
            <CompleteStep
              order={order}
              sym={sym}
              method={selectedMethod}
              onClose={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
