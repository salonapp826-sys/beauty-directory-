import { useState, FormEvent, ChangeEvent } from 'react';
import { Distributor, Product, DistributorReel, Order, OrderStatus, User, WarehouseLocation, DistributorOffer } from '../types';

interface MockReview {
  salonName: string;
  stars: number;
  comment: string;
}

function getMockReviewsForDistributor(id: string): MockReview[] {
  switch (id) {
    case 'dist-1':
      return [
        { salonName: 'Elite Skin Care Studio, Mumbai', stars: 5, comment: 'Aura Botanical Serums are absolute bestsellers in our facials. Claimed 18% GST input credit smoothly!' },
        { salonName: 'Grace & Glow Unisex Salon, Pune', stars: 5, comment: 'Extremely prompt delivery within 24 hours. Genuine batch products, highly recommended.' },
        { salonName: 'Vibe Unisex Spa, Bengaluru', stars: 5, comment: 'Authentic organic luxury items. The margin percent is really high and customers love the fragrance.' }
      ];
    case 'dist-2':
      return [
        { salonName: 'DermaClinique Spa, Delhi NCR', stars: 5, comment: 'Ordered 3 styling chairs and pro hair dryers. Excellent CP build quality and safe packaging.' },
        { salonName: 'Scissors & Spice Salon, Gurgaon', stars: 4, comment: 'Dyson B2B tools are genuine and came with official 2-year warranty card. Very reliable salon equipment supplier.' },
        { salonName: 'Luxe Hair & Nail Lounge, Noida', stars: 5, comment: 'Apex Spa tables are comfortable, client feedback is top notch.' }
      ];
    case 'dist-3':
      return [
        { salonName: 'Aura Luxe Beauty Studio, Bangalore', stars: 5, comment: 'Excellent pigment palettes for bridal makeup. Kryolan and MAC supplies are 100% authentic.' },
        { salonName: 'Pink Petals Bridal Salon, Chennai', stars: 5, comment: 'Bridal client makeup glows. Regular buyer here, volume bulk tier prices are incredibly economical.' },
        { salonName: 'Bella Beauty Parlour, Hyderabad', stars: 5, comment: 'ColorCraft HD foundations are perfect for Indian skin tones. Always in stock!' }
      ];
    case 'dist-4':
      return [
        { salonName: 'Royal Hair Masterclass, Hyderabad', stars: 5, comment: 'Best wholesale source for original Olaplex and Kerastase backbar sets. Genuine salon seal.' },
        { salonName: 'Mirrors Salon & Spa, Secunderabad', stars: 4, comment: 'Moroccan Royal hair oils did wonders for our bridal hair spa sessions. Fast delivery!' },
        { salonName: 'Trendz Salon, Vijayawada', stars: 5, comment: 'Reliable distribution, prompt customer support on whatsapp.' }
      ];
    default:
      return [
        { salonName: 'Premium Salon Hub, India', stars: 5, comment: 'High quality professional beauty products. GST Invoice issued quickly.' },
        { salonName: 'Metro Style Lounge, Mumbai', stars: 5, comment: 'Extremely professional distributor service and transparent bulk discounts.' }
      ];
  }
}

interface DistributorProfileModalProps {
  distributor: Distributor;
  products: Product[];
  reels: DistributorReel[];
  orders?: Order[];
  user?: User | null;
  warehouseLocations?: WarehouseLocation[];
  onUploadReel: (newReel: DistributorReel) => void;
  onEditReel?: (updatedReel: DistributorReel) => void;
  onDeleteReel?: (reelId: string) => void;
  onToggleFeatureReel?: (reelId: string) => void;
  onLikeReel: (reelId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (distributor: Distributor) => void;
  onClose: () => void;
  onAddProduct?: (newProduct: Product) => void;
  onViewInvoice?: (order: Order) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onUpdateProductStock?: (productId: string, stockCount: number) => void;
  onAddWarehouseLocation?: (loc: Omit<WarehouseLocation, 'id'>) => void;
  onUpdateWarehouseLocation?: (loc: WarehouseLocation) => void;
  onSetDefaultWarehouseLocation?: (id: string) => void;
  onAssignDispatchLocation?: (orderId: string, locationId: string, locationName: string, status?: OrderStatus) => void;
  distributorOffers?: DistributorOffer[];
  onAddOffer?: (offer: Omit<DistributorOffer, 'id'>) => void;
  onDeleteOffer?: (offerId: string) => void;
  onToggleOfferStatus?: (offerId: string) => void;
}

const PRESET_THUMBNAILS = [
  {
    name: 'Salon Masterclass',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Facial & Glow Demo',
    url: 'https://images.unsplash.com/photo-1512290900673-7002008f51a0?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Equipment Unboxing',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Hair Treatment Result',
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Spa & Aroma Machine',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
  },
];

export interface ReelComment {
  id: string;
  userName: string;
  salonName?: string;
  avatar?: string;
  content: string;
  createdAt: string;
  isDistributor?: boolean;
}

const INITIAL_COMMENTS: Record<string, ReelComment[]> = {
  'reel-3': [
    {
      id: 'c-3-1',
      userName: 'Anjali Gupta',
      salonName: 'Elite Skin Care Studio',
      content: 'Is this serum safe to use with microcurrent or ultrasound devices during a facial?',
      createdAt: '1 day ago',
    },
    {
      id: 'c-3-2',
      userName: 'Nexora Support',
      content: 'Absolutely! It is water-based, highly conductive, and packed with active botanicals, making it excellent for microcurrent glide.',
      createdAt: '18 hours ago',
      isDistributor: true,
    },
    {
      id: 'c-3-3',
      userName: 'Nikhil Sen',
      salonName: 'Glow & Grace Salon',
      content: 'How many facials can we get out of one 50ml bottle? Trying to estimate backbar cost.',
      createdAt: '2 days ago',
    },
    {
      id: 'c-3-4',
      userName: 'Nexora Support',
      content: 'You only need 3 to 4 drops per service. One 50ml bottle typically yields around 45 to 50 treatments!',
      createdAt: '1 day ago',
      isDistributor: true,
    }
  ],
  'reel-1': [
    {
      id: 'c-1-1',
      userName: 'Preeti Malhotra',
      salonName: 'Bellezza Luxury Salon',
      content: 'Is this formula completely formaldehyde-free? Do we need specialized ventilation?',
      createdAt: '4 days ago',
    },
    {
      id: 'c-1-2',
      userName: 'Nexora Support',
      content: 'Yes, it is 100% formaldehyde-free! However, as with all heat-styling services, standard room ventilation is recommended for comfort.',
      createdAt: '3 days ago',
      isDistributor: true,
    },
    {
      id: 'c-1-3',
      userName: 'Meera Deshmukh',
      salonName: 'Curls & Swirls Academy',
      content: 'Does it work well on highly textured Type 4 hair?',
      createdAt: '3 days ago',
    }
  ],
  'reel-2': [
    {
      id: 'c-2-1',
      userName: 'Kabir Dev',
      salonName: 'The Barber Co.',
      content: 'What is the warranty period for this straightener if purchased through the app?',
      createdAt: '1 week ago',
    },
    {
      id: 'c-2-2',
      userName: 'LuxeTech Support',
      content: 'Hi Kabir! It comes with a 1-year brand warranty. You can register it using the invoice provided here.',
      createdAt: '6 days ago',
      isDistributor: true,
    }
  ],
  'reel-4': [
    {
      id: 'c-4-1',
      userName: 'Ritu Kapoor',
      salonName: 'DermaClinique Spa',
      content: 'Can we order replacement probes or handles separately if they break?',
      createdAt: '2 weeks ago',
    },
    {
      id: 'c-4-2',
      userName: 'Apex Support',
      content: 'Yes, Ritu! We stock individual replacement probes and accessories. Just message us directly or place a quote request.',
      createdAt: '12 days ago',
      isDistributor: true,
    }
  ]
};

export function DistributorProfileModal({
  distributor,
  products,
  reels,
  orders = [],
  user = null,
  warehouseLocations = [],
  onUploadReel,
  onEditReel,
  onDeleteReel,
  onToggleFeatureReel,
  onLikeReel,
  onAddToCart,
  onSelectProduct,
  onRequestQuote,
  onClose,
  onAddProduct,
  onViewInvoice,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onAddWarehouseLocation,
  onUpdateWarehouseLocation,
  onSetDefaultWarehouseLocation,
  onAssignDispatchLocation,
  distributorOffers = [],
  onAddOffer,
  onDeleteOffer,
  onToggleOfferStatus,
}: DistributorProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'reels' | 'upload' | 'addProduct' | 'orders' | 'inventory' | 'buyers' | 'sales' | 'warehouses' | 'offers'>('catalog');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string>('ALL');
  const [selectedBuyer, setSelectedBuyer] = useState<any | null>(null);

  const [isAddWhModalOpen, setIsAddWhModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<WarehouseLocation | null>(null);
  const [whName, setWhName] = useState('');
  const [whAddress, setWhAddress] = useState('');
  const [whCity, setWhCity] = useState('');
  const [whState, setWhState] = useState('');
  const [whPincode, setWhPincode] = useState('');
  const [whIsDefault, setWhIsDefault] = useState(false);

  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerType, setOfferType] = useState<'Product Discount' | 'Bulk Purchase Offer' | 'Limited-Time Deal'>('Product Discount');
  const [offerProductId, setOfferProductId] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('15');
  const [offerMinQty, setOfferMinQty] = useState('10');
  const [offerValidUntil, setOfferValidUntil] = useState('2026-12-31');

  const distributorOffersList = distributorOffers.filter(
    (o) => o.distributorId === distributor.id || o.distributorId === 'dist-1'
  );

  const distributorWarehouses = warehouseLocations.filter(
    (w) => w.distributorId === distributor.id || w.distributorId === 'dist-1'
  );

  const distributorProducts = products.filter(
    (p) => p.distributorId === distributor.id || p.distributorName === distributor.name
  );

  const distributorOrders = orders.filter(o =>
    o.distributorName.toLowerCase() === distributor.name.toLowerCase() ||
    o.items.some(item => item.product.distributorId === distributor.id)
  );

  const filteredOrders = distributorOrders.filter(o => {
    if (orderStatusFilter === 'ALL') return true;
    return o.status.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  const getStockCount = (p: Product) => {
    if (p.stockCount !== undefined) return p.stockCount;
    return 30;
  };

  const filteredInventory = distributorProducts.filter(p => {
    const qty = getStockCount(p);
    if (inventoryStatusFilter === 'IN_STOCK') return qty > 5;
    if (inventoryStatusFilter === 'LOW_STOCK') return qty > 0 && qty <= 5;
    if (inventoryStatusFilter === 'OUT_OF_STOCK') return qty === 0;
    return true;
  });

  const inStockCount = distributorProducts.filter(p => getStockCount(p) > 5).length;
  const lowStockCount = distributorProducts.filter(p => {
    const q = getStockCount(p);
    return q > 0 && q <= 5;
  }).length;
  const outOfStockCount = distributorProducts.filter(p => getStockCount(p) === 0).length;

  // Sales & Buyers computations
  const validOrders = distributorOrders.filter(o => o.status !== 'Cancelled');
  const totalSales = validOrders.reduce((acc, o) => acc + o.total, 0);
  const todaysSales = validOrders.length > 0 ? validOrders[0].total : 0;
  const thisMonthsSales = totalSales;
  const totalOrdersCount = validOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;

  const buyerMap = new Map<string, {
    name: string;
    type: string;
    location: string;
    orders: Order[];
    totalSpent: number;
    lastOrderDate: string;
    latestStatus: string;
  }>();

  distributorOrders.forEach(order => {
    const buyerName = order.shippingAddress?.recipientName || user?.salonName || 'Elite Salon & Spa Network';
    const location = order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'Noida, UP';
    const type = order.shippingAddress?.branchName?.includes('Spa') ? 'Luxury Spa' : 'Salon & Hair Lounge';

    if (!buyerMap.has(buyerName)) {
      buyerMap.set(buyerName, {
        name: buyerName,
        type,
        location,
        orders: [],
        totalSpent: 0,
        lastOrderDate: order.date,
        latestStatus: order.status,
      });
    }

    const b = buyerMap.get(buyerName)!;
    b.orders.push(order);
    if (order.status !== 'Cancelled') {
      b.totalSpent += order.total;
    }
  });

  const buyersList = Array.from(buyerMap.values());

  // B2B Add Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState(distributor.brands[0] || 'Generic');
  const [newProdCategory, setNewProdCategory] = useState(distributor.categories[0] || 'Haircare');
  const [newProdPrice, setNewProdPrice] = useState('1499');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('1999');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMoq, setNewProdMoq] = useState('5');
  const [newProdMargin, setNewProdMargin] = useState('40');
  const [newProdImage, setNewProdImage] = useState('');
  const [selectedProdImageFile, setSelectedProdImageFile] = useState<string | null>(null);
  
  // Video connection state
  const [newProdVideoType, setNewProdVideoType] = useState<'upload' | 'link'>('upload');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<string | null>(null);
  const [newProdVideoLink, setNewProdVideoLink] = useState('');

  // Variants & Stock states
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [newProdVariants, setNewProdVariants] = useState<{ type: string; values: string[] }[]>([]);
  const [variantTypeInput, setVariantTypeInput] = useState<'Shades' | 'Size/Volume' | 'Other'>('Shades');
  const [variantValueInput, setVariantValueInput] = useState('');

  const [commentsMap, setCommentsMap] = useState<Record<string, ReelComment[]>>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedPresetThumbnail, setSelectedPresetThumbnail] = useState(PRESET_THUMBNAILS[0].url);
  const [customThumbnail, setCustomThumbnail] = useState('');
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Haircare');
  const [reelTag, setReelTag] = useState('Tutorial');
  const [productTag, setProductTag] = useState('');
  const [duration, setDuration] = useState('0:45');
  const [isFeaturedUpload, setIsFeaturedUpload] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Edit Reel Form State
  const [editingReel, setEditingReel] = useState<DistributorReel | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('Haircare');
  const [editReelTag, setEditReelTag] = useState('Tutorial');
  const [editProductTag, setEditProductTag] = useState('');
  const [editDuration, setEditDuration] = useState('0:45');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);

