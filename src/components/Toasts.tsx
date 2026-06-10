import { useToast } from '../hooks/useToast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-primary-600 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`${colorMap[toast.type]} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
