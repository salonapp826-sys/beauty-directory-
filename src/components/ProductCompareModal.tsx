import React from 'react';
import { Product } from '../types';

interface ProductCompareModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onClearAll: () => void;
}

export function ProductCompareModal({
  products,
  isOpen,
  onClose,
  onRemoveFromCompare,
  onAddToCart,
  onClearAll,
}: ProductCompareModalProps) {
  if (!isOpen) return null;

  // Collect all unique specification keys across selected products
  const allSpecKeys = Array.from(
    new Set(
      products.flatMap((p) => Object.keys(p.specifications || {}))
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#FCF9F8] border-b border-[#E8E8E8] flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">compare_arrows</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#1c1b1b]">
                  Product Comparison Matrix
                </h2>
                <span className="bg-[#8e004b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {products.length} / 3 Selected
                </span>
              </div>
              <p className="text-xs text-[#594047] mt-0.5">
                Compare technical specifications, ingredients, salon margins & wholesale pricing side-by-side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {products.length > 0 && (
              <button
                id="clear-all-compare-btn"
                onClick={onClearAll}
                className="text-xs font-semibold text-[#594047] hover:text-red-600 bg-white border border-[#E8E8E8] px-3 py-1.5 rounded-xl transition-all hover:bg-red-50"
              >
                Clear All
              </button>
            )}
            <button
              id="close-compare-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200/60 text-[#594047] transition-all"
              title="Close Modal"
            >
              <span className="material-symbols-outlined text-xl block">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-[#FCF9F8] rounded-2xl border border-dashed border-[#d2c9cc] my-4">
              <span className="material-symbols-outlined text-5xl text-[#594047] mb-2">
                compare
              </span>
              <h3 className="text-base font-bold text-[#1c1b1b]">No Products Selected for Comparison</h3>
              <p className="text-xs text-[#594047] mt-1 max-w-md mx-auto">
                Select up to 3 products from the catalog to analyze technical specs, formulations, and bulk wholesale discounts side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[650px]">
                <thead>
                  {/* Product Cards Row Header */}
                  <tr className="border-b border-[#E8E8E8]">
                    <th className="p-3 bg-[#FCF9F8] w-48 text-xs font-bold text-[#594047] uppercase tracking-wider rounded-tl-2xl">
                      Product Overview
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.id}
                        className="p-4 min-w-[200px] sm:min-w-[240px] max-w-[280px] align-top bg-white relative"
                      >
                        <button
                          id={`remove-compare-prod-${product.id}`}
                          onClick={() => onRemoveFromCompare(product.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-600 flex items-center justify-center transition-all"
                          title="Remove from comparison"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>

                        <div className="space-y-3">
                          <div className="w-28 h-28 mx-auto rounded-xl bg-[#fdf8f8] p-2 border border-[#E8E8E8] overflow-hidden flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="text-center space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8e004b] block">
                              {product.brand}
                            </span>
                            <h3 className="text-sm font-bold text-[#1c1b1b] line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-[11px] text-[#0150d6] font-medium truncate">
                              {product.distributorName}
                            </p>
                          </div>

                          <div className="text-center bg-[#FDE7F3]/60 p-2 rounded-xl border border-[#8e004b]/20">
                            <div className="text-base font-extrabold text-[#8e004b]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                              {product.salonMarginPercent}% Salon Margin
                            </div>
                          </div>

                          <button
                            id={`compare-add-cart-${product.id}`}
                            onClick={() => onAddToCart(product, 1)}
                            className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Placeholder Slot if < 3 Products */}
                    {products.length < 3 && (
                      <th className="p-4 min-w-[200px] bg-stone-50/50 rounded-tr-2xl align-middle text-center">
                        <div className="p-6 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-stone-400">
                          <span className="material-symbols-outlined text-3xl">add_circle_outline</span>
                          <span className="text-xs font-semibold text-stone-500">
                            Add product to compare
                          </span>
                          <span className="text-[10px] text-stone-400">
                            (Up to 3 products)
                          </span>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E8E8E8]">
                  {/* Category & Rating */}
                  <tr>
                    <td className="p-3 bg-[#FCF9F8] font-bold text-xs text-[#594047]">
                      Category & Rating
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-3 text-xs text-[#1c1b1b] align-top">
                        <div className="space-y-1">
                          <span className="inline-block bg-[#F0EDEC] text-[#594047] font-semibold text-[10px] px-2 py-0.5 rounded-md">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <span>★ {product.rating}</span>
                            <span className="text-stone-400 text-[10px]">
                              ({product.reviewsCount} reviews)
                            </span>
                          </div>
                        </div>
                      </td>
                    ))}
                    {products.length < 3 && <td className="bg-stone-50/30" />}
                  </tr>

                  {/* Bulk Wholesale Pricing Tiers Section Header */}
                  <tr className="bg-[#8e004b]/5">
                    <td
                      colSpan={products.length + (products.length < 3 ? 2 : 1)}
                      className="p-2.5 px-3 font-bold text-xs text-[#8e004b] uppercase tracking-wider border-y border-[#8e004b]/20"
                    >
                      Wholesale Bulk Pricing Tiers
                    </td>
                  </tr>

                  {/* Bulk Pricing Comparison Row */}
                  <tr>
                    <td className="p-3 bg-[#FCF9F8] font-bold text-xs text-[#594047] align-top">
                      Bulk Price per Unit
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-3 align-top">
                        <div className="space-y-1.5">
                          {product.bulkTiers.map((tier, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg text-xs flex items-center justify-between gap-2 border ${
                                tier.discountPercent > 0
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : 'bg-[#F0EDEC] border-[#E8E8E8] text-[#1c1b1b]'
                              }`}
                            >
                              <span className="font-semibold text-[11px]">
                                {tier.minQty}+ units
                              </span>
                              <div className="text-right">
                                <span className="font-bold block">
                                  ₹{tier.pricePerUnit.toLocaleString('en-IN')}
                                </span>
                                {tier.discountPercent > 0 && (
                                  <span className="text-[10px] font-extrabold text-emerald-700">
                                    {tier.discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                    {products.length < 3 && <td className="bg-stone-50/30" />}
                  </tr>

                  {/* Technical Specifications Section Header */}
                  <tr className="bg-[#8e004b]/5">
                    <td
                      colSpan={products.length + (products.length < 3 ? 2 : 1)}
                      className="p-2.5 px-3 font-bold text-xs text-[#8e004b] uppercase tracking-wider border-y border-[#8e004b]/20"
                    >
                      Technical Specs & Formulations
                    </td>
                  </tr>

                  {/* Dynamic Technical Specs Rows */}
                  {allSpecKeys.map((specKey) => (
                    <tr key={specKey} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3 bg-[#FCF9F8] font-bold text-xs text-[#594047]">
                        {specKey}
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="p-3 text-xs text-[#1c1b1b] align-top">
                          {product.specifications?.[specKey] ? (
                            <span className="font-medium text-[#1c1b1b]">
                              {product.specifications[specKey]}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">N/A</span>
                          )}
                        </td>
                      ))}
                      {products.length < 3 && <td className="bg-stone-50/30" />}
                    </tr>
                  ))}

                  {/* Key Active Ingredients / Features Row */}
                  <tr>
                    <td className="p-3 bg-[#FCF9F8] font-bold text-xs text-[#594047] align-top">
                      Key Description Summary
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-3 text-xs text-[#594047] leading-relaxed align-top">
                        <p className="line-clamp-4 text-[11px]">{product.description}</p>
                      </td>
                    ))}
                    {products.length < 3 && <td className="bg-stone-50/30" />}
                  </tr>

                  {/* Minimum Order Quantity Row */}
                  <tr>
                    <td className="p-3 bg-[#FCF9F8] font-bold text-xs text-[#594047]">
                      Min. Order Quantity (MOQ)
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-3 text-xs font-semibold text-[#1c1b1b]">
                        {product.minOrderQuantity} Unit{product.minOrderQuantity > 1 ? 's' : ''}
                      </td>
                    ))}
                    {products.length < 3 && <td className="bg-stone-50/30" />}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FCF9F8] border-t border-[#E8E8E8] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="text-xs text-[#594047]">
            💡 <strong className="text-[#1c1b1b]">Pro Salon Tip:</strong> Compare higher margin products to boost client retail turnover.
          </div>

          <button
            id="close-compare-modal-footer-btn"
            onClick={onClose}
            className="bg-[#1c1b1b] hover:bg-black text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
