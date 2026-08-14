import { useState, MouseEvent } from 'react';
import { NEXORA_ASSETS, PRODUCTS_DATA, DISTRIBUTORS_DATA } from '../data/mockData';
import { Product, Distributor, ActiveTab } from '../types';
import { PromotionsBannerSection } from './PromotionsBannerSection';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectDistributor: (distributor: Distributor) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onCategoryClick: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
}

export function HomeScreen({
  onSelectProduct,
  onAddToCart,
  onSelectDistributor,
  setActiveTab,
  onCategoryClick,
  searchQuery,
  setSearchQuery,
  wishlistIds = [],
  onToggleWishlist,
}: HomeScreenProps) {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    { name: 'Skincare', icon: 'spa' },
    { name: 'Haircare', icon: 'content_cut' },
    { name: 'Makeup', icon: 'face' },
    { name: 'Tools', icon: 'brush' },
    { name: 'Furniture', icon: 'chair' },
    { name: 'Fragrance', icon: 'local_florist' },
  ];

  const handleQuickAdd = (e: MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const trendingProducts = PRODUCTS_DATA.slice(0, 5);

  return (
    <div className="w-full pb-10">
      {/* Mobile Hero Section (Matching Image 1 & 2) */}
      <section className="relative h-[480px] md:h-[460px] lg:hidden w-full mt-2 px-4">
        <div className="absolute inset-0 mx-4 rounded-2xl overflow-hidden shadow-md">
          <div
            className="bg-cover bg-center w-full h-full"
            data-alt="Editorial luxury beauty products"
            style={{
              backgroundImage: `url('${NEXORA_ASSETS.heroMobileBg}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-end p-6 z-10 mx-4 text-white">
          <span className="inline-block px-3 py-1 bg-[#8e004b]/80 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wider rounded-full w-fit mb-2">
            B2B LUXURY BEAUTY MARKETPLACE
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Beauty Products.<br />
            Trusted Distributors.<br />
            Better Business.
          </h1>
          <p className="text-sm text-white/90 mb-5">
            Elevating the standard of luxury salons across India.
          </p>
          <div className="flex flex-col gap-2">
            <button
              id="hero-shop-mobile-btn"
              onClick={() => setActiveTab('shop')}
              className="bg-[#8e004b] hover:bg-[#b90064] text-white font-semibold text-sm py-3.5 px-6 rounded-xl w-full transition-all active:scale-95 shadow-lg tracking-wider"
            >
              SHOP PRODUCTS
            </button>
            <button
              id="hero-distributors-mobile-btn"
              onClick={() => setActiveTab('directory')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-semibold text-sm py-2.5 px-6 rounded-xl w-full transition-all active:scale-95"
            >
              FIND DISTRIBUTORS
            </button>
          </div>
        </div>
      </section>

      {/* Desktop Hero Section (Matching Image 5 & 6) */}
      <section className="hidden lg:block mt-6 px-10 max-w-[1440px] mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-[#F0EDEC] h-[460px] flex items-center shadow-sm border border-[#E8E8E8]">
          <div className="absolute inset-0 z-0">
            <img
              alt="Luxury Beauty Products"
              className="w-full h-full object-cover object-right"
              src={NEXORA_ASSETS.heroDesktopBg}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDF8F8] via-[#FDF8F8]/90 to-transparent w-3/4" />
          </div>
          <div className="relative z-10 w-full max-w-2xl pl-12 pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDE7F3] text-[#8e004b] text-xs font-semibold rounded-full mb-4">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Direct Salon Pricing • GST Input Credit Enabled</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1c1b1b] mb-4 tracking-tight leading-tight">
              Beauty Products.<br />
              Trusted Distributors.<br />
              Better Business.
            </h1>
            <p className="text-base text-[#594047] mb-8 leading-relaxed">
              भारत के beauty professionals और luxury salon businesses के लिए एक ही संपूर्ण platform.
            </p>
            <div className="flex items-center gap-4">
              <button
                id="hero-shop-desktop-btn"
                onClick={() => setActiveTab('shop')}
                className="bg-[#8e004b] hover:bg-[#b90064] text-white font-semibold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                SHOP PRODUCTS
              </button>
              <button
                id="hero-distributors-desktop-btn"
                onClick={() => setActiveTab('directory')}
                className="border-2 border-[#8e004b] text-[#8e004b] hover:bg-[#FDE7F3] font-semibold py-3.5 px-8 rounded-xl transition-all"
              >
                FIND DISTRIBUTORS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Input matching Image 1 & 2 */}
      <div className="px-4 md:px-10 max-w-[1440px] mx-auto mt-6 md:mt-8">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#594047]">
            search
          </span>
          <input
            id="home-search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setActiveTab('shop');
            }}
            className="w-full bg-[#F0EDEC] border-b-2 border-[#E8E8E8] focus:border-[#8e004b] focus:ring-0 focus:outline-none py-3.5 pl-12 pr-4 rounded-t-xl text-sm md:text-base text-[#1c1b1b] placeholder:text-[#594047] transition-colors"
            placeholder="Product, Brand या Distributor खोजें"
            type="text"
          />
        </div>
      </div>

      {/* Featured Promotions & Seasonal Discounts Banner Section */}
      <PromotionsBannerSection
        products={PRODUCTS_DATA}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        setActiveTab={setActiveTab}
        onCategoryClick={onCategoryClick}
      />

      {/* Categories Horizontal Scroll matching Image 1 & 2 */}
      <section className="mt-6 md:mt-8 max-w-[1440px] mx-auto">
        <div className="px-4 md:px-10 flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              id={`category-btn-${cat.name.toLowerCase()}`}
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="flex flex-col items-center gap-2 min-w-[76px] md:min-w-[90px] group transition-transform active:scale-95"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F0EDEC] flex items-center justify-center group-hover:bg-[#FDE7F3] transition-colors border border-[#E8E8E8] group-hover:border-[#8e004b]/30 shadow-xs">
                <span className="material-symbols-outlined text-[#8e004b] text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
              </div>
              <span className="text-xs md:text-sm font-medium text-[#594047] group-hover:text-[#8e004b] transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Now Products matching Image 1 */}
      <section className="mt-8 md:mt-12 max-w-[1440px] mx-auto">
        <div className="px-4 md:px-10 flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1c1b1b] tracking-tight">Trending Now</h2>
            <p className="text-xs md:text-sm text-[#594047]">Top moving salon supplies and wholesale packs</p>
          </div>
          <button
            id="view-all-trending-btn"
            onClick={() => setActiveTab('shop')}
            className="text-xs md:text-sm font-semibold text-[#8e004b] hover:underline"
          >
            View All →
          </button>
        </div>

        {/* Carousel / Grid */}
        <div className="px-4 md:px-10 flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
          {trendingProducts.map((product) => (
            <div
              id={`product-card-${product.id}`}
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="min-w-[170px] md:min-w-0 snap-center bg-[#F0EDEC] hover:bg-white rounded-xl border border-[#E8E8E8] hover:border-[#8e004b]/40 hover:shadow-md transition-all duration-200 flex flex-col p-3.5 gap-2 cursor-pointer group"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square rounded-lg bg-[#fdf8f8] overflow-hidden mb-1">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={product.image}
                  alt={product.name}
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-[#FDE7F3] text-[#8e004b] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#8e004b]/20">
                    New
                  </span>
                )}
                {product.discountBadge && !product.isNew && (
                  <span className="absolute top-2 left-2 bg-[#8e004b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {product.discountBadge}
                  </span>
                )}

                {/* Wishlist Button */}
                {onToggleWishlist && (
                  <button
                    id={`wishlist-toggle-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-2xs z-10 ${
                      wishlistIds.includes(product.id)
                        ? 'bg-[#8e004b] text-white'
                        : 'bg-white/80 hover:bg-white text-[#594047] hover:text-[#8e004b]'
                    }`}
                    title={wishlistIds.includes(product.id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  >
                    <span className="material-symbols-outlined text-sm block">
                      {wishlistIds.includes(product.id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                )}
              </div>

              {/* Title & Brand */}
              <h3 className="text-sm font-semibold text-[#1c1b1b] truncate group-hover:text-[#8e004b] transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-[#594047] truncate">{product.brand}</p>

              {/* Price & Action */}
              <div className="flex justify-between items-center mt-auto pt-1 border-t border-[#E8E8E8]">
                <div className="flex flex-col">
                  <span className="text-sm md:text-base font-bold text-[#8e004b]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-[#594047] line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <button
                  id={`add-btn-${product.id}`}
                  onClick={(e) => handleQuickAdd(e, product)}
                  className={`p-2 rounded-full transition-all active:scale-90 flex items-center justify-center ${
                    addedProductId === product.id
                      ? 'bg-green-600 text-white'
                      : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                  }`}
                  title="Add to Bag"
                >
                  <span className="material-symbols-outlined text-sm">
                    {addedProductId === product.id ? 'check' : 'add'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Distributor Showcase */}
      <section className="mt-8 md:mt-12 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="bg-[#FDE7F3]/40 rounded-2xl border border-[#e0bec6] p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e004b] uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Nexora Verified Network</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1c1b1b]">Direct From Official Distributors</h2>
              <p className="text-sm text-[#594047]">
                Verified GSTIN, 100% authentic batches, and guaranteed salon credit terms.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('directory')}
              className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Explore All Distributors →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DISTRIBUTORS_DATA.slice(0, 3).map((dist) => (
              <div
                key={dist.id}
                onClick={() => onSelectDistributor(dist)}
                className="bg-white rounded-xl border border-[#E8E8E8] hover:border-[#8e004b] p-4 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <span className="material-symbols-outlined text-amber-500 text-xs">star</span>
                      <span>{dist.rating}</span>
                      <span className="text-[#594047]">({dist.reviewsCount})</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#0150d6] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      GST Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1c1b1b] mb-1">{dist.name}</h3>
                  <p className="text-xs text-[#594047] flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-sm text-[#8e004b]">location_on</span>
                    <span>{dist.location}</span>
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {dist.brands.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] bg-[#F0EDEC] text-[#1c1b1b] px-2 py-0.5 rounded font-medium"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E8E8] flex justify-between items-center text-xs">
                  <span className="text-[#594047]">
                    Min Order: <strong className="text-[#1c1b1b]">₹{dist.minOrderValue.toLocaleString('en-IN')}</strong>
                  </span>
                  <span className="text-[#8e004b] font-semibold">View Catalog →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salon Business Value Banners */}
      <section className="mt-8 md:mt-12 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F0EDEC] rounded-xl p-5 border border-[#E8E8E8] flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1c1b1b]">18% GST Input Credit</h4>
              <p className="text-xs text-[#594047] mt-1">
                Automated B2B tax invoices sent to your email to claim 100% input tax credits.
              </p>
            </div>
          </div>

          <div className="bg-[#F0EDEC] rounded-xl p-5 border border-[#E8E8E8] flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1c1b1b]">Express Pan-India Logistics</h4>
              <p className="text-xs text-[#594047] mt-1">
                24-48 hours rapid fulfillment across metro clusters and tier-2 salon hubs.
              </p>
            </div>
          </div>

          <div className="bg-[#F0EDEC] rounded-xl p-5 border border-[#E8E8E8] flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">percent</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1c1b1b]">Bulk Tier Savings</h4>
              <p className="text-xs text-[#594047] mt-1">
                Save up to 35% on case-pack orders with transparent tiered volume discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer matching Image 6 */}
      <footer className="mt-16 bg-[#f7f2f2] border-t border-[#E8E8E8] w-full">
        <div className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto gap-4">
          <div className="text-lg font-bold text-[#8e004b]">Nexora</div>
          <div className="flex flex-wrap gap-4 md:gap-6 text-xs text-[#594047] justify-center">
            <a href="#" className="hover:text-[#8e004b] underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#8e004b] underline">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#8e004b] underline">
              Contact Support
            </a>
            <a href="#" className="hover:text-[#8e004b] underline">
              Partner Program
            </a>
          </div>
          <div className="text-xs text-[#594047]">
            © 2026 Nexora India. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