  // Delete Reel Confirmation State
  const [deletingReelId, setDeletingReelId] = useState<string | null>(null);

  // Upload Progress Simulation
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Playing reel modal
  const [playingReel, setPlayingReel] = useState<DistributorReel | null>(null);

  // Open Edit Modal with prefilled reel data
  const openEditModal = (reel: DistributorReel) => {
    setEditingReel(reel);
    setEditTitle(reel.title);
    setEditDescription(reel.description || '');
    setEditCategory(reel.category || 'Haircare');
    setEditReelTag(reel.reelTag || 'Tutorial');
    setEditProductTag(reel.productTag || '');
    setEditDuration(reel.duration || '0:45');
    setEditThumbnail(reel.thumbnail || '');
    setEditIsFeatured(!!reel.isFeatured);
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingReel || !editTitle.trim()) return;

    const updated: DistributorReel = {
      ...editingReel,
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory,
      reelTag: editReelTag,
      productTag: editProductTag.trim() || 'Professional Product',
      duration: editDuration,
      thumbnail: editThumbnail.trim() || editingReel.thumbnail,
      isFeatured: editIsFeatured,
    };

    if (onEditReel) {
      onEditReel(updated);
    }

    setEditingReel(null);
    setUploadSuccessMsg(
      updated.isFeatured
        ? `📌 "${updated.title}" updated & featured at the top of HomeScreen!`
        : `"${updated.title}" updated successfully.`
    );
  };

  const confirmDelete = (reelId: string) => {
    if (onDeleteReel) {
      onDeleteReel(reelId);
    }
    setDeletingReelId(null);
    if (playingReel && playingReel.id === reelId) {
      setPlayingReel(null);
    }
    setUploadSuccessMsg('Video reel deleted successfully from your distributor library.');
  };

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !playingReel) return;

    const newComment: ReelComment = {
      id: `c-new-${Date.now()}`,
      userName: 'Riya Sharma',
      salonName: 'Aura Luxe Salon & Spa',
      content: newCommentText.trim(),
      createdAt: 'Just now',
    };

    setCommentsMap((prev) => ({
      ...prev,
      [playingReel.id]: [...(prev[playingReel.id] || []), newComment],
    }));

    setNewCommentText('');
  };

  // Filter reels belonging to this distributor
  const distributorReels = reels.filter(
    (r) =>
      r.distributorId === distributor.id ||
      r.distributor.toLowerCase().includes(distributor.name.toLowerCase()) ||
      distributor.name.toLowerCase().includes(r.distributor.toLowerCase())
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
    }
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStage('Uploading HD Video Stream to Nexora CDN...');

    setTimeout(() => {
      setUploadProgress(45);
      setUploadStage('Extracting keyframe thumbnails & running AI product tagging...');
    }, 800);

    setTimeout(() => {
      setUploadProgress(80);
      setUploadStage('Computing popularity score & indexing for HomeScreen Popular Reels...');
    }, 1600);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStage('Video Processed & Published Successfully!');

      const finalThumb = customThumbnail.trim() || selectedPresetThumbnail;
      const initialViews = 1200;
      const initialLikes = 180;
      // High popularity score for freshly uploaded reels so they rank top on HomeScreen
      const score = initialViews + initialLikes * 5 + 25000;

      const newReel: DistributorReel = {
        id: `reel-user-${Date.now()}`,
        distributorId: distributor.id,
        distributor: distributor.name,
        title: title.trim(),
        description: description.trim() || 'Official distributor product usage demo & unboxing.',
        thumbnail: finalThumb,
        views: '1.2K views',
        viewsCount: initialViews,
        likes: '180',
        likesCount: initialLikes,
        duration: duration || '0:45',
        category,
        reelTag,
        productTag: productTag.trim() || distributor.brands[0] || 'Professional Product',
        createdAt: 'Just now',
        popularityScore: score,
        isFeatured: isFeaturedUpload,
      };

      onUploadReel(newReel);

      setIsUploading(false);
      setUploadSuccessMsg(
        isFeaturedUpload
          ? `📌 "${newReel.title}" published & pinned to the top of the HomeScreen video section!`
          : `"${newReel.title}" has been processed, ranked, and published to HomeScreen Popular Reels!`
      );
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setSelectedFileName(null);
      setCustomThumbnail('');
      setIsFeaturedUpload(false);

      setTimeout(() => {
        setActiveTab('reels');
      }, 600);
    }, 2400);
  };

  const handleAddVariantGroup = () => {
    if (!variantValueInput.trim()) return;
    const newValues = variantValueInput
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    if (newValues.length === 0) return;

    const groupName = variantTypeInput === 'Size/Volume' ? 'Size / Volume' : variantTypeInput;
    const existingIndex = newProdVariants.findIndex((v) => v.type === groupName);

    if (existingIndex !== -1) {
      const updated = [...newProdVariants];
      const combined = Array.from(new Set([...updated[existingIndex].values, ...newValues]));
      updated[existingIndex] = { ...updated[existingIndex], values: combined };
      setNewProdVariants(updated);
    } else {
      setNewProdVariants([...newProdVariants, { type: groupName, values: newValues }]);
    }
    setVariantValueInput('');
  };

  const handleRemoveVariantGroup = (index: number) => {
    setNewProdVariants(newProdVariants.filter((_, i) => i !== index));
  };

  const handleRemoveVariantValue = (groupIndex: number, valIndex: number) => {
    const updated = [...newProdVariants];
    const group = updated[groupIndex];
    const updatedValues = group.values.filter((_, i) => i !== valIndex);
    if (updatedValues.length === 0) {
      setNewProdVariants(newProdVariants.filter((_, i) => i !== groupIndex));
    } else {
      updated[groupIndex] = { ...group, values: updatedValues };
      setNewProdVariants(updated);
    }
  };

  const handleAddPresetValue = (type: 'Shades' | 'Size/Volume', value: string) => {
    const groupName = type === 'Size/Volume' ? 'Size / Volume' : type;
    const existingIndex = newProdVariants.findIndex((v) => v.type === groupName);

    if (existingIndex !== -1) {
      if (newProdVariants[existingIndex].values.includes(value)) return;
      const updated = [...newProdVariants];
      updated[existingIndex] = { ...updated[existingIndex], values: [...updated[existingIndex].values, value] };
      setNewProdVariants(updated);
    } else {
      setNewProdVariants([...newProdVariants, { type: groupName, values: [value] }]);
    }
  };

  const handleProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const basePrice = parseFloat(newProdPrice);
    const retailPrice = newProdOriginalPrice.trim() ? parseFloat(newProdOriginalPrice) : Math.round(basePrice * 1.4);
    
    const minQty = parseInt(newProdMoq) || 1;
    const bulkTiers = [
      { minQty: minQty, pricePerUnit: basePrice, discountPercent: 0 },
      { minQty: minQty * 3, pricePerUnit: Math.round(basePrice * 0.92), discountPercent: 8 },
      { minQty: minQty * 10, pricePerUnit: Math.round(basePrice * 0.85), discountPercent: 15 }
    ];

    const beautyImagesPreset = [
      'https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop'
    ];

    const finalImage = newProdImage.trim() || selectedProdImageFile || beautyImagesPreset[Math.floor(Math.random() * beautyImagesPreset.length)];

    const createdProduct: Product = {
      id: `prod-user-${Date.now()}`,
      name: newProdName.trim(),
      brand: newProdBrand,
      distributorId: distributor.id,
      distributorName: distributor.name,
      category: newProdCategory,
      price: basePrice,
      originalPrice: retailPrice,
      discountBadge: `${Math.round(((retailPrice - basePrice) / retailPrice) * 100)}% Margin`,
      isNew: true,
      image: finalImage,
      rating: 5.0,
      reviewsCount: 1,
      description: newProdDesc.trim() || `${newProdName} is a high-performance beauty item cataloged natively by ${distributor.name} on the B2B portal.`,
      inStock: newProdInStock,
      minOrderQuantity: minQty,
      bulkTiers: bulkTiers,
      specifications: {
        'Origin': 'India',
        'Formulation': 'Professional Grade',
        'Packaging': 'Salon Pack',
        'Authorized Channel': distributor.name,
      },
      salonMarginPercent: parseInt(newProdMargin) || 40,
      variants: newProdVariants.length > 0 ? newProdVariants : undefined,
    };

    if (onAddProduct) {
      onAddProduct(createdProduct);
    }

    setUploadSuccessMsg(`🎉 "${createdProduct.name}" added to your catalog successfully! Variants and stock status are now live.`);
    
    // Clear states
    setNewProdName('');
    setNewProdDesc('');
    setNewProdPrice('1499');
    setNewProdOriginalPrice('1999');
    setNewProdMoq('5');
    setNewProdMargin('40');
    setNewProdVariants([]);
    setNewProdInStock(true);

    setTimeout(() => {
      setActiveTab('catalog');
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E8E8] relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#1c1b1b] via-[#2d1b24] to-[#1c1b1b] text-white p-5 md:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close Profile"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={distributor.logo}
              alt={distributor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8e004b] bg-white shadow-md shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold bg-[#8e004b] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Master Distributor
                </span>
                <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>GSTIN: {distributor.gstNumber}</span>
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">{distributor.name}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300 mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#ffcbd9]">location_on</span>
                  <span>{distributor.location}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                  <span>{distributor.rating} ({distributor.reviewsCount} reviews)</span>
                </span>
                <span className="text-stone-400">• {distributor.yearsInBusiness} Years Industry Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-center">
              <button
                type="button"
                onClick={() => {
                  window.open(
                    `https://wa.me/${distributor.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                      distributor.name
                    )},%20I%20am%20a%20salon%20owner%20reaching%20out%20via%20Nexora.`,
                    '_blank'
                  );
                }}
                className="bg-[#25D366] hover:bg-[#20ba59] text-stone-950 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => onRequestQuote(distributor)}
                className="bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">request_quote</span>
                <span>Request Quote</span>
              </button>
            </div>
          </div>

          {/* Quick SLA Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-400 block">Minimum Order</span>
              <span className="font-bold text-white">₹{distributor.minOrderValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-400 block">Delivery SLA</span>
              <span className="font-bold text-emerald-300 truncate block">{distributor.deliveryTime}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-400 block">Published Video Reels</span>
              <span className="font-bold text-rose-300">{distributorReels.length} Videos</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-stone-400 block">Supplied Brands</span>
              <span className="font-bold text-amber-200 truncate block">{distributor.brands.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#F0EDEC] border-b border-[#E8E8E8] px-4 md:px-6 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">inventory_2</span>
            <span>Product Catalog ({distributorProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reels')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'reels'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">movie</span>
            <span>Video Reels & Demos ({distributorReels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            <span>Wholesale Orders ({distributorOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">warehouse</span>
            <span>Stock & Inventory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buyers')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'buyers'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">groups</span>
            <span>Buyers ({buyersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'sales'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">trending_up</span>
            <span>Sales Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warehouses')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'warehouses'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">location_city</span>
            <span>Business / Warehouses ({distributorWarehouses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'offers'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#594047] hover:text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_offer</span>
            <span>Offers & Promotions ({distributorOffersList.length})</span>
          </button>

          <button
            type="button"
            id="distributor-upload-reel-tab-btn"
            onClick={() => setActiveTab('upload')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-[#8e004b] bg-[#FDE7F3] hover:bg-[#fce4ec] rounded-t-xl'
            }`}
          >
            <span className="material-symbols-outlined text-base">video_call</span>
            <span>+ Upload Video / Reel</span>
          </button>

          <button
            type="button"
            id="distributor-add-product-tab-btn"
            onClick={() => setActiveTab('addProduct')}
            className={`py-3.5 px-4 font-bold text-xs transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'addProduct'
                ? 'border-[#8e004b] text-[#8e004b] bg-white'
                : 'border-transparent text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-t-xl border border-amber-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">add_box</span>
            <span>+ Add Product (नया उत्पाद जोड़ें)</span>
          </button>
        </div>

        {/* Success Banner if uploaded */}
        {uploadSuccessMsg && (
          <div className="m-4 mb-0 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950 animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-xl">stars</span>
              <p className="font-bold">{uploadSuccessMsg}</p>
            </div>
            <button
              onClick={() => setUploadSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Scrollable Tab Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PRODUCT CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              {/* B2B Overview and Verified Reviews Block */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#FCF9F8] border border-[#e5d5da] rounded-2xl p-5 mb-2 shadow-2xs">
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h3 className="text-[11px] font-black text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#8e004b]">info</span>
                      <span>About {distributor.name} (विवरण)</span>
                    </h3>
                    <p className="text-xs text-[#594047] leading-relaxed font-medium">
                      {distributor.description || 'Verified manufacturer-direct distributor supplying high-quality, authentic professional beauty products and salon items across major Indian cities.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E8E8E8]">
                    <div>
                      <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#8e004b]">category</span>
                        <span>Categories (श्रेणियां)</span>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {distributor.categories && distributor.categories.length > 0 ? (
                          distributor.categories.map((c) => (
                            <span key={c} className="text-[10px] bg-[#FFF8FA] text-[#8e004b] border border-[#FDE7F3] font-bold px-2 py-0.5 rounded-md">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-stone-400">Professional Salon Supplies</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#8e004b]">contact_page</span>
                        <span>Contact & Address</span>
                      </h4>
                      <p className="text-xs text-[#1c1b1b] font-medium leading-normal space-y-1">
                        <span className="block">📞 <strong>Phone:</strong> {distributor.phone}</span>
                        <span className="block">✉️ <strong>Email:</strong> {distributor.email}</span>
                        <span className="block text-stone-600">📍 <strong>HQ:</strong> {distributor.address}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#E8E8E8] pt-4 md:pt-0 md:pl-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[11px] font-black text-stone-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-amber-500">rate_review</span>
                        <span>Verified Reviews ({distributor.reviewsCount || 0})</span>
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <span className="material-symbols-outlined text-[11px] leading-none">star</span>
                        <span className="text-[11px] font-black text-[#1c1b1b]">{distributor.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {getMockReviewsForDistributor(distributor.id).map((r, i) => (
                        <div key={i} className="bg-white p-2.5 rounded-xl border border-[#E8E8E8] space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-extrabold text-[#1c1b1b]">{r.salonName}</span>
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.2 rounded-md font-bold scale-90 origin-right">Verified Buyer</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <span key={starIdx} className="material-symbols-outlined text-[10px] leading-none">
                                {starIdx < r.stars ? 'star' : 'star_border'}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10px] text-[#594047] italic">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-[#1c1b1b]">Wholesale Catalog Products</h2>
                  <p className="text-xs text-[#594047]">Authentic distributor batch supply with GST invoice</p>
                </div>
                <span className="text-xs font-bold text-[#8e004b] bg-[#FDE7F3] px-3 py-1 rounded-full">
                  {distributorProducts.length} Items Listed
                </span>
              </div>

              {distributorProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {distributorProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-[#E8E8E8] rounded-2xl p-3.5 hover:border-[#8e004b]/40 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-[#8e004b] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            {p.brand}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-[#1c1b1b] line-clamp-2">{p.name}</h3>
                          <p className="text-[10px] text-stone-500 mt-0.5">{p.category}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-extrabold text-[#8e004b]">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {p.salonMarginPercent}% Margin
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E8E8E8] mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onAddToCart(p)}
                          className="flex-1 bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-[11px] py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className="p-2 bg-[#F0EDEC] hover:bg-[#ece7e7] text-stone-800 rounded-xl"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-stone-50 rounded-2xl text-center text-stone-500">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">inventory</span>
                  <p className="text-xs font-semibold">All products supplied by {distributor.name} are available in the main shop catalog.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REELS & VIDEO DEMOS */}
          {activeTab === 'reels' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-[#1c1b1b]">Published Videos & Product Demos</h2>
                  <p className="text-xs text-[#594047]">
                    Videos uploaded by {distributor.name} and ranked by popularity for salon buyers
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="bg-[#8e004b] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs hover:bg-[#b90064]"
                >
                  <span className="material-symbols-outlined text-sm">video_call</span>
                  <span>Upload New Video</span>
                </button>
              </div>

              {distributorReels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {distributorReels.map((reel, index) => (
                    <div
                      key={reel.id}
                      className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 relative group flex flex-col justify-between shadow-md"
                    >
                      <div className="relative aspect-[9/12] overflow-hidden cursor-pointer" onClick={() => setPlayingReel(reel)}>
                        <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Rank & Featured Badge */}
                        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
                          {reel.isFeatured && (
                            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                              <span className="material-symbols-outlined text-xs">push_pin</span>
                              <span>FEATURED REEL</span>
                            </div>
                          )}
                          <div className="bg-[#8e004b] text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            <span>Rank #{index + 1}</span>
                          </div>
                          {reel.reelTag && (
                            <div className="bg-stone-900/90 text-pink-200 border border-pink-500/40 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs backdrop-blur-md">
                              <span className="material-symbols-outlined text-[10px]">label</span>
                              <span>{reel.reelTag}</span>
                            </div>
                          )}
                        </div>

                        {/* Feature, Edit & Delete Action Buttons */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              if (onToggleFeatureReel) {
                                onToggleFeatureReel(reel.id);
                                const isNowFeatured = !reel.isFeatured;
                                setUploadSuccessMsg(
                                  isNowFeatured
                                    ? `📌 "${reel.title}" is now pinned to the top of HomeScreen!`
                                    : `Unpinned "${reel.title}" from HomeScreen top position.`
                                );
                              }
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
                              reel.isFeatured
                                ? 'bg-amber-500 text-black font-bold ring-2 ring-amber-300'
                                : 'bg-black/75 hover:bg-amber-500 text-stone-200 hover:text-black'
                            }`}
                            title={reel.isFeatured ? 'Unpin Reel' : 'Feature & Pin Reel to Top of HomeScreen'}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {reel.isFeatured ? 'push_pin' : 'keep'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(reel)}
                            className="w-7 h-7 rounded-full bg-black/75 hover:bg-[#8e004b] text-stone-200 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                            title="Edit Reel Details"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingReelId(reel.id)}
                            className="w-7 h-7 rounded-full bg-black/75 hover:bg-rose-600 text-stone-200 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
                            title="Delete Reel"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                          </button>
                        </div>

                        {/* Delete Confirmation Overlay */}
                        {deletingReelId === reel.id && (
                          <div
                            className="absolute inset-0 z-30 bg-black/92 p-4 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="w-10 h-10 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-800">
                              <span className="material-symbols-outlined text-xl">delete_forever</span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Delete this video reel?</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">Removes video from HomeScreen popularity rankings.</p>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setDeletingReelId(null)}
                                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => confirmDelete(reel.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
                              >
                                Confirm Delete
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-[#8e004b]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">play_arrow</span>
                          </div>
                        </div>

                        <div className="absolute bottom-2 inset-x-2 text-white">
                          <h3 className="text-xs font-bold line-clamp-2 leading-snug">{reel.title}</h3>
                          <div className="flex items-center justify-between text-[10px] text-stone-300 mt-1">
                            <span>{reel.views}</span>
                            <span>{reel.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="p-3 bg-stone-950 flex items-center justify-between text-xs text-stone-300">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleFeatureReel) {
                                onToggleFeatureReel(reel.id);
                                const isNowFeatured = !reel.isFeatured;
                                setUploadSuccessMsg(
                                  isNowFeatured
                                    ? `📌 "${reel.title}" is now pinned to the top of HomeScreen!`
                                    : `Unpinned "${reel.title}" from HomeScreen top position.`
                                );
                              }
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                              reel.isFeatured
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-stone-800 text-stone-300 hover:text-amber-300 hover:bg-stone-700'
                            }`}
                            title="Toggle Feature Reel on HomeScreen"
                          >
                            <span className="material-symbols-outlined text-[11px]">push_pin</span>
                            <span>{reel.isFeatured ? 'Pinned Top' : 'Feature'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(reel);
                            }}
                            className="text-[10px] text-[#ffcbd9] hover:text-white font-bold underline"
                          >
                            Edit
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onLikeReel(reel.id)}
                          className="flex items-center gap-1 text-pink-400 font-bold hover:text-pink-300 transition-colors"
                          title="Like video to boost popularity ranking on HomeScreen"
                        >
                          <span className="material-symbols-outlined text-sm">favorite</span>
                          <span>{reel.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-stone-50 rounded-2xl text-center space-y-3">
                  <span className="material-symbols-outlined text-4xl text-stone-400">videocam_off</span>
                  <p className="text-xs font-bold text-stone-800">No videos published by this distributor yet.</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Distributors can upload unboxing, treatment application, or product demos to feature on the HomeScreen!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="bg-[#8e004b] text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">video_call</span>
                    <span>Upload First Video Reel Now</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPLOAD VIDEO / REEL FEATURE */}
          {activeTab === 'upload' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              {/* Feature Introduction Banner */}
              <div className="bg-gradient-to-r from-[#8e004b] to-[#b90064] text-white p-4 rounded-2xl flex items-start gap-3 shadow-sm">
                <span className="material-symbols-outlined text-3xl shrink-0">movie_edit</span>
                <div>
                  <h3 className="text-sm font-bold">Distributor Video Reel & Popularity Ranking Engine</h3>
                  <p className="text-xs text-stone-200 mt-0.5">
                    Upload product usage videos, keratin masterclasses, or tool unboxing clips. Uploaded videos are automatically processed, tagged with your distributor badge, and ranked by popularity for all salon owners on the HomeScreen.
                  </p>
                </div>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Video File Upload Dropzone */}
                <div className="border-2 border-dashed border-[#8e004b]/40 bg-[#FCF9F8] p-5 rounded-2xl text-center space-y-2 hover:bg-[#FDE7F3]/30 transition-colors relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center mx-auto shadow-2xs">
                    <span className="material-symbols-outlined text-2xl">upload_file</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1c1b1b]">
                      {selectedFileName ? `Selected Video: ${selectedFileName}` : 'Drag & Drop Video Reel or Click to Select File'}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      Supports MP4, MOV, WEBM (Max 100MB, 9:16 Vertical Reel Format Recommended)
                    </p>
                  </div>
                </div>

                {/* Preset Keyframe Cover Generator */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1c1b1b] block">
                    Choose Keyframe Thumbnail / Cover Image:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRESET_THUMBNAILS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setSelectedPresetThumbnail(preset.url);
                          setCustomThumbnail('');
                        }}
                        className={`p-1 rounded-xl border-2 transition-all relative aspect-square overflow-hidden group ${
                          selectedPresetThumbnail === preset.url && !customThumbnail
                            ? 'border-[#8e004b] shadow-sm scale-102'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover rounded-lg" />
                        <span className="absolute bottom-1 inset-x-1 bg-black/70 text-white text-[8px] font-bold py-0.5 rounded text-center truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="url"
                    value={customThumbnail}
                    onChange={(e) => setCustomThumbnail(e.target.value)}
                    placeholder="Or paste custom image cover URL (optional)..."
                    className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                {/* Title & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">
                      Video Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Organic Serum Facial Application Masterclass"
                      className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Haircare">Haircare</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Tools">Tools</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Salon Equipment">Salon Equipment</option>
                      <option value="Hair Color">Hair Color</option>
                    </select>
                  </div>
                </div>

                {/* Content Category Tag Selector */}
                <div className="space-y-1.5 bg-[#FFF8FA] border border-[#FDE7F3] rounded-2xl p-3">
                  <label className="text-xs font-bold text-[#1c1b1b] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#8e004b]">label</span>
                      <span>Content Category Tag *</span>
                    </span>
                    <span className="text-[10px] text-[#8e004b] font-semibold">Help salons filter by content type</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[
                      { name: 'Tutorial', icon: 'school' },
                      { name: 'Product Review', icon: 'rate_review' },
                      { name: 'Before/After', icon: 'auto_fix_high' },
                      { name: 'Unboxing', icon: 'inventory_2' },
                      { name: 'Technique Guide', icon: 'content_cut' },
                      { name: 'Brand Showcase', icon: 'stars' },
                    ].map((tag) => (
                      <button
                        key={tag.name}
                        type="button"
                        onClick={() => setReelTag(tag.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                          reelTag === tag.name
                            ? 'bg-[#8e004b] text-white border-[#8e004b] shadow-xs'
                            : 'bg-white text-[#594047] border-[#E8E8E8] hover:border-[#8e004b] hover:text-[#8e004b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">{tag.icon}</span>
                        <span>{tag.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Associated Product / Brand Tag</label>
                    <input
                      type="text"
                      value={productTag}
                      onChange={(e) => setProductTag(e.target.value)}
                      placeholder="e.g. Nexora Organic Serum"
                      className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Video Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    >
                      <option value="0:30">0:30 (Short Reel)</option>
                      <option value="0:45">0:45 (Standard Reel)</option>
                      <option value="1:00">1:00 (Product Demo)</option>
                      <option value="1:30">1:30 (Detailed Tutorial)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Description & Usage Notes</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of product features demonstrated in this reel..."
                    className="w-full bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="bg-[#FFF8FA] border border-[#FDE7F3] rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-base">push_pin</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1c1b1b]">Feature Reel on HomeScreen Top</p>
                      <p className="text-[10px] text-[#594047]">Pin this video to the top position in HomeScreen popular reels</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeaturedUpload}
                      onChange={(e) => setIsFeaturedUpload(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8e004b]"></div>
                  </label>
                </div>

                {/* Upload & AI Processing Pipeline Bar */}
                {isUploading ? (
                  <div className="bg-[#FCF9F8] border border-[#8e004b]/30 p-4 rounded-2xl space-y-2 animate-pulse">
                    <div className="flex justify-between items-center text-xs font-bold text-[#8e004b]">
                      <span>{uploadStage}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8e004b] to-rose-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    id="distributor-submit-reel-btn"
                    className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span className="material-symbols-outlined text-lg">publish</span>
                    <span>Process, Rank & Publish Video to HomeScreen</span>
                  </button>
                )}
              </form>
            </div>
          )}

          {/* TAB 4: ADD PRODUCT WITH VARIANTS & STOCK STATUS */}
          {activeTab === 'addProduct' && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
              <div className="bg-gradient-to-r from-amber-600 to-[#8e004b] text-white p-4 rounded-2xl flex items-start gap-3 shadow-md">
                <span className="material-symbols-outlined text-3xl shrink-0">add_to_photos</span>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black tracking-wide">B2B Wholesale Catalog Publisher (नया उत्पाद जोड़ें)</h3>
                  <p className="text-xs text-stone-100 leading-relaxed">
                    Add new products to your salon-direct wholesale catalog. Define interactive product shades, volume sizes, minimum order quantities (MOQs), and real-time stock availability.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LEFT COLUMN: BASIC DATA & STOCK */}
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#8e004b]">info</span>
                      <span>Product Specifications</span>
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1c1b1b] block">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nexora Moroccan Argan Hair Color"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1c1b1b] block">Brand Name</label>
                        <select
                          value={newProdBrand}
                          onChange={(e) => setNewProdBrand(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                        >
                          {distributor.brands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                          <option value="Nexora Pro">Nexora Pro</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1c1b1b] block">Category</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                        >
                          {distributor.categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value="Hair Care">Hair Care</option>
                          <option value="Hair Color">Hair Color</option>
                          <option value="Skincare">Skincare</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1c1b1b] block">Salon Wholesale Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1c1b1b] block">Original Retail / MRP (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1999"
                          value={newProdOriginalPrice}
                          onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1c1b1b] block">Min Order Qty (MOQ)</label>
                        <input
                          type="number"
                          required
                          value={newProdMoq}
                          onChange={(e) => setNewProdMoq(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#1c1b1b] block">Est. Salon Profit Margin (%)</label>
                        <input
                          type="number"
                          required
                          value={newProdMargin}
                          onChange={(e) => setNewProdMargin(e.target.value)}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STOCK STATUS SELECTOR */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-2.5">
                    <label className="text-xs font-extrabold text-[#1c1b1b] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#8e004b]">inventory</span>
                        <span>Stock Status / उपलब्धता</span>
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        newProdInStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {newProdInStock ? 'Live Wholesale' : 'Temporarily Offline'}
                      </span>
                    </label>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setNewProdInStock(true)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          newProdInStock
                            ? 'bg-green-50 border-green-500 text-green-800 shadow-sm font-bold scale-102'
                            : 'bg-white border-[#E8E8E8] text-stone-500 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg text-green-600 animate-pulse">check_circle</span>
                        <span className="text-xs">In Stock</span>
                        <span className="text-[9px] opacity-80 font-medium">Ready for salon orders</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewProdInStock(false)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          !newProdInStock
                            ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-sm font-bold scale-102'
                            : 'bg-white border-[#E8E8E8] text-stone-500 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg text-rose-600">cancel</span>
                        <span className="text-xs">Out of Stock</span>
                        <span className="text-[9px] opacity-80 font-medium">Temporarily disabled</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: DESCRIPTION, PRESET PHOTO & VARIANTS */}
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#8e004b]">description</span>
                      <span>Marketing & Imagery</span>
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1c1b1b] block">Product Description</label>
                      <textarea
                        rows={2}
                        placeholder="Detail application guidelines, key ingredients, hair-type suitabilities, or post-treatment benefits..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1c1b1b] block">Paste Custom Image URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newProdImage}
                        onChange={(e) => {
                          setNewProdImage(e.target.value);
                          setSelectedProdImageFile(null);
                        }}
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#8e004b] outline-none"
                      />
                    </div>

                    {/* Quick Preset Image Selectors */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Or select a preset mock catalog photo:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: 'Color Cream', url: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop' },
                          { name: 'Argan Serum', url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop' },
                          { name: 'Moisturizer', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop' },
                          { name: 'Style Gel', url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setSelectedProdImageFile(preset.url);
                              setNewProdImage('');
                            }}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedProdImageFile === preset.url
                                ? 'border-[#8e004b] scale-102 ring-2 ring-[#8e004b]/20 shadow-xs'
                                : 'border-transparent hover:border-stone-300'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center">
                              <span className="text-[8px] text-white font-semibold block truncate px-1">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC PRODUCT VARIANTS CONFIGURATION BOX */}
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#8e004b]">style</span>
                        <span>Product Variants (वैरिएंट्स जोड़ें)</span>
                      </h4>
                      <span className="text-[10px] text-stone-500 font-semibold">Optional</span>
                    </div>

                    {/* Variant Group Creator controls */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Variant Category</label>
                          <select
                            value={variantTypeInput}
                            onChange={(e) => setVariantTypeInput(e.target.value as any)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:bg-white focus:border-[#8e004b] outline-none"
                          >
                            <option value="Shades">Shades (Black, Red, etc.)</option>
                            <option value="Size/Volume">Size / Volume (100ml, 500ml, etc.)</option>
                            <option value="Other">Other Custom Attribute</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Enter Values</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={variantValueInput}
                              onChange={(e) => setVariantValueInput(e.target.value)}
                              placeholder="e.g. Red, Black, Nude"
                              className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddVariantGroup();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddVariantGroup}
                              className="bg-[#8e004b] hover:bg-[#b90064] text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center transition-all shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Variant Presets for speedy clicks */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-stone-500 uppercase block">Quick Suggestions (क्लिक करें):</span>
                        {variantTypeInput === 'Shades' ? (
                          <div className="flex flex-wrap gap-1">
                            {['Black', 'Brown', 'Dark Brown', 'Red', 'Nude', 'Blonde'].map((sh) => (
                              <button
                                key={sh}
                                type="button"
                                onClick={() => handleAddPresetValue('Shades', sh)}
                                className="bg-[#FFF8FA] hover:bg-[#FDE7F3] border border-[#FDE7F3] text-[#8e004b] px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
                              >
                                + {sh}
                              </button>
                            ))}
                          </div>
                        ) : variantTypeInput === 'Size/Volume' ? (
                          <div className="flex flex-wrap gap-1">
                            {['100ml', '250ml', '500ml', '1L', '2L'].map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => handleAddPresetValue('Size/Volume', sz)}
                                className="bg-[#FFF8FA] hover:bg-[#FDE7F3] border border-[#FDE7F3] text-[#8e004b] px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
                              >
                                + {sz}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[9px] text-stone-400 italic">Type custom values separated by commas in the box above</p>
                        )}
                      </div>
                    </div>

                    {/* Display of Currently Configured Variants */}
                    {newProdVariants.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block">Configured Product Variants:</span>
                        <div className="space-y-2">
                          {newProdVariants.map((group, groupIdx) => (
                            <div key={group.type} className="bg-white border border-stone-200 rounded-xl p-2.5 relative space-y-1">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantGroup(groupIdx)}
                                className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 transition-colors"
                                title="Remove entire variant group"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                              <span className="text-xs font-bold text-[#8e004b] block uppercase tracking-wider">{group.type}</span>
                              <div className="flex flex-wrap gap-1 pr-6 pt-0.5">
                                {group.values.map((v, valIdx) => (
                                  <span
                                    key={v}
                                    className="bg-stone-100 text-stone-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-stone-200"
                                  >
                                    <span>{v}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariantValue(groupIdx, valIdx)}
                                      className="text-stone-400 hover:text-stone-700 font-extrabold focus:outline-none"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white rounded-xl border border-dashed border-stone-200">
                        <span className="material-symbols-outlined text-xl text-stone-300">layers_clear</span>
                        <p className="text-[10px] text-stone-400 mt-0.5">No variants added yet. Will create as a single standard item.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* FULL WIDTH SUBMIT BUTTON */}
                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    id="submit-new-b2b-product-btn"
                    className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-black text-xs md:text-sm py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base md:text-lg">publish</span>
                    <span>Publish to My Salon Catalog & Active Orders</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: WHOLESALE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FCF9F8] border border-[#e5d5da] p-4 rounded-2xl">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1c1b1b]">Wholesale Order Management</h3>
                  <p className="text-xs text-[#594047] mt-0.5">Manage incoming salon bulk orders, review delivery statuses, and track invoice disbursements.</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['ALL', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        orderStatusFilter === st
                          ? 'bg-[#8e004b] text-white shadow-xs'
                          : 'bg-white text-[#594047] hover:bg-[#FDE7F3] border border-[#E8E8E8]'
                      }`}
                    >
                      {st === 'ALL' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-[#FCF9F8] rounded-2xl border border-dashed border-[#e5d5da]">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">inbox</span>
                  <h4 className="font-bold text-sm text-[#1c1b1b]">No Wholesale Orders Found</h4>
                  <p className="text-xs text-stone-500 mt-1">Orders placed by salons and buyers for this distributor will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const buyerName = order.shippingAddress?.recipientName || user?.salonName || 'Elite Salon & Spa Network';
                    const branchName = order.shippingAddress?.branchName || 'Main Branch';
                    return (
                      <div
                        key={order.id}
                        onClick={() => onViewInvoice?.(order)}
                        className="bg-white border border-[#E8E8E8] hover:border-[#8e004b]/40 rounded-2xl p-4 transition-all cursor-pointer shadow-2xs hover:shadow-md space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#F0EDEC]">
                          <div className="flex items-center gap-3">
                            <span className="bg-[#FDE7F3] text-[#8e004b] font-black text-xs px-2.5 py-1 rounded-lg">
                              {order.id}
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-[#1c1b1b]">{buyerName} • <span className="text-stone-500 font-medium">{branchName}</span></h4>
                              <p className="text-[10px] text-stone-400">Ordered on {order.date} • Invoice #{order.invoiceNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {order.status}
                            </span>
                            {onUpdateOrderStatus && (
                              <select
                                value={order.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  onUpdateOrderStatus(order.id, e.target.value as OrderStatus);
                                }}
                                className="text-[10px] font-bold bg-[#F0EDEC] text-[#1c1b1b] border border-[#E8E8E8] rounded-lg px-2 py-1 outline-hidden hover:border-[#8e004b]"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1">
                              <div className="flex items-center gap-2.5">
                                <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover border border-[#E8E8E8]" />
                                <div>
                                  <p className="font-bold text-[#1c1b1b] line-clamp-1">{item.product.name}</p>
                                  <p className="text-[10px] text-stone-500">Qty: {item.quantity} units</p>
                                </div>
                              </div>
                              <span className="font-extrabold text-[#8e004b]">₹{(item.selectedTierPrice * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-[#F0EDEC] text-xs">
                          <span className="font-bold text-stone-500">Total Amount (incl. GST):</span>
                          <span className="font-black text-sm text-[#1c1b1b]">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: STOCK & INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E8E8E8] p-4 rounded-2xl shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-stone-500 uppercase">In Stock Products</p>
                    <p className="text-xl font-black text-emerald-700 mt-1">{inStockCount}</p>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-emerald-600 bg-emerald-50 p-2.5 rounded-xl">check_circle</span>
                </div>
                <div className="bg-white border border-[#E8E8E8] p-4 rounded-2xl shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-stone-500 uppercase">Low Stock Alerts</p>
                    <p className="text-xl font-black text-amber-600 mt-1">{lowStockCount}</p>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-amber-600 bg-amber-50 p-2.5 rounded-xl">warning</span>
                </div>
                <div className="bg-white border border-[#E8E8E8] p-4 rounded-2xl shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-stone-500 uppercase">Out of Stock</p>
                    <p className="text-xl font-black text-rose-600 mt-1">{outOfStockCount}</p>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-rose-600 bg-rose-50 p-2.5 rounded-xl">inventory</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FCF9F8] border border-[#e5d5da] p-4 rounded-2xl">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1c1b1b]">Catalog Stock & Inventory Control</h3>
                  <p className="text-xs text-[#594047] mt-0.5">Real-time inventory levels connected directly with wholesale orders and salon purchases.</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: 'All Items' },
                    { id: 'IN_STOCK', label: 'In Stock' },
                    { id: 'LOW_STOCK', label: 'Low Stock (≤5)' },
                    { id: 'OUT_OF_STOCK', label: 'Out of Stock (0)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setInventoryStatusFilter(f.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        inventoryStatusFilter === f.id
                          ? 'bg-[#8e004b] text-white shadow-xs'
                          : 'bg-white text-[#594047] hover:bg-[#FDE7F3] border border-[#E8E8E8]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredInventory.length === 0 ? (
                <div className="text-center py-16 bg-[#FCF9F8] rounded-2xl border border-dashed border-[#e5d5da]">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">warehouse</span>
                  <h4 className="font-bold text-sm text-[#1c1b1b]">No Products Found in Inventory Filter</h4>
                  <p className="text-xs text-stone-500 mt-1">Try switching the inventory filter or add new products using the '+ Add Product' tab.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInventory.map((p) => {
                    const currentStock = getStockCount(p);
                    const isOut = currentStock === 0;
                    const isLow = currentStock > 0 && currentStock <= 5;
                    return (
                      <div key={p.id} className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex gap-4 items-center shadow-2xs hover:border-[#8e004b]/40 transition-all">
                        <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-[#E8E8E8] shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              isOut ? 'bg-rose-100 text-rose-800' :
                              isLow ? 'bg-amber-100 text-amber-800 animate-pulse' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isOut ? 'Out of Stock (0)' : isLow ? `Low Stock (${currentStock})` : `In Stock (${currentStock})`}
                            </span>
                            <span className="font-black text-xs text-[#8e004b]">₹{p.price.toLocaleString('en-IN')}</span>
                          </div>
                          <h4 className="font-bold text-xs text-[#1c1b1b] line-clamp-1">{p.name}</h4>
                          <p className="text-[10px] text-stone-500">Brand: {p.brand} • MOQ: {p.minOrderQuantity} units</p>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[10px] font-bold text-stone-600">Stock Units:</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStock = Math.max(0, currentStock - 5);
                                  onUpdateProductStock?.(p.id, nextStock);
                                }}
                                className="w-6 h-6 rounded-lg bg-[#F0EDEC] hover:bg-[#e5d5da] font-black text-xs flex items-center justify-center text-[#1c1b1b]"
                              >
                                -
                              </button>
                              <span className="font-black text-xs px-2 py-0.5 bg-[#FFF8FA] text-[#8e004b] rounded border border-[#FDE7F3]">
                                {currentStock}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStock = currentStock + 10;
                                  onUpdateProductStock?.(p.id, nextStock);
                                }}
                                className="w-6 h-6 rounded-lg bg-[#F0EDEC] hover:bg-[#e5d5da] font-black text-xs flex items-center justify-center text-[#1c1b1b]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BUYERS & CUSTOMERS */}
          {activeTab === 'buyers' && (
            <div className="space-y-4">
              <div className="bg-[#FCF9F8] border border-[#e5d5da] p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1c1b1b]">Wholesale Buyers & Salon Network</h3>
                  <p className="text-xs text-[#594047] mt-0.5">Verified salons, spas, and styling parlors that have placed orders with {distributor.name}.</p>
                </div>
                <span className="text-xs font-black bg-[#8e004b] text-white px-3 py-1.5 rounded-xl">
                  {buyersList.length} Active Buyers
                </span>
              </div>

              {buyersList.length === 0 ? (
                <div className="text-center py-16 bg-[#FCF9F8] rounded-2xl border border-dashed border-[#e5d5da]">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">groups</span>
                  <h4 className="font-bold text-sm text-[#1c1b1b]">No Active Buyers Found</h4>
                  <p className="text-xs text-stone-500 mt-1">When salons or buyers place wholesale orders with this distributor, they will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buyersList.map((buyer, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedBuyer(buyer)}
                      className="bg-white border border-[#E8E8E8] hover:border-[#8e004b]/50 rounded-2xl p-4 cursor-pointer shadow-2xs hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FDE7F3] text-[#8e004b] font-black text-sm flex items-center justify-center border border-[#f8c5dd]">
                            {buyer.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#1c1b1b]">{buyer.name}</h4>
                            <p className="text-[10px] text-stone-500">{buyer.type} • {buyer.location}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {buyer.latestStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EDEC] text-xs">
                        <div className="bg-[#FCF9F8] p-2 rounded-xl">
                          <span className="text-[10px] text-stone-500 block">Total Orders</span>
                          <span className="font-bold text-[#1c1b1b]">{buyer.orders.length} Orders</span>
                        </div>
                        <div className="bg-[#FCF9F8] p-2 rounded-xl">
                          <span className="text-[10px] text-stone-500 block">Purchase Value</span>
                          <span className="font-bold text-[#8e004b]">₹{buyer.totalSpent.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-stone-400 pt-1">
                        <span>Last Order: {buyer.lastOrderDate}</span>
                        <span className="text-[#8e004b] font-bold flex items-center gap-1">
                          <span>View History</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: BUSINESS / WAREHOUSE LOCATIONS */}
          {activeTab === 'warehouses' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FCF9F8] border border-[#e5d5da] p-4 rounded-2xl">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1c1b1b]">Business Locations, Warehouses & Dispatch Hubs</h3>
                  <p className="text-xs text-[#594047] mt-0.5">Manage multiple business addresses, fulfillment centers, and default dispatch locations.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingWh(null);
                    setWhName('');
                    setWhAddress('');
                    setWhCity('');
                    setWhState('');
                    setWhPincode('');
                    setWhIsDefault(distributorWarehouses.length === 0);
                    setIsAddWhModalOpen(true);
                  }}
                  className="bg-[#8e004b] hover:bg-[#72003c] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>+ Add Business / Warehouse Location</span>
                </button>
              </div>

              {distributorWarehouses.length === 0 ? (
                <div className="text-center py-16 bg-[#FCF9F8] rounded-2xl border border-dashed border-[#e5d5da]">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">location_city</span>
                  <h4 className="font-bold text-sm text-[#1c1b1b]">No Warehouse Locations Added</h4>
                  <p className="text-xs text-stone-500 mt-1">Add your warehouse or dispatch center to assign it to wholesale order fulfillments.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {distributorWarehouses.map((wh) => (
                    <div key={wh.id} className="bg-white border border-[#E8E8E8] hover:border-[#8e004b]/40 rounded-2xl p-4 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-xl text-[#8e004b] bg-[#FDE7F3] p-2 rounded-xl">warehouse</span>
                          <div>
                            <h4 className="font-bold text-xs text-[#1c1b1b]">{wh.name}</h4>
                            <p className="text-[10px] text-stone-500">{wh.city}, {wh.state} - {wh.pincode}</p>
                          </div>
                        </div>
                        {wh.isDefault ? (
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                            Default Dispatch Hub
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSetDefaultWarehouseLocation?.(wh.id)}
                            className="text-[10px] font-bold bg-[#F0EDEC] hover:bg-[#e5d5da] text-[#1c1b1b] px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 font-medium">📍 {wh.address}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-[#F0EDEC] text-xs">
                        <span className="text-[10px] font-bold text-stone-400">ID: {wh.id}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWh(wh);
                            setWhName(wh.name);
                            setWhAddress(wh.address);
                            setWhCity(wh.city);
                            setWhState(wh.state);
                            setWhPincode(wh.pincode);
                            setWhIsDefault(wh.isDefault);
                            setIsAddWhModalOpen(true);
                          }}
                          className="font-bold text-[#8e004b] hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          <span>Edit Location</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: OFFERS & PROMOTIONS */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FCF9F8] border border-[#e5d5da] p-4 rounded-2xl">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1c1b1b]">Distributor Offers, Bulk Deals & Limited-Time Discounts</h3>
                  <p className="text-xs text-[#594047] mt-0.5">Create promotional discounts and bulk purchase rules scoped directly to your catalog.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOfferTitle('');
                    setOfferDescription('');
                    setOfferType('Product Discount');
                    setOfferProductId(distributorProducts[0]?.id || '');
                    setOfferDiscount('15');
                    setOfferMinQty('10');
                    setOfferValidUntil('2026-12-31');
                    setIsAddOfferModalOpen(true);
                  }}
                  className="bg-[#8e004b] hover:bg-[#72003c] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">local_offer</span>
                  <span>+ Create New Offer / Deal</span>
                </button>
              </div>

              {distributorOffersList.length === 0 ? (
                <div className="text-center py-16 bg-[#FCF9F8] rounded-2xl border border-dashed border-[#e5d5da]">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">local_offer</span>
                  <h4 className="font-bold text-sm text-[#1c1b1b]">No Active Offers or Promotions</h4>
                  <p className="text-xs text-stone-500 mt-1">Create limited-time deals or bulk wholesale discounts to boost salon orders.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {distributorOffersList.map((offer) => (
                    <div key={offer.id} className="bg-white border border-[#E8E8E8] hover:border-[#8e004b]/40 rounded-2xl p-4 shadow-2xs space-y-3 relative overflow-hidden">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-xl text-[#8e004b] bg-[#FDE7F3] p-2 rounded-xl">local_offer</span>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#8e004b] bg-[#FDE7F3] px-2 py-0.5 rounded-md">
                              {offer.offerType}
                            </span>
                            <h4 className="font-extrabold text-xs text-[#1c1b1b] mt-1">{offer.title}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${offer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                            {offer.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 font-medium">{offer.description}</p>

                      <div className="bg-[#FCF9F8] p-2.5 rounded-xl border border-[#F0EDEC] text-xs space-y-1">
                        <div className="flex justify-between text-stone-600 font-medium">
                          <span>Target Product:</span>
                          <span className="font-bold text-[#1c1b1b] truncate max-w-[200px]">{offer.productName}</span>
                        </div>
                        {offer.discountPercentage && (
                          <div className="flex justify-between text-stone-600 font-medium">
                            <span>Discount Benefit:</span>
                            <span className="font-bold text-emerald-700">{offer.discountPercentage}% OFF</span>
                          </div>
                        )}
                        {offer.minBulkQty && (
                          <div className="flex justify-between text-stone-600 font-medium">
                            <span>Minimum Bulk Qty:</span>
                            <span className="font-bold text-blue-700">{offer.minBulkQty}+ Units</span>
                          </div>
                        )}
                        <div className="flex justify-between text-stone-600 font-medium">
                          <span>Valid Until:</span>
                          <span className="font-bold text-stone-700">{offer.validUntil}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#F0EDEC] text-xs">
                        <button
                          type="button"
                          onClick={() => onToggleOfferStatus?.(offer.id)}
                          className="font-bold text-stone-600 hover:text-[#1c1b1b] flex items-center gap-1 bg-[#F0EDEC] px-2.5 py-1 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-xs">
                            {offer.isActive ? 'pause_circle' : 'play_circle'}
                          </span>
                          <span>{offer.isActive ? 'Pause Offer' : 'Activate'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteOffer?.(offer.id)}
                          className="font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                          <span>Delete Offer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Buyer Detail Modal */}
          {selectedBuyer && (
            <div className="fixed inset-0 z-70 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-[#E8E8E8] space-y-5 relative">
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F0EDEC] hover:bg-[#e5d5da] text-[#1c1b1b] flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>

                <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0EDEC]">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDE7F3] text-[#8e004b] font-black text-lg flex items-center justify-center border border-[#f8c5dd]">
                    {selectedBuyer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#1c1b1b]">{selectedBuyer.name}</h3>
                    <p className="text-xs text-stone-500">{selectedBuyer.type} • {selectedBuyer.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FCF9F8] p-3 rounded-xl border border-[#E8E8E8]">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">Total Lifetime Spend</span>
                    <p className="text-lg font-black text-[#8e004b] mt-0.5">₹{selectedBuyer.totalSpent.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-[#FCF9F8] p-3 rounded-xl border border-[#E8E8E8]">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">Total Orders Placed</span>
                    <p className="text-lg font-black text-[#1c1b1b] mt-0.5">{selectedBuyer.orders.length} Orders</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-[#1c1b1b] uppercase tracking-wider">Order History with {distributor.name}</h4>
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {selectedBuyer.orders.map((ord: Order) => (
                      <div key={ord.id} onClick={() => { setSelectedBuyer(null); onViewInvoice?.(ord); }} className="bg-[#FCF9F8] hover:bg-[#FDE7F3]/30 border border-[#E8E8E8] rounded-2xl p-3.5 cursor-pointer transition-all space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-xs text-[#8e004b]">{ord.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{ord.status}</span>
                        </div>
                        <p className="text-[11px] text-stone-500">Ordered on {ord.date} • Invoice #{ord.invoiceNumber}</p>
                        <div className="space-y-1 pt-1 border-t border-[#E8E8E8]">
                          {ord.items.map((it: any, i: number) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-stone-700 font-medium line-clamp-1">{it.product.name} (x{it.quantity})</span>
                              <span className="font-bold text-[#1c1b1b]">₹{(it.selectedTierPrice * it.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#E8E8E8] text-xs">
                          <span className="font-bold text-stone-500">Total Amount:</span>
                          <span className="font-black text-sm text-[#1c1b1b]">₹{ord.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Reel Player Modal */}
        {playingReel && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-stone-900 text-white rounded-3xl overflow-hidden max-w-4xl w-full relative shadow-2xl border border-white/20 grid grid-cols-1 md:grid-cols-12 max-h-[92vh] md:max-h-[85vh]">
              
              {/* Close button for entire modal (placed at top right on desktop/tablet) */}
              <button
                onClick={() => setPlayingReel(null)}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                title="Close Player"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {/* LEFT COLUMN: Video Player & Metadata (md:col-span-6 or 7) */}
              <div className="md:col-span-6 flex flex-col relative bg-black aspect-[4/5] md:aspect-auto md:h-[80vh] min-h-[300px]">
                
                {/* Admin Quick Action Controls Overlay */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleFeatureReel) {
                        onToggleFeatureReel(playingReel.id);
                        setPlayingReel({ ...playingReel, isFeatured: !playingReel.isFeatured });
                        const isNowFeatured = !playingReel.isFeatured;
                        setUploadSuccessMsg(
                          isNowFeatured
                            ? `📌 "${playingReel.title}" is now pinned to the top of HomeScreen!`
                            : `Unpinned "${playingReel.title}" from HomeScreen top position.`
                        );
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 backdrop-blur-md transition-all ${
                      playingReel.isFeatured
                        ? 'bg-amber-500 text-black font-extrabold ring-2 ring-amber-300'
                        : 'bg-black/70 hover:bg-amber-500 hover:text-black text-white'
                    }`}
                    title={playingReel.isFeatured ? 'Unpin Reel' : 'Feature Reel on Top'}
                  >
                    <span className="material-symbols-outlined text-xs">push_pin</span>
                    <span>{playingReel.isFeatured ? 'Pinned Top' : 'Feature'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const r = playingReel;
                      setPlayingReel(null);
                      openEditModal(r);
                    }}
                    className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-[#8e004b] text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingReelId(playingReel.id);
                    }}
                    className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    <span>Delete</span>
                  </button>
                </div>

                {/* Media Image Backdrop */}
                <div className="w-full h-full relative overflow-hidden flex-1 flex items-center justify-center">
                  <img src={playingReel.thumbnail} alt={playingReel.title} className="w-full h-full object-cover absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />

                  {/* Play Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-[#8e004b]/90 text-white flex items-center justify-center shadow-2xl animate-pulse">
                      <span className="material-symbols-outlined text-3xl">play_arrow</span>
                    </div>
                  </div>

                  {/* Delete Confirmation Overlay inside player */}
                  {deletingReelId === playingReel.id && (
                    <div className="absolute inset-0 z-30 bg-black/95 p-6 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-800">
                        <span className="material-symbols-outlined text-2xl">delete_forever</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Delete this video reel?</p>
                        <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">Removes video from HomeScreen popularity rankings.</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setDeletingReelId(null)}
                          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(playingReel.id)}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Info Overlay at Bottom of Video */}
                  <div className="absolute bottom-0 inset-x-0 p-4 pt-16 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2 z-10">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-[#FDE7F3] bg-[#8e004b] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {playingReel.distributor}
                      </span>
                      {playingReel.reelTag && (
                        <span className="text-[10px] font-bold text-amber-300 bg-stone-900/90 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">label</span>
                          <span>{playingReel.reelTag}</span>
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-sm md:text-base font-bold leading-snug text-white">{playingReel.title}</h3>
                    <p className="text-xs text-stone-300 line-clamp-2">{playingReel.description || 'Verified product demo.'}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                      <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">visibility</span>
                        <span>{playingReel.views}</span>
                        <span className="text-stone-500">•</span>
                        <span className="material-symbols-outlined text-xs text-pink-500">favorite</span>
                        <span>{playingReel.likes} Likes</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onLikeReel(playingReel.id);
                        }}
                        className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-md"
                      >
                        <span className="material-symbols-outlined text-sm">favorite</span>
                        <span>Like Reel</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Salon Owner Q&A & Leave a Comment Section */}
              <div className="md:col-span-6 bg-[#FAF7F6] text-[#1c1b1b] flex flex-col md:h-[80vh] overflow-hidden">
                
                {/* Comments Header */}
                <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">forum</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1c1b1b] tracking-tight uppercase">Salon Questions Forum</h4>
                      <p className="text-[10px] text-[#594047]">Ask products & application queries directly</p>
                    </div>
                  </div>
                  
                  {/* Comments Count Badge */}
                  <div className="bg-[#8e004b]/10 text-[#8e004b] text-[10px] font-black px-2.5 py-1 rounded-full">
                    {(commentsMap[playingReel.id] || []).length} questions
                  </div>
                </div>

                {/* Comments Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] md:max-h-none min-h-[180px]">
                  {(commentsMap[playingReel.id] || []).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-stone-400">
                      <span className="material-symbols-outlined text-3xl text-stone-300">contact_support</span>
                      <div>
                        <p className="text-xs font-bold text-stone-600">No questions asked yet</p>
                        <p className="text-[10px] text-stone-400 max-w-xs mt-0.5">Be the first to ask the distributor a question about application or stock availability!</p>
                      </div>
                    </div>
                  ) : (
                    (commentsMap[playingReel.id] || []).map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-2xl text-xs space-y-1.5 transition-all ${
                          comment.isDistributor
                            ? 'bg-[#FFF8FA] border border-[#FDE7F3] ml-4'
                            : 'bg-white border border-stone-100 shadow-2xs mr-4'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                              comment.isDistributor
                                ? 'bg-[#8e004b] text-white'
                                : 'bg-pink-100 text-[#8e004b]'
                            }`}>
                              {comment.isDistributor ? 'D' : comment.userName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-extrabold text-[#1c1b1b] text-[11px]">{comment.userName}</span>
                                {comment.isDistributor && (
                                  <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[8px]">verified</span>
                                    <span>DISTRIBUTOR</span>
                                  </span>
                                )}
                              </div>
                              {comment.salonName && (
                                <p className="text-[9px] text-[#594047] font-medium leading-none">{comment.salonName}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[9px] text-stone-400 font-semibold">{comment.createdAt}</span>
                        </div>
                        <p className="text-[#3c3b3b] text-[11px] leading-relaxed pl-8 break-words font-medium">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input Footer */}
                <form onSubmit={handleAddComment} className="p-3 bg-white border-t border-stone-200">
                  <div className="flex items-start gap-2.5">
                    {/* User Profile Avatar Indicator */}
                    <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-[#8e004b] shrink-0 mt-1">
                      R
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <textarea
                        rows={2}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={`Ask ${playingReel.distributor} a question about this product...`}
                        className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#8e004b] focus:border-[#8e004b] resize-none"
                      />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-stone-400 font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">shield_person</span>
                          <span>Posting as Salon Owner (Riya Sharma)</span>
                        </span>
                        
                        <button
                          type="submit"
                          disabled={!newCommentText.trim()}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            newCommentText.trim()
                              ? 'bg-[#8e004b] hover:bg-[#b90064] text-white shadow-xs active:scale-95'
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <span>Ask Question</span>
                          <span className="material-symbols-outlined text-xs">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

              </div>

            </div>
          </div>
        )}

        {/* Edit Reel Modal */}
        {editingReel && (
          <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E8] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1c1b1b]">Edit Video Reel Details</h3>
                    <p className="text-xs text-[#594047]">Update title, tag, duration or thumbnail cover</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingReel(null)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Reel Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Haircare">Haircare</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Tools">Tools</option>
                      <option value="Salon Equipment">Salon Equipment</option>
                      <option value="Hair Color">Hair Color</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Duration</label>
                    <select
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    >
                      <option value="0:30">0:30 (Short Reel)</option>
                      <option value="0:45">0:45 (Standard Reel)</option>
                      <option value="1:00">1:00 (Product Demo)</option>
                      <option value="1:30">1:30 (Detailed Tutorial)</option>
                    </select>
                  </div>
                </div>

                {/* Content Category Tag Selector in Edit Modal */}
                <div className="space-y-1.5 bg-[#FFF8FA] border border-[#FDE7F3] rounded-2xl p-3">
                  <label className="text-xs font-bold text-[#1c1b1b] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#8e004b]">label</span>
                      <span>Content Category Tag</span>
                    </span>
                    <span className="text-[10px] text-[#8e004b] font-semibold">Displayed on card badge</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[
                      { name: 'Tutorial', icon: 'school' },
                      { name: 'Product Review', icon: 'rate_review' },
                      { name: 'Before/After', icon: 'auto_fix_high' },
                      { name: 'Unboxing', icon: 'inventory_2' },
                      { name: 'Technique Guide', icon: 'content_cut' },
                      { name: 'Brand Showcase', icon: 'stars' },
                    ].map((tag) => (
                      <button
                        key={tag.name}
                        type="button"
                        onClick={() => setEditReelTag(tag.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                          editReelTag === tag.name
                            ? 'bg-[#8e004b] text-white border-[#8e004b] shadow-xs'
                            : 'bg-white text-[#594047] border-[#E8E8E8] hover:border-[#8e004b] hover:text-[#8e004b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">{tag.icon}</span>
                        <span>{tag.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Associated Product / Brand Tag</label>
                  <input
                    type="text"
                    value={editProductTag}
                    onChange={(e) => setEditProductTag(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Thumbnail Cover Image URL</label>
                  <input
                    type="url"
                    value={editThumbnail}
                    onChange={(e) => setEditThumbnail(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Description & Usage Notes</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="bg-[#FFF8FA] border border-[#FDE7F3] rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-base">push_pin</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1c1b1b]">Feature / Pin Reel on Top</p>
                      <p className="text-[10px] text-[#594047]">Pin this video to the top position in HomeScreen popular reels</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8e004b]"></div>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReel(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Warehouse Modal */}
        {isAddWhModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">warehouse</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1c1b1b]">
                      {editingWh ? 'Edit Warehouse Location' : 'Add New Business & Warehouse Location'}
                    </h3>
                    <p className="text-xs text-[#594047]">Configure dispatch and fulfillment centers</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddWhModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F0EDEC] hover:bg-[#e5d5da] text-stone-700 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!whName.trim() || !whAddress.trim() || !whCity.trim()) return;
                  if (editingWh) {
                    onUpdateWarehouseLocation?.({
                      ...editingWh,
                      name: whName,
                      address: whAddress,
                      city: whCity,
                      state: whState || 'Maharashtra',
                      pincode: whPincode || '400001',
                      isDefault: whIsDefault,
                    });
                  } else {
                    onAddWarehouseLocation?.({
                      distributorId: distributor.id,
                      name: whName,
                      address: whAddress,
                      city: whCity,
                      state: whState || 'Maharashtra',
                      pincode: whPincode || '400001',
                      isDefault: whIsDefault || distributorWarehouses.length === 0,
                    });
                  }
                  setIsAddWhModalOpen(false);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Location / Warehouse Name *</label>
                  <input
                    type="text"
                    required
                    value={whName}
                    onChange={(e) => setWhName(e.target.value)}
                    placeholder="e.g. South Region Fulfillment Center"
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={whAddress}
                    onChange={(e) => setWhAddress(e.target.value)}
                    placeholder="e.g. Plot 12, Industrial Area Phase 2"
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">City *</label>
                    <input
                      type="text"
                      required
                      value={whCity}
                      onChange={(e) => setWhCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">State</label>
                    <input
                      type="text"
                      value={whState}
                      onChange={(e) => setWhState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Pincode</label>
                    <input
                      type="text"
                      value={whPincode}
                      onChange={(e) => setWhPincode(e.target.value)}
                      placeholder="400001"
                      className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="whDefaultCheck"
                    checked={whIsDefault}
                    onChange={(e) => setWhIsDefault(e.target.checked)}
                    className="w-4 h-4 accent-[#8e004b] rounded cursor-pointer"
                  />
                  <label htmlFor="whDefaultCheck" className="text-xs font-bold text-[#1c1b1b] cursor-pointer">
                    Set as Default Dispatch Hub for Wholesale Orders
                  </label>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8E8E8]">
                  <button
                    type="button"
                    onClick={() => setIsAddWhModalOpen(false)}
                    className="px-4 py-2 bg-[#F0EDEC] hover:bg-[#e5d5da] text-stone-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8e004b] hover:bg-[#72003c] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    {editingWh ? 'Save Changes' : 'Add Location'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Offer / Promotion Modal */}
        {isAddOfferModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">local_offer</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1c1b1b]">Create New Distributor Offer</h3>
                    <p className="text-xs text-[#594047]">Configure discounts or bulk deals for your catalog</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOfferModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F0EDEC] hover:bg-[#e5d5da] text-stone-700 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!offerTitle.trim() || !offerProductId) return;
                  const selectedProd = distributorProducts.find((p) => p.id === offerProductId);
                  onAddOffer?.({
                    distributorId: distributor.id,
                    productId: offerProductId,
                    productName: selectedProd ? selectedProd.name : 'Selected Product',
                    offerType,
                    title: offerTitle,
                    description: offerDescription || `${offerDiscount}% discount special offer on wholesale purchase.`,
                    discountPercentage: Number(offerDiscount) || 15,
                    minBulkQty: offerType === 'Bulk Purchase Offer' ? Number(offerMinQty) || 10 : undefined,
                    validUntil: offerValidUntil || '2026-12-31',
                    isActive: true,
                  });
                  setIsAddOfferModalOpen(false);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Offer Type *</label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value as any)}
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  >
                    <option value="Product Discount">Product Discount</option>
                    <option value="Bulk Purchase Offer">Bulk Purchase Offer</option>
                    <option value="Limited-Time Deal">Limited-Time Deal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Select Product from Catalog *</label>
                  <select
                    value={offerProductId}
                    onChange={(e) => setOfferProductId(e.target.value)}
                    required
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  >
                    <option value="">-- Choose Product --</option>
                    {distributorProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Offer Title *</label>
                  <input
                    type="text"
                    required
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="e.g. Festival Salon Special: 15% Off"
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1c1b1b] block">Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={offerDiscount}
                      onChange={(e) => setOfferDiscount(e.target.value)}
                      placeholder="15"
                      className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                    />
                  </div>
                  {offerType === 'Bulk Purchase Offer' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1c1b1b] block">Min Bulk Qty</label>
                      <input
                        type="number"
                        value={offerMinQty}
                        onChange={(e) => setOfferMinQty(e.target.value)}
                        placeholder="10"
                        className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1c1b1b] block">Valid Until Date</label>
                      <input
                        type="date"
                        value={offerValidUntil}
                        onChange={(e) => setOfferValidUntil(e.target.value)}
                        className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1c1b1b] block">Offer Description</label>
                  <textarea
                    rows={2}
                    value={offerDescription}
                    onChange={(e) => setOfferDescription(e.target.value)}
                    placeholder="Describe benefit for salon owners..."
                    className="w-full bg-[#FCF9F8] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8E8E8]">
                  <button
                    type="button"
                    onClick={() => setIsAddOfferModalOpen(false)}
                    className="px-4 py-2 bg-[#F0EDEC] hover:bg-[#e5d5da] text-stone-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8e004b] hover:bg-[#72003c] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Publish Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
