import { useState, useMemo, useEffect } from 'react';
import { DISTRIBUTORS_DATA, PRODUCTS_DATA } from '../data/mockData';
import { Distributor } from '../types';

interface DirectoryScreenProps {
  onSelectDistributor: (distributor: Distributor) => void;
  onRequestQuote: (distributor: Distributor) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenDistributorProfile?: (distributor: Distributor) => void;
  initialCity?: string;
  initialCategory?: string;
  setInitialCity?: (city: string) => void;
  setInitialCategory?: (category: string) => void;
  verifiedOnly?: boolean;
  setVerifiedOnly?: (val: boolean) => void;
  minRating?: number;
  setMinRating?: (val: number) => void;
  onClearFilters?: () => void;
}

export function DirectoryScreen({
  onSelectDistributor,
  onRequestQuote,
  searchQuery,
  setSearchQuery,
  onOpenDistributorProfile,
  initialCity = 'All',
  initialCategory = 'All',
  setInitialCity,
  setInitialCategory,
  verifiedOnly: propVerifiedOnly,
  setVerifiedOnly: propSetVerifiedOnly,
  minRating: propMinRating,
  setMinRating: propSetMinRating,
  onClearFilters,
}: DirectoryScreenProps) {
  const [localCity, setLocalCity] = useState<string>(initialCity);
  const [localCategory, setLocalCategory] = useState<string>(initialCategory);
  const [localVerifiedOnly, setLocalVerifiedOnly] = useState<boolean>(false);
  const [localMinRating, setLocalMinRating] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const selectedCity = setInitialCity ? initialCity : localCity;
  const setSelectedCity = setInitialCity || setLocalCity;

  const selectedCategory = setInitialCategory ? initialCategory : localCategory;
  const setSelectedCategory = setInitialCategory || setLocalCategory;

  const verifiedOnly = propSetVerifiedOnly !== undefined ? propVerifiedOnly : localVerifiedOnly;
  const setVerifiedOnly = propSetVerifiedOnly || setLocalVerifiedOnly;

  const minRating = propMinRating !== undefined ? propMinRating : localMinRating;
  const setMinRating = propSetMinRating || setLocalMinRating;

  // Sync props to state if modified
  useEffect(() => {
    if (!setInitialCity) {
      setLocalCity(initialCity);
    }
  }, [initialCity, setInitialCity]);

  useEffect(() => {
    if (!setInitialCategory) {
      setLocalCategory(initialCategory);
    }
  }, [initialCategory, setInitialCategory]);

  const cities = ['Delhi', 'Mumbai', 'Jaipur', 'Ahmedabad', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune'];
  const categories = [
    'Skincare',
    'Haircare',
    'Hair Color',
    'Makeup',
    'Nails',
    'Spa',
    'Massage',
    'Tattoo Studio',
    'Salon Equipment',
    'Professional Beauty Products'
  ];

  const handleClearAll = () => {
    setSelectedCity('All');
    setSelectedCategory('All');
    setVerifiedOnly(false);
    setMinRating(0);
    if (onClearFilters) onClearFilters();
  };

  const filteredDistributors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // 1. Filter matching distributors
    const filtered = DISTRIBUTORS_DATA.filter((dist) => {
      // Robust city matching
      const matchCity =
        selectedCity === 'All' ||
        dist.state.toLowerCase().includes(selectedCity.toLowerCase()) ||
        dist.location.toLowerCase().includes(selectedCity.toLowerCase()) ||
        (selectedCity === 'Delhi' && dist.state === 'Delhi NCR') ||
        (selectedCity === 'Mumbai' && dist.state === 'Maharashtra') ||
        (selectedCity === 'Pune' && dist.state === 'Maharashtra');

      // Robust category matching (case insensitive)
      const matchCat =
        selectedCategory === 'All' ||
        dist.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());

      // Verified matching
      const matchVerified = !verifiedOnly || dist.verifiedGst === true;

      // Rating matching
      const matchRating = dist.rating >= minRating;

      // Match products sold by this distributor
      const hasMatchingProduct = !query || PRODUCTS_DATA.some(
        (p) =>
          p.distributorId === dist.id &&
          (p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query))
      );

      // Match distributor's details
      const matchSearch =
        !query ||
        dist.name.toLowerCase().includes(query) ||
        dist.brands.some((b) => b.toLowerCase().includes(query)) ||
        dist.categories.some((c) => c.toLowerCase().includes(query)) ||
        dist.location.toLowerCase().includes(query) ||
        hasMatchingProduct;

      return matchCity && matchCat && matchVerified && matchRating && matchSearch;
    });

    // 2. Map with relevance scores and Sort
    return filtered
      .map((dist) => {
        let relevanceScore = 0;
        if (query) {
          // a. Distributor name match strength
          if (dist.name.toLowerCase() === query) {
            relevanceScore += 500;
          } else if (dist.name.toLowerCase().startsWith(query)) {
            relevanceScore += 300;
          } else if (dist.name.toLowerCase().includes(query)) {
            relevanceScore += 150;
          }

          // b. Brands match strength
          const matchingBrands = dist.brands.filter((b) => b.toLowerCase().includes(query));
          if (matchingBrands.length > 0) {
            const hasExactBrand = matchingBrands.some((b) => b.toLowerCase() === query);
            const hasStartBrand = matchingBrands.some((b) => b.toLowerCase().startsWith(query));
            relevanceScore += hasExactBrand ? 200 : hasStartBrand ? 120 : 60;
          }

          // c. Categories match strength
          const matchingCategories = dist.categories.filter((c) => c.toLowerCase().includes(query));
          if (matchingCategories.length > 0) {
            const hasExactCategory = matchingCategories.some((c) => c.toLowerCase() === query);
            relevanceScore += hasExactCategory ? 100 : 40;
          }

          // d. Products match strength
          const matchingProducts = PRODUCTS_DATA.filter(
            (p) =>
              p.distributorId === dist.id &&
              (p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query))
          );
          if (matchingProducts.length > 0) {
            const exactProductMatch = matchingProducts.some(
              (p) => p.name.toLowerCase() === query || p.brand.toLowerCase() === query
            );
            relevanceScore += exactProductMatch ? 150 : 80;
          }

          // e. Location match strength
          if (
            dist.location.toLowerCase().includes(query) ||
            dist.state.toLowerCase().includes(query)
          ) {
            relevanceScore += 30;
          }
        }

        return { dist, relevanceScore };
      })
      .sort((a, b) => {
        if (query) {
          // Primary sort by search relevance score first
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
        }

        // Secondary sort (or primary sort when no query):
        // 1. Verified distributors first
        if (a.dist.verifiedGst !== b.dist.verifiedGst) {
          return a.dist.verifiedGst ? -1 : 1;
        }

        // 2. Rating descending
        if (b.dist.rating !== a.dist.rating) {
          return b.dist.rating - a.dist.rating;
        }

        // 3. ReviewsCount descending (popularity measure)
        return b.dist.reviewsCount - a.dist.reviewsCount;
      })
      .map((item) => item.dist);
  }, [selectedCity, selectedCategory, verifiedOnly, minRating, searchQuery]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDE7F3] text-[#8e004b] text-xs font-semibold rounded-full mb-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Verified GSTIN & Authorized Distribution Partners</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1c1b1b]">
            Beauty Distributor Directory
          </h1>
          <p className="text-sm text-[#594047] mt-1 font-medium">
            अपने शहर और category के अनुसार trusted beauty distributors खोजें।
          </p>
        </div>
        {(selectedCity !== 'All' || selectedCategory !== 'All' || verifiedOnly || minRating > 0) && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8e004b]/10 hover:bg-[#8e004b] text-[#8e004b] hover:text-white border border-[#8e004b]/20 rounded-xl transition-all text-xs font-bold self-start md:self-end"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Grid Layout: Sidebar on Desktop, Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-2xs self-start sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EDEC] mb-5">
            <h2 className="font-bold text-[#1c1b1b] flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-stone-600 text-lg">filter_alt</span>
              <span>Filter Options</span>
            </h2>
            {(selectedCity !== 'All' || selectedCategory !== 'All' || verifiedOnly || minRating > 0) && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#8e004b] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter by City */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2.5">
              City / Location
            </label>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCity('All')}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCity === 'All'
                    ? 'bg-[#8e004b] text-white shadow-xs'
                    : 'bg-[#FDF8F8] text-[#1c1b1b] hover:bg-[#FDE7F3] hover:text-[#8e004b]'
                }`}
              >
                <span>All Cities</span>
                {selectedCity === 'All' && <span className="material-symbols-outlined text-sm">check</span>}
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  id={`filter-city-desktop-${city.toLowerCase()}`}
                  onClick={() => setSelectedCity(city)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCity === city
                      ? 'bg-[#8e004b] text-white shadow-xs'
                      : 'bg-[#FDF8F8] text-[#1c1b1b] hover:bg-[#FDE7F3] hover:text-[#8e004b]'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Category */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2.5">
              Beauty Category
            </label>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#8e004b] text-white shadow-xs'
                    : 'bg-[#FDF8F8] text-[#1c1b1b] hover:bg-[#FDE7F3] hover:text-[#8e004b]'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'All' && <span className="material-symbols-outlined text-sm">check</span>}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-category-desktop-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#8e004b] text-white shadow-xs'
                      : 'bg-[#FDF8F8] text-[#1c1b1b] hover:bg-[#FDE7F3] hover:text-[#8e004b]'
                  }`}
                >
                  <span className="truncate pr-1">{cat}</span>
                  {selectedCategory === cat && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Verified toggle */}
          <div className="mb-6 pb-5 border-b border-[#F0EDEC]">
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2.5">
              Verification Status
            </label>
            <button
              id="filter-verified-toggle-desktop"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all ${
                verifiedOnly
                  ? 'bg-[#FDE7F3] border-[#8e004b]/30 text-[#8e004b] font-bold'
                  : 'bg-white border-[#E8E8E8] text-[#1c1b1b] hover:bg-[#FDF8F8]'
              }`}
            >
              <span className="text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base">verified</span>
                Verified Only
              </span>
              <span className="material-symbols-outlined text-base">
                {verifiedOnly ? 'toggle_on' : 'toggle_off'}
              </span>
            </button>
          </div>

          {/* Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2.5">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 4.0, 4.5].map((val) => (
                <button
                  key={val}
                  id={`filter-rating-desktop-${val}`}
                  onClick={() => setMinRating(val)}
                  className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-0.5 transition-all ${
                    minRating === val
                      ? 'bg-[#1c1b1b] border-[#1c1b1b] text-white'
                      : 'bg-white border-[#E8E8E8] text-[#1c1b1b] hover:bg-[#FDF8F8]'
                  }`}
                >
                  {val === 0 ? (
                    <span>Any</span>
                  ) : (
                    <>
                      <span>{val}+</span>
                      <span className="material-symbols-outlined text-[11px] text-amber-500 fill-amber-500">star</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area (Search + Active Filter Pills + Grid) */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Prominent Search Bar */}
          <div className="bg-[#F0EDEC] p-4 rounded-xl border border-[#E8E8E8] mb-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                search
              </span>
              <input
                id="directory-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Distributor, Business या Product खोजें"
                className="w-full bg-white border border-[#E8E8E8] rounded-xl py-3 pl-11 pr-4 text-sm text-[#1c1b1b] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8e004b]/20 focus:border-[#8e004b] shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Mobile Filter Button and Active Pills Row */}
          <div className="lg:hidden flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E8E8] hover:bg-stone-50 text-[#1c1b1b] rounded-xl text-xs font-bold shadow-xs flex-1 justify-center"
              >
                <span className="material-symbols-outlined text-base">filter_alt</span>
                <span>Filter & Sort Options</span>
                {(selectedCity !== 'All' || selectedCategory !== 'All' || verifiedOnly || minRating > 0) && (
                  <span className="inline-flex items-center justify-center bg-[#8e004b] text-white text-[10px] w-5 h-5 rounded-full font-bold">
                    {[
                      selectedCity !== 'All',
                      selectedCategory !== 'All',
                      verifiedOnly,
                      minRating > 0
                    ].filter(Boolean).length}
                  </span>
                )}
              </button>
              
              {(selectedCity !== 'All' || selectedCategory !== 'All' || verifiedOnly || minRating > 0) && (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#1c1b1b] text-xs font-bold rounded-xl border border-stone-200"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Scrollable quick chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
              {selectedCity !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8e004b]/10 text-xs font-bold text-[#8e004b] rounded-full whitespace-nowrap">
                  <span>{selectedCity}</span>
                  <button onClick={() => setSelectedCity('All')} className="material-symbols-outlined text-[10px] leading-none">close</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8e004b]/10 text-xs font-bold text-[#8e004b] rounded-full whitespace-nowrap">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')} className="material-symbols-outlined text-[10px] leading-none">close</button>
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8e004b]/10 text-xs font-bold text-[#8e004b] rounded-full whitespace-nowrap">
                  <span>Verified Only</span>
                  <button onClick={() => setVerifiedOnly(false)} className="material-symbols-outlined text-[10px] leading-none">close</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8e004b]/10 text-xs font-bold text-[#8e004b] rounded-full whitespace-nowrap">
                  <span>{minRating}+ ★</span>
                  <button onClick={() => setMinRating(0)} className="material-symbols-outlined text-[10px] leading-none">close</button>
                </span>
              )}
            </div>
          </div>

          {/* Active Filter Pills (Desktop Only) */}
          <div className="hidden lg:block">
            {(selectedCity !== 'All' || selectedCategory !== 'All' || verifiedOnly || minRating > 0) && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-stone-100 p-3 rounded-xl border border-stone-200/50">
                <span className="text-xs font-bold text-[#594047] mr-1">Active Filters:</span>
                {selectedCity !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E8E8] text-xs font-semibold text-[#1c1b1b] rounded-full shadow-2xs">
                    <span>City: {selectedCity}</span>
                    <button
                      onClick={() => setSelectedCity('All')}
                      className="hover:bg-stone-100 p-0.5 rounded-full inline-flex items-center justify-center text-[#8e004b]"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E8E8] text-xs font-semibold text-[#1c1b1b] rounded-full shadow-2xs">
                    <span>Category: {selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="hover:bg-stone-100 p-0.5 rounded-full inline-flex items-center justify-center text-[#8e004b]"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E8E8] text-xs font-semibold text-[#1c1b1b] rounded-full shadow-2xs">
                    <span>Verified Only</span>
                    <button
                      onClick={() => setVerifiedOnly(false)}
                      className="hover:bg-stone-100 p-0.5 rounded-full inline-flex items-center justify-center text-[#8e004b]"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E8E8] text-xs font-semibold text-[#1c1b1b] rounded-full shadow-2xs">
                    <span className="flex items-center gap-0.5">
                      Rating: {minRating}+ <span className="material-symbols-outlined text-xs text-amber-500 fill-amber-500">star</span>
                    </span>
                    <button
                      onClick={() => setMinRating(0)}
                      className="hover:bg-stone-100 p-0.5 rounded-full inline-flex items-center justify-center text-[#8e004b]"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-[#8e004b] hover:underline ml-auto pl-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Distributors Listing Grid */}
          {filteredDistributors.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-3xl border border-[#E8E8E8] p-8">
              <div className="w-16 h-16 bg-[#FDF8F8] text-[#8e004b] rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">search_off</span>
              </div>
              <h3 className="text-lg font-bold text-[#1c1b1b] mb-1">No distributors found</h3>
              <p className="text-sm text-[#594047] max-w-md mb-6">
                We couldn't find any beauty distributors matching your current search query and filter selections.
              </p>
              <button
                onClick={handleClearAll}
                className="px-5 py-2.5 bg-[#8e004b] hover:bg-[#a00055] text-white text-xs font-bold rounded-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredDistributors.map((dist) => (
          <div
            id={`distributor-card-${dist.id}`}
            key={dist.id}
            className="bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#8e004b]/60 transition-all hover:shadow-lg p-5 flex flex-col justify-between"
          >
            <div
              onClick={() => {
                if (onOpenDistributorProfile) {
                  onOpenDistributorProfile(dist);
                } else {
                  onSelectDistributor(dist);
                }
              }}
              className="cursor-pointer group/card"
              title={`Click to view ${dist.name} Profile`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={dist.logo}
                    alt={dist.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E8E8E8] group-hover/card:border-[#8e004b]/40 transition-colors bg-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#1c1b1b] leading-tight group-hover/card:text-[#8e004b] transition-colors">
                      {dist.name}
                    </h3>
                    <p className="text-xs text-[#594047] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs text-[#8e004b]">location_on</span>
                      <span>{dist.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-amber-500 text-xs">star</span>
                    <span>{dist.rating}</span>
                  </div>
                  <span className="text-[10px] text-[#594047] mt-0.5">{dist.reviewsCount} reviews</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#594047] line-clamp-2 mb-3">
                {dist.description}
              </p>

              {/* Badges / Specs */}
              <div className="grid grid-cols-2 gap-2 bg-[#F0EDEC] p-3 rounded-xl text-xs mb-4">
                <div>
                  <span className="text-[10px] text-[#594047] block">Min Order Value</span>
                  <span className="font-bold text-[#1c1b1b]">₹{dist.minOrderValue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#594047] block">Delivery SLA</span>
                  <span className="font-bold text-[#0150d6] truncate block">{dist.deliveryTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#594047] block">GST Number</span>
                  <span className="font-mono text-[11px] font-semibold text-[#1c1b1b]">{dist.gstNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#594047] block">Experience</span>
                  <span className="font-bold text-[#1c1b1b]">{dist.yearsInBusiness} Years Verified</span>
                </div>
              </div>

              {/* Brands Supplied */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#594047] block mb-1">
                  Brands Supplied:
                </span>
                <div className="flex flex-wrap gap-1">
                  {dist.brands.map((brand) => (
                    <span
                      key={brand}
                      className="bg-[#FDE7F3] text-[#8e004b] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#8e004b]/10"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#E8E8E8] flex flex-wrap items-center gap-2">
              <button
                type="button"
                id={`profile-reels-btn-${dist.id}`}
                onClick={() => {
                  if (onOpenDistributorProfile) {
                    onOpenDistributorProfile(dist);
                  } else {
                    onSelectDistributor(dist);
                  }
                }}
                className="w-full bg-[#1c1b1b] hover:bg-[#2d1b24] text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm text-[#ffcbd9]">store</span>
                <span>View Distributor Profile</span>
              </button>

              <button
                id={`whatsapp-btn-${dist.id}`}
                onClick={() => {
                  window.open(
                    `https://wa.me/${dist.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                      dist.name
                    )},%20I%20am%20a%20salon%20owner%20reaching%20out%20via%20Nexora%20for%20wholesale%20rates.`,
                    '_blank'
                  );
                }}
                className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-xs py-2 px-3 rounded-lg border border-[#25D366]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>WhatsApp</span>
              </button>

              <button
                id={`quote-btn-${dist.id}`}
                onClick={() => onRequestQuote(dist)}
                className="flex-1 bg-[#8e004b] hover:bg-[#b90064] text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">request_quote</span>
                <span>Request Quote</span>
              </button>

              <button
                id={`catalog-btn-${dist.id}`}
                onClick={() => onSelectDistributor(dist)}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                title="View Catalog Products"
              >
                <span className="material-symbols-outlined text-sm">shopping_bag</span>
                <span>View Products</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  {/* Mobile Filter Drawer (Bottom Sheet style) */}
  {isMobileFilterOpen && (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileFilterOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer wrapper */}
      <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 transform translate-y-0 border-t border-[#E8E8E8]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDEC] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-stone-700">filter_list</span>
            <h3 className="font-bold text-[#1c1b1b] text-base">Filter Distributors</h3>
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* City Select */}
          <div>
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2">
              City / Location
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCity('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCity === 'All'
                    ? 'bg-[#8e004b] text-white'
                    : 'bg-[#F0EDEC] text-[#594047]'
                }`}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  id={`filter-city-mobile-${city.toLowerCase()}`}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCity === city
                      ? 'bg-[#8e004b] text-white'
                      : 'bg-[#F0EDEC] text-[#594047]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2">
              Beauty Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#8e004b] text-white'
                    : 'bg-[#F0EDEC] text-[#594047]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-category-mobile-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#8e004b] text-white'
                      : 'bg-[#F0EDEC] text-[#594047]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Toggle */}
          <div>
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2">
              Verification Status
            </label>
            <button
              id="filter-verified-toggle-mobile"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all ${
                verifiedOnly
                  ? 'bg-[#FDE7F3] border-[#8e004b]/30 text-[#8e004b] font-bold'
                  : 'bg-stone-50 border-[#E8E8E8] text-[#1c1b1b]'
              }`}
            >
              <span className="text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">verified</span>
                Verified Only
              </span>
              <span className="material-symbols-outlined text-xl">
                {verifiedOnly ? 'toggle_on' : 'toggle_off'}
              </span>
            </button>
          </div>

          {/* Rating Select */}
          <div>
            <label className="block text-xs font-bold text-[#594047] uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 4.0, 4.5].map((val) => (
                <button
                  key={val}
                  id={`filter-rating-mobile-${val}`}
                  onClick={() => setMinRating(val)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    minRating === val
                      ? 'bg-[#1c1b1b] border-[#1c1b1b] text-white'
                      : 'bg-stone-50 border-[#E8E8E8] text-[#1c1b1b]'
                  }`}
                >
                  {val === 0 ? (
                    <span>Any</span>
                  ) : (
                    <>
                      <span>{val}+</span>
                      <span className="material-symbols-outlined text-xs text-amber-500 fill-amber-500">star</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-[#F0EDEC] flex gap-3 sticky bottom-0">
          <button
            onClick={handleClearAll}
            className="flex-1 py-3 text-xs font-bold text-stone-600 hover:text-stone-800 bg-white border border-[#E8E8E8] rounded-xl transition-all"
          >
            Reset All
          </button>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="flex-1 py-3 text-xs font-bold text-white bg-[#8e004b] rounded-xl transition-all shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

