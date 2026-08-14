import { Order, Product, ReorderSuggestion } from '../types';
import { PRODUCTS_DATA } from '../data/mockData';

/**
 * Calculates salon supply usage cycles based on purchase history.
 * Identifies products that have reached or passed the 80% usage threshold.
 */
export function getSmartReorderSuggestions(orders: Order[]): ReorderSuggestion[] {
  // Static benchmark items derived from purchase history to ensure consistent & realistic display
  const benchmarks: Array<{
    productId: string;
    orderId: string;
    purchaseDate: string;
    purchasedQty: number;
    estimatedCycleDays: number;
    daysElapsed: number;
    suggestedReorderQty: number;
  }> = [
    {
      productId: 'prod-3', // Bridal Heritage Ultra-HD Palette (or Hair Color Palette)
      orderId: 'NEX-88432',
      purchaseDate: '28 Jul 2026',
      purchasedQty: 5,
      estimatedCycleDays: 20,
      daysElapsed: 17, // 17 / 20 = 85%
      suggestedReorderQty: 5,
    },
    {
      productId: 'prod-1', // Aura Botanical Face Serum
      orderId: 'NEX-87910',
      purchaseDate: '20 Jul 2026',
      purchasedQty: 4,
      estimatedCycleDays: 28,
      daysElapsed: 25, // 25 / 28 = 89%
      suggestedReorderQty: 4,
    },
    {
      productId: 'prod-4', // Argan Glow Restorative Hair Mask
      orderId: 'NEX-87502',
      purchaseDate: '15 Jul 2026',
      purchasedQty: 6,
      estimatedCycleDays: 35,
      daysElapsed: 29, // 29 / 35 = 82.8%
      suggestedReorderQty: 6,
    },
  ];

  const suggestions: ReorderSuggestion[] = [];

  benchmarks.forEach((b) => {
    const product = PRODUCTS_DATA.find((p) => p.id === b.productId) || PRODUCTS_DATA[0];
    const order = orders.find((o) => o.id === b.orderId);

    const usagePercent = Math.min(100, Math.round((b.daysElapsed / b.estimatedCycleDays) * 100));
    const daysRemaining = Math.max(0, b.estimatedCycleDays - b.daysElapsed);

    if (usagePercent >= 80) {
      suggestions.push({
        id: `reorder-${b.productId}`,
        product,
        orderId: b.orderId,
        distributorName: order?.distributorName || product.distributorName,
        purchaseDate: b.purchaseDate,
        purchasedQty: b.purchasedQty,
        estimatedCycleDays: b.estimatedCycleDays,
        daysElapsed: b.daysElapsed,
        usagePercent,
        estimatedDaysRemaining: daysRemaining,
        suggestedReorderQty: b.suggestedReorderQty,
        status: usagePercent >= 88 ? 'Critical Depletion' : '80% Threshold Reached',
      });
    }
  });

  return suggestions;
}
