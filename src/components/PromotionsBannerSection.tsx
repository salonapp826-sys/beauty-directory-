import { useState, useEffect } from 'react';
import { Product, ActiveTab } from '../types';

interface PromotionsBannerSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onCategoryClick: (category: string) => void;
}

interface PromotionSlide {
  id: string;
  tag: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  highlightText: string;
  promoCode: string;
  discountValue: string;
  category: string;
  validUntil: string;
  gradientBg: string;
  accentColor: string;
  borderColor: string;
  featuredProductId: string;
  bgImageUrl?: string;
}

export function PromotionsBannerSection({
  products,
  onSelectProduct,
  onAddToCart,
  setActiveTab,
  onCategoryClick,
}: PromotionsBannerSectionProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null);

  const PROMOTION_SLIDES: PromotionSlide[] = [
    {
      id: 'promo-monsoon',
      tag: 'SEASONAL MEGA FEST',
      badgeColor: 'bg-emerald-600 text-white',
      title: 'Monsoon Salon Rejuvenation & Spa Deals',
      subtitle: 'Stock up on hydrating keratin therapies, argan elixirs, and scalp detox kits with direct wholesale rebates.',
      highlightText: 'Flat 30% OFF on Case-Packs + Free Dispatch',
      promoCode: 'MONSOON30',
      discountValue: '30% OFF',
      category: 'Haircare',
      validUntil: 'Ends in 2 days',
      gradientBg: 'from-[#2b0819] via-[#4d0c2e] to-[#8e004b]',
      accentColor: '#FDE7F3',
      borderColor: 'border-pink-900/40',
      featuredProductId: 'prod-4', // Moroccan Argan Luxury Scalp Elixir
    },
    {
      id: 'promo-skincare',
      tag: 'DIRECT DISTRIBUTOR FLASH SALE',
      badgeColor: 'bg-amber-500 text-black',
      title: 'Clinical Peptide & Radiant Serum Consignments',
      subtitle: 'Maximized 42% salon retail margin on high-concentration 10% Niacinamide glass-glow facial formulations.',
      highlightText: 'Extra ₹1,500 ITC Rebate on Orders > ₹20,000',
      promoCode: 'AURA1500',
      discountValue: '₹1,500 OFF',
      category: 'Skincare',
      validUntil: 'Limited Batch Allocation',
      gradientBg: 'from-[#1a1423] via-[#3d1933] to-[#701a4e]',
      accentColor: '#FFDFBA',
      borderColor: 'border-amber-900/40',
      featuredProductId: 'prod-1', // Aura Serum - Radiance Elixir
    },
    {
      id: 'promo-tools',
      tag: 'EQUIPMENT UPGRADE EVENT',
      badgeColor: 'bg-blue-600 text-white',
      title: 'Pro Styler Ionic & Titanium Studio Tools',
      subtitle: 'Heavy-duty 235°C floating plates engineered for non-stop salon keratin sealing. Includes 2-year warranty.',
      highlightText: 'Wholesale Special: ₹1,300 OFF Per Unit',
      promoCode: 'TOOLFEST35',
      discountValue: '25% OFF',
      category: 'Tools',
      validUntil: 'Valid this week',
      gradientBg: 'from-[#0b1b3d] via-[#12285a] to-[#8e004b]',
      accentColor: '#BAE6FD',
      borderColor: 'border-blue-900/40',
      featuredProductId: 'prod-2', // Pro Styler Ionic Ceramic Straightener
    },
    {
      id: 'promo-bridal',
      tag: 'BRIDAL SEASON PRE-BOOKING',
      badgeColor: 'bg-rose-600 text-white',
      title: 'Ultra-HD Pigment & Studio Makeup Palettes',
      subtitle: 'Waterproof 16-hr sweatproof formulations crafted for Indian bridal skin tones with 45% salon profit margin.',
      highlightText: 'Buy 5+ Palettes, Get Free Vanity Master Light',
      promoCode: 'BRIDALGLOW20',
      discountValue: '20% OFF',
      category: 'Makeup',
      validUntil: 'Bridal Edition',
      gradientBg: 'from-[#38041c] via-[#5e072e] to-[#b90064]',
      accentColor: '#FFE4E6',
      borderColor: 'border-rose-900/40',
      featuredProductId: 'prod-3', // Bridal Heritage Ultra-HD Palette
    },
  ];

  // Auto rotate carousel every 5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % PROMOTION_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, PROMOTION_SLIDES.length]);

  const activeSlide = PROMOTION_SLIDES[currentSlideIndex];
  const featuredProduct =
    products.find((p) => p.id === activeSlide.featuredProductId) || products[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleQuickAddPromo = (product: Product) => {
    onAddToCart(product, product.minOrderQuantity || 1);
    setAddedItemCode(product.id);
    setTimeout(() => setAddedItemCode(null), 1800);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PROMOTION_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + PROMOTION_SLIDES.length) % PROMOTION_SLIDES.length);
  };

  return (
    <section
      id="promotions-banner-section"
      className="mt-6 md:mt-8 px-4 md:px-10 max-w-[1440px] mx-auto select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8e004b] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-lg">local_fire_department</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-[#1c1b1b]">
                Promotions & Seasonal Discounts
              </h2>
              <span className="bg-[#FDE7F3] text-[#8e004b] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#8e004b]/20 animate-pulse">
                LIVE OFFERS
              </span>
            </div>
            <p className="text-xs text-[#594047]">
              Exclusive wholesale consignments, volume rebates, and brand flash deals
            </p>
          </div>
        </div>

        {/* Carousel controls & Slide dots */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex gap-1.5 items-center">
            {PROMOTION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-[#8e004b]'
                    : 'w-2 bg-[#E8E8E8] hover:bg-[#8e004b]/40'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-lg bg-white hover:bg-[#F0EDEC] border border-[#E8E8E8] text-[#1c1b1b] shadow-2xs transition-colors"
              title="Previous promotion"
            >
              <span className="material-symbols-outlined text-base block">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-lg bg-white hover:bg-[#F0EDEC] border border-[#E8E8E8] text-[#1c1b1b] shadow-2xs transition-colors"
              title="Next promotion"
            >
              <span className="material-symbols-outlined text-base block">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Promotional Banner Card */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${activeSlide.gradientBg} ${activeSlide.borderColor} border text-white shadow-md transition-all duration-500`}
      >
        {/* Ambient background glow & graphic watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <span className="material-symbols-outlined text-[160px] md:text-[220px] absolute -right-6 -bottom-10 text-white/5 pointer-events-none select-none">
          percent
        </span>

        <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Left Column: Promotion Title, Description, Coupons */}
          <div className="flex-1 space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${activeSlide.badgeColor}`}
              >
                {activeSlide.tag}
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1 font-medium bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-md">
                <span className="material-symbols-outlined text-sm text-amber-400">schedule</span>
                <span>{activeSlide.validUntil}</span>
              </span>
              <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-md border border-white/20">
                {activeSlide.discountValue}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
                {activeSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Highlight Callout */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-3.5 py-2 text-xs text-white font-semibold">
              <span className="material-symbols-outlined text-amber-300 text-base">verified</span>
              <span>{activeSlide.highlightText}</span>
            </div>

            {/* Promo Code Snippet & CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/30 rounded-xl p-1 pl-3 gap-2">
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-mono font-medium">
                  CODE:
                </div>
                <span className="font-mono font-bold text-xs sm:text-sm text-amber-300 select-all">
                  {activeSlide.promoCode}
                </span>
                <button
                  id={`copy-promo-${activeSlide.promoCode}`}
                  onClick={() => handleCopyCode(activeSlide.promoCode)}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-colors"
                  title="Copy coupon code"
                >
                  <span className="material-symbols-outlined text-xs">
                    {copiedCode === activeSlide.promoCode ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedCode === activeSlide.promoCode ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <button
                id="shop-promo-category-btn"
                onClick={() => {
                  onCategoryClick(activeSlide.category);
                  setActiveTab('shop');
                }}
                className="bg-white hover:bg-zinc-100 text-[#8e004b] font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>Shop {activeSlide.category} Deals</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Column: Highlighted Featured Salon Product Card */}
          {featuredProduct && (
            <div className="lg:w-80 flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between gap-3 text-white shadow-xl">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>Featured Supply</span>
                </span>
                <span className="bg-emerald-500/90 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  {featuredProduct.salonMarginPercent}% Salon Margin
                </span>
              </div>

              <div
                onClick={() => onSelectProduct(featuredProduct)}
                className="flex items-center gap-3 cursor-pointer group/card bg-black/20 hover:bg-black/30 p-2 rounded-xl transition-all"
              >
                <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-white/20">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover/card:text-amber-300 transition-colors">
                    {featuredProduct.name}
                  </h4>
                  <p className="text-[10px] text-white/75 truncate">{featuredProduct.brand}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-white font-mono">
                      ₹{featuredProduct.price.toLocaleString('en-IN')}
                    </span>
                    {featuredProduct.originalPrice && (
                      <span className="text-[10px] text-white/60 line-through">
                        ₹{featuredProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Add to Cart & Inspect Button */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id={`promo-view-details-${featuredProduct.id}`}
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all text-center border border-white/10"
                >
                  View Details
                </button>

                <button
                  id={`promo-quick-add-${featuredProduct.id}`}
                  onClick={() => handleQuickAddPromo(featuredProduct)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                    addedItemCode === featuredProduct.id
                      ? 'bg-green-500 text-white'
                      : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                  }`}
                  title="Quick Add to Salon Cart"
                >
                  <span className="material-symbols-outlined text-sm">
                    {addedItemCode === featuredProduct.id ? 'check' : 'shopping_bag'}
                  </span>
                  <span>{addedItemCode === featuredProduct.id ? 'Added!' : 'Add to Bag'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini Promotional Perks ticker */}
        <div className="bg-black/30 border-t border-white/10 px-6 py-2.5 hidden sm:flex items-center justify-between text-[11px] text-white/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-amber-300">local_shipping</span>
            <span>Free Express Freight on Orders ₹15,000+</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-amber-300">verified</span>
            <span>100% Authorized Distributor Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-amber-300">receipt_long</span>
            <span>Instant Verified GST Input Tax Credit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
