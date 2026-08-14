import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  reorderAlertCount?: number;
  onSearchClick?: () => void;
}

export function BottomNav({ activeTab, setActiveTab, reorderAlertCount = 3, onSearchClick }: BottomNavProps) {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fdf8f8]/95 backdrop-blur-md border-t border-[#E8E8E8] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe pt-2 px-4 z-40 flex justify-around items-center h-[72px] md:hidden">
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center justify-center w-16 gap-1 group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all ${
              activeTab === 'home'
                ? 'bg-[#FDE7F3] text-[#8e004b]'
                : 'text-[#594047] group-hover:bg-[#F0EDEC]'
            }`}
          >
            <span
              className="material-symbols-outlined font-bold text-xl"
              style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
            >
              home
            </span>
          </div>
          <span
            className={`text-[11px] font-medium transition-colors ${
              activeTab === 'home' ? 'text-[#8e004b] font-bold' : 'text-[#594047]'
            }`}
          >
            Home
          </span>
        </button>

        {/* Directory */}
        <button
          id="mobile-nav-directory"
          onClick={() => setActiveTab('directory')}
          className="flex flex-col items-center justify-center w-16 gap-1 group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all ${
              activeTab === 'directory'
                ? 'bg-[#FDE7F3] text-[#8e004b]'
                : 'text-[#594047] group-hover:bg-[#F0EDEC]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: activeTab === 'directory' ? "'FILL' 1" : "'FILL' 0" }}
            >
              storefront
            </span>
          </div>
          <span
            className={`text-[11px] font-medium transition-colors ${
              activeTab === 'directory' ? 'text-[#8e004b] font-bold' : 'text-[#594047]'
            }`}
          >
            Directory
          </span>
        </button>

        {/* Shop */}
        <button
          id="mobile-nav-shop"
          onClick={() => setActiveTab('shop')}
          className="flex flex-col items-center justify-center w-16 gap-1 group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all ${
              activeTab === 'shop'
                ? 'bg-[#FDE7F3] text-[#8e004b]'
                : 'text-[#594047] group-hover:bg-[#F0EDEC]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: activeTab === 'shop' ? "'FILL' 1" : "'FILL' 0" }}
            >
              shopping_bag
            </span>
          </div>
          <span
            className={`text-[11px] font-medium transition-colors ${
              activeTab === 'shop' ? 'text-[#8e004b] font-bold' : 'text-[#594047]'
            }`}
          >
            Shop
          </span>
        </button>

        {/* Search */}
        <button
          id="mobile-nav-search"
          onClick={() => {
            if (onSearchClick) {
              onSearchClick();
            } else {
              setActiveTab('shop');
            }
          }}
          className="flex flex-col items-center justify-center w-16 gap-1 group"
        >
          <div
            className="px-4 py-1 rounded-full transition-all text-[#594047] group-hover:bg-[#F0EDEC]"
          >
            <span
              className="material-symbols-outlined text-xl"
            >
              search
            </span>
          </div>
          <span
            className="text-[11px] font-medium transition-colors text-[#594047]"
          >
            Search
          </span>
        </button>

        {/* Profile */}
        <button
          id="mobile-nav-profile"
          onClick={() => setActiveTab('profile')}
          className="flex flex-col items-center justify-center w-16 gap-1 group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all relative ${
              activeTab === 'profile'
                ? 'bg-[#FDE7F3] text-[#8e004b]'
                : 'text-[#594047] group-hover:bg-[#F0EDEC]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
            >
              person
            </span>
            {reorderAlertCount > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-[#8e004b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-2xs">
                {reorderAlertCount}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-medium transition-colors ${
              activeTab === 'profile' ? 'text-[#8e004b] font-bold' : 'text-[#594047]'
            }`}
          >
            Dashboard
          </span>
        </button>
      </nav>

      {/* Safe area padding */}
      <div className="h-[72px] w-full md:hidden" />
    </>
  );
}
