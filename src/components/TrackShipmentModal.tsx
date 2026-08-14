import { Order, User } from '../types';
import { TrackShipmentTimeline } from './TrackShipmentTimeline';
import { OrderStatusBadge } from './OrderStatusBadge';

interface TrackShipmentModalProps {
  order: Order | null;
  user: User | null;
  onClose: () => void;
  onViewInvoice?: (order: Order) => void;
  onReorder?: (order: Order) => void;
}

export function TrackShipmentModal({
  order,
  user,
  onClose,
  onViewInvoice,
  onReorder,
}: TrackShipmentModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8E8E8] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#1c1b1b] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8e004b] text-white flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Track Consignment • {order.id}
                </h2>
                <OrderStatusBadge status={order.status} size="sm" showPulse={true} />
              </div>
              <p className="text-xs text-[#ffccd9]/80 mt-0.5">
                Wholesale consignment for <strong className="text-white">{user?.salonName || 'Aura Luxe Salon'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close Tracking"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Tracking Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <TrackShipmentTimeline
            order={order}
            onViewInvoice={onViewInvoice}
            onReorder={onReorder}
            isModal={true}
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F8] px-5 py-3.5 border-t border-[#E8E8E8] flex items-center justify-between">
          <span className="text-xs text-[#594047]">
            Invoice: <strong className="font-mono text-[#1c1b1b]">{order.invoiceNumber}</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-[#1c1b1b] hover:bg-[#333] text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
