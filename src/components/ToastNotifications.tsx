import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

const mockToasts: Toast[] = [
  {
    id: 1,
    type: 'success',
    title: 'Task Created',
    message: 'TASK-012 has been successfully created'
  },
  {
    id: 2,
    type: 'info',
    title: 'New Comment',
    message: 'Sarah Chen commented on TASK-001'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Deadline Approaching',
    message: 'TASK-005 is due in 2 hours'
  },
  {
    id: 4,
    type: 'error',
    title: 'Update Failed',
    message: 'Could not update task status. Please try again.'
  }
];

export function ToastNotifications() {
  const getToastStyles = (type: Toast['type']) => {
    const styles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Info,
        iconColor: 'text-blue-600'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600'
      }
    };
    return styles[type];
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-96">
      {mockToasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        const Icon = styles.icon;

        return (
          <div
            key={toast.id}
            className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 animate-in slide-in-from-right`}
          >
            <div className="flex gap-3">
              <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-900 mb-1">{toast.title}</h4>
                <p className="text-gray-600">{toast.message}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
