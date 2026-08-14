import React from 'react';

interface OrderHistoryEmptyStateProps {
  searchQuery?: string;
  activeTab?: string;
  selectedBranchName?: string;
  onResetFilters?: () => void;
  onExploreShop?: () => void;
  onSelectCategoryShortcut?: (category: string) => void;
}

export function OrderHistoryEmptyState({
  searchQuery,
  activeTab,
  selectedBranchName,
  onResetFilters,
  onExploreShop,
  onSelectCategoryShortcut,
}: OrderHistoryEmptyStateProps) {
  const isFiltered = !!searchQuery || activeTab !== 'ALL' || !!selectedBranchName;

  const popularCategories = [
    { label: 'Haircare & Color', icon: 'palette' },
    { label: 'Styling Equipment', icon: 'content_cut' },
    { label: 'Skin & Serums', icon: 'spa' },
    { label: 'Nail & Spa', icon: 'dry' },
  ];

  return (
    <div
      id="order-history-empty-state"
      className="py-12 px-6 bg-gradient-to-b from-[#FCF9F8] to-[#FAF8F8] rounded-3xl border border-dashed border-[#E8E8E8] text-center flex flex-col items-center justify-center space-y-6 shadow-2xs my-4 animate-fade-in"
    >
      {/* Multi-Layered Vector Illustration */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Radial Background */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FDE7F3] via-[#FAF8F8] to-amber-50 animate-pulse opacity-80" />

        {/* Outer Ring */}
        <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-[#8e004b]/20 flex items-center justify-center" />

        {/* Central Graphic Badge */}
        <div className="absolute w-16 h-16 rounded-2xl bg-white shadow-md border border-[#E8E8E8] flex items-center justify-center text-[#8e004b]">
          <span className="material-symbols-outlined text-3xl">
            {searchQuery ? 'search_off' : 'inventory_2'}
          </span>
        </div>

        {/* Floating Accent Badges */}
        <div className="absolute -top-1 -right-2 bg-amber-400 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[11px]">local_shipping</span>
          <span>EXPRESS</span>
        </div>

        <div className="absolute -bottom-1 -left-2 bg-[#8e004b] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[11px]">verified</span>
          <span>18% GST ITC</span>
        </div>
      </div>

      {/* Copywriting & Headings */}
      <div className="max-w-md space-y-2">
        <h3 className="text-base md:text-lg font-bold text-[#1c1b1b]">
          {searchQuery
            ? `No orders matching "${searchQuery}"`
            : selectedBranchName
            ? `No consignments found for ${selectedBranchName}`
            : activeTab === 'ACTIVE'
            ? 'No Active Shipments in Transit'
            : activeTab === 'PAST'
            ? 'No Delivered Orders Yet'
            : 'No Wholesale Consignments Yet'}
        </h3>

        <p className="text-xs text-[#594047] leading-relaxed">
          {searchQuery || isFiltered
            ? 'Try adjusting your search query, clearing branch filters, or resetting status filters to see all historical purchase invoices.'
            : 'Stock your salon with authentic, direct-from-distributor supplies. All purchases include GST invoices with claimable 18% Input Tax Credit.'}
        </p>
      </div>

      {/* Category Shortcuts */}
      {!searchQuery && (
        <div className="space-y-2 pt-2 w-full max-w-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7A7A] block">
            Popular Salon Categories to Explore:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {popularCategories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => {
                  if (onSelectCategoryShortcut) onSelectCategoryShortcut(cat.label);
                  else if (onExploreShop) onExploreShop();
                }}
                className="bg-white hover:bg-[#FDE7F3] border border-[#E8E8E8] hover:border-[#8e004b]/30 text-[#1c1b1b] hover:text-[#8e004b] text-xs font-semibold py-1.5 px-3 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm text-[#8e004b]">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {isFiltered && onResetFilters && (
          <button
            id="empty-state-reset-filters-btn"
            type="button"
            onClick={onResetFilters}
            className="bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Reset All Filters</span>
          </button>
        )}

        {onExploreShop && (
          <button
            id="empty-state-explore-shop-btn"
            type="button"
            onClick={onExploreShop}
            className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Explore Wholesale Catalog</span>
          </button>
        )}
      </div>
    </div>
  );
}

interface WishlistEmptyStateProps {
  onExploreCatalog: () => void;
  onSelectCategoryShortcut?: (category: string) => void;
}

export function WishlistEmptyState({
  onExploreCatalog,
  onSelectCategoryShortcut,
}: WishlistEmptyStateProps) {
  const quickCategories = [
    { label: 'Haircare & Color', icon: 'palette' },
    { label: 'Styling Equipment', icon: 'content_cut' },
    { label: 'Skin & Serums', icon: 'spa' },
  ];

  return (
    <div
      id="wishlist-empty-state"
      className="py-10 px-5 bg-gradient-to-b from-[#FCF9F8] to-[#FAF8F8] rounded-3xl border border-dashed border-[#E8E8E8] text-center flex flex-col items-center justify-center space-y-5 my-auto animate-fade-in"
    >
      {/* Vector Illustration Badge */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Glow Circle */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FDE7F3] via-purple-50 to-pink-50 animate-pulse opacity-90" />

        {/* Outer Dotted Ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-[#8e004b]/30 flex items-center justify-center" />

        {/* Center Floating Icon Card */}
        <div className="absolute w-14 h-14 rounded-2xl bg-white shadow-md border border-[#E8E8E8] flex items-center justify-center text-[#8e004b]">
          <span className="material-symbols-outlined text-3xl">favorite</span>
        </div>

        {/* Floating Sparkle & Margin Badges */}
        <div className="absolute -top-1 -right-1 bg-amber-400 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[10px]">grade</span>
          <span>SAVED RESTOCK</span>
        </div>

        <div className="absolute -bottom-1 -left-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[10px]">trending_up</span>
          <span>45%+ MARGINS</span>
        </div>
      </div>

      {/* Copywriting */}
      <div className="max-w-xs space-y-1.5">
        <h3 className="font-bold text-base md:text-lg text-[#1c1b1b]">
          Your Salon Wishlist is Empty
        </h3>
        <p className="text-xs text-[#594047] leading-relaxed">
          Bookmark high-margin hair colors, restorative masks, and salon tools while browsing to lock in direct distributor pricing for seamless restock.
        </p>
      </div>

      {/* Recommended Shortcut Pills */}
      <div className="space-y-1.5 w-full max-w-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7A7A] block">
          Browse Top Salon Supplies:
        </span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {quickCategories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => {
                if (onSelectCategoryShortcut) onSelectCategoryShortcut(cat.label);
                else onExploreCatalog();
              }}
              className="bg-white hover:bg-[#FDE7F3] border border-[#E8E8E8] hover:border-[#8e004b]/30 text-[#1c1b1b] hover:text-[#8e004b] text-[11px] font-semibold py-1 px-2.5 rounded-lg transition-all shadow-2xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs text-[#8e004b]">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        id="wishlist-empty-explore-btn"
        type="button"
        onClick={onExploreCatalog}
        className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 mt-1"
      >
        <span className="material-symbols-outlined text-base">storefront</span>
        <span>Explore Wholesale Catalog</span>
      </button>
    </div>
  );
}
