import { useState, useMemo, MouseEvent } from 'react';
import { PRODUCTS_DATA, DISTRIBUTORS_DATA } from '../data/mockData';
import { Product, Distributor } from '../types';

interface ShopScreenProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  selectedCategoryFilter?: string | null;
  selectedDistributorFilter?: Distributor | null;
  onClearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
}

export function ShopScreen({
  onSelectProduct,
  onAddToCart,
  selectedCategoryFilter,
  selectedDistributorFilter,
  onClearFilters,
  searchQuery,
  setSearchQuery,
  wishlistIds = [],
  onToggleWishlist,
}: ShopScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategoryFilter || 'All'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'new-arrivals' | 'margin'>('featured');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = ['All', 'Skincare', 'Haircare', 'Makeup', 'Tools', 'Furniture'];

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
      return matchCat && matchDist && matchSearch;
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
  }, [activeCategory, selectedDistributorFilter, searchQuery, sortBy]);

  const handleQuickAdd = (e: MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
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

      {/* Active Filter Chips */}
      {(selectedDistributorFilter || searchQuery || activeCategory !== 'All') && (
        <div className="bg-[#FDE7F3]/60 p-3 rounded-xl border border-[#ffd9e2] mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#8e004b]">Active Filters:</span>
          {selectedDistributorFilter && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Distributor: {selectedDistributorFilter.name}</span>
              <button
                onClick={onClearFilters}
                className="hover:text-red-600 ml-1 font-bold"
              >
                ×
              </button>
            </span>
          )}
          {activeCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Category: {activeCategory}</span>
              <button
                onClick={() => setActiveCategory('All')}
                className="hover:text-red-600 ml-1 font-bold"
              >
                ×
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-white text-[#8e004b] text-xs font-medium px-2.5 py-1 rounded-full border border-[#8e004b]/30">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-red-600 ml-1 font-bold"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              onClearFilters();
            }}
            className="text-xs text-[#8e004b] underline font-semibold ml-auto"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
        {categories.map((cat) => (
          <button
            id={`shop-category-tab-${cat.toLowerCase()}`}
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
          <p className="text-xs text-[#594047] mt-1">
            Try adjusting your search keywords or category filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              onClearFilters();
            }}
            className="mt-4 bg-[#8e004b] text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                <p className="text-[11px] text-[#0150d6] font-medium truncate mt-1">
                  By {product.distributorName}
                </p>

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
    </div>
  );
}
