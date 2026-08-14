import { useState } from 'react';
import { User, Order } from '../types';

interface NexoraRewardsSectionProps {
  user: User;
  orders: Order[];
  onRedeemReward?: (reward: AvailableDiscount) => void;
}

export interface LoyaltyTier {
  id: 'silver' | 'gold' | 'platinum' | 'diamond';
  name: string;
  badge: string;
  minSpend: number;
  maxSpend: number | null;
  color: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  multiplier: string;
  perks: string[];
}

export interface AvailableDiscount {
  id: string;
  code: string;
  title: string;
  discountType: 'PERCENTAGE' | 'FLAT_AMOUNT' | 'FREE_SHIPPING' | 'GIFT_BOX';
  valueDisplay: string;
  minOrderValue: number;
  categoryRestriction?: string;
  brandRestriction?: string;
  pointsCost?: number;
  isUnlocked: boolean;
  expiresIn: string;
  description: string;
}

export interface PointTransaction {
  id: string;
  orderId?: string;
  title: string;
  date: string;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS';
  details: string;
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'silver',
    name: 'Silver Partner',
    badge: 'Silver Tier',
    minSpend: 0,
    maxSpend: 50000,
    color: '#71717A',
    bgGradient: 'from-zinc-100 to-zinc-200',
    borderColor: 'border-zinc-300',
    textColor: 'text-zinc-800',
    multiplier: '1.0x Points',
    perks: ['1 Point per ₹50 spent', 'Standard 30-Day B2B Credit', 'Quarterly Catalog Updates'],
  },
  {
    id: 'gold',
    name: 'Gold Salon Partner',
    badge: 'Gold Tier ★',
    minSpend: 50000,
    maxSpend: 150000,
    color: '#D97706',
    bgGradient: 'from-amber-50 via-amber-100 to-yellow-100',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-900',
    multiplier: '1.5x Points',
    perks: [
      '1.5x Points Multiplier on Haircare & Skincare',
      '5% Quarterly Volume Rebate Vouchers',
      'Priority Logistics Dispatch Lane',
      'Free Tester Sample Kits with Orders > ₹15,000',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum Elite Salon',
    badge: 'Platinum Elite ★★★',
    minSpend: 150000,
    maxSpend: 300000,
    color: '#8e004b',
    bgGradient: 'from-[#FDE7F3] via-pink-100 to-[#FCE4EC]',
    borderColor: 'border-[#8e004b]/40',
    textColor: 'text-[#8e004b]',
    multiplier: '2.0x Points',
    perks: [
      '2.0x Points on All Wholesale Consignments',
      'Zero-Cost Express Air Freight on All Orders',
      'Dedicated Wholesale Account Manager',
      '15% Flash Rebate Coupons on Top Brands',
      'Invitations to L’Oréal & Wella Masterclasses',
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond VIP Enterprise',
    badge: 'Diamond VIP 👑',
    minSpend: 300000,
    maxSpend: null,
    color: '#0150d6',
    bgGradient: 'from-blue-50 via-indigo-50 to-sky-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    multiplier: '3.0x Points',
    perks: [
      '3.0x Points on All Direct Distributor Purchases',
      'Custom Net-60 Payment Terms Approval',
      'Priority Factory Direct Allocation',
      'Free Salon Staff Master Training Vouchers',
    ],
  },
];

export function NexoraRewardsSection({ user, orders, onRedeemReward }: NexoraRewardsSectionProps) {
  // Calculate total purchase volume from order history
  const totalPurchaseVolume = orders.reduce((sum, o) => sum + o.total, 0);

  // Compute Current Tier based on purchase volume
  const currentTier: LoyaltyTier =
    LOYALTY_TIERS.slice()
      .reverse()
      .find((t) => totalPurchaseVolume >= t.minSpend) || LOYALTY_TIERS[0];

  const currentTierIndex = LOYALTY_TIERS.findIndex((t) => t.id === currentTier.id);
  const nextTier = LOYALTY_TIERS[currentTierIndex + 1] || null;

  // Next tier progress calculation
  const spendTowardsNext = nextTier ? totalPurchaseVolume - currentTier.minSpend : 0;
  const spendRequiredForNext = nextTier ? nextTier.minSpend - currentTier.minSpend : 1;
  const progressToNextTier = nextTier
    ? Math.min(100, Math.max(0, (spendTowardsNext / spendRequiredForNext) * 100))
    : 100;
  const amountNeededForNext = nextTier ? Math.max(0, nextTier.minSpend - totalPurchaseVolume) : 0;

  // Calculate Loyalty Points (e.g. Base points + bonus from orders)
  const baseOrderPoints = orders.reduce((acc, order) => {
    // ₹100 spent = 2 points
    return acc + Math.floor(order.total / 50);
  }, 0);
  // Total points including GST bonus & onboarding bonus
  const gstBonusPoints = user.isVerified ? 500 : 0;
  const welcomeBonusPoints = 250;
  const totalLoyaltyPoints = baseOrderPoints + gstBonusPoints + welcomeBonusPoints;

  // State
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'VOUCHERS' | 'TIERS' | 'HISTORY'>('VOUCHERS');
  const [redeemedCodes, setRedeemedCodes] = useState<Record<string, boolean>>({});
  const [pointsRedeemSuccess, setPointsRedeemSuccess] = useState<string | null>(null);

  // Available Discounts & Vouchers list based on purchase history
  const availableDiscounts: AvailableDiscount[] = [
    {
      id: 'disc-gold10',
      code: 'GOLDREBATE10',
      title: '10% Off Bulk Haircare Consignment',
      discountType: 'PERCENTAGE',
      valueDisplay: '10% OFF',
      minOrderValue: 20000,
      categoryRestriction: 'Haircare Products',
      isUnlocked: totalPurchaseVolume >= 40000,
      expiresIn: 'Valid for 28 days',
      description: 'Exclusive bulk repurchase rebate for Gold and Platinum salon partners on all shampoos, hair spas, and serums.',
    },
    {
      id: 'disc-luxe1500',
      code: 'AURA1500',
      title: '₹1,500 Instant Credit on L\'Oréal & Kérastase',
      discountType: 'FLAT_AMOUNT',
      valueDisplay: '₹1,500 OFF',
      minOrderValue: 25000,
      brandRestriction: "L'Oréal Professionnel / Kérastase",
      isUnlocked: orders.length >= 2,
      expiresIn: 'Valid for 14 days',
      description: 'Applicable directly on wholesale cart orders exceeding ₹25,000 from authorized distributor channels.',
    },
    {
      id: 'disc-freeship',
      code: 'EXPRESSVIP',
      title: 'Free Express Air Freight Consignment',
      discountType: 'FREE_SHIPPING',
      valueDisplay: 'FREE AIR FREIGHT',
      minOrderValue: 15000,
      isUnlocked: currentTier.id !== 'silver',
      expiresIn: 'Always active for Gold+',
      description: 'Complimentary expedited 24-48hr door-to-door carrier shipping directly to your salon branch.',
    },
    {
      id: 'disc-points500',
      code: 'NXPOINTS500',
      title: '₹500 Instant Voucher for 500 Loyalty Points',
      discountType: 'FLAT_AMOUNT',
      valueDisplay: '₹500 VOUCHER',
      minOrderValue: 5000,
      pointsCost: 500,
      isUnlocked: totalLoyaltyPoints >= 500,
      expiresIn: 'Redeem on demand',
      description: 'Convert 500 Nexora points directly into an instant checkout coupon with no category lock.',
    },
    {
      id: 'disc-masterkit',
      code: 'VIPTESTERBOX',
      title: 'Free Salon Masterclass Sample Box',
      discountType: 'GIFT_BOX',
      valueDisplay: 'FREE SAMPLE KIT',
      minOrderValue: 35000,
      isUnlocked: totalPurchaseVolume >= 80000,
      expiresIn: 'Valid this quarter',
      description: 'Complimentary 8-piece professional trial kit with Olaplex, Matrix, and Schwarzkopf testers for your styling team.',
    },
  ];

  // Points history ledger
  const pointsHistory: PointTransaction[] = [
    ...(orders.map((o, idx) => ({
      id: `pt-${o.id}`,
      orderId: o.id,
      title: `Order #${o.id} Fulfilled (${o.distributorName})`,
      date: o.date,
      points: Math.floor(o.total / 50),
      type: 'EARNED' as const,
      details: `Earned on ₹${o.total.toLocaleString('en-IN')} wholesale purchase`,
    }))),
    ...(user.isVerified
      ? [
          {
            id: 'pt-gst',
            title: 'GSTIN Registration & Verified ITC Entitlement',
            date: '10 Aug 2026',
            points: 500,
            type: 'BONUS' as const,
            details: 'Bonus points for providing verified salon GSTIN for tax invoice pass-through',
          },
        ]
      : []),
    {
      id: 'pt-welcome',
      title: 'Nexora B2B Salon Onboarding Bonus',
      date: '01 Aug 2026',
      points: 250,
      type: 'BONUS' as const,
      details: 'Welcome credit for creating salon business account',
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeemDiscount = (discount: AvailableDiscount) => {
    if (!discount.isUnlocked) return;
    setRedeemedCodes((prev) => ({ ...prev, [discount.code]: true }));
    handleCopyCode(discount.code);
    if (onRedeemReward) {
      onRedeemReward(discount);
    }
    setPointsRedeemSuccess(`Coupon code "${discount.code}" unlocked & copied!`);
    setTimeout(() => setPointsRedeemSuccess(null), 3500);
  };

  return (
    <div id="nexora-rewards-section" className="bg-white rounded-2xl border border-[#E8E8E8] p-6 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8e004b] via-[#b90064] to-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#8e004b]/20">
            <span className="material-symbols-outlined text-2xl">workspace_premium</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-[#1c1b1b]">
                Nexora Rewards & Loyalty Program
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${currentTier.bgGradient} ${currentTier.textColor} ${currentTier.borderColor}`}>
                {currentTier.badge}
              </span>
            </div>
            <p className="text-xs text-[#594047] mt-0.5">
              Earn redeemable B2B loyalty points, tiered distributor discounts, and quarterly volume rebates on every wholesale order.
            </p>
          </div>
        </div>

        {/* Total Points Pill */}
        <div className="bg-[#FAF8F8] border border-[#E8E8E8] rounded-2xl p-3 px-4 flex items-center gap-4 justify-between sm:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#594047] block tracking-wider">
              Available Loyalty Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl md:text-2xl font-black text-[#8e004b] font-mono">
                {totalLoyaltyPoints.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#594047]">Points</span>
            </div>
          </div>
          <div className="h-8 w-px bg-[#E8E8E8]" />
          <div className="text-right">
            <span className="text-[10px] text-[#594047] block font-semibold">Redeemable Value</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ≈ ₹{totalLoyaltyPoints.toLocaleString('en-IN')} Credit
            </span>
          </div>
        </div>
      </div>

      {/* Tier Status Card & Next Milestone Bar */}
      <div className={`rounded-2xl p-5 md:p-6 border bg-gradient-to-r ${currentTier.bgGradient} ${currentTier.borderColor} shadow-2xs relative overflow-hidden`}>
        {/* Background decorative watermark */}
        <span className="material-symbols-outlined text-9xl absolute -right-4 -bottom-6 text-black/5 pointer-events-none select-none">
          military_tech
        </span>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#594047]">Current Salon Tier</span>
                <span className="text-xs font-bold bg-white/80 backdrop-blur-xs text-[#1c1b1b] px-2 py-0.5 rounded-md border border-black/10">
                  {currentTier.multiplier}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#1c1b1b] mt-1 flex items-center gap-2">
                <span>{currentTier.name}</span>
                <span className="text-xs font-normal text-[#594047]">({user.salonName})</span>
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#594047] block font-medium">Annual Wholesale Volume</span>
              <span className="text-base sm:text-lg font-bold text-[#1c1b1b]">
                ₹{totalPurchaseVolume.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Stepping / Milestone Progress Bar towards Next Tier */}
          {nextTier ? (
            <div className="bg-white/85 backdrop-blur-xs rounded-xl p-4 border border-white/60 shadow-2xs space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#8e004b]">trending_up</span>
                  <span className="font-bold text-[#1c1b1b]">
                    Progress to {nextTier.name}:
                  </span>
                </div>
                <span className="font-semibold text-[#8e004b]">
                  Spend ₹{amountNeededForNext.toLocaleString('en-IN')} more to unlock {nextTier.badge}
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-[#E8E8E8] h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-[#8e004b] via-[#b90064] to-amber-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage(progressToNextTier)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#594047] font-mono font-medium">
                <span>Current: ₹{totalPurchaseVolume.toLocaleString('en-IN')}</span>
                <span>Target: ₹{nextTier.minSpend.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-white/60 flex items-center gap-2 text-xs font-bold text-blue-900">
              <span className="material-symbols-outlined text-base text-blue-600">verified</span>
              <span>Highest Partner Tier Reached! You enjoy maximum points multiplier & dedicated enterprise terms.</span>
            </div>
          )}

          {/* Current Tier Perks Grid */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#594047] block mb-2">
              Active Tier Privileges:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {currentTier.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-black/5 flex items-start gap-2 text-xs text-[#1c1b1b] shadow-2xs"
                >
                  <span className="material-symbols-outlined text-sm text-[#8e004b] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="leading-tight font-medium">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation: Available Discounts, Tier Comparison, Points History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('VOUCHERS')}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'VOUCHERS'
                ? 'bg-[#8e004b] text-white shadow-2xs'
                : 'bg-[#FAF8F8] text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">sell</span>
            <span>Available Discounts & Vouchers ({availableDiscounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('TIERS')}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'TIERS'
                ? 'bg-[#8e004b] text-white shadow-2xs'
                : 'bg-[#FAF8F8] text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grade</span>
            <span>Tier Benefits Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'HISTORY'
                ? 'bg-[#8e004b] text-white shadow-2xs'
                : 'bg-[#FAF8F8] text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">history</span>
            <span>Points Ledger & Activity</span>
          </button>
        </div>

        {pointsRedeemSuccess && (
          <span className="text-xs font-bold text-green-800 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl flex items-center gap-1 animate-fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{pointsRedeemSuccess}</span>
          </span>
        )}
      </div>

      {/* TAB 1: AVAILABLE DISCOUNTS & VOUCHERS */}
      {activeTab === 'VOUCHERS' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDiscounts.map((discount) => {
              const isCopied = copiedCode === discount.code;
              const isRedeemed = redeemedCodes[discount.code];

              return (
                <div
                  key={discount.id}
                  className={`rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
                    discount.isUnlocked
                      ? 'bg-[#FAF8F8] border-[#8e004b]/30 hover:border-[#8e004b] hover:shadow-xs'
                      : 'bg-[#F9F9F9] border-[#E8E8E8] opacity-75'
                  }`}
                >
                  {/* Top discount header */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-[#FDE7F3] text-[#8e004b] border border-[#8e004b]/20">
                        {discount.valueDisplay}
                      </span>

                      {discount.isUnlocked ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">check</span>
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#7A7A7A] bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">lock</span>
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-[#1c1b1b] mt-2.5 leading-snug">
                      {discount.title}
                    </h4>

                    <p className="text-xs text-[#594047] mt-1 leading-relaxed">
                      {discount.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#E8E8E8] space-y-1 text-[11px] text-[#594047]">
                      <div className="flex justify-between">
                        <span>Min Wholesale Spend:</span>
                        <strong className="text-[#1c1b1b]">₹{discount.minOrderValue.toLocaleString('en-IN')}</strong>
                      </div>

                      {discount.brandRestriction && (
                        <div className="flex justify-between">
                          <span>Applicable Brands:</span>
                          <strong className="text-[#8e004b]">{discount.brandRestriction}</strong>
                        </div>
                      )}

                      {discount.categoryRestriction && (
                        <div className="flex justify-between">
                          <span>Eligible Category:</span>
                          <strong className="text-[#0150d6]">{discount.categoryRestriction}</strong>
                        </div>
                      )}

                      <div className="flex justify-between text-[10px] text-[#7A7A7A]">
                        <span>Expiry / Validity:</span>
                        <span>{discount.expiresIn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code & Action Button */}
                  <div className="mt-4 pt-3 border-t border-[#E8E8E8] flex items-center justify-between gap-2">
                    <div className="bg-white border border-dashed border-[#8e004b]/40 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#8e004b] select-all">
                      {discount.code}
                    </div>

                    {discount.isUnlocked ? (
                      <button
                        onClick={() => handleRedeemDiscount(discount)}
                        className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all shadow-2xs active:scale-95 flex-shrink-0"
                        title="Copy code and apply on wholesale checkout"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isCopied ? 'check' : 'content_copy'}
                        </span>
                        <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-medium text-[#7A7A7A] italic">
                        Spend more to unlock
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TIER BENEFITS ROADMAP */}
      {activeTab === 'TIERS' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LOYALTY_TIERS.map((tier) => {
              const isCurrent = tier.id === currentTier.id;

              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-4 md:p-5 border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? `bg-gradient-to-b ${tier.bgGradient} ${tier.borderColor} ring-2 ring-[#8e004b] shadow-md`
                      : 'bg-[#FAF8F8] border-[#E8E8E8] hover:border-[#8e004b]/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-black/10 text-[#1c1b1b]">
                        {tier.multiplier}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-[#8e004b] text-white px-2 py-0.5 rounded-full shadow-2xs">
                          Your Tier
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-[#1c1b1b] mt-1">{tier.name}</h4>
                    <p className="text-xs font-medium text-[#594047] mt-0.5">
                      {tier.maxSpend
                        ? `₹${tier.minSpend.toLocaleString('en-IN')} – ₹${tier.maxSpend.toLocaleString('en-IN')} / year`
                        : `₹${tier.minSpend.toLocaleString('en-IN')}+ / year`}
                    </p>

                    <div className="my-3 border-t border-black/10" />

                    <ul className="space-y-2 text-xs text-[#1c1b1b]">
                      {tier.perks.map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#8e004b] flex-shrink-0 mt-0.5">
                            verified
                          </span>
                          <span className="text-[11px] leading-snug">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/10 text-center">
                    {isCurrent ? (
                      <span className="text-xs font-bold text-[#8e004b] flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Active Tier Privileges</span>
                      </span>
                    ) : totalPurchaseVolume >= tier.minSpend ? (
                      <span className="text-xs font-semibold text-emerald-700">Achieved</span>
                    ) : (
                      <span className="text-[11px] text-[#594047]">
                        Spend ₹{(tier.minSpend - totalPurchaseVolume).toLocaleString('en-IN')} to reach
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: POINTS HISTORY LEDGER */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-[#FAF8F8] rounded-xl border border-[#E8E8E8] overflow-hidden">
            <div className="px-4 py-3 bg-[#F0EDEC] border-b border-[#E8E8E8] flex justify-between items-center text-xs font-bold text-[#1c1b1b]">
              <span>Activity & Transaction Description</span>
              <span>Points Added / Credited</span>
            </div>

            <div className="divide-y divide-[#E8E8E8]">
              {pointsHistory.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-base">
                        {tx.type === 'EARNED' ? 'shopping_bag' : 'military_tech'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-[#1c1b1b]">{tx.title}</p>
                      <p className="text-[11px] text-[#594047] mt-0.5">{tx.details}</p>
                      <span className="text-[10px] text-[#7A7A7A] block mt-0.5 font-mono">
                        {tx.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      +{tx.points} Pts
                    </span>
                    <span className="text-[10px] text-[#594047] block mt-1">
                      ≈ ₹{tx.points} Value
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function progressPercentage(val: number): number {
  return Math.min(100, Math.max(0, val));
}
