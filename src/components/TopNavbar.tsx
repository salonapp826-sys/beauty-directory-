import { useState } from 'react';
import { NEXORA_ASSETS } from '../data/mockData';
import { ActiveTab, User } from '../types';

interface TopNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  reorderAlertCount?: number;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onGoToSplash: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TopNavbar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  reorderAlertCount = 3,
  user,
  onLogout,
  onOpenAuth,
  onGoToSplash,
  searchQuery,
  setSearchQuery,
}: TopNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fdf8f8]/95 backdrop-blur-md border-b border-[#E8E8E8] w-full transition-all">
      {/* Mandatory Global Requirement Notification */}
      <div className="bg-[#8e004b] text-white text-center py-1 px-3 text-[11px] font-black tracking-widest flex items-center justify-center gap-2 shadow-xs select-none">
        <span className="material-symbols-outlined text-xs text-amber-300">warning</span>
        <span>STITCH INDIA नहीं बनाता है</span>
        <span className="material-symbols-outlined text-xs text-amber-300">warning</span>
      </div>

      <div className="flex justify-between items-center w-full px-4 md:px-10 py-3.5 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left group"
          >
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#8e004b] group-hover:text-[#b90064] transition-colors">
              Nexora
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <button
              id="desktop-nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#594047] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Home
            </button>
            <button
              id="desktop-nav-directory"
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'directory'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#594047] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Distributor Directory
            </button>
            <button
              id="desktop-nav-shop"
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'shop'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#594047] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Shop Catalog
            </button>
            <button
              id="desktop-nav-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#594047] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              <span>Salon Dashboard</span>
              {reorderAlertCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#8e004b] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-2xs">
                  {reorderAlertCount} Reorder
                </span>
              )}
            </button>
          </nav>
        </div>



        {/* Right Actions */}
        <div className="flex items-center gap-3 text-[#8e004b]">
          {/* Notification Button */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => {
                setShowNotificationToast(!showNotificationToast);
                setTimeout(() => setShowNotificationToast(false), 4000);
              }}
              className="p-2 rounded-full hover:bg-[#FDE7F3] transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 bg-[#8e004b] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {showNotificationToast && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-[#E8E8E8] p-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2 mb-2">
                  <span className="font-semibold text-xs text-[#1c1b1b]">B2B Salon Alerts</span>
                  <span className="text-[10px] text-[#8e004b] font-medium">New Deals</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-[#FDE7F3]/60 rounded-lg">
                    <p className="font-semibold text-[#8e004b]">GST Input Credit Active</p>
                    <p className="text-[#594047] text-[11px]">Save up to 18% GST on all bulk orders this month.</p>
                  </div>
                  <div className="p-2 bg-[#F0EDEC] rounded-lg">
                    <p className="font-semibold text-[#1c1b1b]">LuxeTech Flash Offer</p>
                    <p className="text-[#594047] text-[11px]">Pro Styler flat 23% off on 10+ units.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            id="wishlist-nav-btn"
            onClick={onOpenWishlist}
            className="p-2 rounded-full hover:bg-[#FDE7F3] transition-colors relative group"
            title="Saved Products / Wishlist"
          >
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:scale-110">
              favorite
            </span>
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#8e004b] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button matching Image 1 & 2 */}
          <button
            id="cart-btn"
            onClick={onOpenCart}
            className="p-2 rounded-full hover:bg-[#FDE7F3] transition-colors relative"
            title="View Cart"
          >
            <span className="material-symbols-outlined text-2xl fill-1">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#8e004b] text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            {user ? (
              <button
                id="user-avatar-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#8e004b]/30 transition-all ml-1"
              >
                <img
                  alt={user.name}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-[#E8E8E8]"
                  src={user.avatar || NEXORA_ASSETS.userAvatar}
                />
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="bg-[#8e004b] text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-[#b90064] transition-colors"
              >
                Login
              </button>
            )}

            {/* Profile Dropdown */}
            {showProfileMenu && user && (
              <div
                className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-[#E8E8E8] py-2 z-50"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-2 border-b border-[#E8E8E8]">
                  <p className="font-bold text-sm text-[#1c1b1b]">{user.name}</p>
                  <p className="text-xs text-[#594047] truncate">{user.salonName}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#0150d6] text-xs">verified</span>
                    <span className="text-[10px] text-[#0150d6] font-semibold">GST Verified</span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full px-4 py-2 text-left text-[#1c1b1b] hover:bg-[#FDE7F3] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    <span>Salon Profile & Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="w-full px-4 py-2 text-left text-[#1c1b1b] hover:bg-[#FDE7F3] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">storefront</span>
                    <span>Distributor Directory</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="w-full px-4 py-2 text-left text-[#1c1b1b] hover:bg-[#FDE7F3] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">inventory_2</span>
                    <span>Wholesale Catalog</span>
                  </button>
                  <button
                    onClick={onGoToSplash}
                    className="w-full px-4 py-2 text-left text-[#594047] hover:bg-[#F0EDEC] flex items-center gap-2 border-t border-[#E8E8E8]"
                  >
                    <span className="material-symbols-outlined text-base">fullscreen</span>
                    <span>View Splash Intro</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-[#ba1a1a] hover:bg-red-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
