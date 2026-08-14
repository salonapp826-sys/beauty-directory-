import { useState } from 'react';
import { Order } from '../types';

interface OrderTrackingTimelineProps {
  order: Order;
}

export function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const [copiedAwb, setCopiedAwb] = useState(false);

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard?.writeText(awb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  // Generate fallback timeline if not present
  const timeline = order.statusTimeline || [
    {
      title: 'Order Confirmed & GST Logged',
      time: order.date + ', 10:00 AM',
      description: `Wholesale consignment registered under invoice ${order.invoiceNumber}.`,
      completed: true,
    },
    {
      title: 'Distributor QC & Sealed',
      time: order.date + ', 03:30 PM',
      description: `Dispatched from ${order.distributorName} warehouse with tamper-evident seal.`,
      completed: order.status !== 'Processing',
      current: order.status === 'Processing',
    },
    {
      title: 'In Transit with Logistics Partner',
      time: order.status === 'In Transit' || order.status === 'Delivered' ? 'In Transit' : 'Pending',
      description: `${order.courierPartner || 'Express Air Logistics'} consignment en route.`,
      completed: order.status === 'In Transit' || order.status === 'Out for Delivery' || order.status === 'Delivered',
      current: order.status === 'In Transit' || order.status === 'Dispatched',
    },
    {
      title: 'Delivered to Salon Branch',
      time: order.status === 'Delivered' ? order.estimatedDelivery || 'Completed' : (order.estimatedDelivery || 'Est. 2 Days'),
      description: order.shippingAddress
        ? `Delivered to ${order.shippingAddress.branchName} (Attn: ${order.shippingAddress.recipientName}).`
        : 'Direct doorstep delivery to registered salon premises.',
      completed: order.status === 'Delivered',
      current: order.status === 'Out for Delivery' || order.status === 'Delivered',
    },
  ];

  // Calculate percentage of progress
  const completedCount = timeline.filter((s) => s.completed).length;
  const progressPercent = order.status === 'Delivered' 
    ? 100 
    : order.status === 'In Transit' || order.status === 'Dispatched'
    ? 65
    : order.status === 'Out for Delivery'
    ? 85
    : 25;

  return (
    <div className="bg-white rounded-xl border border-[#8e004b]/20 p-4 md:p-5 mt-3 space-y-4 shadow-xs animate-fade-in">
      {/* Top Tracking Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">local_shipping</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1c1b1b]">
                {order.courierPartner || 'Nexora Express Surface Cargo'}
              </span>
              <span className="text-[10px] bg-sky-50 text-sky-800 font-semibold px-2 py-0.2 rounded border border-sky-200">
                Live GPS Sync
              </span>
            </div>
            <p className="text-[11px] text-[#594047]">
              Consignment AWB:{' '}
              <strong className="font-mono text-[#1c1b1b]">
                {order.trackingNumber || `AWB-NX${order.id.replace('NEX-', '')}`}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {order.trackingNumber && (
            <button
              onClick={() => handleCopyAwb(order.trackingNumber!)}
              className="text-[11px] font-semibold text-[#8e004b] hover:bg-[#FDE7F3] px-2.5 py-1 rounded-md border border-[#8e004b]/30 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">
                {copiedAwb ? 'check' : 'content_copy'}
              </span>
              <span>{copiedAwb ? 'Copied AWB!' : 'Copy AWB'}</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#594047] block">Estimated Arrival</span>
            <span className="text-xs font-bold text-[#8e004b]">
              {order.estimatedDelivery || (order.status === 'Delivered' ? 'Delivered' : 'Tomorrow by 2:00 PM')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Visualizer */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#594047]">
          <span>Consignment Progress</span>
          <span className="text-[#8e004b] font-bold">{progressPercent}% Completed</span>
        </div>
        <div className="h-2 w-full bg-[#F0EDEC] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#8e004b] via-[#b90064] to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step-by-Step Timeline Tree */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E8E8]">
        {timeline.map((step, idx) => {
          const isDone = step.completed;
          const isCurrent = step.current;

          return (
            <div key={idx} className="relative group">
              {/* Step Node Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#8e004b] border-[#ffccd9] text-white ring-4 ring-[#FDE7F3] animate-pulse'
                    : 'bg-white border-[#D1D1D1] text-[#7A7A7A]'
                }`}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-xs">check</span>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="bg-[#FAF8F8] p-2.5 rounded-lg border border-[#E8E8E8] group-hover:border-[#8e004b]/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <h5 className={`text-xs font-bold ${isDone ? 'text-[#1c1b1b]' : isCurrent ? 'text-[#8e004b]' : 'text-[#7A7A7A]'}`}>
                      {step.title}
                    </h5>
                    {isCurrent && (
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-300 animate-pulse">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-medium text-[#594047]">
                    {step.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#594047] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Destination Salon Branch info footer */}
      {order.shippingAddress && (
        <div className="bg-[#F0EDEC] p-3 rounded-lg border border-[#E8E8E8] flex items-center justify-between text-xs text-[#594047]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#8e004b]">
              storefront
            </span>
            <div>
              <p className="font-bold text-[#1c1b1b]">
                Delivering to: {order.shippingAddress.branchName}
              </p>
              <p className="text-[11px]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode} • Attn: {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
            Authorized Receiver
          </span>
        </div>
      )}
    </div>
  );
}
