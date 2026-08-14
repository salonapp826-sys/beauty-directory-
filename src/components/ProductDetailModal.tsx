import { useState, MouseEvent } from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDistributor: (distributorId: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onViewDistributor,
  isWishlisted = false,
  onToggleWishlist,
}: ProductDetailModalProps) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        // ignore
      }
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Calculate tier price based on current quantity
  const matchedTier =
    [...product.bulkTiers]
      .reverse()
      .find((tier) => quantity >= tier.minQty) || product.bulkTiers[0];

  const currentUnitPrice = matchedTier.pricePerUnit;
  const totalPrice = currentUnitPrice * quantity;
  const estimatedSalonRevenue = Math.round(totalPrice * (1 + product.salonMarginPercent / 100));
  const estimatedProfit = estimatedSalonRevenue - totalPrice;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E8E8] relative flex flex-col md:flex-row overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Share Link Copied Toast Notification */}
        {copied && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#1c1b1b] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in border border-white/20">
            <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
            <span>Product link copied to clipboard!</span>
          </div>
        )}

        {/* Top Header Actions (Share & Close) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            id="share-product-modal-top-btn"
            type="button"
            onClick={handleShare}
            className={`p-2 rounded-full border shadow-sm transition-all active:scale-90 flex items-center justify-center ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white/90 hover:bg-white text-[#1c1b1b] border-[#E8E8E8]'
            }`}
            title="Share product link with colleagues or branch managers"
          >
            <span className="material-symbols-outlined text-lg">
              {copied ? 'check' : 'share'}
            </span>
          </button>

          <button
            id="close-product-modal-btn"
            type="button"
            onClick={onClose}
            className="bg-white/90 hover:bg-white text-[#1c1b1b] p-2 rounded-full border border-[#E8E8E8] shadow-sm transition-all active:scale-90 flex items-center justify-center"
            title="Close"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 bg-[#fdf8f8] relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E8E8E8]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-72 md:max-h-96 object-contain rounded-xl drop-shadow-md"
          />
          {product.discountBadge && (
            <span className="absolute top-4 left-4 bg-[#8e004b] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.discountBadge}
            </span>
          )}

          {/* Wishlist Floating Button on Image */}
          {onToggleWishlist && (
            <button
              id="product-modal-wishlist-btn"
              onClick={() => onToggleWishlist(product)}
              className={`absolute top-4 right-4 md:right-auto md:left-4 md:top-14 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm z-10 ${
                isWishlisted
                  ? 'bg-[#8e004b] text-white'
                  : 'bg-white/90 hover:bg-white text-[#594047] hover:text-[#8e004b]'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <span className="material-symbols-outlined text-lg block">
                {isWishlisted ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8e004b]">
                {product.category}
              </span>
              <span className="text-xs text-[#594047]">•</span>
              <span className="text-xs text-[#594047]">{product.brand}</span>
            </div>

            <h2 className="text-xl font-bold text-[#1c1b1b] leading-tight mb-2">
              {product.name}
            </h2>

            {/* Distributor line */}
            <div className="flex items-center gap-1.5 text-xs text-[#0150d6] font-medium mb-3">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Supplied by: <strong>{product.distributorName}</strong></span>
            </div>

            <p className="text-xs text-[#594047] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Bulk Pricing Tiers Table */}
            <div className="mb-4">
              <span className="text-xs font-bold text-[#1c1b1b] block mb-1.5">
                B2B Volume Wholesale Tiers:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {product.bulkTiers.map((tier) => {
                  const isActive = matchedTier.minQty === tier.minQty;
                  return (
                    <button
                      key={tier.minQty}
                      type="button"
                      onClick={() => setQuantity(tier.minQty)}
                      className={`p-2 rounded-xl border text-xs transition-all ${
                        isActive
                          ? 'bg-[#FDE7F3] border-[#8e004b] text-[#8e004b] font-bold shadow-xs'
                          : 'bg-[#F0EDEC] border-transparent text-[#594047] hover:bg-[#ece7e7]'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-semibold">
                        {tier.minQty}+ Units
                      </span>
                      <span className="font-bold text-xs">
                        ₹{tier.pricePerUnit.toLocaleString('en-IN')}
                      </span>
                      {tier.discountPercent > 0 && (
                        <span className="block text-[9px] text-green-700 font-bold">
                          {tier.discountPercent}% OFF
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Salon Margin ROI Card */}
            <div className="bg-[#F0EDEC] p-3 rounded-xl border border-[#E8E8E8] text-xs mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#594047]">Salon Profit Margin:</span>
                <span className="font-bold text-green-700">~{product.salonMarginPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#594047]">
                <span>Est. Salon Revenue:</span>
                <span className="font-semibold text-[#1c1b1b]">₹{estimatedSalonRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-green-800 font-medium">
                <span>Est. Net Profit:</span>
                <span>+₹{estimatedProfit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-1 text-[11px] text-[#594047] mb-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-[#E8E8E8] pb-1">
                  <span className="font-medium">{key}:</span>
                  <span className="text-[#1c1b1b] text-right font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-3 border-t border-[#E8E8E8]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold text-[#594047]">Order Quantity:</span>
              <div className="flex items-center border border-[#E8E8E8] rounded-xl overflow-hidden bg-[#F0EDEC]">
                <button
                  id="decrement-modal-qty"
                  onClick={() => setQuantity((q) => Math.max(product.minOrderQuantity || 1, q - 1))}
                  className="px-3 py-1.5 hover:bg-[#ece7e7] text-sm font-bold text-[#1c1b1b]"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#1c1b1b] min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  id="increment-modal-qty"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-[#ece7e7] text-sm font-bold text-[#1c1b1b]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#594047]">Subtotal:</span>
              <span className="text-lg font-bold text-[#8e004b]">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                id="share-product-modal-action-btn"
                type="button"
                onClick={handleShare}
                className={`p-3 rounded-xl border font-bold text-sm transition-all active:scale-95 flex items-center justify-center ${
                  copied
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                    : 'bg-[#F0EDEC] border-[#E8E8E8] hover:bg-[#ece7e7] text-[#594047]'
                }`}
                title="Copy shareable link"
              >
                <span className="material-symbols-outlined text-lg">
                  {copied ? 'check' : 'share'}
                </span>
              </button>

              {onToggleWishlist && (
                <button
                  id="modal-wishlist-action-btn"
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-xl border font-bold text-sm transition-all active:scale-95 flex items-center justify-center ${
                    isWishlisted
                      ? 'bg-[#FDE7F3] border-[#8e004b] text-[#8e004b]'
                      : 'bg-[#F0EDEC] border-[#E8E8E8] hover:bg-[#ece7e7] text-[#594047]'
                  }`}
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isWishlisted ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              )}

              <button
                id="add-to-cart-modal-btn"
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {added ? 'check' : 'shopping_bag'}
                </span>
                <span>{added ? 'Added to Bag!' : `Add ${quantity} to Bag (₹${totalPrice.toLocaleString('en-IN')})`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
