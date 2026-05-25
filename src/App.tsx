import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import TableManagement from './pages/TableManagement';
import OrderTaking from './pages/OrderTaking';
import KitchenDisplay from './pages/KitchenDisplay';
import MenuManagement from './pages/MenuManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useStore } from './store/useStore';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

function ToastContainer() {
  const { toasts, removeToast } = useStore();

  const iconMap = {
    success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
    error: <AlertCircle size={18} className="text-red-500 shrink-0" />,
    info: <Info size={18} className="text-blue-500 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
  };

  const borderMap = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
    warning: 'border-l-amber-500',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center gap-3 bg-white rounded-xl shadow-lg border border-gray-100 border-l-4 px-4 py-3 animate-slide-in',
            borderMap[toast.type]
          )}
        >
          {iconMap[toast.type]}
          <span className="text-sm text-gray-700 flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tables" element={<TableManagement />} />
              <Route path="/order/:tableId?" element={<OrderTaking />} />
              <Route path="/kitchen" element={<KitchenDisplay />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
