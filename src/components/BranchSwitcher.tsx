import { useState } from 'react';
import { SavedAddress, Order, User } from '../types';

interface BranchSwitcherProps {
  branches: SavedAddress[];
  selectedBranchId: string; // 'ALL' or SavedAddress.id
  onSelectBranch: (branchId: string) => void;
  orders: Order[];
  user: User;
  onAddNewBranch: () => void;
  onSetDefaultBranch: (branchId: string) => void;
}

const TAG_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  Flagship: {
    label: 'Flagship Outlet',
    bg: 'bg-[#FDE7F3]',
    text: 'text-[#8e004b]',
    icon: 'star',
  },
  Studio: {
    label: 'Beauty Studio',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: 'spa',
  },
  Branch: {
    label: 'Salon Branch',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'storefront',
  },
  Warehouse: {
    label: 'Stock Warehouse',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    icon: 'inventory_2',
  },
  Academy: {
    label: 'Training Academy',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    icon: 'school',
  },
};

export function BranchSwitcher({
  branches,
  selectedBranchId,
  onSelectBranch,
  orders,
  user,
  onAddNewBranch,
  onSetDefaultBranch,
}: BranchSwitcherProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper to count orders for a branch
  const getBranchOrderStats = (branchId: string) => {
    if (branchId === 'ALL') {
      const totalSpend = orders.reduce((acc, o) => acc + o.total, 0);
      return { count: orders.length, spend: totalSpend };
    }

    const branch = branches.find((b) => b.id === branchId);
    if (!branch) return { count: 0, spend: 0 };

    const matchingOrders = orders.filter((order) => {
      if (order.shippingAddress?.id === branchId) return true;
      if (order.shippingAddress?.branchName) {
        return (
          order.shippingAddress.branchName
            .toLowerCase()
            .includes(branch.branchName.toLowerCase()) ||
          branch.branchName
            .toLowerCase()
            .includes(order.shippingAddress.branchName.toLowerCase())
        );
      }
      return false;
    });

    const spend = matchingOrders.reduce((acc, o) => acc + o.total, 0);
    return { count: matchingOrders.length, spend };
  };

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const selectedStats = getBranchOrderStats(selectedBranchId);

  return (
    <div
      id="branch-manager-switcher-card"
      className="bg-white rounded-2xl border border-[#E8E8E8] shadow-sm overflow-hidden transition-all"
    >
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1c1b1b] via-[#3a0823] to-[#8e004b] text-white p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                MULTI-BRANCH MANAGER
              </span>
              <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                {branches.length} Registered Outlets
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight">
              Salon Network & Location Selector
            </h2>
            <p className="text-xs text-white/80 max-w-xl mt-0.5">
              Toggle active location to isolate branch order history, route wholesale dispatches, and manage tax GSTIN details.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="branch-switcher-add-new-btn"
          onClick={onAddNewBranch}
          className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 self-stretch md:self-auto justify-center"
        >
          <span className="material-symbols-outlined text-base">add_business</span>
          <span>Add New Location</span>
        </button>
      </div>

      {/* Main Switcher Control Strip */}
      <div className="p-4 md:p-5 bg-[#FCF9F8] border-b border-[#E8E8E8]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#594047] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#8e004b]">
              swap_horiz
            </span>
            <span>Switch Active Location:</span>
          </label>

          {selectedBranchId !== 'ALL' && (
            <button
              id="clear-branch-selection-btn"
              onClick={() => onSelectBranch('ALL')}
              className="text-xs font-semibold text-[#8e004b] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              <span>View All Outlets (Consolidated)</span>
            </button>
          )}
        </div>

        {/* Branch Quick Selection Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Option 1: ALL BRANCHES CONSOLIDATED */}
          <button
            id="branch-select-all"
            type="button"
            onClick={() => onSelectBranch('ALL')}
            className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[96px] ${
              selectedBranchId === 'ALL'
                ? 'bg-[#8e004b] text-white border-[#8e004b] shadow-md ring-2 ring-[#8e004b]/30'
                : 'bg-white text-[#1c1b1b] border-[#E8E8E8] hover:border-[#8e004b]/50 hover:bg-[#FAF8F8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    selectedBranchId === 'ALL'
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-100 text-[#594047]'
                  }`}
                >
                  CONSOLIDATED
                </span>
                {selectedBranchId === 'ALL' && (
                  <span className="material-symbols-outlined text-amber-300 text-lg">
                    check_circle
                  </span>
                )}
              </div>
              <h3 className="font-bold text-xs line-clamp-1">All Salon Outlets</h3>
              <p
                className={`text-[11px] truncate mt-0.5 ${
                  selectedBranchId === 'ALL' ? 'text-white/80' : 'text-[#594047]'
                }`}
              >
                {user.salonName} • {branches.length} Locations
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[11px] font-medium">
              <span>{orders.length} Total Orders</span>
              <span className="font-bold">₹{getBranchOrderStats('ALL').spend.toLocaleString('en-IN')}</span>
            </div>
          </button>

          {/* Individual Branch Outlets */}
          {branches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            const stats = getBranchOrderStats(branch.id);
            const tagStyle = TAG_CONFIG[branch.tag] || TAG_CONFIG.Branch;

            return (
              <button
                key={branch.id}
                id={`branch-select-${branch.id}`}
                type="button"
                onClick={() => onSelectBranch(branch.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[96px] ${
                  isSelected
                    ? 'bg-[#8e004b] text-white border-[#8e004b] shadow-md ring-2 ring-[#8e004b]/30'
                    : 'bg-white text-[#1c1b1b] border-[#E8E8E8] hover:border-[#8e004b]/50 hover:bg-[#FAF8F8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 truncate ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : `${tagStyle.bg} ${tagStyle.text}`
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {tagStyle.icon}
                      </span>
                      <span>{branch.tag}</span>
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {branch.isDefault && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected
                              ? 'bg-amber-300 text-black'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          Default
                        </span>
                      )}
                      {isSelected && (
                        <span className="material-symbols-outlined text-amber-300 text-lg">
                          check_circle
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-xs line-clamp-1">{branch.branchName}</h3>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-white/80' : 'text-[#594047]'
                    }`}
                  >
                    {branch.city}, {branch.state} • Attn: {branch.recipientName.split(' ')[0]}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[11px] font-medium">
                  <span>{stats.count} Orders</span>
                  <span className="font-bold">₹{stats.spend.toLocaleString('en-IN')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Branch Information & Quick Control Bar */}
      <div className="p-4 md:p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        {selectedBranchId === 'ALL' ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0150d6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div>
              <p className="font-bold text-[#1c1b1b]">
                Viewing Consolidated Statement Across All {branches.length} Branches
              </p>
              <p className="text-[#594047] text-[11px]">
                Showing orders and dispatch tracking for all salon outlets combined.
              </p>
            </div>
          </div>
        ) : selectedBranch ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">location_on</span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#1c1b1b] text-sm">
                  {selectedBranch.branchName}
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#0150d6] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  GSTIN: {selectedBranch.gstin || user.gstNumber}
                </span>
              </div>
              <p className="text-[#594047]">
                {selectedBranch.addressLine1}, {selectedBranch.city}, {selectedBranch.state} - {selectedBranch.pincode} • Manager: <strong>{selectedBranch.recipientName}</strong> ({selectedBranch.phone})
              </p>
            </div>
          </div>
        ) : null}

        {/* Actions for Selected Branch */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#E8E8E8]">
          {selectedBranch && !selectedBranch.isDefault && (
            <button
              id="set-active-as-default-branch-btn"
              onClick={() => onSetDefaultBranch(selectedBranch.id)}
              className="bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] font-semibold text-xs py-2 px-3 rounded-xl transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm text-amber-600">star</span>
              <span>Set as Default Outlet</span>
            </button>
          )}

          <a
            href="#order-history-section"
            className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">list_alt</span>
            <span>View Branch Orders ({selectedStats.count})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
