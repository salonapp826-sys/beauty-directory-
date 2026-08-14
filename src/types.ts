export interface Product {
  id: string;
  name: string;
  brand: string;
  distributorId: string;
  distributorName: string;
  category: 'Skincare' | 'Haircare' | 'Makeup' | 'Tools' | 'Furniture' | 'Fragrance';
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  isNew?: boolean;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  inStock: boolean;
  minOrderQuantity: number;
  bulkTiers: {
    minQty: number;
    pricePerUnit: number;
    discountPercent: number;
  }[];
  specifications: Record<string, string>;
  salonMarginPercent: number;
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

export type OrderStatus = 'Processing' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

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
}

export type ActiveTab = 'home' | 'directory' | 'shop' | 'profile';
export type AppScreen = 'splash' | 'auth' | 'app';
