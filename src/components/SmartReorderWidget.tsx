import { useState, MouseEvent } from 'react';
import { Product, ReorderSuggestion } from '../types';

interface SmartReorderWidgetProps {
  suggestions: ReorderSuggestion[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onExploreShop?: () => void;
}

export function SmartReorderWidget({
  suggestions,
  onAddToCart,
  onSelectProduct,
  onExploreShop,
}: SmartReorderWidgetProps) {
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const handleQuickReorder = (e: MouseEvent, suggestion: ReorderSuggestion) => {
    e.stopPropagation();
    onAddToCart(suggestion.product, suggestion.suggestedReorderQty);
    setAddedItemIds((prev) => ({ ...prev, [suggestion.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [suggestion.id]: false }));
    }, 1800);
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8e004b]">inventory</span>
            <h3 className="font-bold text-sm text-[#1c1b1b]">Stock Usage & Cycle Tracker</h3>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            All Stock Optimal (&lt;80% Cycle)
          </span>
        </div>
        <p className="text-xs text-[#594047] mt-2">
          Your salon supplies are currently stocked above 20% capacity based on recent order history.
        </p>
      </div>
    );
  }

  return (
    <div id="smart-reorder-section" className="bg-white rounded-2xl border border-[#8e004b]/30 p-5 md:p-6 shadow-xs space-y-5 animate-fade-in">
      {/* Widget Header with Notification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E8E8]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="material-symbols-outlined text-2xl text-[#8e004b]">published_with_changes</span>
            <h2 className="text-lg font-bold text-[#1c1b1b]">Inventory & Low Stock Alerts</h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full shadow-2xs animate-pulse">
              <span className="material-symbols-outlined text-xs">notifications_active</span>
              <span>80%+ Usage Reached ({suggestions.length} Items)</span>
            </span>
          </div>
          <p className="text-xs text-[#594047] mt-1">
            Automated stock predictions based on past wholesale order frequency & usage cycles.
          </p>
        </div>

        {onExploreShop && (
          <button
            onClick={onExploreShop}
            className="text-xs text-[#8e004b] font-bold hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>Full Wholesale Catalog</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        )}
      </div>

      {/* Top Banner Alert Callout */}
      <div className="bg-gradient-to-r from-[#FDE7F3] via-[#fce4ec] to-white border border-[#8e004b]/30 p-3.5 rounded-xl flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-lg bg-[#8e004b] text-white flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-lg">crisis_alert</span>
        </div>
        <div className="text-xs text-[#1c1b1b] space-y-0.5">
          <p className="font-bold text-[#8e004b]">
            Reorder Recommended for {suggestions.length} Essential Supplies
          </p>
          <p className="text-[#594047] leading-relaxed text-[11px]">
            Products listed below have reached <strong>80% or higher estimated consumption</strong>. Reorder today to avoid service disruptions and maintain client booking schedules.
          </p>
        </div>
      </div>

      {/* Grid of Reorder Suggestion Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((item) => {
          const isAdded = addedItemIds[item.id];
          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.product)}
              className="bg-[#FCF9F8] rounded-xl border border-[#E8E8E8] hover:border-[#8e004b]/50 p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md relative overflow-hidden"
            >
              {/* Badge Overlay */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#8e004b] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                  {item.usagePercent}% Consumed
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">
                  Last ordered: {item.purchaseDate}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-[#E8E8E8]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#8e004b] uppercase tracking-wider">
                    {item.product.brand}
                  </p>
                  <h4 className="text-xs font-bold text-[#1c1b1b] truncate group-hover:text-[#8e004b] transition-colors">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-[#594047] mt-0.5 truncate">
                    Distributor: {item.distributorName}
                  </p>
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="space-y-1.5 mb-3 bg-white p-2.5 rounded-lg border border-[#E8E8E8]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#594047] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-amber-600">timelapse</span>
                    <span>Usage Cycle</span>
                  </span>
                  <span className="font-extrabold text-[#8e004b]">
                    {item.usagePercent}% ({item.estimatedDaysRemaining} days left)
                  </span>
                </div>

                {/* Progress bar with 80% Threshold Line Indicator */}
                <div className="relative w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.usagePercent}%` }}
                  />
                  {/* 80% Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-stone-800 z-10"
                    style={{ left: '80%' }}
                    title="80% Reorder Threshold"
                  />
                </div>

                <div className="flex justify-between text-[9px] text-stone-500 font-medium pt-0.5">
                  <span>0% (New Batch)</span>
                  <span className="text-rose-700 font-bold">80% Reorder Threshold</span>
                  <span>100% Depleted</span>
                </div>
              </div>

              {/* Price & Reorder Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E8] mt-auto">
                <div>
                  <span className="text-xs font-extrabold text-[#1c1b1b]">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    Suggested Qty: {item.suggestedReorderQty} Units
                  </span>
                </div>

                <button
                  type="button"
                  id={`quick-reorder-btn-${item.product.id}`}
                  onClick={(e) => handleQuickReorder(e, item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 ${
                    isAdded
                      ? 'bg-green-700 text-white'
                      : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isAdded ? 'check_circle' : 'repeat'}
                  </span>
                  <span>{isAdded ? 'Added ✓' : 'Instant Reorder'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
