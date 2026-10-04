export interface Product {
  id: string;
  name: string;
  brand: string;
  distributorId: string;
  distributorName: string;
  category:
    | 'Skincare'
    | 'Haircare'
    | 'Makeup'
    | 'Tools'
    | 'Furniture'
    | 'Fragrance'
    | 'Nails'
    | 'Tattoo Studio'
    | 'Spa'
    | 'Massage'
    | 'Salon Equipment'
    | 'Hair Color'
    | 'Professional Beauty Products'
    | (string & {});
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  isNew?: boolean;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  inStock: boolean;
  stockCount?: number;
  minOrderQuantity: number;
  bulkTiers: {
    minQty: number;
    pricePerUnit: number;
    discountPercent: number;
  }[];
  specifications: Record<string, string>;
  salonMarginPercent: number;
  videoUrl?: string;
  reelId?: string;
  variants?: {
    type: 'Shades' | 'Size/Volume' | 'Other' | string;
    values: string[];
  }[];
}

export interface Distributor {
  id: string;
  name: string;
  location: string;
  state: string;
  rating: number;
  reviewsCount: number;
  yearsInBusiness: number;
  verifiedGst: boolean;
  gstNumber: string;
  minOrderValue: number;
  deliveryTime: string;
  categories: string[];
  brands: string[];
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logo: string;
  featured: boolean;
  description: string;
}

export interface DistributorReel {
  id: string;
  distributorId: string;
  distributor: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl?: string;
  views: string;
  viewsCount: number;
  likes: string;
  likesCount: number;
  duration: string;
  category?: string;
  reelTag?: string;
  productTag?: string;
  createdAt: string;
  popularityScore: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTierPrice: number;
}

export interface SavedAddress {
  id: string;
  branchName: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  isDefault: boolean;
  tag: 'Flagship' | 'Branch' | 'Studio' | 'Warehouse' | 'Academy';
}

export interface User {
  name: string;
  email: string;
  phone: string;
  salonName: string;
  gstNumber: string;
  city: string;
  avatar: string;
  walletBalance: number;
  isVerified: boolean;
  savedAddresses?: SavedAddress[];
}

export interface OrderTimelineStep {
  title: string;
  time: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export type OrderStatus = 'Processing' | 'Ready to Dispatch' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Delivery Failed' | 'Cancelled';

export interface DistributorOffer {
  id: string;
  distributorId: string;
  productId: string;
  productName: string;
  offerType: 'Product Discount' | 'Bulk Purchase Offer' | 'Limited-Time Deal';
  title: string;
  description: string;
  discountPercentage?: number;
  promotionalPrice?: number;
  minBulkQty?: number;
  validUntil: string;
  isActive: boolean;
}

export interface WarehouseLocation {
  id: string;
  distributorId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  status: OrderStatus;
  distributorName: string;
  invoiceNumber: string;
  shippingAddress?: SavedAddress;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  statusTimeline?: OrderTimelineStep[];
  dispatchLocationId?: string;
  dispatchLocationName?: string;
}

export type ActiveTab = 'home' | 'directory' | 'shop' | 'profile' | 'booking';
export type AppScreen = 'splash' | 'auth' | 'app';

export interface ReorderSuggestion {
  id: string;
  product: Product;
  orderId: string;
  distributorName: string;
  purchaseDate: string;
  purchasedQty: number;
  estimatedCycleDays: number;
  daysElapsed: number;
  usagePercent: number;
  estimatedDaysRemaining: number;
  suggestedReorderQty: number;
  status: '80% Threshold Reached' | 'Critical Depletion' | 'Sufficient';
}
