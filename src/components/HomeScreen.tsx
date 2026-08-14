import React, { useState, useEffect, useRef, MouseEvent, ReactNode } from 'react';
import { NEXORA_ASSETS, PRODUCTS_DATA, DISTRIBUTORS_DATA, INITIAL_REELS } from '../data/mockData';
import { Product, Distributor, ActiveTab, DistributorReel } from '../types';
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
  reels?: DistributorReel[];
  onLikeReel?: (reelId: string) => void;
  onOpenDistributorProfile?: (distributor: Distributor) => void;
  onSelectDirectoryCity?: (city: string) => void;
  onSelectDirectoryCategory?: (category: string) => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
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
  reels = INITIAL_REELS,
  onLikeReel,
  onOpenDistributorProfile,
  onSelectDirectoryCity,
  onSelectDirectoryCategory,
  onOpenCart,
  onOpenWishlist,
}: HomeScreenProps) {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [activeReel, setActiveReel] = useState<DistributorReel | null>(null);
  const [selectedReelTag, setSelectedReelTag] = useState<string>('All');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [footerModalContent, setFooterModalContent] = useState<{
    title: string;
    icon: string;
    content: ReactNode;
  } | null>(null);
  const trendingSectionRef = useRef<HTMLElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (trendingSectionRef.current) {
        const rect = trendingSectionRef.current.getBoundingClientRect();
        // Appears after the user scrolls past the Trending Products section
        setShowBackToTop(rect.bottom < 120);
      } else {
        setShowBackToTop(window.scrollY > 800);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close search predictive dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | Event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TRENDING_SEARCHES = [
    { keyword: 'Bridal Makeup Kit', tag: 'High Volume', icon: 'local_fire_department' },
    { keyword: 'Keratin Hair Treatment', tag: 'Trending', icon: 'auto_awesome' },
    { keyword: 'Ozone Facial Steamer', tag: 'Equipment', icon: 'countertops' },
    { keyword: '10% Niacinamide Serum', tag: 'Skincare', icon: 'spa' },
    { keyword: 'Basalt Hot Stone Spa Set', tag: 'Spa', icon: 'hot_tub' },
    { keyword: 'Hydra Facial Machine', tag: 'Popular', icon: 'medical_services' },
    { keyword: 'Argan Hair Mask', tag: 'Restock', icon: 'palette' },
  ];

  const categories = [
    { name: 'Skincare', icon: 'spa' },
    { name: 'Haircare', icon: 'content_cut' },
    { name: 'Makeup', icon: 'face' },
    { name: 'Tools', icon: 'brush' },
    { name: 'Furniture', icon: 'chair' },
    { name: 'Fragrance', icon: 'local_florist' },
    { name: 'Nails', icon: 'back_hand' },
    { name: 'Tattoo Studio', icon: 'draw' },
    { name: 'Spa', icon: 'hot_tub' },
    { name: 'Massage', icon: 'self_improvement' },
    { name: 'Salon Equipment', icon: 'countertops' },
    { name: 'Hair Color', icon: 'palette' },
    { name: 'Professional Beauty Products', icon: 'auto_awesome' },
  ];

  const handleQuickAdd = (e: MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const trendingProducts = PRODUCTS_DATA.slice(0, 5);
  const newProducts = PRODUCTS_DATA.filter((p) => p.isNew || p.rating >= 4.8).slice(0, 5);

  return (
    <div className="w-full pb-10">
      {/* 1 & 2. HERO BANNER (Mobile & Desktop) */}
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

      {/* 3. PROMINENT MAIN SEARCH BAR (Directly below Hero) WITH REAL-TIME PREDICTIVE DROPDOWN */}
      <div className="px-4 md:px-10 max-w-[1440px] mx-auto mt-6 md:mt-8">
        <div ref={searchWrapperRef} className="max-w-4xl mx-auto relative z-30">
          <div className="relative flex items-center bg-white border-2 border-[#8e004b]/20 hover:border-[#8e004b]/50 focus-within:border-[#8e004b] focus-within:ring-4 focus-within:ring-[#FDE7F3] shadow-lg hover:shadow-xl rounded-2xl md:rounded-full p-2 md:p-2.5 transition-all duration-300 group">
            <span className="material-symbols-outlined text-[#8e004b] text-2xl md:text-3xl ml-2 md:ml-4 mr-2 pointer-events-none transition-transform group-focus-within:scale-110">
              search
            </span>
            <input
              id="home-search-bar"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSearchFocused(false);
                  setActiveTab('shop');
                }
                if (e.key === 'Escape') {
                  setIsSearchFocused(false);
                }
              }}
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base md:text-lg font-medium text-[#1c1b1b] placeholder:text-[#8c7077] placeholder:font-normal py-2 px-1"
              placeholder="Product, Brand या Distributor खोजें..."
              type="text"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(true);
                }}
                className="p-1.5 rounded-full hover:bg-[#F0EDEC] text-[#594047] hover:text-[#8e004b] transition-colors mr-1"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
            <button
              id="home-search-submit-btn"
              type="button"
              onClick={() => {
                setIsSearchFocused(false);
                setActiveTab('shop');
              }}
              className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs md:text-sm px-5 md:px-7 py-3 rounded-xl md:rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>खोजें</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {/* REAL-TIME PREDICTIVE DROPDOWN */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#8e004b]/30 overflow-hidden z-50 p-4 md:p-5 max-h-[500px] overflow-y-auto animate-fade-in text-[#1c1b1b]">
              {!searchQuery.trim() ? (
                /* EMPTY SEARCH QUERY - SHOW TRENDING SEARCHES & CATEGORIES */
                <div className="space-y-5">
                  {/* Trending Searches in Salons */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#8e004b] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-rose-600">local_fire_department</span>
                        <span>Trending Searches in Salons</span>
                      </h3>
                      <span className="text-[10px] text-stone-500 font-semibold">Live Salon Demand</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((item) => (
                        <button
                          key={item.keyword}
                          type="button"
                          onClick={() => {
                            setSearchQuery(item.keyword);
                            setIsSearchFocused(true);
                          }}
                          className="px-3 py-1.5 bg-[#FDF8F8] hover:bg-[#FDE7F3] border border-[#E8E8E8] hover:border-[#8e004b]/40 rounded-xl text-xs font-medium text-[#1c1b1b] hover:text-[#8e004b] transition-all flex items-center gap-1.5 group shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-sm text-[#8e004b]">
                            {item.icon}
                          </span>
                          <span>{item.keyword}</span>
                          <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                            {item.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Predictive Product Categories */}
                  <div className="pt-3 border-t border-[#E8E8E8]">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-[#8e004b]">grid_view</span>
                        <span>Explore Popular Product Categories</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {categories.slice(0, 6).map((cat) => {
                        const count = PRODUCTS_DATA.filter((p) =>
                          p.category.toLowerCase().includes(cat.name.toLowerCase())
                        ).length;
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => {
                              onCategoryClick(cat.name);
                              setActiveTab('shop');
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 bg-[#FCF9F8] hover:bg-[#FDE7F3] border border-[#E8E8E8] hover:border-[#8e004b]/40 rounded-xl text-left transition-all flex items-center gap-2 group"
                          >
                            <span className="material-symbols-outlined text-lg text-[#8e004b] group-hover:scale-110 transition-transform">
                              {cat.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1c1b1b] group-hover:text-[#8e004b] truncate">
                                {cat.name}
                              </p>
                              <p className="text-[10px] text-stone-500">{count > 0 ? `${count}+ items` : 'Explore'}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommended Quick Discovery */}
                  <div className="pt-3 border-t border-[#E8E8E8]">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
                      ⚡ Top Wholesale Beauty Picks
                    </h3>
                    <div className="space-y-2">
                      {PRODUCTS_DATA.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            onSelectProduct(product);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FDE7F3]/50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#E8E8E8]"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1c1b1b] truncate group-hover:text-[#8e004b]">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-stone-500">
                                {product.brand} • <span className="text-[#8e004b] font-semibold">{product.category}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-[#1c1b1b]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-stone-500 block">Wholesale</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* TYPED SEARCH QUERY - SHOW REAL-TIME PREDICTIVE MATCHES */
                <div className="space-y-4">
                  {/* Matching Categories */}
                  {(() => {
                    const norm = searchQuery.trim().toLowerCase();
                    const matchingCategories = categories.filter((c) =>
                      c.name.toLowerCase().includes(norm)
                    );
                    if (matchingCategories.length === 0) return null;
                    return (
                      <div>
                        <h3 className="text-xs font-bold text-[#8e004b] uppercase tracking-wider mb-2">
                          Matching Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {matchingCategories.map((cat) => (
                            <button
                              key={cat.name}
                              type="button"
                              onClick={() => {
                                onCategoryClick(cat.name);
                                setActiveTab('shop');
                                setIsSearchFocused(false);
                              }}
                              className="px-3 py-1.5 bg-[#FDE7F3] border border-[#8e004b]/30 text-[#8e004b] text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-[#8e004b] hover:text-white transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Matching Products */}
                  {(() => {
                    const norm = searchQuery.trim().toLowerCase();
                    const matchingProducts = PRODUCTS_DATA.filter(
                      (p) =>
                        p.name.toLowerCase().includes(norm) ||
                        p.brand.toLowerCase().includes(norm) ||
                        p.category.toLowerCase().includes(norm) ||
                        p.description.toLowerCase().includes(norm)
                    );

                    return (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                            Product Suggestions ({matchingProducts.length})
                          </h3>
                          {matchingProducts.length > 0 && (
                            <span className="text-[10px] text-[#8e004b] font-semibold">Instant Direct Pricing</span>
                          )}
                        </div>

                        {matchingProducts.length > 0 ? (
                          <div className="space-y-2">
                            {matchingProducts.slice(0, 5).map((product) => (
                              <div
                                key={product.id}
                                onClick={() => {
                                  onSelectProduct(product);
                                  setIsSearchFocused(false);
                                }}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FDE7F3]/60 border border-transparent hover:border-[#8e004b]/20 cursor-pointer transition-all group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-[#E8E8E8] shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-extrabold text-[#8e004b] uppercase tracking-wider block">
                                      {product.brand}
                                    </span>
                                    <h4 className="text-xs font-bold text-[#1c1b1b] truncate group-hover:text-[#8e004b]">
                                      {product.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] bg-stone-100 px-1.5 py-0.2 rounded text-stone-600 font-medium">
                                        {product.category}
                                      </span>
                                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                                        ★ {product.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <p className="text-xs font-extrabold text-[#1c1b1b]">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </p>
                                  <button
                                    type="button"
                                    className="mt-1 px-2.5 py-1 bg-[#8e004b] text-white text-[10px] font-bold rounded-md hover:bg-[#b90064] transition-colors"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-stone-50 rounded-xl text-center">
                            <p className="text-xs text-stone-500 font-medium">
                              No exact product titles matching "{searchQuery}"
                            </p>
                            <p className="text-[11px] text-[#8e004b] font-semibold mt-1">
                              Try searching for 'Shampoo', 'Serum', 'Facial', 'Kit', or 'Equipment'
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Matching Distributors */}
                  {(() => {
                    const norm = searchQuery.trim().toLowerCase();
                    const matchingDistributors = DISTRIBUTORS_DATA.filter(
                      (d) =>
                        d.name.toLowerCase().includes(norm) ||
                        d.location.toLowerCase().includes(norm) ||
                        d.categories.some((c) => c.toLowerCase().includes(norm)) ||
                        d.brands.some((b) => b.toLowerCase().includes(norm))
                    );
                    if (matchingDistributors.length === 0) return null;
                    return (
                      <div className="pt-2 border-t border-[#E8E8E8]">
                        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                          Matching Distributors ({matchingDistributors.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingDistributors.slice(0, 2).map((d) => (
                            <div
                              key={d.id}
                              onClick={() => {
                                onSelectDistributor(d);
                                setIsSearchFocused(false);
                              }}
                              className="p-2.5 bg-[#FCF9F8] hover:bg-[#FDE7F3] border border-[#E8E8E8] rounded-xl cursor-pointer transition-all flex items-center gap-2.5"
                            >
                              <img src={d.logo} alt={d.name} className="w-8 h-8 rounded-full border border-white" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1c1b1b] truncate">{d.name}</p>
                                <p className="text-[10px] text-stone-500">{d.location} • Verified</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* See All Results Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('shop');
                        setIsSearchFocused(false);
                      }}
                      className="w-full py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Search All Salon Products in Shop</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. CATEGORIES SECTION */}
      <section className="mt-6 md:mt-8 max-w-[1440px] mx-auto">
        <div className="px-4 md:px-10 mb-3 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-[#1c1b1b] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8e004b] text-xl">category</span>
            <span>Explore Salon Categories</span>
          </h2>
          <span className="text-xs font-semibold text-[#8e004b] hidden sm:inline">
            Scroll to view all 13 categories →
          </span>
        </div>

        <div className="px-4 md:px-10 flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar pb-3 pt-1">
          {categories.map((cat) => (
            <button
              id={`category-btn-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="flex flex-col items-center gap-2 min-w-[82px] md:min-w-[96px] shrink-0 group transition-all duration-300 active:scale-95 focus:outline-none"
            >
              <div className="relative w-18 h-18 md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#E8E8E8] via-white to-[#FDE7F3] group-hover:from-[#8e004b] group-hover:to-[#ffb3d1] shadow-2xs group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-[#F0EDEC] group-hover:bg-[#FDE7F3] flex items-center justify-center transition-colors duration-300 border border-white">
                  <span className="material-symbols-outlined text-[#8e004b] text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110">
                    {cat.icon}
                  </span>
                </div>
              </div>
              <span className="text-xs md:text-sm font-semibold text-[#3b2b2e] group-hover:text-[#8e004b] transition-colors whitespace-nowrap text-center">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. TRENDING PRODUCTS */}
      <section ref={trendingSectionRef} className="mt-8 md:mt-12 max-w-[1440px] mx-auto">
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

        <div className="px-4 md:px-10 flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
          {trendingProducts.map((product) => (
            <div
              id={`product-card-${product.id}`}
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="min-w-[170px] md:min-w-0 snap-center bg-[#F0EDEC] hover:bg-white rounded-xl border border-[#E8E8E8] hover:border-[#8e004b]/40 hover:shadow-md transition-all duration-200 flex flex-col p-3.5 gap-2 cursor-pointer group"
            >
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

              <h3 className="text-sm font-semibold text-[#1c1b1b] truncate group-hover:text-[#8e004b] transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-[#594047] truncate">{product.brand}</p>

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

      {/* 6. OFFERS & BANNERS */}
      <PromotionsBannerSection
        products={PRODUCTS_DATA}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        setActiveTab={setActiveTab}
        onCategoryClick={onCategoryClick}
      />

      {/* 7. POPULAR DISTRIBUTOR VIDEOS / REELS */}
      <section className="mt-8 md:mt-12 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e004b] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">movie</span>
              <span>Distributor Reels & Demos</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1c1b1b] tracking-tight">Popular Videos / Reels</h2>
            <p className="text-xs md:text-sm text-[#594047]">Watch live product usage, unboxing & salon application demos (Auto-ranked by popularity)</p>
          </div>

          {/* Category Tag Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 max-w-full">
            {['All', 'Tutorial', 'Product Review', 'Before/After', 'Unboxing', 'Technique Guide', 'Brand Showcase'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedReelTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedReelTag === tag
                    ? 'bg-[#8e004b] text-white border-[#8e004b] shadow-xs'
                    : 'bg-white text-[#594047] border-[#E8E8E8] hover:border-[#8e004b] hover:text-[#8e004b]'
                }`}
              >
                {tag !== 'All' && <span className="material-symbols-outlined text-[11px] mr-1 align-middle">label</span>}
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
          {(selectedReelTag === 'All' ? reels : reels.filter((r) => r.reelTag === selectedReelTag)).map((reel, index) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="min-w-[200px] sm:min-w-[230px] md:min-w-[250px] aspect-[9/14] rounded-2xl relative overflow-hidden bg-stone-900 border border-[#E8E8E8] shadow-md cursor-pointer group snap-center"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Popularity Rank, Featured & Category Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10">
                {reel.isFeatured && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-amber-300">
                    <span className="material-symbols-outlined text-xs">push_pin</span>
                    <span>FEATURED REEL</span>
                  </div>
                )}
                <div className="bg-[#8e004b] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  <span>#{index + 1} Popularity Rank</span>
                </div>
                {reel.reelTag && (
                  <div className="bg-stone-900/90 text-amber-300 border border-amber-400/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-md">
                    <span className="material-symbols-outlined text-[10px]">label</span>
                    <span>{reel.reelTag}</span>
                  </div>
                )}
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span>{reel.duration}</span>
              </div>

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#8e004b]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl leading-none">play_arrow</span>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 text-white space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDE7F3] truncate">
                    {reel.distributor}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                  {reel.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-stone-300 pt-1">
                  <span>{reel.views}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onLikeReel) onLikeReel(reel.id);
                    }}
                    className="flex items-center gap-1 text-pink-300 font-bold hover:text-pink-100 transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md"
                  >
                    <span className="material-symbols-outlined text-[12px]">favorite</span>
                    <span>{reel.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reel Modal Preview */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-stone-900 text-white rounded-3xl overflow-hidden max-w-sm w-full relative shadow-2xl border border-white/20">
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <div className="relative aspect-[9/14] bg-black">
              <img src={activeReel.thumbnail} alt={activeReel.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#8e004b] text-white flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-3xl">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-4 inset-x-4 space-y-2">
                <span className="text-xs font-bold text-[#FDE7F3] bg-[#8e004b] px-2.5 py-1 rounded-full">
                  {activeReel.distributor}
                </span>
                <h3 className="text-base font-bold leading-tight">{activeReel.title}</h3>
                <p className="text-xs text-stone-300">{activeReel.views} • {activeReel.likes} Likes</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onLikeReel) onLikeReel(activeReel.id);
                    }}
                    className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    <span>Like Reel</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveReel(null);
                      const distObj = DISTRIBUTORS_DATA.find(
                        (d) =>
                          d.id === activeReel.distributorId ||
                          d.name.toLowerCase().includes(activeReel.distributor.toLowerCase()) ||
                          activeReel.distributor.toLowerCase().includes(d.name.toLowerCase())
                      );
                      if (distObj && onOpenDistributorProfile) {
                        onOpenDistributorProfile(distObj);
                      } else {
                        setActiveTab('directory');
                      }
                    }}
                    className="flex-1 bg-white text-[#1c1b1b] font-bold text-xs py-2 rounded-xl hover:bg-stone-200 transition-colors"
                  >
                    Distributor Profile & Reels →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. FEATURED / VERIFIED DISTRIBUTORS */}
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

      {/* 9. FIND DISTRIBUTORS / DIRECTORY SECTION */}
      <section className="mt-8 md:mt-12 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="bg-[#FCF9F8] rounded-2xl border border-[#e5d5da] p-5 md:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#1c1b1b] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8e004b] text-xl md:text-2xl">storefront</span>
                <span>Beauty Distributors खोजें</span>
              </h2>
              <p className="text-xs md:text-sm text-[#594047] mt-0.5">
                अपने शहर और category के अनुसार verified beauty distributors खोजें।
              </p>
            </div>
            <button
              onClick={() => {
                if (onSelectDirectoryCity) {
                  onSelectDirectoryCity('All');
                } else {
                  setActiveTab('directory');
                }
              }}
              className="text-xs md:text-sm font-extrabold text-[#8e004b] hover:text-[#b90064] transition-all flex items-center gap-1 group self-start sm:self-center bg-[#FDE7F3] hover:bg-[#fcd3e8] px-3 py-1.5 rounded-lg border border-[#8e004b]/20"
            >
              <span>View All Distributors →</span>
            </button>
          </div>

          {/* Grid Layout containing City and Category discoveries */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: City search */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-stone-500 uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>शहरों द्वारा खोजें (By City)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {[
                  { name: 'Delhi', stateName: 'Delhi NCR', icon: 'location_city' },
                  { name: 'Mumbai', stateName: 'Maharashtra', icon: 'corporate_fare' },
                  { name: 'Jaipur', stateName: 'Rajasthan', icon: 'fort' },
                  { name: 'Ahmedabad', stateName: 'Gujarat', icon: 'domain' },
                  { name: 'Bengaluru', stateName: 'Karnataka', icon: 'location_city' },
                  { name: 'Kolkata', stateName: 'West Bengal', icon: 'museum' },
                  { name: 'Hyderabad', stateName: 'Telangana', icon: 'gavel' },
                  { name: 'Pune', stateName: 'Maharashtra', icon: 'domain' }
                ].map((city) => (
                  <button
                    key={city.name}
                    onClick={() => onSelectDirectoryCity && onSelectDirectoryCity(city.name)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:bg-[#FDE7F3]/50 hover:border-[#8e004b]/30 text-left transition-all hover:-translate-y-0.5 hover:shadow-xs group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0EDEC] group-hover:bg-[#FDE7F3] flex items-center justify-center shadow-2xs border border-[#E8E8E8]/60 group-hover:border-[#8e004b]/10 shrink-0 transition-colors">
                      <span className="material-symbols-outlined text-stone-600 group-hover:text-[#8e004b] text-base transition-transform group-hover:scale-110">
                        {city.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1c1b1b] group-hover:text-[#8e004b] transition-colors truncate">
                        {city.name}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate leading-none mt-0.5">
                        {city.stateName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Category discovery */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-stone-500 uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">category</span>
                <span>श्रेणी द्वारा खोजें (By Category)</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {[
                  { name: 'Skincare', icon: 'spa', color: 'bg-emerald-50 text-emerald-800 border-emerald-100' },
                  { name: 'Haircare', icon: 'content_cut', color: 'bg-sky-50 text-sky-800 border-sky-100' },
                  { name: 'Makeup', icon: 'face', color: 'bg-pink-50 text-[#8e004b] border-pink-100' },
                  { name: 'Nails', icon: 'back_hand', color: 'bg-purple-50 text-purple-800 border-purple-100' },
                  { name: 'Spa', icon: 'hot_tub', color: 'bg-teal-50 text-teal-800 border-teal-100' },
                  { name: 'Massage', icon: 'self_improvement', color: 'bg-indigo-50 text-indigo-800 border-indigo-100' },
                  { name: 'Tattoo Studio', icon: 'draw', color: 'bg-amber-50 text-amber-800 border-amber-100' },
                  { name: 'Salon Equipment', icon: 'countertops', color: 'bg-rose-50 text-rose-800 border-rose-100' },
                  { name: 'Hair Color', icon: 'palette', color: 'bg-violet-50 text-violet-800 border-violet-100' }
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => onSelectDirectoryCategory && onSelectDirectoryCategory(cat.name)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E8E8E8] bg-white hover:bg-[#FDE7F3]/50 hover:border-[#8e004b]/30 text-center transition-all hover:-translate-y-0.5 hover:shadow-xs group"
                  >
                    <div className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center border shadow-3xs mb-2.5 transition-transform group-hover:scale-110`}>
                      <span className="material-symbols-outlined text-sm leading-none">
                        {cat.icon}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1c1b1b] group-hover:text-[#8e004b] transition-colors line-clamp-1 leading-none">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. BUSINESS VALUE FEATURES */}
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

      {/* 11. NEW PRODUCTS & REST OF EXISTING SECTIONS */}
      <section className="mt-8 md:mt-12 max-w-[1440px] mx-auto">
        <div className="px-4 md:px-10 flex justify-between items-end mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e004b] uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>New on Nexora</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1c1b1b] tracking-tight">New on Nexora</h2>
            <p className="text-xs md:text-sm text-[#594047]">Beauty professionals के लिए नए products और latest arrivals.</p>
          </div>
          <button
            id="view-all-new-products-btn"
            onClick={() => setActiveTab('shop')}
            className="text-xs md:text-sm font-bold text-[#8e004b] hover:text-[#b90064] hover:underline flex items-center gap-1"
          >
            <span>View All →</span>
          </button>
        </div>

        <div className="px-4 md:px-10 flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
          {newProducts.map((product) => {
            const distributor = DISTRIBUTORS_DATA.find(
              (d) => d.id === product.distributorId || d.brands.includes(product.brand)
            );

            return (
              <div
                id={`new-product-card-${product.id}`}
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="min-w-[170px] md:min-w-0 snap-center bg-[#F0EDEC] hover:bg-white rounded-xl border border-[#E8E8E8] hover:border-[#8e004b]/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col p-3.5 gap-2 cursor-pointer group"
              >
                <div className="relative w-full aspect-square rounded-lg bg-[#fdf8f8] overflow-hidden mb-1">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 bg-[#8e004b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    New
                  </span>

                  {onToggleWishlist && (
                    <button
                      id={`new-wishlist-toggle-${product.id}`}
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

                <h3 className="text-sm font-bold text-[#1c1b1b] truncate group-hover:text-[#8e004b] transition-colors leading-snug">
                  {product.name}
                </h3>
                
                {/* Brand / Distributor link */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#8e004b] uppercase tracking-wider">
                    {product.brand}
                  </span>
                  {distributor && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDistributorProfile) {
                          onOpenDistributorProfile(distributor);
                        } else {
                          setActiveTab('directory');
                        }
                      }}
                      className="text-[10px] text-stone-500 hover:text-[#8e004b] hover:underline text-left mt-0.5 font-medium truncate"
                    >
                      Seller: {distributor.name}
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center mt-auto pt-1 border-t border-[#E8E8E8]">
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base font-bold text-[#8e004b]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#594047] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        {product.discountBadge && (
                          <span className="text-[9px] text-[#8e004b] font-bold">
                            {product.discountBadge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    id={`new-add-btn-${product.id}`}
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
            );
          })}
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="mt-16 bg-[#F5EFEF] border-t border-[#e2d6d9] w-full font-sans">
        {/* Top Grid Section */}
        <div className="w-full pt-12 pb-8 px-4 md:px-10 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: NEXORA BRAND (span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8e004b] text-3xl font-bold animate-pulse">auto_awesome</span>
              <span className="text-2xl font-black tracking-tight text-[#8e004b]">Nexora</span>
            </div>
            <p className="text-sm font-bold text-[#1c1b1b] leading-snug">
              “Beauty Products. Trusted Distributors. Better Business.”
            </p>
            <p className="text-xs text-[#594047] leading-relaxed">
              India’s beauty industry marketplace for products, distributors and professionals. Connecting verified regional salons, spa centers and master distributors for genuine batches and secure credits.
            </p>
            {/* Added standard trust badges */}
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#8e004b] bg-[#FDE7F3] border border-[#8e004b]/10 px-2 py-0.5 rounded-md">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>GSTIN Verified</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
                <span className="material-symbols-outlined text-xs">gavel</span>
                <span>Cosmetic Rules 2020</span>
              </span>
            </div>
          </div>

          {/* Column 2: QUICK LINKS (span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#8e004b] border-b border-[#e2d6d9] pb-1.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#594047]">
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-[#8e004b] transition-colors flex items-center gap-1.5 text-left"
                >
                  <span className="material-symbols-outlined text-sm">home</span>
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('directory')} className="hover:text-[#8e004b] transition-colors flex items-center gap-1.5 text-left">
                  <span className="material-symbols-outlined text-sm">folder_shared</span>
                  <span>Directory</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#8e004b] transition-colors flex items-center gap-1.5 text-left">
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                  <span>Shop</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    searchWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setIsSearchFocused(true);
                  }} 
                  className="hover:text-[#8e004b] transition-colors flex items-center gap-1.5 text-left"
                >
                  <span className="material-symbols-outlined text-sm">search</span>
                  <span>Search</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-[#8e004b] transition-colors flex items-center gap-1.5 text-left">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>My Profile</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: SHOP CATEGORIES (span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#8e004b] border-b border-[#e2d6d9] pb-1.5">
              Shop
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#594047]">
              {[
                { label: 'Hair Care', query: 'Haircare' },
                { label: 'Skin Care', query: 'Skincare' },
                { label: 'Makeup', query: 'Makeup' },
                { label: 'Nails', query: 'Nails' },
                { label: 'Spa', query: 'Spa' },
                { label: 'Massage', query: 'Massage' },
                { label: 'Tattoo Studio', query: 'Tattoo Studio' },
                { label: 'Salon Equipment', query: 'Salon Equipment' },
                { label: 'Hair Color', query: 'Hair Color' }
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => {
                      onCategoryClick(item.query);
                      setActiveTab('shop');
                    }}
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: FOR BUSINESS & SUPPORT (span 4) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {/* Sub-col 1: FOR BUSINESS */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#8e004b] border-b border-[#e2d6d9] pb-1.5">
                For Business
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-[#594047]">
                <li>
                  <button onClick={() => setActiveTab('directory')} className="hover:text-[#8e004b] transition-colors text-left">
                    Distributor Directory
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalContent({
                      title: 'Become a Distributor / Seller',
                      icon: 'storefront',
                      content: (
                        <div className="space-y-4 text-xs md:text-sm text-[#594047]">
                          <p className="font-bold text-[#8e004b] text-sm">Grow your B2B wholesale business with Nexora India!</p>
                          <p>We connect authorized master distributors, importers, and cosmetic brands directly with over 15,000+ verified salons, premium beauty spas, and retail artists nationwide.</p>
                          <div className="bg-[#F0EDEC] p-3 rounded-lg space-y-1.5 border border-[#E8E8E8]">
                            <p className="font-bold text-[#1c1b1b] text-xs">📋 Requirements to Join:</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-stone-600">
                              <li>Valid GSTIN Registration Certificate</li>
                              <li>Brand Authorization Letters or Direct Import licenses</li>
                              <li>Wholesale bulk pricing structure & catalog</li>
                              <li>Fulfillment capability across region/pan-India</li>
                            </ul>
                          </div>
                          <p>To register your distribution house as an official seller partner, please send your details and catalog documents to <span className="font-bold text-[#8e004b] underline">partner@nexora.in</span> or call our merchant onboarding desk at <span className="font-bold">+91 22 4967 8000</span>.</p>
                        </div>
                      )
                    })}
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    Become a Distributor / Seller
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (onOpenDistributorProfile && DISTRIBUTORS_DATA.length > 0) {
                        onOpenDistributorProfile(DISTRIBUTORS_DATA[0]);
                      } else {
                        setActiveTab('directory');
                      }
                    }} 
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    Distributor Profile
                  </button>
                </li>
              </ul>
            </div>

            {/* Sub-col 2: SUPPORT */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#8e004b] border-b border-[#e2d6d9] pb-1.5">
                Support
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-[#594047]">
                <li>
                  <button 
                    onClick={() => setFooterModalContent({
                      title: 'Help & Support Desk',
                      icon: 'support_agent',
                      content: (
                        <div className="space-y-4 text-xs md:text-sm text-[#594047]">
                          <p className="font-bold text-[#8e004b] text-sm">Nexora B2B Help Desk & Dedicated Merchant Care</p>
                          <p>Whether you need help with batch codes, credit terms, automated GST invoicing, or order delivery tracking, our support specialists are available 7 days a week.</p>
                          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                            <div className="bg-[#F0EDEC] p-3 rounded-lg border border-[#E8E8E8]">
                              <p className="font-bold text-[#1c1b1b]">📞 Support Hotline</p>
                              <p className="text-[#8e004b] font-bold mt-1 text-xs">1800-309-8080</p>
                              <p className="text-[10px] text-stone-500">Toll-Free (9 AM - 8 PM)</p>
                            </div>
                            <div className="bg-[#F0EDEC] p-3 rounded-lg border border-[#E8E8E8]">
                              <p className="font-bold text-[#1c1b1b]">✉️ Email Query</p>
                              <p className="text-[#8e004b] font-bold mt-1 text-xs">support@nexora.in</p>
                              <p className="text-[10px] text-stone-500">Response within 2 hrs</p>
                            </div>
                          </div>
                          <p className="text-xs text-stone-500">Need immediate booking assistance? You can also message our WhatsApp Live Chat Assistant directly from individual distributor profile pages.</p>
                        </div>
                      )
                    })}
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    Help & Support
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalContent({
                      title: 'Contact Us',
                      icon: 'location_on',
                      content: (
                        <div className="space-y-4 text-xs md:text-sm text-[#594047]">
                          <p className="font-bold text-[#8e004b] text-sm">Nexora India HQ — Beauty Marketplace Solutions</p>
                          <div className="space-y-2">
                            <p className="font-bold text-[#1c1b1b]">📍 Corporate Office Address:</p>
                            <p className="bg-[#F0EDEC] p-3 text-xs leading-relaxed text-stone-600 border border-[#E8E8E8] rounded-xl">
                              Nexora Technologies Private Limited,<br />
                              Level 14, Supreme Business Park, Hiranandani Gardens,<br />
                              Powai, Mumbai, Maharashtra — 400076, India
                            </p>
                          </div>
                          <div className="space-y-1.5 text-xs text-stone-600">
                            <p>🌐 <span className="font-bold text-[#1c1b1b]">Corporate Website:</span> b2b.nexora.in</p>
                            <p>💼 <span className="font-bold text-[#1c1b1b]">Grievance Officer:</span> grievance@nexora.in</p>
                            <p>📞 <span className="font-bold text-[#1c1b1b]">CIN Number:</span> U74140MH2026PTC294150</p>
                          </div>
                        </div>
                      )
                    })}
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const notifyBtn = document.getElementById('notifications-btn');
                      if (notifyBtn) {
                        notifyBtn.click();
                      } else {
                        setFooterModalContent({
                          title: 'Notifications Hub',
                          icon: 'notifications_active',
                          content: (
                            <div className="space-y-3 text-xs md:text-sm text-[#594047]">
                              <p className="font-bold text-[#8e004b]">Stay Updated with Live Orders & Wholesale Offers</p>
                              <p>No new alerts at this moment. You will be notified here as soon as regional distributors release new clearance sales or flash discount codes.</p>
                            </div>
                          )
                        });
                      }
                    }} 
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    Notifications
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setFooterModalContent({
                      title: 'Salon Platform Settings',
                      icon: 'settings',
                      content: (
                        <div className="space-y-3 text-xs md:text-sm text-[#594047]">
                          <p className="font-bold text-[#8e004b]">Configure Your Merchant Interface</p>
                          <div className="bg-[#F0EDEC] p-4 rounded-xl border border-[#E8E8E8] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#1c1b1b]">GSTIN Auto-Validation</span>
                              <span className="text-green-600 font-bold">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                              <span className="font-bold text-[#1c1b1b]">Notification Sounds</span>
                              <span className="text-[#8e004b] font-bold">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                              <span className="font-bold text-[#1c1b1b]">Default Logistics Partner</span>
                              <span className="text-stone-600 font-bold">Delhivery B2B</span>
                            </div>
                          </div>
                          <p className="text-stone-500 text-xs">To edit billing credentials, business address lists, or owner profiles, please navigate to the <strong>My Profile</strong> tab.</p>
                        </div>
                      )
                    })}
                    className="hover:text-[#8e004b] transition-colors text-left"
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-[#e2d6d9] w-full" />

        {/* Bottom Bar Section */}
        <div className="w-full py-6 px-4 md:px-10 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-stone-500 font-bold">
          <div>
            © Nexora — All Rights Reserved. Verified GSTIN Network.
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFooterModalContent({
                title: 'Privacy Policy Summary',
                icon: 'gavel',
                content: (
                  <div className="space-y-4 text-xs md:text-sm text-[#594047]">
                    <p className="font-bold text-[#8e004b] text-sm">Nexora B2B Privacy Charter & Data Security Standards</p>
                    <p>We respect the commercial privacy of our salons and distributors. Your registered GST numbers, order logs, commercial volumes, and payment details are encrypted using banking-grade security.</p>
                    <div className="bg-[#F0EDEC] p-3 rounded-lg space-y-1.5 border border-[#E8E8E8] text-xs">
                      <p className="font-bold text-[#1c1b1b]">🔒 Key Protections:</p>
                      <ul className="list-disc pl-4 space-y-1 text-stone-600">
                        <li>No consumer tracking or selling of salon order history</li>
                        <li>PCI-DSS Compliant Payment Gateways</li>
                        <li>Encrypted communication with wholesale distribution partners</li>
                      </ul>
                    </div>
                    <p className="text-xs text-stone-500">For complete compliance policies regarding cookies, third-party logisticians, and regional warehouse access, contact privacy@nexora.in.</p>
                  </div>
                )
              })}
              className="hover:text-[#8e004b] transition-colors"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button 
              onClick={() => setFooterModalContent({
                title: 'Terms & Conditions Summary',
                icon: 'policy',
                content: (
                  <div className="space-y-4 text-xs md:text-sm text-[#594047]">
                    <p className="font-bold text-[#8e004b] text-sm">Nexora B2B Wholesale Platform Terms of Use</p>
                    <p>By purchasing bulk salon inventory or registering as an authorized distributor on Nexora, you agree to comply with our commercial trade standards.</p>
                    <div className="bg-[#F0EDEC] p-3 rounded-lg space-y-1.5 border border-[#E8E8E8] text-xs">
                      <p className="font-bold text-[#1c1b1b]">⚖️ Crucial Commercial Terms:</p>
                      <ul className="list-disc pl-4 space-y-1 text-stone-600">
                        <li>All listed prices are B2B wholesale rates; applicable GST is added at checkout</li>
                        <li>Anti-Counterfeit: All listed batches must come with valid regional distribution codes</li>
                        <li>Return policy limits credit adjustments within 7 working days of logistics receipt</li>
                      </ul>
                    </div>
                    <p className="text-xs text-stone-500">Please review complete legal trade practices under Indian Cosmetic Rules 2020 at terms.nexora.in before placing bulk high-value volume bookings.</p>
                  </div>
                )
              })}
              className="hover:text-[#8e004b] transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>

      {/* FLOATING BACK TO TOP BUTTON */}
      <button
        id="back-to-top-btn"
        onClick={scrollToTop}
        className={`fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 bg-[#8e004b] hover:bg-[#b90064] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-1.5 group border border-white/20 active:scale-95 ${
          showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        aria-label="Back to top"
        title="Scroll back to top"
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl group-hover:-translate-y-0.5 transition-transform">
          arrow_upward
        </span>
        <span className="text-xs font-extrabold tracking-wide hidden sm:inline">Back to Top</span>
      </button>

      {/* PREMIUM FOOTER INFORMATION DIALOG MODAL */}
      {footerModalContent && (
        <div className="fixed inset-0 bg-[#1c1b1b]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setFooterModalContent(null)}>
          <div 
            className="bg-[#FDF8F8] border border-[#8e004b]/30 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#8e004b] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl">{footerModalContent.icon}</span>
                <span className="font-bold text-sm tracking-wide uppercase">{footerModalContent.title}</span>
              </div>
              <button 
                onClick={() => setFooterModalContent(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-lg block">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {footerModalContent.content}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F0EDEC] border-t border-[#E8E8E8] flex justify-end">
              <button 
                onClick={() => setFooterModalContent(null)}
                className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs active:scale-95"
              >
                Okay, Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
