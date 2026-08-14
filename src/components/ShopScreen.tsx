import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { PRODUCTS_DATA, DISTRIBUTORS_DATA } from '../data/mockData';
import { Product, Distributor } from '../types';
import { ProductCompareModal } from './ProductCompareModal';

interface ShopScreenProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  selectedCategoryFilter?: string | null;
  selectedDistributorFilter?: Distributor | null;
  onSelectDistributor?: (distributor: Distributor) => void;
  onClearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  onOpenDistributorProfile?: (distributor: Distributor) => void;
  onBackToDirectory?: () => void;
}

export function ShopScreen({
  onSelectProduct,
  onAddToCart,
  selectedCategoryFilter,
  selectedDistributorFilter,
  onSelectDistributor,
  onClearFilters,
  searchQuery,
  setSearchQuery,
  wishlistIds = [],
  onToggleWishlist,
  onOpenDistributorProfile,
  onBackToDirectory,
}: ShopScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategoryFilter || 'All'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'new-arrivals' | 'margin'>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Advanced Search & Sidebar Filter States
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedMoq, setSelectedMoq] = useState<string>('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync selectedCategoryFilter prop when user clicks category from Home
  useEffect(() => {
    if (selectedCategoryFilter) {
      setActiveCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  // Extract unique brands and locations dynamically
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    PRODUCTS_DATA.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, []);

  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    DISTRIBUTORS_DATA.forEach((d) => {
      if (d.location) {
        // Extract city or location
        const cityMatch = d.location.split(',').pop()?.trim();
        if (cityMatch) locSet.add(cityMatch);
        locSet.add(d.location);
      }
    });
    return Array.from(locSet).sort();
  }, []);

  // Active Filter Count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'All') count++;
    if (selectedBrand !== 'All') count++;
    if (selectedLocation !== 'All') count++;
    if (selectedMoq !== 'All') count++;
    if (selectedDistributorFilter) count++;
    if (searchQuery) count++;
    return count;
  }, [activeCategory, selectedBrand, selectedLocation, selectedMoq, selectedDistributorFilter, searchQuery]);

  const handleResetAllFilters = () => {
    setActiveCategory('All');
    setSelectedBrand('All');
    setSelectedLocation('All');
    setSelectedMoq('All');
    setSearchQuery('');
    onClearFilters();
  };

  // Compare Feature States
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareToast, setCompareToast] = useState<string | null>(null);

  const categories = [
    'All',
    'Skincare',
    'Haircare',
    'Makeup',
    'Tools',
    'Furniture',
    'Fragrance',
    'Nails',
    'Tattoo Studio',
    'Spa',
    'Massage',
    'Salon Equipment',
    'Hair Color',
    'Professional Beauty Products',
  ];

  const selectedCompareProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => selectedCompareIds.includes(p.id));
  }, [selectedCompareIds]);

  const categoryDistributors = useMemo(() => {
    let dists = DISTRIBUTORS_DATA;
    if (activeCategory !== 'All') {
      dists = dists.filter((dist) =>
        dist.categories.some((cat) => {
          const c1 = cat.toLowerCase();
          const c2 = activeCategory.toLowerCase();
          return c1 === c2 || c1.includes(c2) || c2.includes(c1);
        })
      );
    }
    if (selectedLocation !== 'All') {
      dists = dists.filter((dist) =>
        dist.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        dist.state.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    return dists;
  }, [activeCategory, selectedLocation]);

  const handleToggleCompare = (e: MouseEvent, product: Product) => {
    e.stopPropagation();
    if (selectedCompareIds.includes(product.id)) {
      setSelectedCompareIds((prev) => prev.filter((id) => id !== product.id));
    } else {
      if (selectedCompareIds.length >= 3) {
        setCompareToast('You can compare up to 3 products at a time.');
        setTimeout(() => setCompareToast(null), 3000);
        return;
      }
      setSelectedCompareIds((prev) => [...prev, product.id]);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS_DATA.filter((prod) => {
      const matchCat =
        activeCategory === 'All' || prod.category === activeCategory;
      const matchDist =
        !selectedDistributorFilter ||
        prod.distributorId === selectedDistributorFilter.id;
      const matchSearch =
        !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Brand Filter
      const matchBrand =
        selectedBrand === 'All' || prod.brand === selectedBrand;

      // Location Filter
      const dist = DISTRIBUTORS_DATA.find((d) => d.id === prod.distributorId);
      const matchLocation =
        selectedLocation === 'All' ||
        (dist &&
          (dist.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
            dist.state.toLowerCase().includes(selectedLocation.toLowerCase())));

      // Minimum Order Quantity (MOQ) Filter
      let matchMoq = true;
      const moq = prod.minOrderQuantity || 1;
      if (selectedMoq === '1') {
        matchMoq = moq === 1;
      } else if (selectedMoq === '3') {
        matchMoq = moq <= 3;
      } else if (selectedMoq === '5') {
        matchMoq = moq <= 5;
      }

      return (
        matchCat &&
        matchDist &&
        matchSearch &&
        matchBrand &&
        matchLocation &&
        matchMoq
      );
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'new-arrivals') {
      list.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return b.rating - a.rating;
      });
    } else if (sortBy === 'margin') {
      list.sort((a, b) => b.salonMarginPercent - a.salonMarginPercent);
    }

    return list;
  }, [
    activeCategory,
    selectedDistributorFilter,
    searchQuery,
    selectedBrand,
    selectedLocation,
    selectedMoq,
    sortBy,
  ]);

  const handleQuickAdd = (e: MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const renderSidebarFilters = () => (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-4 space-y-5 shadow-2xs">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8e004b] text-xl">filter_alt</span>
          <h3 className="text-base font-bold text-[#1c1b1b]">Refine Catalog</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-[#8e004b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            id="reset-all-filters-sidebar-btn"
            onClick={handleResetAllFilters}
            className="text-xs text-[#8e004b] font-semibold hover:underline"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. Brand Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="brand-select-filter" className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm text-[#8e004b]">verified</span>
            <span>Brand</span>
          </label>
          {selectedBrand !== 'All' && (
            <button
              onClick={() => setSelectedBrand('All')}
              className="text-[11px] text-[#8e004b] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <select
          id="brand-select-filter"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-[#F0EDEC] hover:bg-[#ece7e7] border border-[#E8E8E8] focus:border-[#8e004b] text-xs font-semibold text-[#1c1b1b] rounded-xl p-2.5 transition-colors cursor-pointer appearance-none shadow-2xs"
        >
          <option value="All">All Brands ({availableBrands.length})</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1 mt-2.5">
          {availableBrands.slice(0, 5).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(selectedBrand === b ? 'All' : b)}
              className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                selectedBrand === b
                  ? 'bg-[#8e004b] text-white border-[#8e004b]'
                  : 'bg-[#F0EDEC] text-[#594047] border-transparent hover:border-[#8e004b]/30'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Distributor Location Filter */}
      <div className="pt-3 border-t border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="location-select-filter" className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm text-[#8e004b]">location_on</span>
            <span>Distributor Location</span>
          </label>
          {selectedLocation !== 'All' && (
            <button
              onClick={() => setSelectedLocation('All')}
              className="text-[11px] text-[#8e004b] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <select
          id="location-select-filter"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-[#F0EDEC] hover:bg-[#ece7e7] border border-[#E8E8E8] focus:border-[#8e004b] text-xs font-semibold text-[#1c1b1b] rounded-xl p-2.5 transition-colors cursor-pointer appearance-none shadow-2xs"
        >
          <option value="All">All Direct Wholesale Hubs</option>
          <option value="Mumbai">Mumbai Hubs</option>
          <option value="New Delhi">New Delhi Hubs</option>
          <option value="Bengaluru">Bengaluru Hubs</option>
          <option value="Hyderabad">Hyderabad Hubs</option>
          <option value="Pune">Pune Hubs</option>
          {availableLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1 mt-2.5">
          {['Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedLocation(selectedLocation === city ? 'All' : city)}
              className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                selectedLocation === city
                  ? 'bg-[#8e004b] text-white border-[#8e004b]'
                  : 'bg-[#F0EDEC] text-[#594047] border-transparent hover:border-[#8e004b]/30'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Minimum Order Quantity (MOQ) Filter */}
      <div className="pt-3 border-t border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm text-[#8e004b]">inventory_2</span>
            <span>Min Order Quantity (MOQ)</span>
          </label>
          {selectedMoq !== 'All' && (
            <button
              onClick={() => setSelectedMoq('All')}
              className="text-[11px] text-[#8e004b] font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {[
            { id: 'All', label: 'Any MOQ (All Bulk Tiers)' },
            { id: '1', label: 'Single Unit Allowed (MOQ = 1)' },
            { id: '3', label: 'Low MOQ (≤ 3 Units)' },
            { id: '5', label: 'Medium MOQ (≤ 5 Units)' },
          ].map((moqOpt) => (
            <label
              key={moqOpt.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                selectedMoq === moqOpt.id
                  ? 'bg-[#FDE7F3] text-[#8e004b] border-[#8e004b]/40 font-bold shadow-2xs'
                  : 'bg-[#F0EDEC] text-[#1c1b1b] border-transparent hover:bg-[#ece7e7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="moq-filter"
                  checked={selectedMoq === moqOpt.id}
                  onChange={() => setSelectedMoq(moqOpt.id)}
                  className="accent-[#8e004b]"
                />
                <span>{moqOpt.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Pro Tip Callout */}
      <div className="bg-[#FDE7F3]/50 p-3 rounded-xl border border-[#ffd9e2] text-[11px] text-[#594047] leading-relaxed">
        <span className="font-bold text-[#8e004b] block mb-0.5">💡 Salon Owner Tip:</span>
        Select nearby distributor locations to minimize shipping lead time for express replenishment.
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
      {selectedDistributorFilter && (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <img
              src={selectedDistributorFilter.logo}
              alt={selectedDistributorFilter.name}
              className="w-12 h-12 rounded-xl object-cover border border-stone-200"
            />
            <div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenDistributorProfile) {
                    onOpenDistributorProfile(selectedDistributorFilter);
                  }
                }}
                className="font-bold text-base text-[#1c1b1b] hover:text-[#8e004b] text-left transition-colors flex items-center gap-1 group/title"
              >
                <span>{selectedDistributorFilter.name}</span>
                <span className="material-symbols-outlined text-sm text-[#8e004b] group-hover/title:translate-x-0.5 transition-transform">open_in_new</span>
              </button>
              <p className="text-xs text-[#594047] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-xs text-[#8e004b]">location_on</span>
                <span>{selectedDistributorFilter.location} • ⭐ {selectedDistributorFilter.rating} ({selectedDistributorFilter.reviewsCount} reviews)</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onBackToDirectory && (
              <button
                type="button"
                onClick={onBackToDirectory}
                className="flex-1 sm:flex-initial px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-stone-200"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Directory</span>
              </button>
            )}
            {onOpenDistributorProfile && (
              <button
                type="button"
                onClick={() => onOpenDistributorProfile(selectedDistributorFilter)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-[#8e004b] hover:bg-[#a00055] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">store</span>
                <span>View Profile</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FDE7F3] text-[#8e004b] text-xs font-semibold rounded-full mb-1">
            <span>Wholesale & Bulk Salon Catalog</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1c1b1b]">
            Professional Beauty Catalog
          </h1>
          <p className="text-xs md:text-sm text-[#594047] mt-0.5">
            Showing {filteredProducts.length} verified products with direct wholesale tier pricing
          </p>
        </div>

        {/* Filter / Sort dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="shop-sort-select" className="text-xs font-semibold text-[#594047] whitespace-nowrap flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-[#8e004b]">swap_vert</span>
            <span>Sort By:</span>
          </label>
          <div className="relative flex-1 md:w-56">
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#F0EDEC] hover:bg-[#ece7e7] border border-[#E8E8E8] focus:border-[#8e004b] text-xs md:text-sm font-semibold text-[#1c1b1b] rounded-xl py-2.5 pl-3.5 pr-8 transition-colors cursor-pointer appearance-none shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#8e004b]/20"
            >
              <option value="featured">Featured / Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="new-arrivals">New Arrivals</option>
              <option value="margin">Highest Salon Margin %</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#594047]">
              <span className="material-symbols-outlined text-base">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Filter Button Bar */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E8E8E8] shadow-2xs">
        <button
          id="mobile-toggle-filters-btn"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex items-center gap-2 text-xs font-bold text-[#8e004b] bg-[#FDE7F3] px-3.5 py-2 rounded-xl border border-[#8e004b]/30 hover:bg-[#8e004b] hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-base">filter_list</span>
          <span>{isMobileFilterOpen ? 'Hide Filters' : 'Filter Options'} {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
        </button>
        <span className="text-xs text-[#594047] font-semibold">
          {filteredProducts.length} Products Found
        </span>
      </div>

      {/* Mobile Collapsible Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden mb-6 animate-fade-in">
          {renderSidebarFilters()}
        </div>
      )}

      {/* Active Filter Chips */}
      {(selectedDistributorFilter || searchQuery || activeCategory !== 'All' || selectedBrand !== 'All' || selectedLocation !== 'All' || selectedMoq !== 'All') && (
        <div className="bg-[#FDE7F3]/60 p-3 rounded-xl border border-[#ffd9e2] mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#8e004b]">Active Filters:</span>
          {activeCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Category: {activeCategory}</span>
              <button onClick={() => setActiveCategory('All')} className="hover:text-red-600 ml-1 font-bold">×</button>
            </span>
          )}
          {selectedBrand !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Brand: {selectedBrand}</span>
              <button onClick={() => setSelectedBrand('All')} className="hover:text-red-600 ml-1 font-bold">×</button>
            </span>
          )}
          {selectedLocation !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Location: {selectedLocation}</span>
              <button onClick={() => setSelectedLocation('All')} className="hover:text-red-600 ml-1 font-bold">×</button>
            </span>
          )}
          {selectedMoq !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>MOQ: {selectedMoq === '1' ? 'Single Unit' : selectedMoq === '3' ? '≤ 3 Units' : '≤ 5 Units'}</span>
              <button onClick={() => setSelectedMoq('All')} className="hover:text-red-600 ml-1 font-bold">×</button>
            </span>
          )}
          {selectedDistributorFilter && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Distributor: {selectedDistributorFilter.name}</span>
              <button onClick={onClearFilters} className="hover:text-red-600 ml-1 font-bold">×</button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Search: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-red-600 ml-1 font-bold">×</button>
            </span>
          )}
          <button
            onClick={handleResetAllFilters}
            className="text-xs text-[#8e004b] underline font-semibold ml-auto"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Main Two-Column Layout (Sidebar + Catalog) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 hidden lg:block">
          {renderSidebarFilters()}
        </aside>

        {/* Main Content Catalog Column */}
        <main className="flex-1 min-w-0">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
            {categories.map((cat) => (
              <button
                id={`shop-category-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#8e004b] text-white shadow-sm'
                    : 'bg-[#F0EDEC] text-[#594047] hover:bg-[#ece7e7] hover:text-[#8e004b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#F0EDEC] rounded-2xl border border-[#E8E8E8]">
              <span className="material-symbols-outlined text-4xl text-[#594047] mb-2">
                search_off
              </span>
              <h3 className="text-lg font-bold text-[#1c1b1b]">No Products Found</h3>
              <p className="text-xs text-[#594047] mt-1 max-w-md mx-auto">
                No beauty products match your selected brand, location, MOQ, or category filters.
              </p>
              <button
                onClick={handleResetAllFilters}
                className="mt-4 bg-[#8e004b] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#b90064] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-5">
              {filteredProducts.map((product) => (
                <div
                  id={`shop-product-${product.id}`}
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#8e004b]/50 hover:shadow-lg transition-all duration-200 p-3 md:p-4 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative w-full aspect-square rounded-xl bg-[#fdf8f8] overflow-hidden mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isNew && (
                        <span className="absolute top-2 left-2 bg-[#FDE7F3] text-[#8e004b] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#8e004b]/20">
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
                      id={`shop-wishlist-toggle-${product.id}`}
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

                  {/* Compare Toggle Button */}
                  <button
                    id={`shop-compare-toggle-${product.id}`}
                    onClick={(e) => handleToggleCompare(e, product)}
                    className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md transition-all z-10 flex items-center gap-1 active:scale-95 ${
                      selectedCompareIds.includes(product.id)
                        ? 'bg-[#8e004b] text-white shadow-xs ring-1 ring-white/50'
                        : 'bg-white/90 hover:bg-white text-[#1c1b1b] border border-black/10 shadow-2xs'
                    }`}
                    title="Add to comparison"
                  >
                    <span className="material-symbols-outlined text-[12px] leading-none">
                      {selectedCompareIds.includes(product.id) ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span>{selectedCompareIds.includes(product.id) ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                    {product.salonMarginPercent}% Salon Margin
                  </span>
                </div>

                {/* Info */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e004b]">
                  {product.category}
                </span>
                <h3 className="text-sm md:text-base font-bold text-[#1c1b1b] line-clamp-1 group-hover:text-[#8e004b] transition-colors mt-0.5">
                  {product.name}
                </h3>
                <p className="text-xs text-[#594047] truncate">{product.brand}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const matchedDist = DISTRIBUTORS_DATA.find(
                      (d) => d.id === product.distributorId || d.name === product.distributorName
                    );
                    if (matchedDist && onOpenDistributorProfile) {
                      onOpenDistributorProfile(matchedDist);
                    }
                  }}
                  className="text-[11px] text-[#0150d6] hover:text-[#8e004b] hover:underline font-bold truncate mt-1 text-left block w-full focus:outline-none"
                  title={`View ${product.distributorName} Profile`}
                >
                  By {product.distributorName}
                </button>

                {/* Bulk Tiers indicator */}
                <div className="bg-[#F0EDEC] p-2 rounded-lg mt-2 text-[10px] text-[#594047] flex justify-between items-center">
                  <span>Bulk Tier:</span>
                  <span className="font-semibold text-[#8e004b]">
                    Up to {product.bulkTiers[product.bulkTiers.length - 1].discountPercent}% off
                  </span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 mt-3 border-t border-[#E8E8E8] flex justify-between items-center">
                <div>
                  <span className="text-sm md:text-base font-bold text-[#8e004b]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-[#594047] line-through block">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  id={`shop-add-btn-${product.id}`}
                  onClick={(e) => handleQuickAdd(e, product)}
                  className={`p-2 md:p-2.5 rounded-xl transition-all active:scale-90 flex items-center justify-center ${
                    addedProductId === product.id
                      ? 'bg-green-600 text-white'
                      : 'bg-[#8e004b] hover:bg-[#b90064] text-white shadow-xs'
                  }`}
                  title="Add to Bag"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">
                    {addedProductId === product.id ? 'check' : 'add_shopping_cart'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </main>
      </div>

      {/* Verified Category Distributors & Suppliers Section */}
      {categoryDistributors.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#E8E8E8]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FDE7F3] text-[#8e004b] text-[11px] font-bold rounded-full mb-1">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Verified Direct Wholesale Partners</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1c1b1b]">
                {activeCategory === 'All'
                  ? 'Verified Beauty Distributors & Suppliers'
                  : `Verified ${activeCategory} Distributors & Shops`}
              </h2>
              <p className="text-xs md:text-sm text-[#594047] mt-0.5">
                Authorized GSTIN distributors providing genuine {activeCategory === 'All' ? 'beauty products' : activeCategory} with wholesale pricing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categoryDistributors.map((dist) => (
              <div
                key={dist.id}
                id={`distributor-card-${dist.id}`}
                className="bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#8e004b]/50 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={dist.logo}
                      alt={dist.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8E8E8]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#1c1b1b] truncate group-hover:text-[#8e004b] transition-colors">
                          {dist.name}
                        </h3>
                        {dist.verifiedGst && (
                          <span className="material-symbols-outlined text-[#8e004b] text-base shrink-0" title="Verified GSTIN">
                            verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#594047] flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-xs text-[#8e004b]">location_on</span>
                        <span>{dist.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Rating & Details */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#594047] mb-3">
                    <span className="flex items-center gap-1 font-bold text-[#1c1b1b]">
                      <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                      <span>{dist.rating}</span>
                      <span className="font-normal text-[#594047]">({dist.reviewsCount})</span>
                    </span>
                    <span>•</span>
                    <span className="bg-[#F0EDEC] text-[#594047] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Min Order: ₹{dist.minOrderValue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Categories badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dist.categories.map((c) => (
                      <span
                        key={c}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.toLowerCase() === activeCategory.toLowerCase()
                            ? 'bg-[#8e004b] text-white border-[#8e004b]'
                            : 'bg-[#F0EDEC] text-[#594047] border-transparent'
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between">
                  <span className="text-[11px] text-[#594047] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#8e004b]">local_shipping</span>
                    <span>{dist.deliveryTime}</span>
                  </span>
                  {onSelectDistributor && (
                    <button
                      onClick={() => onSelectDistributor(dist)}
                      className="text-xs font-bold text-[#8e004b] hover:text-[#b90064] flex items-center gap-1 group-hover:underline"
                    >
                      <span>View Shop</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compare Limit Toast Notification */}
      {compareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1c1b1b] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl border border-white/20 flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-amber-400 text-base">info</span>
          <span>{compareToast}</span>
        </div>
      )}

      {/* Floating Bottom Compare Bar */}
      {selectedCompareIds.length > 0 && (
        <div
          id="floating-compare-bar"
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-[#1c1b1b] text-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/10 flex items-center justify-between gap-3 animate-fade-in backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="bg-[#8e004b] text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs">
              Compare ({selectedCompareIds.length}/3)
            </span>
            <div className="flex items-center -space-x-2 overflow-hidden">
              {selectedCompareProducts.map((p) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  className="w-8 h-8 rounded-lg object-cover border-2 border-[#1c1b1b] bg-white shadow-xs"
                  title={p.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="clear-compare-bar-btn"
              onClick={() => setSelectedCompareIds([])}
              className="text-stone-400 hover:text-white text-xs font-semibold px-2 py-1 transition-colors"
            >
              Clear
            </button>
            <button
              id="open-compare-modal-btn"
              onClick={() => setIsCompareModalOpen(true)}
              className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">compare_arrows</span>
              <span>Compare Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Comparison Side-by-Side Modal */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={selectedCompareProducts}
        onRemoveFromCompare={(prodId) => {
          setSelectedCompareIds((prev) => prev.filter((id) => id !== prodId));
        }}
        onAddToCart={(prod, qty) => {
          onAddToCart(prod, qty);
        }}
        onClearAll={() => {
          setSelectedCompareIds([]);
          setIsCompareModalOpen(false);
        }}
      />
    </div>
  );
}
