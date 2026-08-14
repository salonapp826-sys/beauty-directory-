import { useState } from 'react';
import { CartItem, User, Order, SavedAddress } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  user: User | null;
  onOrderPlaced: (order: Order) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOrderPlaced,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Checkout Mode: Registered Profile vs Guest Checkout
  const [checkoutMode, setCheckoutMode] = useState<'profile' | 'guest'>(
    user ? 'profile' : 'guest'
  );

  // Guest Checkout Form State
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [guestName, setGuestName] = useState(user?.name || user?.salonName || '');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState(user?.city || 'Mumbai');
  const [guestState, setGuestState] = useState('Maharashtra');
  const [guestPincode, setGuestPincode] = useState('400050');
  const [guestNotes, setGuestNotes] = useState('');
  const [guestFormError, setGuestFormError] = useState('');

  // GST State
  const [applyGst, setApplyGst] = useState(true);
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || '27AABCU9603R1ZM');

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Subtotal calculation
  const subtotal = items.reduce((acc, item) => {
    return acc + item.selectedTierPrice * item.quantity;
  }, 0);

  // GST Calculation (18% B2B Beauty rate)
  const gstAmount = applyGst ? Math.round(subtotal * 0.18) : 0;
  const shipping = subtotal > 5000 ? 0 : 250;
  const finalTotal = Math.max(0, subtotal + gstAmount + shipping - couponDiscount);

  // Registered Address selection
  const defaultAddr = user?.savedAddresses?.find((a) => a.isDefault) || user?.savedAddresses?.[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '');
  const selectedAddress = user?.savedAddresses?.find((a) => a.id === selectedAddressId) || defaultAddr;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'SALONFIRST') {
      const discount = Math.min(500, subtotal * 0.2);
      setCouponDiscount(discount);
      setAppliedCoupon('SALONFIRST');
    } else if (couponCode.toUpperCase() === 'NEXORA10') {
      const discount = Math.round(subtotal * 0.1);
      setCouponDiscount(discount);
      setAppliedCoupon('NEXORA10');
    } else if (couponCode.toUpperCase() === 'EXPRESSGUEST') {
      const discount = Math.min(350, subtotal * 0.15);
      setCouponDiscount(discount);
      setAppliedCoupon('EXPRESSGUEST');
    } else {
      setCouponError('Invalid code. Try "SALONFIRST", "NEXORA10" or "EXPRESSGUEST"');
    }
  };

  const validateGuestForm = () => {
    const cleanPhone = guestPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setGuestFormError('Please enter a valid 10-digit mobile phone number.');
      return false;
    }
    if (!guestName.trim()) {
      setGuestFormError('Please enter your contact or salon name.');
      return false;
    }
    if (!guestAddress.trim() || guestAddress.length < 5) {
      setGuestFormError('Please enter your delivery street/suite address.');
      return false;
    }
    if (!guestCity.trim()) {
      setGuestFormError('Please specify the delivery city.');
      return false;
    }
    if (!guestPincode.trim() || guestPincode.length < 6) {
      setGuestFormError('Please enter a valid 6-digit postal pincode.');
      return false;
    }
    setGuestFormError('');
    return true;
  };

  const handleCheckout = () => {
    setGuestFormError('');

    let finalShippingAddress: SavedAddress | undefined = undefined;

    if (checkoutMode === 'guest' || !user) {
      if (!validateGuestForm()) {
        return;
      }
      finalShippingAddress = {
        id: `guest-addr-${Date.now()}`,
        branchName: guestName.includes('Salon') || guestName.includes('Studio') || guestName.includes('Spa')
          ? guestName
          : `${guestName}'s Salon`,
        recipientName: guestName,
        phone: guestPhone.startsWith('+91') ? guestPhone : `+91 ${guestPhone}`,
        addressLine1: guestAddress,
        landmark: guestNotes || undefined,
        city: guestCity,
        state: guestState || 'Maharashtra',
        pincode: guestPincode,
        gstin: applyGst ? gstNumber : undefined,
        isDefault: true,
        tag: 'Studio',
      };
    } else {
      finalShippingAddress = selectedAddress;
    }

    setIsCheckingOut(true);

    setTimeout(() => {
      const isGuest = checkoutMode === 'guest' || !user;
      const newOrder: Order = {
        id: `NEX-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...items],
        subtotal,
        gstAmount,
        discount: couponDiscount,
        total: finalTotal,
        status: 'Processing',
        distributorName: items[0]?.product.distributorName || 'Nexora Direct Logistics',
        invoiceNumber: `INV/2026/NX-${Math.floor(1000 + Math.random() * 9000)}`,
        shippingAddress: finalShippingAddress,
        courierPartner: isGuest ? 'Blue Dart Express (Priority Urgent)' : 'Blue Dart Express Surface',
        trackingNumber: `BD-${Math.floor(1000000 + Math.random() * 9000000)}`,
        estimatedDelivery: isGuest ? 'Priority Dispatch (Next Business Day)' : 'Est. 2-3 Business Days',
        statusTimeline: [
          {
            title: isGuest ? 'Urgent Guest Order Placed & Priority Logged' : 'Order Placed & GST Invoiced',
            time: 'Just now',
            description: isGuest
              ? `Dispatched via guest checkout. SMS updates linked to ${guestPhone}.`
              : 'Wholesale batch order logged on Nexora.',
            completed: true,
            current: true,
          },
          { title: 'Distributor Verification', time: 'In Queue', description: 'Distributor reviewing batch stock & dispatch slot.', completed: false },
          { title: 'Handover to Logistics', time: 'Pending', description: 'Priority courier pickup scheduled.', completed: false },
          { title: 'Delivery to Salon Branch', time: isGuest ? 'Est. Tomorrow' : 'Est. 2-3 Days', description: 'Direct delivery with OTP/SMS verification code.', completed: false },
        ],
      };

      onOrderPlaced(newOrder);
      setIsCheckingOut(false);
      onClearCart();
      onClose();
    }, 1200);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="bg-[#FCF9F8] w-full max-w-lg h-full flex flex-col justify-between shadow-2xl border-l border-[#E8E8E8] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-5 bg-white border-b border-[#E8E8E8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">
                shopping_bag
              </span>
            </div>
            <div>
              <h2 className="font-bold text-base md:text-lg text-[#1c1b1b]">Salon Order Bag</h2>
              <p className="text-xs text-[#594047]">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 text-[#594047] hover:text-[#1c1b1b] hover:bg-[#F0EDEC] rounded-full transition-colors"
            title="Close Bag"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Cart Items & Checkout Flow */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              </div>
              <h3 className="font-bold text-base text-[#1c1b1b]">Your Bag is Empty</h3>
              <p className="text-xs text-[#594047] mt-1 max-w-xs mx-auto">
                Explore our catalog of professional haircare, luxury serums, and styling tools to restock your salon.
              </p>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#594047] font-semibold px-1">
                  <span>Selected Products ({items.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-[#ba1a1a] hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-xs">delete_sweep</span>
                    <span>Clear all</span>
                  </button>
                </div>

                {items.map(({ product, quantity, selectedTierPrice }) => (
                  <div
                    key={product.id}
                    className="bg-white p-3.5 rounded-xl border border-[#E8E8E8] shadow-2xs flex gap-3 items-start"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-[#fdf8f8] border border-[#E8E8E8] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-[#1c1b1b] truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#594047] truncate">{product.brand}</p>
                      <p className="text-[10px] text-[#0150d6] font-medium truncate">
                        Distributor: {product.distributorName}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-xs md:text-sm text-[#8e004b]">
                          ₹{(selectedTierPrice * quantity).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] font-normal text-[#594047]">
                            (@₹{selectedTierPrice}/unit)
                          </span>
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#E8E8E8] rounded-lg overflow-hidden bg-[#F0EDEC]">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 hover:bg-[#ece7e7] text-xs font-bold text-[#1c1b1b]"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-[#1c1b1b] min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="px-2 py-0.5 hover:bg-[#ece7e7] text-xs font-bold text-[#1c1b1b]"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-[#8c7077] hover:text-[#ba1a1a] p-1"
                      title="Remove Item"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Mode Selector: Registered vs Guest */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E8E8] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#8e004b]">
                      local_shipping
                    </span>
                    <span>Fulfillment & Dispatch</span>
                  </span>

                  {user && (
                    <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-md border border-green-200">
                      Logged in: {user.name}
                    </span>
                  )}
                </div>

                {/* Mode Toggle Pills */}
                {user ? (
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F0EDEC] rounded-xl text-xs">
                    <button
                      type="button"
                      id="mode-profile-btn"
                      onClick={() => {
                        setCheckoutMode('profile');
                        setGuestFormError('');
                      }}
                      className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        checkoutMode === 'profile'
                          ? 'bg-[#8e004b] text-white shadow-2xs'
                          : 'text-[#594047] hover:text-[#1c1b1b]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">badge</span>
                      <span className="truncate">Salon Profile</span>
                    </button>

                    <button
                      type="button"
                      id="mode-guest-btn"
                      onClick={() => {
                        setCheckoutMode('guest');
                        setGuestFormError('');
                      }}
                      className={`py-2 px-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        checkoutMode === 'guest'
                          ? 'bg-[#8e004b] text-white shadow-2xs'
                          : 'text-[#594047] hover:text-[#1c1b1b]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm text-amber-300">bolt</span>
                      <span className="truncate">⚡ Guest / Urgent</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#FAF8F8] border border-[#8e004b]/20 p-2.5 rounded-xl flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#8e004b] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">bolt</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1c1b1b]">
                        Express Guest Checkout Active
                      </h4>
                      <p className="text-[10px] text-[#594047]">
                        No account or registration needed. Enter phone & address for immediate dispatch.
                      </p>
                    </div>
                  </div>
                )}

                {/* Profile Mode: Saved Branch Selector */}
                {checkoutMode === 'profile' && user?.savedAddresses && user.savedAddresses.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] text-[#594047] font-medium block">
                      Select Registered Salon Branch:
                    </label>
                    <select
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="w-full bg-[#FAF8F8] border border-[#E8E8E8] rounded-xl p-2.5 text-xs text-[#1c1b1b] font-medium focus:outline-none focus:border-[#8e004b]"
                    >
                      {user.savedAddresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.branchName} ({addr.city} - {addr.pincode}){addr.isDefault ? ' [Default]' : ''}
                        </option>
                      ))}
                    </select>

                    {selectedAddress && (
                      <div className="bg-[#FAF8F8] p-2.5 rounded-xl border border-[#E8E8E8]/80 text-[11px] text-[#594047] space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#1c1b1b]">
                            {selectedAddress.recipientName}
                          </p>
                          <span className="text-[10px] text-[#8e004b] font-mono font-semibold">
                            {selectedAddress.phone}
                          </span>
                        </div>
                        <p className="truncate">
                          {selectedAddress.addressLine1}
                          {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
                        </p>
                        <p>
                          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Guest Mode: Simplified Quick Form (Phone + Delivery Address) */}
                {checkoutMode === 'guest' && (
                  <div className="space-y-3 pt-1">
                    {/* Guest Benefit Banner */}
                    <div className="bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                        offline_bolt
                      </span>
                      <div>
                        <p className="font-bold">Urgent Dispatch Flow</p>
                        <p className="text-[10px] text-amber-800 leading-tight mt-0.5">
                          Bypasses full KYC and profile registration. Live courier tracking SMS will be delivered directly to this number.
                        </p>
                      </div>
                    </div>

                    {/* Phone Number (Primary Requirement) */}
                    <div>
                      <label className="text-[11px] font-bold text-[#1c1b1b] flex items-center justify-between mb-1">
                        <span>Contact Mobile Number <span className="text-red-500">*</span></span>
                        <span className="text-[10px] text-[#594047] font-normal">For OTP & AWB SMS</span>
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-[#E8E8E8] focus-within:border-[#8e004b] bg-white">
                        <span className="bg-[#F0EDEC] text-[#1c1b1b] text-xs font-semibold px-3 py-2 flex items-center border-r border-[#E8E8E8]">
                          🇮🇳 +91
                        </span>
                        <input
                          id="guest-checkout-phone"
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="e.g. 98765 43210"
                          maxLength={14}
                          className="w-full px-3 py-2 text-xs font-mono font-medium text-[#1c1b1b] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Contact / Salon Name */}
                    <div>
                      <label className="text-[11px] font-bold text-[#1c1b1b] block mb-1">
                        Recipient / Salon Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="guest-checkout-name"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Priya Verma (Style Studio)"
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                      />
                    </div>

                    {/* Delivery Street Address */}
                    <div>
                      <label className="text-[11px] font-bold text-[#1c1b1b] block mb-1">
                        Delivery Street Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="guest-checkout-address"
                        value={guestAddress}
                        onChange={(e) => setGuestAddress(e.target.value)}
                        placeholder="e.g. Shop 12, Floor 1, Crystal Mall, Linking Road"
                        rows={2}
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b] resize-none"
                      />
                    </div>

                    {/* City, State & Pincode Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-[#1c1b1b] block mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-checkout-city"
                          type="text"
                          value={guestCity}
                          onChange={(e) => setGuestCity(e.target.value)}
                          placeholder="Mumbai"
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-2.5 py-1.5 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-[#1c1b1b] block mb-1">
                          State
                        </label>
                        <input
                          id="guest-checkout-state"
                          type="text"
                          value={guestState}
                          onChange={(e) => setGuestState(e.target.value)}
                          placeholder="State"
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-2.5 py-1.5 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-[#1c1b1b] block mb-1">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="guest-checkout-pincode"
                          type="text"
                          value={guestPincode}
                          onChange={(e) => setGuestPincode(e.target.value)}
                          placeholder="400050"
                          maxLength={6}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                        />
                      </div>
                    </div>

                    {/* Urgent Delivery Note */}
                    <div>
                      <label className="text-[10px] font-semibold text-[#594047] flex items-center justify-between mb-1">
                        <span>Urgent Instructions / Landmark (Optional)</span>
                      </label>
                      <input
                        id="guest-checkout-notes"
                        type="text"
                        value={guestNotes}
                        onChange={(e) => setGuestNotes(e.target.value)}
                        placeholder="e.g. Need before Saturday 10 AM bridal makeup appointment"
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-1.5 text-xs text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                      />
                    </div>

                    {/* Error display if validation fails */}
                    {guestFormError && (
                      <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5 animate-shake">
                        <span className="material-symbols-outlined text-sm">error</span>
                        <span>{guestFormError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* GST Input Tax Credit Card */}
              <div className="bg-[#F0EDEC] p-3.5 rounded-2xl border border-[#E8E8E8] text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#1c1b1b]">
                    <span className="material-symbols-outlined text-base text-[#0150d6]">
                      receipt_long
                    </span>
                    <span>B2B Tax Invoice & GST Credit</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyGst}
                      onChange={(e) => setApplyGst(e.target.checked)}
                      className="rounded text-[#8e004b] focus:ring-[#8e004b] h-4 w-4"
                    />
                  </label>
                </div>
                {applyGst ? (
                  <div>
                    <label className="text-[10px] text-[#594047] block mb-1">
                      Salon GSTIN for 18% Input Tax Credit Claim (Optional):
                    </label>
                    <input
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 27AABCU9603R1ZM"
                      className="w-full bg-white border border-[#E8E8E8] px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-[#1c1b1b]"
                    />
                    <span className="text-[10px] text-green-700 font-medium block mt-1">
                      ✓ You will receive an official tax invoice with ₹{gstAmount.toLocaleString('en-IN')} claimable GST credit
                    </span>
                  </div>
                ) : (
                  <p className="text-[10px] text-[#594047]">
                    Standard B2B billing without separate input tax claim.
                  </p>
                )}
              </div>

              {/* Promo Code Card */}
              <div className="bg-white p-3 rounded-2xl border border-[#E8E8E8]">
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon (SALONFIRST, EXPRESSGUEST)"
                    className="flex-1 bg-[#F0EDEC] border border-transparent focus:border-[#8e004b] px-3 py-1.5 rounded-xl text-xs uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#8e004b] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl hover:bg-[#b90064] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-green-700 font-bold mt-1.5">
                    ✓ Code '{appliedCoupon}' applied! Saved ₹{couponDiscount.toLocaleString('en-IN')}
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">
                    {couponError}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer & Place Order */}
        {items.length > 0 && (
          <div className="bg-white p-4 md:p-5 border-t border-[#E8E8E8] space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#594047]">
                <span>Wholesale Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {applyGst && (
                <div className="flex justify-between text-[#594047]">
                  <span>GST (18% B2B Credit Eligible):</span>
                  <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#594047]">
                <span>Logistics & Freight:</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-green-700">FREE EXPRESS</strong>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm md:text-base font-bold text-[#1c1b1b] pt-2 border-t border-[#E8E8E8]">
                <span>Total Payable:</span>
                <span className="text-[#8e004b]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              id="place-order-btn"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Processing {checkoutMode === 'guest' ? 'Express Guest' : 'Salon'} Dispatch...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    {checkoutMode === 'guest' ? 'bolt' : 'verified'}
                  </span>
                  <span>
                    {checkoutMode === 'guest' ? '⚡ Place Express Guest Order' : 'Place Salon Order'} • ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

