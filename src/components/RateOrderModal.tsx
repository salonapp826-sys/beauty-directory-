import { useState, FormEvent } from 'react';
import { Order, Product } from '../types';

export interface OrderRatingData {
  orderId: string;
  overallRating: number;
  qualityRating: number;
  deliveryRating: number;
  distributorRating: number;
  comment: string;
  productRatings: Record<string, number>;
  selectedTags: string[];
  submittedAt: string;
}

interface RateOrderModalProps {
  order: Order;
  existingRating?: OrderRatingData;
  onClose: () => void;
  onSubmitRating: (ratingData: OrderRatingData) => void;
  onSelectProduct?: (product: Product) => void;
}

const FEEDBACK_TAGS = [
  'Genuine Distributor Seal',
  'Fast Express Dispatch',
  'High Salon Profit Margin',
  'Excellent Product Shelf Life',
  'Client-Favorite Formulation',
  'Sturdy Leak-Proof Packaging',
  'Accurate Batch Coding',
];

export function RateOrderModal({
  order,
  existingRating,
  onClose,
  onSubmitRating,
  onSelectProduct,
}: RateOrderModalProps) {
  const [overallRating, setOverallRating] = useState(existingRating?.overallRating || 5);
  const [qualityRating, setQualityRating] = useState(existingRating?.qualityRating || 5);
  const [deliveryRating, setDeliveryRating] = useState(existingRating?.deliveryRating || 5);
  const [distributorRating, setDistributorRating] = useState(existingRating?.distributorRating || 5);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingRating?.selectedTags || ['Genuine Distributor Seal', 'Fast Express Dispatch']
  );

  // Individual product ratings mapping
  const initialProductRatings: Record<string, number> = {};
  order.items.forEach((item) => {
    initialProductRatings[item.product.id] =
      existingRating?.productRatings?.[item.product.id] || 5;
  });
  const [productRatings, setProductRatings] = useState<Record<string, number>>(initialProductRatings);

  const [hoverOverall, setHoverOverall] = useState<number | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleProductRatingChange = (productId: string, rating: number) => {
    setProductRatings((prev) => ({
      ...prev,
      [productId]: rating,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ratingData: OrderRatingData = {
      orderId: order.id,
      overallRating,
      qualityRating,
      deliveryRating,
      distributorRating,
      comment,
      productRatings,
      selectedTags,
      submittedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    onSubmitRating(ratingData);
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const RATING_LABELS: Record<number, string> = {
    1: 'Poor / Defective',
    2: 'Fair / Below Expectation',
    3: 'Good / Standard Quality',
    4: 'Very Good / High Satisfaction',
    5: 'Excellent / Top Salon Grade',
  };

  return (
    <div
      id="rate-order-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="rate-order-modal-card"
        className="bg-[#FCF9F8] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8E8E8] relative overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2b0819] via-[#4d0c2e] to-[#8e004b] text-white p-5 md:p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                VERIFIED DELIVERED ORDER
              </span>
              <span className="text-xs text-white/80">• Order ID: {order.id}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold">Rate Your Salon Consignment</h3>
            <p className="text-xs text-white/85">
              Provided by <strong className="text-amber-300">{order.distributorName}</strong> on {order.date}
            </p>
          </div>

          <button
            id="close-rate-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#1c1b1b]">
          {isSubmittedSuccess ? (
            <div className="py-12 text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h4 className="text-xl font-bold text-[#1c1b1b]">Feedback Submitted Successfully!</h4>
              <p className="text-xs text-[#594047] max-w-md mx-auto">
                Thank you for rating Order <strong className="text-[#8e004b]">{order.id}</strong>. Your feedback directly helps fellow salon owners source authentic wholesale products.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Overall Order Rating */}
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#E8E8E8] shadow-2xs space-y-3 text-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[#594047] block">
                  Overall Order Experience
                </label>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentStarValue = hoverOverall !== null ? hoverOverall : overallRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        id={`star-overall-${star}`}
                        onClick={() => setOverallRating(star)}
                        onMouseEnter={() => setHoverOverall(star)}
                        onMouseLeave={() => setHoverOverall(null)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <span
                          className={`material-symbols-outlined text-3xl md:text-4xl ${
                            star <= currentStarValue
                              ? 'text-amber-400 fill-1'
                              : 'text-zinc-300'
                          }`}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-semibold text-[#8e004b] h-5">
                  {RATING_LABELS[hoverOverall || overallRating]}
                </div>
              </div>

              {/* 2. Detailed Category Ratings */}
              <div className="bg-[#FAF8F8] p-4 rounded-2xl border border-[#E8E8E8] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1b1b] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#8e004b]">
                    tune
                  </span>
                  <span>Consignment Quality Breakdown</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Product Quality */}
                  <div className="bg-white p-3 rounded-xl border border-[#E8E8E8] space-y-1.5">
                    <span className="text-xs font-bold text-[#1c1b1b] block">Product Quality</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setQualityRating(star)}
                          className="focus:outline-none"
                        >
                          <span
                            className={`material-symbols-outlined text-lg ${
                              star <= qualityRating ? 'text-amber-400 fill-1' : 'text-zinc-300'
                            }`}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Packaging */}
                  <div className="bg-white p-3 rounded-xl border border-[#E8E8E8] space-y-1.5">
                    <span className="text-xs font-bold text-[#1c1b1b] block">Delivery & Handling</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setDeliveryRating(star)}
                          className="focus:outline-none"
                        >
                          <span
                            className={`material-symbols-outlined text-lg ${
                              star <= deliveryRating ? 'text-amber-400 fill-1' : 'text-zinc-300'
                            }`}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Distributor Service */}
                  <div className="bg-white p-3 rounded-xl border border-[#E8E8E8] space-y-1.5">
                    <span className="text-xs font-bold text-[#1c1b1b] block">Distributor Support</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setDistributorRating(star)}
                          className="focus:outline-none"
                        >
                          <span
                            className={`material-symbols-outlined text-lg ${
                              star <= distributorRating ? 'text-amber-400 fill-1' : 'text-zinc-300'
                            }`}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Product-Specific Ratings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#594047] flex items-center justify-between">
                  <span>Rate Individual Products ({order.items.length})</span>
                  <span className="text-[11px] font-normal text-[#594047]">Optional detail</span>
                </h4>

                <div className="space-y-2.5">
                  {order.items.map((item) => {
                    const currentRating = productRatings[item.product.id] || 5;

                    return (
                      <div
                        key={item.product.id}
                        className="bg-white p-3 rounded-xl border border-[#E8E8E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer min-w-0"
                          onClick={() => onSelectProduct?.(item.product)}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#fdf8f8] border border-[#E8E8E8] shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#1c1b1b] truncate hover:text-[#8e004b] transition-colors">
                              {item.product.name}
                            </h5>
                            <p className="text-[10px] text-[#594047] truncate">
                              {item.product.brand} • Qty Received: {item.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Individual Star Selector */}
                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              id={`item-star-${item.product.id}-${star}`}
                              onClick={() => handleProductRatingChange(item.product.id, star)}
                              className="focus:outline-none p-0.5"
                            >
                              <span
                                className={`material-symbols-outlined text-lg ${
                                  star <= currentRating
                                    ? 'text-amber-400 fill-1'
                                    : 'text-zinc-300'
                                }`}
                              >
                                star
                              </span>
                            </button>
                          ))}
                          <span className="text-xs font-bold text-[#8e004b] ml-1 min-w-[28px]">
                            {currentRating}★
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Highlight Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#594047] block">
                  Quick Feedback Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FEEDBACK_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#8e004b] text-white border-[#8e004b] shadow-2xs'
                            : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border-[#E8E8E8]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Written Salon Review Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1c1b1b] flex items-center justify-between">
                  <span>Detailed Salon Review / Comments</span>
                  <span className="text-[10px] text-[#594047] font-normal">Optional</span>
                </label>
                <textarea
                  id="rate-order-comment-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details regarding packaging integrity, product efficacy, or distributor handling..."
                  rows={3}
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-xs text-[#1c1b1b] placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#8e004b] resize-none"
                />
              </div>

              {/* Submit Button Bar */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-[#594047] hover:text-[#1c1b1b] hover:bg-[#F0EDEC] rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  id="submit-order-rating-btn"
                  type="submit"
                  className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Submit Salon Rating</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
