import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface TrackShipmentTimelineProps {
  order: Order;
  onViewInvoice?: (order: Order) => void;
  onReorder?: (order: Order) => void;
  isModal?: boolean;
}

export interface StepperMilestone {
  id: string;
  key: OrderStatus | 'Placed' | 'QC_Packed' | 'Dispatched' | 'In_Transit' | 'Out_For_Delivery' | 'Delivered';
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: string;
  timestamp: string;
  location: string;
  details: string;
  badgeText: string;
  courierNote?: string;
}

export function TrackShipmentTimeline({
  order,
  onViewInvoice,
  onReorder,
  isModal = false,
}: TrackShipmentTimelineProps) {
  // Determine initial step index based on order status
  const getInitialStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Processing':
        return 1; // QC & Packed
      case 'Dispatched':
        return 2; // Dispatched
      case 'In Transit':
        return 3; // In Transit
      case 'Out for Delivery':
        return 4; // Out for Delivery
      case 'Delivered':
        return 5; // Delivered
      case 'Cancelled':
        return 0;
      default:
        return 2;
    }
  };

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() =>
    getInitialStepIndex(order.status)
  );
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(() =>
    getInitialStepIndex(order.status)
  );
  const [isCopiedAwb, setIsCopiedAwb] = useState<boolean>(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(false);
  const [lastSyncSecondsAgo, setLastSyncSecondsAgo] = useState<number>(12);

  // Sync state if order changes
  useEffect(() => {
    const idx = getInitialStepIndex(order.status);
    setCurrentStepIndex(idx);
    setSelectedStepIndex(idx);
  }, [order.status, order.id]);

  // Live timer simulation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncSecondsAgo((prev) => (prev >= 60 ? 3 : prev + 3));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Milestones definition from Order Placed to Delivered
  const milestones: StepperMilestone[] = [
    {
      id: 'step-placed',
      key: 'Placed',
      stepNumber: 1,
      label: 'Order Placed',
      shortLabel: 'Placed',
      icon: 'receipt_long',
      timestamp: `${order.date}, 09:30 AM`,
      location: 'Nexora B2B Digital Exchange (Mumbai HQ)',
      details: `Wholesale batch order received and logged with distributor ${order.distributorName}. GSTIN ITC entitlement verified.`,
      badgeText: 'Invoice Generated',
      courierNote: `System Reference ID: ${order.invoiceNumber}`,
    },
    {
      id: 'step-packed',
      key: 'QC_Packed',
      stepNumber: 2,
      label: 'QC & Packed',
      shortLabel: 'Packed',
      icon: 'inventory_2',
      timestamp: `${order.date}, 02:15 PM`,
      location: `${order.distributorName} Fulfillment Warehouse, Bhiwandi`,
      details: 'Products verified for holographic authentication seal, batch manufacturing date, and intact salon tamper-proof barrier.',
      badgeText: 'Seal #NX-78491-QC',
      courierNote: 'Quality Inspector: Rajesh M. (QC Grade A+ Passed)',
    },
    {
      id: 'step-dispatched',
      key: 'Dispatched',
      stepNumber: 3,
      label: 'Dispatched',
      shortLabel: 'Dispatched',
      icon: 'departure_board',
      timestamp: `${order.date}, 06:45 PM`,
      location: 'Central Surface Logistics Hub, Navi Mumbai',
      details: `Consignment handed over to carrier ${order.courierPartner || 'Blue Dart Express Surface'}. Manifest barcode scanned.`,
      badgeText: 'Manifest Manifested',
      courierNote: `AWB ${order.trackingNumber || 'BD-8829104'} assigned to Bay #14`,
    },
    {
      id: 'step-transit',
      key: 'In_Transit',
      stepNumber: 4,
      label: 'In Transit',
      shortLabel: 'In Transit',
      icon: 'local_shipping',
      timestamp: '13 Aug 2026, 08:30 AM',
      location: 'Western Corridor Regional Transit Facility, Mumbai',
      details: 'Line-haul container in active transit towards local distribution depot. Real-time GPS beacon sync verified.',
      badgeText: 'Live GPS Active',
      courierNote: 'Vehicle #MH-04-AZ-8921 (Speed: 48 km/h)',
    },
    {
      id: 'step-out',
      key: 'Out_For_Delivery',
      stepNumber: 5,
      label: 'Out for Delivery',
      shortLabel: 'Out for Del.',
      icon: 'delivery_dining',
      timestamp: '13 Aug 2026, 11:45 AM',
      location: `${order.shippingAddress?.city || 'Mumbai'} Local Sorting Hub`,
      details: `Consignment loaded onto delivery van with assigned field logistics specialist for delivery to ${order.shippingAddress?.branchName || 'Salon Branch'}.`,
      badgeText: 'Delivery PIN Required',
      courierNote: 'Delivery Executive: Suresh K. (+91 98201 54321)',
    },
    {
      id: 'step-delivered',
      key: 'Delivered',
      stepNumber: 6,
      label: 'Delivered',
      shortLabel: 'Delivered',
      icon: 'verified',
      timestamp: order.status === 'Delivered' ? (order.estimatedDelivery || '30 Jul 2026, 01:45 PM') : 'Est. Delivery by 2:00 PM',
      location: `${order.shippingAddress?.branchName || 'Aura Luxe Flagship'}, ${order.shippingAddress?.city || 'Mumbai'}`,
      details: order.shippingAddress
        ? `Consignment safely handed over to ${order.shippingAddress.recipientName} (${order.shippingAddress.phone}) at ${order.shippingAddress.addressLine1}.`
        : 'Package delivered at registered salon reception with digital recipient signature.',
      badgeText: 'Proof of Delivery Filed',
      courierNote: 'Delivered & Accepted with tamper seals intact.',
    },
  ];

  const totalSteps = milestones.length;
  // Progress percentage calculation for the connecting stepping line
  const progressPercentage = (currentStepIndex / (totalSteps - 1)) * 100;

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard?.writeText(awb);
    setIsCopiedAwb(true);
    setTimeout(() => setIsCopiedAwb(false), 2200);
  };

  // Step advancement simulator for interactive salon experience
  const handleAdvanceStep = () => {
    setIsLiveSimulating(true);
    setCurrentStepIndex((prev) => {
      const next = prev < totalSteps - 1 ? prev + 1 : 0;
      setSelectedStepIndex(next);
      return next;
    });
    setTimeout(() => setIsLiveSimulating(false), 600);
  };

  const handleStepClick = (index: number) => {
    setSelectedStepIndex(index);
  };

  const activeMilestone = milestones[selectedStepIndex] || milestones[currentStepIndex];
  const isCurrentLiveStep = selectedStepIndex === currentStepIndex;

  return (
    <div
      id={`track-shipment-${order.id}`}
      className={`bg-white rounded-2xl border border-[#8e004b]/25 shadow-xs overflow-hidden transition-all animate-fade-in ${
        isModal ? 'p-5 md:p-7' : 'p-4 md:p-6 mt-3'
      }`}
    >
      {/* Top Header Strip: Carrier, AWB, ETA, and Live GPS badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E8]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-xl">local_shipping</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm md:text-base text-[#1c1b1b]">
                {order.courierPartner || 'Blue Dart Express Surface'}
              </h3>
              <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-600" />
                </span>
                <span>Live GPS Synced ({lastSyncSecondsAgo}s ago)</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#594047]">
              <span>Consignment AWB:</span>
              <strong className="font-mono text-[#0150d6] font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                {order.trackingNumber || `AWB-NX${order.id.replace('NEX-', '')}`}
              </strong>
              <button
                onClick={() => handleCopyAwb(order.trackingNumber || `AWB-NX${order.id.replace('NEX-', '')}`)}
                className="text-[11px] text-[#8e004b] hover:underline font-semibold flex items-center gap-0.5 ml-0.5"
                title="Copy Consignment AWB to clipboard"
              >
                <span className="material-symbols-outlined text-xs">
                  {isCopiedAwb ? 'check' : 'content_copy'}
                </span>
                <span>{isCopiedAwb ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ETA & Real-Time Simulator Action */}
        <div className="flex items-center gap-2.5 justify-between md:justify-end">
          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-bold text-[#594047] block">
              Estimated Delivery
            </span>
            <span className="text-xs md:text-sm font-bold text-[#8e004b]">
              {order.estimatedDelivery || (order.status === 'Delivered' ? 'Delivered' : 'Tomorrow by 2:00 PM')}
            </span>
          </div>

          <button
            onClick={handleAdvanceStep}
            disabled={isLiveSimulating}
            className="bg-[#FAF8F8] hover:bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/30 text-xs font-semibold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            title="Simulate shipment progression through stages"
          >
            <span className={`material-symbols-outlined text-sm ${isLiveSimulating ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span className="hidden sm:inline">Simulate Stage</span>
            <span className="sm:hidden">Simulate</span>
          </button>
        </div>
      </div>

      {/* Interactive Stepping Progress Bar */}
      <div className="py-6 px-1 md:px-4">
        {/* Stepper Progress Bar Header with Percentage */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#594047]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#1c1b1b]">Shipment Roadmap:</span>
            <span className="text-[11px] text-[#594047] hidden sm:inline">
              (Click any milestone to inspect stage details)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#594047]">Completion:</span>
            <span className="font-mono font-bold text-[#8e004b] bg-[#FDE7F3] px-2 py-0.5 rounded-md text-xs">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Stepper Visual Component */}
        <div className="relative">
          {/* Background Track Line */}
          <div className="absolute top-5 left-4 right-4 h-1.5 bg-[#E8E8E8] rounded-full -translate-y-1/2 z-0 hidden sm:block" />

          {/* Active Filled Gradient Progress Line */}
          <div
            className="absolute top-5 left-4 h-1.5 bg-gradient-to-r from-[#8e004b] via-[#b90064] to-emerald-500 rounded-full -translate-y-1/2 z-0 transition-all duration-700 ease-out hidden sm:block shadow-xs"
            style={{
              width: `calc(${progressPercentage}% - (100% - ${progressPercentage}%) * 0.05)`,
              maxWidth: 'calc(100% - 2rem)',
            }}
          />

          {/* Stepping Nodes Container */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative z-10">
            {milestones.map((m, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isSelected = idx === selectedStepIndex;
              const isPending = idx > currentStepIndex;

              return (
                <button
                  key={m.id}
                  onClick={() => handleStepClick(idx)}
                  className={`flex flex-col items-center text-center group cursor-pointer transition-all p-2 rounded-xl border sm:border-0 ${
                    isSelected
                      ? 'bg-[#FDE7F3]/60 border-[#8e004b] sm:bg-transparent'
                      : 'bg-white border-[#E8E8E8] hover:bg-[#FAF8F8] sm:bg-transparent'
                  }`}
                >
                  {/* Step Node Circle Indicator */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 relative shadow-2xs ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                        : isCurrent
                        ? 'bg-[#8e004b] text-white ring-4 ring-[#FDE7F3] shadow-md scale-110'
                        : 'bg-[#F0EDEC] text-[#7A7A7A] border-2 border-[#D1D1D1] group-hover:border-[#8e004b]/50'
                    } ${isSelected && !isCurrent ? 'ring-2 ring-[#8e004b]' : ''}`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : isCurrent ? (
                      <span className="material-symbols-outlined text-base animate-pulse">
                        {m.icon}
                      </span>
                    ) : (
                      <span>{m.stepNumber}</span>
                    )}

                    {/* Glowing Live Radar Dot on Current Node */}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff85ad] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8e004b] border-2 border-white" />
                      </span>
                    )}
                  </div>

                  {/* Step Labels */}
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-bold transition-colors leading-tight ${
                        isCurrent
                          ? 'text-[#8e004b]'
                          : isCompleted
                          ? 'text-[#1c1b1b]'
                          : 'text-[#7A7A7A]'
                      }`}
                    >
                      {m.label}
                    </p>
                    <span
                      className={`text-[10px] font-mono block mt-0.5 ${
                        isCurrent
                          ? 'text-[#8e004b] font-semibold'
                          : isCompleted
                          ? 'text-[#594047]'
                          : 'text-[#7A7A7A]'
                      }`}
                    >
                      {isCompleted || isCurrent ? m.timestamp.split(',')[1] || m.timestamp : 'Pending'}
                    </span>
                  </div>

                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8e004b] hidden sm:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Step Deep Dive Card */}
      <div className="bg-[#FAF8F8] rounded-xl border border-[#E8E8E8] p-4 md:p-5 mt-2 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E8E8E8]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#8e004b] text-white flex items-center justify-center text-xs font-bold">
              {activeMilestone.stepNumber}
            </span>
            <h4 className="font-bold text-sm text-[#1c1b1b]">
              Stage: {activeMilestone.label}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/20">
              {activeMilestone.badgeText}
            </span>
            {isCurrentLiveStep && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 animate-pulse">
                Active Live Stage
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#594047]">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>{activeMilestone.timestamp}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#594047] block">
              Checkpoint Location & Facility:
            </span>
            <p className="font-semibold text-[#1c1b1b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#8e004b]">
                location_on
              </span>
              <span>{activeMilestone.location}</span>
            </p>
            <p className="text-[#594047] text-[11px] mt-1 leading-relaxed">
              {activeMilestone.details}
            </p>
          </div>

          <div className="space-y-1 bg-white p-3 rounded-lg border border-[#E8E8E8]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#594047] block">
              Logistics & Courier Metadata:
            </span>
            <p className="font-mono text-[11px] text-[#1c1b1b] font-medium">
              {activeMilestone.courierNote || 'Automated barcode scan verified with hub server.'}
            </p>
            {activeMilestone.key === 'Out_For_Delivery' && (
              <div className="mt-2 pt-2 border-t border-[#E8E8E8] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1c1b1b]">
                  Delivery PIN for Receiver:
                </span>
                <span className="font-mono font-bold text-sm bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 tracking-wider">
                  OTP: 7492
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Destination Salon Branch Details & Consignment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
        {/* Salon Branch Recipient Card */}
        <div className="bg-[#FAF8F8] p-3.5 rounded-xl border border-[#E8E8E8] space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#1c1b1b]">
              <span className="material-symbols-outlined text-sm text-[#8e004b]">
                storefront
              </span>
              <span>Destination Salon Branch:</span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.2 rounded border border-emerald-200">
              Verified Delivery Branch
            </span>
          </div>

          <p className="font-semibold text-xs text-[#1c1b1b]">
            {order.shippingAddress?.branchName || 'Aura Luxe Salon Flagship'}
          </p>
          <p className="text-[11px] text-[#594047]">
            Attn: <strong className="text-[#1c1b1b]">{order.shippingAddress?.recipientName || 'Salon Manager'}</strong> (
            {order.shippingAddress?.phone || '+91 98200 12345'})
          </p>
          <p className="text-[11px] text-[#594047]">
            {order.shippingAddress?.addressLine1 || 'Plot 42, Linking Road, Bandra West'},{' '}
            {order.shippingAddress?.city || 'Mumbai'}, {order.shippingAddress?.state || 'Maharashtra'} -{' '}
            {order.shippingAddress?.pincode || '400050'}
          </p>
        </div>

        {/* Consignment Enclosure Card */}
        <div className="bg-[#FAF8F8] p-3.5 rounded-xl border border-[#E8E8E8] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#1c1b1b]">
              <span className="material-symbols-outlined text-sm text-[#8e004b]">
                inventory
              </span>
              <span>Consignment Manifest & Items:</span>
            </div>
            <span className="text-[10px] font-mono text-[#594047] bg-[#F0EDEC] px-2 py-0.2 rounded">
              {order.items.length} Product SKU{order.items.length > 1 ? 's' : ''} Enclosed
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-[#E8E8E8] flex-shrink-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-7 h-7 rounded object-cover border border-[#E8E8E8]"
                />
                <div className="text-[10px] leading-tight">
                  <p className="font-semibold text-[#1c1b1b] truncate max-w-[110px]">
                    {item.product.name}
                  </p>
                  <span className="text-[#8e004b] font-bold">Qty: {item.quantity} units</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#594047] pt-1 border-t border-[#E8E8E8]">
            <span>Total Wholesale Value: <strong className="text-[#1c1b1b]">₹{order.total.toLocaleString('en-IN')}</strong></span>
            <span className="text-emerald-700 font-semibold">18% GST Invoiced</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-[#E8E8E8]">
        <div className="flex items-center gap-2">
          <a
            href={`tel:+9118002094400`}
            className="text-xs font-semibold text-[#594047] hover:text-[#8e004b] flex items-center gap-1 bg-[#FAF8F8] px-3 py-1.5 rounded-lg border border-[#E8E8E8] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">support_agent</span>
            <span>Carrier Helpline (1800-209-4400)</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {onViewInvoice && (
            <button
              onClick={() => onViewInvoice(order)}
              className="bg-white hover:bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/30 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">description</span>
              <span>Download GST Invoice</span>
            </button>
          )}

          {onReorder && (
            <button
              onClick={() => onReorder(order)}
              className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">replay</span>
              <span>Reorder Batch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
