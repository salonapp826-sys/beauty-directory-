import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export function OrderStatusBadge({ status, size = 'sm', showPulse = true }: OrderStatusBadgeProps) {
  const getStatusConfig = (s: OrderStatus) => {
    switch (s) {
      case 'Processing':
        return {
          label: 'Processing & Batch QC',
          bg: 'bg-amber-50',
          text: 'text-amber-900',
          border: 'border-amber-300',
          dotBg: 'bg-amber-500',
          icon: 'hourglass_top',
          isLive: true,
        };
      case 'In Transit':
        return {
          label: 'In Transit',
          bg: 'bg-sky-50',
          text: 'text-sky-900',
          border: 'border-sky-300',
          dotBg: 'bg-sky-500',
          icon: 'local_shipping',
          isLive: true,
        };
      case 'Dispatched':
        return {
          label: 'Dispatched',
          bg: 'bg-indigo-50',
          text: 'text-indigo-900',
          border: 'border-indigo-300',
          dotBg: 'bg-indigo-500',
          icon: 'departure_board',
          isLive: true,
        };
      case 'Out for Delivery':
        return {
          label: 'Out for Delivery',
          bg: 'bg-purple-50',
          text: 'text-purple-900',
          border: 'border-purple-300',
          dotBg: 'bg-purple-500',
          icon: 'delivery_dining',
          isLive: true,
        };
      case 'Delivered':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-50',
          text: 'text-emerald-900',
          border: 'border-emerald-300',
          dotBg: 'bg-emerald-600',
          icon: 'check_circle',
          isLive: false,
        };
      case 'Cancelled':
        return {
          label: 'Cancelled',
          bg: 'bg-red-50',
          text: 'text-red-900',
          border: 'border-red-300',
          dotBg: 'bg-red-500',
          icon: 'cancel',
          isLive: false,
        };
      default:
        return {
          label: s,
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          border: 'border-gray-300',
          dotBg: 'bg-gray-500',
          icon: 'info',
          isLive: false,
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5',
  }[size];

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {/* Real-time Pulsing Radar Dot */}
      {config.isLive && showPulse ? (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotBg}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotBg}`} />
        </span>
      ) : (
        <span className={`material-symbols-outlined ${iconSizes} font-bold`}>
          {config.icon}
        </span>
      )}

      <span>{config.label}</span>
    </span>
  );
}
