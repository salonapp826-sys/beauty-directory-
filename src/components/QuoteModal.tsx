import { useState, FormEvent } from 'react';
import { Distributor } from '../types';

interface QuoteModalProps {
  distributor: Distributor | null;
  onClose: () => void;
}

export function QuoteModal({ distributor, onClose }: QuoteModalProps) {
  if (!distributor) return null;

  const [productDetails, setProductDetails] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('20-50 units');
  const [deliveryPincode, setDeliveryPincode] = useState('400050');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#E8E8E8] relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#594047] hover:text-[#1c1b1b] p-1.5 rounded-full hover:bg-[#F0EDEC]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={distributor.logo}
            alt={distributor.name}
            className="w-12 h-12 rounded-xl object-cover border border-[#E8E8E8]"
          />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8e004b] tracking-wider">
              Request B2B Wholesale Quote
            </span>
            <h2 className="text-lg font-bold text-[#1c1b1b]">{distributor.name}</h2>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-lg font-bold text-[#1c1b1b]">Quote Request Sent!</h3>
            <p className="text-xs text-[#594047] mt-1 max-w-xs mx-auto">
              The distributor's sales desk will contact you via WhatsApp and Email with customized wholesale tier rates within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#594047] block mb-1">
                Products / Brands Needed
              </label>
              <textarea
                rows={3}
                required
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                placeholder="e.g. Aura Serum 30 units, Pro Styler 5 units, Keratin Treatment kits..."
                className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl p-3 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#594047] block mb-1">
                  Estimated Order Volume
                </label>
                <select
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl p-2.5 text-xs text-[#1c1b1b]"
                >
                  <option value="10-20 units">10 - 20 Units</option>
                  <option value="20-50 units">20 - 50 Units (Case Pack)</option>
                  <option value="50-100 units">50 - 100 Units (Salon Chain)</option>
                  <option value="100+ units">100+ Units (Master Batch)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#594047] block mb-1">
                  Delivery Pincode
                </label>
                <input
                  required
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl p-2.5 text-xs text-[#1c1b1b]"
                  placeholder="e.g. 400050"
                />
              </div>
            </div>

            <div className="bg-[#FDE7F3]/60 p-3 rounded-xl border border-[#ffd9e2] text-[11px] text-[#594047]">
              ✓ Verified salon members receive <strong>30-day B2B credit eligibility</strong> and automated <strong>18% GST tax invoices</strong>.
            </div>

            <button
              type="submit"
              className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Send Wholesale Quote Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
