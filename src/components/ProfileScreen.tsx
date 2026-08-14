import { useState, FormEvent } from 'react';
import { User, Order, Product, SavedAddress, OrderStatus } from '../types';
import { SavedAddressesSection } from './SavedAddressesSection';
import { OrderStatusBadge } from './OrderStatusBadge';
import { TrackShipmentTimeline } from './TrackShipmentTimeline';
import { TrackShipmentModal } from './TrackShipmentModal';
import { RateOrderModal, OrderRatingData } from './RateOrderModal';
import { NexoraRewardsSection } from './NexoraRewardsSection';
import { BranchSwitcher } from './BranchSwitcher';
import { OrderHistoryEmptyState } from './EmptyState';
import { QuickSupportCard } from './QuickSupportCard';
import { exportOrdersToCSV, exportOrdersToPDF } from '../utils/exportUtils';

interface ProfileScreenProps {
  user: User;
  orders: Order[];
  onReorder: (order: Order) => void;
  onViewInvoice: (order: Order) => void;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onExploreShop?: () => void;
}

export function ProfileScreen({
  user,
  orders,
  onReorder,
  onViewInvoice,
  onUpdateUser,
  onLogout,
  onSelectProduct,
  onAddToCart,
  onExploreShop,
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [salonName, setSalonName] = useState(user.salonName);
  const [gstNumber, setGstNumber] = useState(user.gstNumber);
  const [city, setCity] = useState(user.city);
  const [phone, setPhone] = useState(user.phone);
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null);

  // Branch Operations Manager State
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');

  // Real-time Order Tracking state & Modal state
  const [orderTab, setOrderTab] = useState<'ALL' | 'ACTIVE' | 'PAST'>('ALL');
  const [subStatusFilter, setSubStatusFilter] = useState<'ALL' | 'IN_TRANSIT' | 'PROCESSING' | 'DELIVERED'>('ALL');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [expandedTrackingOrders, setExpandedTrackingOrders] = useState<Record<string, boolean>>({
    'NEX-89210': true, // default expand the live in-transit order for immediate visibility
  });
  const [selectedTrackingModalOrder, setSelectedTrackingModalOrder] = useState<Order | null>(null);
  const [selectedRatingOrder, setSelectedRatingOrder] = useState<Order | null>(null);
  const [orderRatings, setOrderRatings] = useState<Record<string, OrderRatingData>>({
    'NEX-88432': {
      orderId: 'NEX-88432',
      overallRating: 5,
      qualityRating: 5,
      deliveryRating: 5,
      distributorRating: 5,
      comment: 'Excellent batch quality! The ColorCraft hair color Developer arrived with genuine factory seal. Clients loved the shine.',
      productRatings: { 'prod-3': 5 },
      selectedTags: ['Genuine Distributor Seal', 'Fast Express Dispatch'],
      submittedAt: '31 Jul 2026',
    },
  });

  const savedAddresses = user.savedAddresses || [];

  const handleSaveRating = (ratingData: OrderRatingData) => {
    setOrderRatings((prev) => ({
      ...prev,
      [ratingData.orderId]: ratingData,
    }));
  };

  const toggleOrderTracking = (orderId: string) => {
    setExpandedTrackingOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'In Transit' || o.status === 'Dispatched' || o.status === 'Processing' || o.status === 'Out for Delivery'
  ).length;

  const pastOrdersCount = orders.filter(
    (o) => o.status === 'Delivered' || o.status === 'Cancelled'
  ).length;

  const inTransitCount = orders.filter(
    (o) => o.status === 'In Transit' || o.status === 'Dispatched' || o.status === 'Out for Delivery'
  ).length;

  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const filteredOrders = orders.filter((order) => {
    // Branch Filter
    if (selectedBranchId !== 'ALL') {
      const selectedBranch = savedAddresses.find((b) => b.id === selectedBranchId);
      if (selectedBranch) {
        if (order.shippingAddress?.id) {
          if (order.shippingAddress.id !== selectedBranchId) return false;
        } else if (order.shippingAddress?.branchName) {
          const matchName =
            order.shippingAddress.branchName.toLowerCase().includes(selectedBranch.branchName.toLowerCase()) ||
            selectedBranch.branchName.toLowerCase().includes(order.shippingAddress.branchName.toLowerCase());
          if (!matchName) return false;
        }
      }
    }

    // Primary Tab Scope Filter (All Orders / Active / Past)
    if (orderTab === 'ACTIVE') {
      const isActive =
        order.status === 'In Transit' ||
        order.status === 'Dispatched' ||
        order.status === 'Processing' ||
        order.status === 'Out for Delivery';
      if (!isActive) return false;
    } else if (orderTab === 'PAST') {
      const isPast = order.status === 'Delivered' || order.status === 'Cancelled';
      if (!isPast) return false;
    }

    // Specific sub-status dropdown filter
    if (subStatusFilter === 'IN_TRANSIT') {
      if (
        order.status !== 'In Transit' &&
        order.status !== 'Dispatched' &&
        order.status !== 'Out for Delivery'
      ) {
        return false;
      }
    } else if (subStatusFilter === 'PROCESSING') {
      if (order.status !== 'Processing') return false;
    } else if (subStatusFilter === 'DELIVERED') {
      if (order.status !== 'Delivered') return false;
    }

    // Search query filter
    if (searchOrderQuery.trim()) {
      const q = searchOrderQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchDistro = order.distributorName.toLowerCase().includes(q);
      const matchItems = order.items.some(
        (item) => item.product.name.toLowerCase().includes(q) || item.product.brand.toLowerCase().includes(q)
      );
      const matchTracking = order.trackingNumber?.toLowerCase().includes(q);
      const matchBranch = order.shippingAddress?.branchName?.toLowerCase().includes(q);
      return matchId || matchDistro || matchItems || matchTracking || matchBranch;
    }

    return true;
  });

  const handleSaveAddress = (address: SavedAddress) => {
    let updated: SavedAddress[];
    const exists = savedAddresses.some((a) => a.id === address.id);

    if (exists) {
      updated = savedAddresses.map((a) => {
        if (a.id === address.id) {
          return address;
        }
        return address.isDefault ? { ...a, isDefault: false } : a;
      });
    } else {
      if (address.isDefault) {
        updated = [...savedAddresses.map((a) => ({ ...a, isDefault: false })), address];
      } else {
        updated = [...savedAddresses, address];
      }
    }

    onUpdateUser({
      ...user,
      savedAddresses: updated,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    const target = savedAddresses.find((a) => a.id === addressId);
    let updated = savedAddresses.filter((a) => a.id !== addressId);

    // If deleting default address, make the first remaining address default
    if (target?.isDefault && updated.length > 0) {
      updated = updated.map((a, idx) => (idx === 0 ? { ...a, isDefault: true } : a));
    }

    onUpdateUser({
      ...user,
      savedAddresses: updated,
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    const updated = savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    onUpdateUser({
      ...user,
      savedAddresses: updated,
    });
  };

  const handleAddItemToCart = (product: Product, quantity: number, key: string) => {
    onAddToCart(product, quantity);
    setAddedItemKey(key);
    setTimeout(() => {
      setAddedItemKey(null);
    }, 1600);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      salonName,
      gstNumber,
      city,
      phone,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6 space-y-6">
      {/* Branch Operations Manager Switcher Bar */}
      <BranchSwitcher
        branches={savedAddresses}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        orders={orders}
        user={user}
        onAddNewBranch={() => {
          const addressEl = document.getElementById('saved-addresses-section');
          if (addressEl) {
            addressEl.scrollIntoView({ behavior: 'smooth' });
            const addBtn = document.getElementById('add-address-btn') as HTMLButtonElement;
            if (addBtn) addBtn.click();
          }
        }}
        onSetDefaultBranch={handleSetDefaultAddress}
      />

      {/* Profile Banner */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-[#8e004b] p-0.5 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-[#1c1b1b]">{user.name}</h1>
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-[#0150d6] border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>GST Verified Salon</span>
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[#8e004b] mt-0.5">{user.salonName}</p>
            <p className="text-xs text-[#594047] flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span>{user.city}</span> • <span>{user.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 md:flex-none bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>{isEditing ? 'Cancel Edit' : 'Edit Business Details'}</span>
          </button>
          <button
            onClick={onLogout}
            className="flex-1 md:flex-none border border-red-200 hover:bg-red-50 text-[#ba1a1a] text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Form Modal/Section */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-[#F0EDEC] p-6 rounded-2xl border border-[#E8E8E8] animate-fade-in">
          <h3 className="font-bold text-sm text-[#1c1b1b] mb-4">Edit Salon & Tax Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#594047] block mb-1">Salon / Business Name</label>
              <input
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-lg p-2.5 text-xs text-[#1c1b1b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#594047] block mb-1">GSTIN Number (for 18% ITC)</label>
              <input
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-lg p-2.5 text-xs font-mono font-semibold text-[#1c1b1b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#594047] block mb-1">City / Location</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-lg p-2.5 text-xs text-[#1c1b1b]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#594047] block mb-1">Phone / WhatsApp</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-lg p-2.5 text-xs text-[#1c1b1b]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#8e004b] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs hover:bg-[#b90064]"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Salon Wallet */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#594047] font-semibold">Nexora B2B Credit Line</span>
            <h3 className="text-2xl font-bold text-[#8e004b] mt-0.5">
              ₹{user.walletBalance.toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-green-700 font-medium">30-Day Interest-Free Terms</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
        </div>

        {/* Loyalty Points & Partner Tier */}
        <div className="bg-white p-5 rounded-2xl border border-[#8e004b]/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#594047] font-semibold">Nexora Rewards</span>
              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                Gold Tier
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#8e004b] mt-0.5 font-mono">
              {(orders.reduce((acc, o) => acc + Math.floor(o.total / 50), 0) + (user.isVerified ? 500 : 0) + 250).toLocaleString('en-IN')} Pts
            </h3>
            <span className="text-[10px] text-[#594047]">1.5x Multiplier Active</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#8e004b] to-amber-500 text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-2xl">military_tech</span>
          </div>
        </div>

        {/* GST Credits Claimed */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#594047] font-semibold">Total GST ITC Saved</span>
            <h3 className="text-2xl font-bold text-[#0150d6] mt-0.5">
              ₹{(orders.reduce((acc, o) => acc + o.gstAmount, 0)).toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-[#594047]">Eligible on GSTR-2B filing</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0150d6] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
        </div>

        {/* Orders Placed */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#594047] font-semibold">Wholesale Orders</span>
            <h3 className="text-2xl font-bold text-[#1c1b1b] mt-0.5">{orders.length} Orders</h3>
            <span className="text-[10px] text-[#594047]">All fulfilled via verified distros</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F0EDEC] text-[#1c1b1b] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
        </div>
      </div>

      {/* Nexora Rewards, Loyalty Tiers, and Dynamic Discounts Section */}
      <NexoraRewardsSection user={user} orders={orders} />

      {/* Saved Addresses / Salon Branches Management */}
      <SavedAddressesSection
        addresses={savedAddresses}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
      />

      {/* Dedicated Executive Account Support Card & FAB */}
      <QuickSupportCard userPhone={user.phone} salonName={user.salonName} />

      {/* Order History */}
      <div id="order-history-section" className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-xs space-y-6">
        {/* Branch Filter Banner if specific location is selected */}
        {selectedBranchId !== 'ALL' && (
          <div className="bg-[#FDE7F3] border border-[#8e004b]/30 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-[#8e004b] animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">domain</span>
              <span>
                Filtering Order History for Outlet: <strong>{savedAddresses.find((b) => b.id === selectedBranchId)?.branchName || 'Selected Branch'}</strong> ({filteredOrders.length} Order{filteredOrders.length !== 1 ? 's' : ''} found)
              </span>
            </div>

            <button
              id="reset-branch-filter-btn"
              onClick={() => setSelectedBranchId('ALL')}
              className="bg-[#8e004b] text-white hover:bg-[#b90064] text-[11px] font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 active:scale-95 shadow-2xs"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              <span>Show All Outlets</span>
            </button>
          </div>
        )}

        {/* Header & High-level Real-time Logistics Transparency */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[#1c1b1b]">Wholesale Order History & Live Logistics</h2>
              {activeOrdersCount > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600" />
                  </span>
                  <span>{activeOrdersCount} Consignment{activeOrdersCount > 1 ? 's' : ''} in Motion</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#594047] mt-0.5">
              Real-time consignment status badges, carrier GPS tracking, batch QC inspection, and instant GST invoices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold bg-[#FDE7F3] text-[#8e004b] px-3 py-1 rounded-full border border-[#8e004b]/20">
              {orders.length} Total Orders
            </span>

            {/* Export Invoices Dropdown / Action Buttons */}
            <div className="flex items-center gap-1.5 bg-[#FAF8F8] p-1 rounded-xl border border-[#E8E8E8]">
              <button
                id="export-csv-btn"
                onClick={() => exportOrdersToCSV(filteredOrders, user)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                title="Download purchase invoices as CSV/Excel spreadsheet for accounting"
              >
                <span className="material-symbols-outlined text-sm">table_view</span>
                <span>Export Excel/CSV</span>
              </button>

              <button
                id="export-pdf-btn"
                onClick={() => exportOrdersToPDF(filteredOrders, user)}
                className="bg-[#0150d6] hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                title="Generate printable PDF Bookkeeping Summary & GST ITC Ledger"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>Export PDF Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs, Dropdown & Live Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Primary Tab Navigation: All Orders / Active / Past */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F0EDEC] rounded-2xl overflow-x-auto scrollbar-none w-fit">
            <button
              id="order-tab-all"
              onClick={() => {
                setOrderTab('ALL');
                setSubStatusFilter('ALL');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                orderTab === 'ALL' && subStatusFilter === 'ALL'
                  ? 'bg-[#8e004b] text-white shadow-2xs'
                  : 'text-[#594047] hover:text-[#1c1b1b] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>All Orders</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  orderTab === 'ALL' && subStatusFilter === 'ALL'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E8E8E8] text-[#594047]'
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              id="order-tab-active"
              onClick={() => {
                setOrderTab('ACTIVE');
                setSubStatusFilter('ALL');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                orderTab === 'ACTIVE'
                  ? 'bg-sky-700 text-white shadow-2xs'
                  : 'text-[#594047] hover:text-sky-800 hover:bg-sky-50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
              </span>
              <span>Active</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  orderTab === 'ACTIVE'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {activeOrdersCount}
              </span>
            </button>

            <button
              id="order-tab-past"
              onClick={() => {
                setOrderTab('PAST');
                setSubStatusFilter('ALL');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                orderTab === 'PAST'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-[#594047] hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              <span>Past</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  orderTab === 'PAST'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {pastOrdersCount}
              </span>
            </button>
          </div>

          {/* Right Group: Dropdown Filter + Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Status Dropdown Filter */}
            <div className="relative">
              <select
                id="order-filter-dropdown"
                value={
                  subStatusFilter !== 'ALL'
                    ? subStatusFilter
                    : orderTab
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'ALL') {
                    setOrderTab('ALL');
                    setSubStatusFilter('ALL');
                  } else if (val === 'ACTIVE') {
                    setOrderTab('ACTIVE');
                    setSubStatusFilter('ALL');
                  } else if (val === 'PAST') {
                    setOrderTab('PAST');
                    setSubStatusFilter('ALL');
                  } else if (val === 'IN_TRANSIT') {
                    setOrderTab('ACTIVE');
                    setSubStatusFilter('IN_TRANSIT');
                  } else if (val === 'PROCESSING') {
                    setOrderTab('ACTIVE');
                    setSubStatusFilter('PROCESSING');
                  } else if (val === 'DELIVERED') {
                    setOrderTab('PAST');
                    setSubStatusFilter('DELIVERED');
                  }
                }}
                className="w-full sm:w-auto bg-[#FAF8F8] hover:bg-[#F0EDEC] border border-[#E8E8E8] focus:border-[#8e004b] text-xs font-semibold text-[#1c1b1b] rounded-xl py-2 pl-3 pr-8 transition-colors cursor-pointer appearance-none shadow-2xs focus:outline-none"
              >
                <option value="ALL">View: All Orders ({orders.length})</option>
                <option value="ACTIVE">View: Active Only ({activeOrdersCount})</option>
                <option value="PAST">View: Past Only ({pastOrdersCount})</option>
                <option value="IN_TRANSIT">Sub-filter: In Transit ({inTransitCount})</option>
                <option value="PROCESSING">Sub-filter: Processing ({processingCount})</option>
                <option value="DELIVERED">Sub-filter: Delivered ({deliveredCount})</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#594047]">
                <span className="material-symbols-outlined text-base">expand_more</span>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[200px] flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7A7A7A]">
                search
              </span>
              <input
                type="text"
                placeholder="Search ID, product, AWB..."
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl pl-8 pr-7 py-2 text-xs text-[#1c1b1b] placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#8e004b]"
              />
              {searchOrderQuery && (
                <button
                  onClick={() => setSearchOrderQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#1c1b1b]"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <OrderHistoryEmptyState
            searchQuery={searchOrderQuery}
            activeTab={orderTab}
            selectedBranchName={savedAddresses.find((b) => b.id === selectedBranchId)?.branchName}
            onResetFilters={() => {
              setSearchOrderQuery('');
              setOrderTab('ALL');
              setSubStatusFilter('ALL');
              setSelectedBranchId('ALL');
            }}
            onExploreShop={onExploreShop}
            onSelectCategoryShortcut={() => {
              if (onExploreShop) onExploreShop();
            }}
          />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isTrackingOpen = !!expandedTrackingOrders[order.id];

              return (
                <div
                  id={`order-card-${order.id}`}
                  key={order.id}
                  className="bg-[#FAF8F8] rounded-2xl p-4 md:p-5 border border-[#E8E8E8] shadow-2xs transition-all hover:border-[#8e004b]/30"
                >
                  {/* Order Summary Top Bar */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-[#E8E8E8]">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-sm text-[#1c1b1b]">{order.id}</span>
                      <span className="text-xs text-[#594047]">• {order.date}</span>

                      {/* Real-Time Live Status Badge */}
                      <OrderStatusBadge status={order.status} size="sm" showPulse={true} />

                      <span className="text-xs text-[#594047]">
                        via <strong className="text-[#1c1b1b]">{order.distributorName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                      {/* Track Live Consignment Toggle Button */}
                      <button
                        id={`track-order-btn-${order.id}`}
                        onClick={() => toggleOrderTracking(order.id)}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs ${
                          isTrackingOpen
                            ? 'bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]'
                            : 'bg-white hover:bg-[#F0EDEC] text-[#1c1b1b] border border-[#E8E8E8]'
                        }`}
                        title="View stepping interactive consignment progress bar"
                      >
                        <span className="material-symbols-outlined text-sm text-[#8e004b]">
                          {isTrackingOpen ? 'expand_less' : 'timeline'}
                        </span>
                        <span>{isTrackingOpen ? 'Hide Progress' : 'Track Shipment'}</span>
                      </button>

                      <button
                        id={`track-modal-btn-${order.id}`}
                        onClick={() => setSelectedTrackingModalOrder(order)}
                        className="bg-white hover:bg-[#F0EDEC] text-[#594047] border border-[#E8E8E8] text-xs font-semibold py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                        title="Open interactive shipment tracker modal"
                      >
                        <span className="material-symbols-outlined text-sm text-[#8e004b]">open_in_full</span>
                        <span className="hidden sm:inline">Expanded View</span>
                      </button>

                      {/* Rate Order Button for Delivered Items */}
                      {order.status === 'Delivered' && (
                        <button
                          id={`rate-order-btn-${order.id}`}
                          onClick={() => setSelectedRatingOrder(order)}
                          className={`text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all shadow-2xs ${
                            orderRatings[order.id]
                              ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                              : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
                          }`}
                          title={
                            orderRatings[order.id]
                              ? 'View or update your rating for this order'
                              : 'Rate received products & distributor service'
                          }
                        >
                          <span className="material-symbols-outlined text-sm fill-1 text-amber-300">
                            {orderRatings[order.id] ? 'grade' : 'star'}
                          </span>
                          <span>
                            {orderRatings[order.id]
                              ? `Rated ${orderRatings[order.id].overallRating}★`
                              : 'Rate Order'}
                          </span>
                        </button>
                      )}

                      <button
                        id={`invoice-btn-${order.id}`}
                        onClick={() => onViewInvoice(order)}
                        className="bg-white hover:bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/30 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
                        title="View & print official GST tax invoice"
                      >
                        <span className="material-symbols-outlined text-sm">description</span>
                        <span>GST Invoice</span>
                      </button>

                      <button
                        id={`export-single-csv-btn-${order.id}`}
                        onClick={() => exportOrdersToCSV([order], user, `Invoice_${order.invoiceNumber}`)}
                        className="bg-[#FAF8F8] hover:bg-[#F0EDEC] text-[#594047] hover:text-[#1c1b1b] border border-[#E8E8E8] text-xs font-semibold py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-colors"
                        title="Download invoice CSV for bookkeeping"
                      >
                        <span className="material-symbols-outlined text-sm text-emerald-700">file_download</span>
                        <span className="hidden sm:inline">CSV</span>
                      </button>

                      <button
                        id={`buy-again-btn-${order.id}`}
                        onClick={() => onReorder(order)}
                        className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                        title="Immediately add all products from this order to cart"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        <span>Buy Again</span>
                      </button>
                    </div>
                  </div>

                  {/* Rating Banner if order has been rated */}
                  {orderRatings[order.id] && (
                    <div className="py-2.5 px-3.5 my-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-lg fill-1">
                          star
                        </span>
                        <div>
                          <p className="font-bold text-[#1c1b1b]">
                            Salon Feedback ({orderRatings[order.id].overallRating}/5 ★)
                          </p>
                          <p className="text-[11px] text-[#594047] line-clamp-1">
                            {orderRatings[order.id].comment || 'All items received in good condition.'}
                          </p>
                        </div>
                      </div>

                      <button
                        id={`edit-rating-btn-${order.id}`}
                        onClick={() => setSelectedRatingOrder(order)}
                        className="text-xs font-bold text-[#8e004b] hover:underline flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Edit Review</span>
                      </button>
                    </div>
                  )}

                  {/* Real-time Logistics Overview Sub-Strip */}
                  <div className="py-2.5 px-3 my-2.5 rounded-xl bg-white border border-[#E8E8E8] flex flex-wrap items-center justify-between gap-2.5 text-xs text-[#594047]">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      {order.courierPartner && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#8e004b]">
                            local_shipping
                          </span>
                          <span>Carrier: <strong className="text-[#1c1b1b]">{order.courierPartner}</strong></span>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-[#0150d6] font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            AWB: {order.trackingNumber}
                          </span>
                        </div>
                      )}

                      {order.shippingAddress && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#594047]">
                            location_on
                          </span>
                          <span className="truncate max-w-[200px] md:max-w-xs">
                            To: <strong className="text-[#1c1b1b]">{order.shippingAddress.branchName}</strong> ({order.shippingAddress.city})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#594047]">ETA:</span>
                      <span className="font-bold text-xs text-[#8e004b] bg-[#FDE7F3] px-2 py-0.5 rounded">
                        {order.estimatedDelivery || (order.status === 'Delivered' ? 'Delivered' : 'Est. 2 Days')}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Real-time Consignment Timeline with Stepping Progress Bar */}
                  {isTrackingOpen && (
                    <TrackShipmentTimeline
                      order={order}
                      onViewInvoice={onViewInvoice}
                      onReorder={onReorder}
                    />
                  )}

                  {/* Historical Items List with Direct Add to Cart Buttons */}
                  <div className="py-3 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#594047] block">
                      Ordered Products ({order.items.length}):
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => {
                        const itemKey = `${order.id}-${item.product.id}-${idx}`;
                        const isJustAdded = addedItemKey === itemKey;

                        return (
                          <div
                            key={itemKey}
                            className="bg-white p-3 rounded-xl border border-[#E8E8E8] flex items-center justify-between gap-3 shadow-2xs hover:border-[#8e004b]/40 transition-colors"
                          >
                            {/* Thumbnail & Info */}
                            <div
                              className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                              onClick={() => onSelectProduct(item.product)}
                              title="Click to view product details"
                            >
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-13 h-13 rounded-lg object-cover bg-[#fdf8f8] border border-[#E8E8E8] flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-xs text-[#1c1b1b] truncate hover:text-[#8e004b] transition-colors">
                                  {item.product.name}
                                </h4>
                                <p className="text-[10px] text-[#594047] truncate">
                                  {item.product.brand} • {item.product.category}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-bold text-[#8e004b]">
                                    ₹{item.selectedTierPrice.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] text-[#594047] bg-[#F0EDEC] px-1.5 py-0.2 rounded font-medium">
                                    Prev. Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Add to Cart Action */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <button
                                id={`add-historical-item-${order.id}-${item.product.id}`}
                                onClick={() => handleAddItemToCart(item.product, item.quantity, itemKey)}
                                className={`text-xs font-semibold py-1.5 px-3 rounded-lg transition-all active:scale-95 flex items-center gap-1 shadow-2xs ${
                                  isJustAdded
                                    ? 'bg-green-600 text-white'
                                    : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                                }`}
                                title={`Add ${item.quantity} unit(s) of ${item.product.name} to bag`}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {isJustAdded ? 'check' : 'add_shopping_cart'}
                                </span>
                                <span>{isJustAdded ? 'Added!' : `Add to Cart (x${item.quantity})`}</span>
                              </button>
                              <button
                                onClick={() => handleAddItemToCart(item.product, 1, `${itemKey}-single`)}
                                className="text-[10px] text-[#8e004b] hover:underline font-medium"
                                title="Add just 1 unit to cart"
                              >
                                + Add 1 unit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Footer Totals */}
                  <div className="pt-3 border-t border-[#E8E8E8] flex flex-wrap items-center justify-between text-xs text-[#594047] gap-2">
                    <div className="flex items-center gap-3">
                      <span>
                        Subtotal: <strong className="text-[#1c1b1b]">₹{order.subtotal.toLocaleString('en-IN')}</strong>
                      </span>
                      <span>
                        GST (18%): <strong className="text-[#0150d6]">₹{order.gstAmount.toLocaleString('en-IN')}</strong>
                      </span>
                      {order.discount > 0 && (
                        <span className="text-green-700 font-semibold">
                          Discount: -₹{order.discount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <span>Total Paid: </span>
                        <span className="text-sm font-bold text-[#8e004b]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        id={`buy-again-footer-btn-${order.id}`}
                        onClick={() => onReorder(order)}
                        className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                        title="Add all products from this order to cart immediately"
                      >
                        <span className="material-symbols-outlined text-sm">shopping_bag</span>
                        <span>Buy Again</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Track Shipment Interactive Modal */}
      {selectedTrackingModalOrder && (
        <TrackShipmentModal
          order={selectedTrackingModalOrder}
          user={user}
          onClose={() => setSelectedTrackingModalOrder(null)}
          onViewInvoice={onViewInvoice}
          onReorder={onReorder}
        />
      )}

      {/* Rate Order Interactive Modal */}
      {selectedRatingOrder && (
        <RateOrderModal
          order={selectedRatingOrder}
          existingRating={orderRatings[selectedRatingOrder.id]}
          onClose={() => setSelectedRatingOrder(null)}
          onSubmitRating={handleSaveRating}
          onSelectProduct={onSelectProduct}
        />
      )}
    </div>
  );
}
