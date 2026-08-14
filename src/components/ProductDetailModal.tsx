import { useState, useEffect, MouseEvent, FormEvent, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDistributor: (distributorId: string) => void;
  onSelectProduct?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

interface ReviewItem {
  id: string;
  authorName: string;
  salonName: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onViewDistributor,
  onSelectProduct,
  isWishlisted = false,
  onToggleWishlist,
}: ProductDetailModalProps) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Product Video Reel states
  const [isPlayingProductVideo, setIsPlayingProductVideo] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [reelLiked, setReelLiked] = useState(false);

  // Sync state on product change
  useEffect(() => {
    if (product) {
      setQuantity(product.minOrderQuantity || 1);
      setAdded(false);
      setCopied(false);
      setIsFormOpen(false);
    }
  }, [product?.id]);

  // Calculate up to 4 similar items from the same category
  const similarProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = PRODUCTS_DATA.filter(
      (p) => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase()
    );
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }
    const otherProducts = PRODUCTS_DATA.filter(
      (p) => p.id !== product.id && p.category.toLowerCase() !== product.category.toLowerCase()
    );
    return [...sameCategory, ...otherProducts].slice(0, 4);
  }, [product]);

  // Review Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [authorName, setAuthorName] = useState('Riya Sharma');
  const [salonName, setSalonName] = useState('Aura Unisex Salon, Mumbai');
  const [reviewSuccessToast, setReviewSuccessToast] = useState(false);
  const [helpfulLikedIds, setHelpfulLikedIds] = useState<string[]>([]);

  // Default mock reviews list for salon owners
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      authorName: 'Priya Verma',
      salonName: 'StyleStudio Luxury Salon',
      location: 'Delhi NCR',
      rating: 5,
      date: '2 days ago',
      title: 'Exceptional client satisfaction & instant repeat orders!',
      comment:
        'We introduced this product in our flagship South Delhi branch last month. Client feedback after hair procedures is outstanding. The wholesale margin is very profitable for salon retail.',
      verifiedBuyer: true,
      helpfulCount: 12,
    },
    {
      id: 'rev-2',
      authorName: 'Anand Kapoor',
      salonName: 'Glow Hair & Aesthetic Clinic',
      location: 'Mumbai',
      rating: 5,
      date: '1 week ago',
      title: 'Original distributor stock with fast GST invoice',
      comment:
        'Prompt 24-hour dispatch from Nexora distributor. Hologram seal was intact and 18% GST input credit was credited smoothly. Highly recommended for salon procurement.',
      verifiedBuyer: true,
      helpfulCount: 8,
    },
    {
      id: 'rev-3',
      authorName: 'Neha Joshi',
      salonName: 'Velvet Touch Parlour & Spa',
      location: 'Bengaluru',
      rating: 4,
      date: '2 weeks ago',
      title: 'Great product texture and pleasant natural aroma',
      comment:
        'My senior stylists prefer this formula during client sessions. Works smoothly without weighing down hair or causing scalp irritation.',
      verifiedBuyer: true,
      helpfulCount: 5,
    },
  ]);

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

  // Review submission handler
  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: authorName.trim() || 'Verified Salon Owner',
      salonName: salonName.trim() || 'Independent Salon',
      location: 'India',
      rating: userRating,
      date: 'Just now',
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verifiedBuyer: true,
      helpfulCount: 0,
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setReviewTitle('');
    setReviewComment('');
    setIsFormOpen(false);
    setReviewSuccessToast(true);
    setTimeout(() => setReviewSuccessToast(false), 3000);
  };

  const toggleHelpful = (reviewId: string) => {
    if (helpfulLikedIds.includes(reviewId)) {
      setHelpfulLikedIds((prev) => prev.filter((id) => id !== reviewId));
      setReviewsList((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount - 1 } : r))
      );
    } else {
      setHelpfulLikedIds((prev) => [...prev, reviewId]);
      setReviewsList((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
      );
    }
  };

  const averageRating = useMemo(() => {
    if (reviewsList.length === 0) return product.rating;
    const total = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList, product.rating]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E8E8] relative flex flex-col overflow-hidden animate-fade-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Share Link Copied Toast Notification */}
        {copied && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#1c1b1b] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in border border-white/20">
            <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
            <span>Product link copied to clipboard!</span>
          </div>
        )}

        {/* Review Submitted Toast Notification */}
        {reviewSuccessToast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#8e004b] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in border border-white/20">
            <span className="material-symbols-outlined text-amber-300 text-base">star</span>
            <span>Thank you! Your verified salon review has been posted.</span>
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

        {/* Top Section: Product Overview Split */}
        <div className="flex flex-col md:flex-row border-b border-[#E8E8E8]">
          {/* Left: Product Image */}
          <div className="w-full md:w-1/2 bg-[#fdf8f8] relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E8E8E8] group">
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
                className={`absolute top-4 right-14 md:right-auto md:left-4 md:top-14 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm z-10 ${
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

            {/* Floating Watch Video Reel / Demo button */}
            {(product.videoUrl || product.reelId || product.id === 'prod-1' || product.id === 'prod-2' || product.id === 'prod-3') && (
              <button
                id="product-modal-watch-video-btn"
                type="button"
                onClick={() => setIsPlayingProductVideo(true)}
                className="absolute bottom-4 left-4 right-4 bg-[#8e004b]/95 hover:bg-[#8e004b] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 z-10"
                title="Watch unboxing / application demo video reel"
              >
                <span className="material-symbols-outlined text-lg animate-pulse text-amber-300">play_circle</span>
                <span>Watch Product Reel (वीडियो देखें)</span>
              </button>
            )}
          </div>

          {/* Right: Product Details & Pricing */}
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
              <button
                type="button"
                onClick={() => {
                  onViewDistributor(product.distributorId || product.distributorName);
                }}
                className="flex items-center gap-1.5 text-xs text-[#0150d6] hover:text-[#013cb0] hover:underline font-bold mb-3 text-left transition-colors"
                title={`Open ${product.distributorName} wholesale profile`}
              >
                <span className="material-symbols-outlined text-sm animate-pulse text-[#0150d6]">verified</span>
                <span>Supplied by: <strong className="font-extrabold">{product.distributorName}</strong></span>
              </button>

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

        {/* Bottom Section: Product Reviews & Ratings Section */}
        <div className="p-6 bg-[#FCF9F8] space-y-6">
          {/* Section Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8e004b]">rate_review</span>
                <h3 className="text-lg font-bold text-[#1c1b1b]">
                  Verified Salon Owner Reviews
                </h3>
              </div>
              <p className="text-xs text-[#594047] mt-0.5">
                Authentic feedback from salon directors, hair artists & aesthetic practitioners
              </p>
            </div>

            <button
              id="toggle-write-review-btn"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">
                {isFormOpen ? 'close' : 'edit_note'}
              </span>
              <span>{isFormOpen ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Rating Statistics Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E8E8] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Average Rating Score */}
            <div className="text-center sm:border-r border-[#E8E8E8] pr-0 sm:pr-4">
              <div className="text-3xl font-extrabold text-[#1c1b1b]">{averageRating}</div>
              <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined text-lg fill-1">
                    star
                  </span>
                ))}
              </div>
              <p className="text-xs font-semibold text-[#594047]">
                Based on {reviewsList.length} Verified Salon Reviews
              </p>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="sm:col-span-2 space-y-1.5 text-xs">
              {[
                { stars: 5, pct: 85 },
                { stars: 4, pct: 15 },
                { stars: 3, pct: 0 },
                { stars: 2, pct: 0 },
                { stars: 1, pct: 0 },
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center gap-2">
                  <span className="w-12 text-[#594047] font-semibold text-[11px]">
                    {bar.stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-[#F0EDEC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-stone-400 font-medium text-[10px]">
                    {bar.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Write a Review Form */}
          {isFormOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-white p-5 rounded-2xl border border-[#8e004b]/30 shadow-md space-y-4 animate-fade-in"
            >
              <h4 className="text-sm font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8e004b] text-base">verified</span>
                <span>Submit Your Salon Experience</span>
              </h4>

              {/* Star Rating System */}
              <div>
                <label className="block text-xs font-bold text-[#594047] mb-1.5">
                  Overall Product Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeStar = (hoverRating !== null ? hoverRating : userRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setUserRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform focus:outline-hidden"
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {activeStar ? 'star' : 'star_border'}
                        </span>
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-[#8e004b] ml-2">
                    {userRating} / 5 ({userRating === 5 ? 'Excellent' : userRating === 4 ? 'Very Good' : 'Good'})
                  </span>
                </div>
              </div>

              {/* User / Salon Details Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#594047] mb-1">
                    Your Name / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Riya Sharma (Senior Stylist)"
                    className="w-full bg-[#F0EDEC] text-xs text-[#1c1b1b] font-medium px-3 py-2 rounded-xl border border-[#E8E8E8] focus:bg-white focus:border-[#8e004b] outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#594047] mb-1">
                    Salon Name & City
                  </label>
                  <input
                    type="text"
                    required
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    placeholder="e.g. Aura Unisex Salon, Mumbai"
                    className="w-full bg-[#F0EDEC] text-xs text-[#1c1b1b] font-medium px-3 py-2 rounded-xl border border-[#E8E8E8] focus:bg-white focus:border-[#8e004b] outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Review Headline Input */}
              <div>
                <label className="block text-xs font-bold text-[#594047] mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Smooth client results, high repeat value!"
                  className="w-full bg-[#F0EDEC] text-xs text-[#1c1b1b] font-medium px-3 py-2 rounded-xl border border-[#E8E8E8] focus:bg-white focus:border-[#8e004b] outline-hidden transition-all"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-[#594047] mb-1">
                  Detailed Salon Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience as a salon owner regarding formula effectiveness, client satisfaction, packaging, or margins..."
                  className="w-full bg-[#F0EDEC] text-xs text-[#1c1b1b] font-medium p-3 rounded-xl border border-[#E8E8E8] focus:bg-white focus:border-[#8e004b] outline-hidden transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#594047] hover:bg-[#F0EDEC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="submit-product-review-btn"
                  type="submit"
                  className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Existing Salon Reviews */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#594047] uppercase tracking-wider">
              Recent Salon Owner Experiences ({reviewsList.length})
            </h4>

            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-4 rounded-2xl border border-[#E8E8E8] space-y-2 shadow-2xs hover:border-[#8e004b]/30 transition-all"
              >
                {/* Review Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar Badge */}
                    <div className="w-8 h-8 rounded-full bg-[#FDE7F3] text-[#8e004b] font-extrabold text-xs flex items-center justify-center border border-[#8e004b]/20">
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#1c1b1b]">
                          {rev.authorName}
                        </span>
                        {rev.verifiedBuyer && (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-200">
                            <span className="material-symbols-outlined text-[10px]">check_circle</span>
                            <span>Verified Salon Buyer</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#594047]">
                        {rev.salonName} • {rev.location}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400 font-medium">
                    {rev.date}
                  </span>
                </div>

                {/* Rating & Review Title */}
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`material-symbols-outlined text-sm ${
                          s <= rev.rating ? 'fill-1' : 'text-stone-300'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <h5 className="text-xs font-bold text-[#1c1b1b]">
                    {rev.title}
                  </h5>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-[#594047] leading-relaxed">
                  {rev.comment}
                </p>

                {/* Helpful Count Action */}
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#F0EDEC]">
                  <span className="text-stone-400 text-[10px]">Was this review helpful to your salon?</span>
                  <button
                    type="button"
                    onClick={() => toggleHelpful(rev.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      helpfulLikedIds.includes(rev.id)
                        ? 'bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/30'
                        : 'bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#594047]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">thumb_up</span>
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products Horizontal Carousel (Cross-Selling Section) */}
        {similarProducts.length > 0 && (
          <div className="p-5 md:p-8 bg-[#FCF9F8] border-t border-[#E8E8E8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FDE7F3] text-[#8e004b] text-[10px] font-extrabold rounded-full mb-1">
                  <span className="material-symbols-outlined text-[12px]">local_mall</span>
                  <span>Cross-Sell Recommendations</span>
                </span>
                <h4 className="text-base md:text-lg font-bold text-[#1c1b1b]">
                  Similar Products in {product.category}
                </h4>
              </div>
              <span className="text-xs font-semibold text-[#8e004b] hidden sm:inline">
                Scroll to view ({similarProducts.length}) →
              </span>
            </div>

            <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-2">
              {similarProducts.map((simProd) => (
                <div
                  key={simProd.id}
                  id={`similar-product-card-${simProd.id}`}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(simProd);
                    }
                  }}
                  className="bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#8e004b]/50 p-3 min-w-[200px] max-w-[210px] shrink-0 shadow-2xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Discount Badge */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-[#F0EDEC]">
                      <img
                        src={simProd.image}
                        alt={simProd.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {simProd.discountBadge && (
                        <span className="absolute top-1.5 left-1.5 bg-[#8e004b] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                          {simProd.discountBadge}
                        </span>
                      )}
                    </div>

                    {/* Brand & Name */}
                    <p className="text-[10px] font-bold text-[#8e004b] uppercase tracking-wider mb-0.5">
                      {simProd.brand}
                    </p>
                    <h5 className="text-xs font-bold text-[#1c1b1b] line-clamp-2 mb-1.5 group-hover:text-[#8e004b] transition-colors leading-tight">
                      {simProd.name}
                    </h5>
                  </div>

                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[10px] text-[#594047] mb-2">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span>{simProd.rating}</span>
                      </span>
                      <span>({simProd.reviewsCount})</span>
                    </div>

                    {/* Price & Add Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F0EDEC]">
                      <div>
                        <span className="text-xs font-extrabold text-[#1c1b1b]">
                          ₹{simProd.price.toLocaleString('en-IN')}
                        </span>
                        {simProd.originalPrice && (
                          <span className="text-[10px] text-stone-400 line-through ml-1">
                            ₹{simProd.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(simProd, simProd.minOrderQuantity || 1);
                        }}
                        className="p-1.5 rounded-lg bg-[#FDE7F3] hover:bg-[#8e004b] text-[#8e004b] hover:text-white transition-colors flex items-center justify-center"
                        title="Quick Add to Cart"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Unboxing Video Reel Overlay */}
        {isPlayingProductVideo && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsPlayingProductVideo(false)}>
            <div className="bg-stone-900 text-white rounded-3xl overflow-hidden max-w-sm w-full relative shadow-2xl border border-white/20" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsPlayingProductVideo(false)}
                className="absolute top-3 right-3 z-35 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                title="Close Player"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              <div className="relative aspect-[9/16] bg-black">
                {/* Autoplay Video Stream */}
                <video
                  src={product.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-skin-care-serum-being-applied-43187-large.mp4"}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                
                {/* Audio Control */}
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                  title={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isVideoMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </button>

                <div className="absolute bottom-4 inset-x-4 space-y-1.5 pointer-events-none">
                  <span className="inline-block text-[10px] font-bold text-[#FDE7F3] bg-[#8e004b] px-2 py-0.5 rounded-md">
                    {product.distributorName}
                  </span>
                  <h3 className="text-xs font-bold leading-tight">{product.name} - Demo</h3>
                  <p className="text-[10px] text-stone-300">Autoplay • Verified Salon Tutorial</p>
                  
                  {/* Simulated Like & Ask Feature */}
                  <div className="flex items-center gap-2 pt-1.5 pointer-events-auto">
                    <button
                      onClick={() => setReelLiked(!reelLiked)}
                      className={`font-bold text-[10px] py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-colors ${
                        reelLiked ? 'bg-pink-600 text-white animate-bounce' : 'bg-black/60 text-white hover:bg-black'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px] font-black">favorite</span>
                      <span>{reelLiked ? 'Liked!' : 'Like Product Video'}</span>
                    </button>
                    <span className="text-[9px] text-stone-300">Hologram Batch Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

