import { useState } from 'react';
import { Product } from '../types';
import { WishlistEmptyState } from './EmptyState';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onExploreCatalog: () => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onClearWishlist,
  onAddToCart,
  onSelectProduct,
  onExploreCatalog,
}: WishlistDrawerProps) {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [addAllSuccess, setAddAllSuccess] = useState(false);

  if (!isOpen) return null;

  const totalEstimatedValue = wishlistProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddSingle = (product: Product) => {
    onAddToCart(product, product.minOrderQuantity || 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleAddAll = () => {
    wishlistProducts.forEach((product) => {
      onAddToCart(product, product.minOrderQuantity || 1);
    });
    setAddAllSuccess(true);
    setTimeout(() => setAddAllSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDF8F8] shadow-2xl flex flex-col justify-between border-l border-[#E8E8E8] animate-slide-left">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#E8E8E8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-[#1c1b1b]">
                    Salon Wishlist
                  </h2>
                  <span className="text-xs font-bold bg-[#8e004b] text-white px-2 py-0.5 rounded-full">
                    {wishlistProducts.length}
                  </span>
                </div>
                <p className="text-xs text-[#594047]">Saved professional supplies & restock items</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {wishlistProducts.length > 0 && (
                <button
                  id="clear-wishlist-btn"
                  onClick={onClearWishlist}
                  className="text-xs text-[#594047] hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-[#F0EDEC] transition-colors"
                  title="Clear all saved items"
                >
                  Clear All
                </button>
              )}
              <button
                id="close-wishlist-drawer-btn"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#F0EDEC] text-[#594047] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
            {wishlistProducts.length === 0 ? (
              <WishlistEmptyState
                onExploreCatalog={() => {
                  onClose();
                  onExploreCatalog();
                }}
                onSelectCategoryShortcut={() => {
                  onClose();
                  onExploreCatalog();
                }}
              />
            ) : (
              <div className="space-y-3">
                {/* Information Callout */}
                <div className="p-3 bg-[#FDE7F3]/70 border border-[#8e004b]/20 rounded-xl flex items-center justify-between text-xs text-[#8e004b]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="font-medium">Direct distributor pricing locked for saved items</span>
                  </div>
                </div>

                {wishlistProducts.map((product) => {
                  const isAdded = addedIds[product.id];
                  return (
                    <div
                      key={product.id}
                      id={`wishlist-item-${product.id}`}
                      className="bg-white rounded-2xl border border-[#E8E8E8] hover:border-[#8e004b]/40 p-3.5 flex flex-col gap-2.5 shadow-2xs transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div
                          onClick={() => {
                            onClose();
                            onSelectProduct(product);
                          }}
                          className="w-20 h-20 rounded-xl bg-[#fdf8f8] border border-[#E8E8E8] overflow-hidden flex-shrink-0 cursor-pointer group"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8e004b]">
                              {product.category}
                            </span>
                            <button
                              id={`remove-wishlist-item-${product.id}`}
                              onClick={() => onRemoveFromWishlist(product.id)}
                              className="text-[#8c7077] hover:text-red-600 p-1 rounded transition-colors"
                              title="Remove from saved items"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>

                          <h4
                            onClick={() => {
                              onClose();
                              onSelectProduct(product);
                            }}
                            className="text-xs md:text-sm font-bold text-[#1c1b1b] truncate cursor-pointer hover:text-[#8e004b] transition-colors"
                          >
                            {product.name}
                          </h4>

                          <p className="text-[11px] text-[#594047] truncate">{product.brand}</p>
                          <p className="text-[10px] text-[#0150d6] font-medium truncate mt-0.5">
                            Distributor: {product.distributorName}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs md:text-sm font-bold text-[#8e004b]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] text-[#7A7A7A] line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded ml-auto">
                              {product.salonMarginPercent}% Margin
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: MOQ & Add to Cart button */}
                      <div className="pt-2 border-t border-[#F0EDEC] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#594047]">
                          MOQ: <strong>{product.minOrderQuantity || 1} Unit</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            id={`wishlist-inspect-btn-${product.id}`}
                            onClick={() => {
                              onClose();
                              onSelectProduct(product);
                            }}
                            className="bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Details
                          </button>

                          <button
                            id={`wishlist-add-btn-${product.id}`}
                            onClick={() => handleAddSingle(product)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs active:scale-95 ${
                              isAdded
                                ? 'bg-green-600 text-white'
                                : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {isAdded ? 'check' : 'shopping_bag'}
                            </span>
                            <span>{isAdded ? 'Added!' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Bulk Add */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 bg-white border-t border-[#E8E8E8] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#594047]">Est. Total Base Valuation:</span>
                <span className="text-sm font-bold text-[#1c1b1b] font-mono">
                  ₹{totalEstimatedValue.toLocaleString('en-IN')}
                </span>
              </div>

              {addAllSuccess && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-center text-xs font-semibold text-green-800 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>All {wishlistProducts.length} items added to your cart!</span>
                </div>
              )}

              <button
                id="wishlist-add-all-btn"
                onClick={handleAddAll}
                className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs md:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                <span>Add All ({wishlistProducts.length}) to Shopping Bag</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
