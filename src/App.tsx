import { useState } from 'react';
import {
  Product,
  Distributor,
  CartItem,
  User,
  Order,
  OrderStatus,
  WarehouseLocation,
  DistributorOffer,
  ActiveTab,
  AppScreen,
  DistributorReel,
} from './types';
import {
  INITIAL_USER,
  PRODUCTS_DATA,
  INITIAL_ORDERS,
  INITIAL_REELS,
  DISTRIBUTORS_DATA,
} from './data/mockData';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { TopNavbar } from './components/TopNavbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { ShopScreen } from './components/ShopScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BookingScreen } from './components/BookingScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { QuoteModal } from './components/QuoteModal';
import { TrackShipmentModal } from './components/TrackShipmentModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { DistributorProfileModal } from './components/DistributorProfileModal';
import { getSmartReorderSuggestions } from './utils/reorderUtils';
import { NexoraSupport } from './components/NexoraSupport';

export default function App() {
  // Screen management
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('app');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Directory initial filters passed from Home Screen
  const [directoryCityFilter, setDirectoryCityFilter] = useState<string>('All');
  const [directoryCategoryFilter, setDirectoryCategoryFilter] = useState<string>('All');
  const [directoryVerifiedOnly, setDirectoryVerifiedOnly] = useState<boolean>(false);
  const [directoryMinRating, setDirectoryMinRating] = useState<number>(0);

  // User state
  const [user, setUser] = useState<User | null>(INITIAL_USER);

  // Cart state - initialized with 2 items to match the reference screenshots (badge "2")
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS_DATA[0], // Aura Serum
      quantity: 2,
      selectedTierPrice: 1299,
    },
    {
      product: PRODUCTS_DATA[1], // Pro Styler
      quantity: 1,
      selectedTierPrice: 4500,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state - initialized with 2 curated salon favorites
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    PRODUCTS_DATA[0].id, // Aura Botanical Face Serum
    PRODUCTS_DATA[2].id, // Argan Glow Restorative Hair Mask
  ]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDistributorForQuote, setSelectedDistributorForQuote] = useState<Distributor | null>(null);
  const [selectedDistributorFilter, setSelectedDistributorFilter] = useState<Distributor | null>(null);
  const [selectedDistributorProfile, setSelectedDistributorProfile] = useState<Distributor | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Helper to sort reels: Featured/Pinned reels first, then by popularity score
  const sortReelsList = (list: DistributorReel[]) => {
    return [...list].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.popularityScore - a.popularityScore;
    });
  };

  // Stateful products list for B2B catalog management
  const [products, setProducts] = useState<Product[]>(() => PRODUCTS_DATA);

  const handleAddProduct = (newProduct: Product) => {
    PRODUCTS_DATA.unshift(newProduct);
    setProducts([newProduct, ...PRODUCTS_DATA]);
  };

  // Reels & Videos state sorted by featured status & popularity score
  const [reels, setReels] = useState<DistributorReel[]>(() => sortReelsList(INITIAL_REELS));

  const handleUploadReel = (newReel: DistributorReel) => {
    setReels((prev) => sortReelsList([newReel, ...prev]));
  };

  const handleEditReel = (updatedReel: DistributorReel) => {
    setReels((prev) => sortReelsList(prev.map((r) => (r.id === updatedReel.id ? updatedReel : r))));
  };

  const handleDeleteReel = (reelId: string) => {
    setReels((prev) => prev.filter((r) => r.id !== reelId));
  };

  const handleToggleFeatureReel = (reelId: string) => {
    setReels((prev) =>
      sortReelsList(
        prev.map((r) => {
          if (r.id === reelId) {
            return { ...r, isFeatured: !r.isFeatured };
          }
          return r;
        })
      )
    );
  };

  const handleLikeReel = (reelId: string) => {
    setReels((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reelId) {
          const newLikesCount = r.likesCount + 1;
          const newScore = r.viewsCount + newLikesCount * 5 + (r.id.startsWith('reel-user') ? 25000 : 0);
          const likesStr = newLikesCount >= 1000 ? `${(newLikesCount / 1000).toFixed(1)}K` : `${newLikesCount}`;
          return {
            ...r,
            likesCount: newLikesCount,
            likes: likesStr,
            popularityScore: newScore,
          };
        }
        return r;
      });
      return sortReelsList(updated);
    });
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Reorder alerts count derived from purchase history
  const reorderSuggestions = getSmartReorderSuggestions(orders);
  const reorderAlertCount = reorderSuggestions.length;

  // Cart total count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist products
  const wishlistProducts = PRODUCTS_DATA.filter((p) => wishlistIds.includes(p.id));

  // Wishlist handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  // Cart handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const newQty = existing ? existing.quantity + quantity : quantity;

      // Find matching tier price
      const matchedTier =
        [...product.bulkTiers]
          .reverse()
          .find((tier) => newQty >= tier.minQty) || product.bulkTiers[0];

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, selectedTierPrice: matchedTier.pricePerUnit }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            quantity: newQty,
            selectedTierPrice: matchedTier.pricePerUnit,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const matchedTier =
            [...item.product.bulkTiers]
              .reverse()
              .find((tier) => quantity >= tier.minQty) || item.product.bulkTiers[0];
          return {
            ...item,
            quantity,
            selectedTierPrice: matchedTier.pricePerUnit,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    // Connect order items to product inventory (stock deduction)
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderedItem = order.items.find((item) => item.product.id === p.id);
        if (orderedItem) {
          const currentStock = p.stockCount !== undefined ? p.stockCount : 30;
          const newStock = Math.max(0, currentStock - orderedItem.quantity);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0,
          };
        }
        return p;
      })
    );
    setSelectedInvoiceOrder(order);
  };

  const handleUpdateProductStock = (productId: string, stockCount: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount, inStock: stockCount > 0 } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const [warehouseLocations, setWarehouseLocations] = useState<WarehouseLocation[]>([
    {
      id: 'wh-1',
      distributorId: 'dist-1',
      name: 'Main Central Warehouse & Dispatch Hub',
      address: 'Plot 42, Sector 18 Industrial Area',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      isDefault: true,
    },
    {
      id: 'wh-2',
      distributorId: 'dist-1',
      name: 'North Region Fulfillment Center',
      address: '14/3 Okhla Phase 3',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110020',
      isDefault: false,
    },
  ]);

  const handleAddWarehouseLocation = (loc: Omit<WarehouseLocation, 'id'>) => {
    const newLoc: WarehouseLocation = {
      ...loc,
      id: `wh-${Date.now()}`,
    };
    setWarehouseLocations((prev) => [newLoc, ...prev]);
  };

  const handleUpdateWarehouseLocation = (updated: WarehouseLocation) => {
    setWarehouseLocations((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  };

  const handleSetDefaultWarehouseLocation = (id: string) => {
    setWarehouseLocations((prev) =>
      prev.map((l) => ({ ...l, isDefault: l.id === id }))
    );
  };

  const [distributorOffers, setDistributorOffers] = useState<DistributorOffer[]>([
    {
      id: 'off-1',
      distributorId: 'dist-1',
      productId: 'prod-1',
      productName: "L'Oréal Professionnel Vitamino Color Shampoo (1500ml)",
      offerType: 'Limited-Time Deal',
      title: 'Festive Salon Special: 15% Off',
      description: 'Special wholesale discount for festival stock-up.',
      discountPercentage: 15,
      validUntil: '2026-10-31',
      isActive: true,
    },
    {
      id: 'off-2',
      distributorId: 'dist-1',
      productId: 'prod-2',
      productName: 'Schwarzkopf Professional Bonacure Repair Rescue',
      offerType: 'Bulk Purchase Offer',
      title: 'Bulk Salon Pack: Buy 10 Get Extra 10% Off',
      description: 'Ideal for large salon chains. Minimum 10 units required.',
      minBulkQty: 10,
      discountPercentage: 10,
      validUntil: '2026-11-15',
      isActive: true,
    },
  ]);

  const handleAddOffer = (offer: Omit<DistributorOffer, 'id'>) => {
    const newOffer: DistributorOffer = {
      ...offer,
      id: `off-${Date.now()}`,
    };
    setDistributorOffers((prev) => [newOffer, ...prev]);
  };

  const handleDeleteOffer = (offerId: string) => {
    setDistributorOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  const handleToggleOfferStatus = (offerId: string) => {
    setDistributorOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isActive: !o.isActive } : o))
    );
  };

  const handleAssignDispatchLocation = (orderId: string, locationId: string, locationName: string, status?: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            dispatchLocationId: locationId,
            dispatchLocationName: locationName,
            ...(status ? { status } : {}),
            statusTimeline: [
              { title: 'Order Placed', time: '10:30 AM', description: 'Order received from salon', completed: true },
              { title: 'Confirmed', time: '10:35 AM', description: 'Distributor verified payment & stock', completed: true },
              { title: 'Packed', time: '11:15 AM', description: `Items packed at ${locationName}`, completed: true },
              { title: 'Dispatched', time: '12:00 PM', description: `Dispatched from ${locationName}`, completed: ['Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'].includes(status || o.status), current: status === 'Dispatched' },
              { title: 'In Transit', time: 'In Progress', description: 'En route to salon delivery address', completed: ['In Transit', 'Out for Delivery', 'Delivered'].includes(status || o.status) },
              { title: 'Delivered', time: 'Pending', description: 'Delivered to salon recipient', completed: (status || o.status) === 'Delivered' },
            ]
          };
        }
        return o;
      })
    );
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      handleAddToCart(item.product, item.quantity);
    });
    setIsCartOpen(true);
  };

  const handleSelectDistributor = (distributor: Distributor) => {
    setSelectedDistributorFilter(distributor);
    setActiveTab('shop');
  };

  const handleCategoryClick = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setActiveTab('shop');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] text-[#1c1b1b] flex flex-col selection:bg-[#FDE7F3] selection:text-[#8e004b]">

      {/* Dev / Presentation Screen Quick Switcher Bar */}
      <div className="bg-[#1c1b1b] text-white text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 z-50 print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8e004b] animate-ping" />
          <span className="font-bold tracking-wide text-[#ffcbd9]">NEXORA PRO</span>
          <span className="text-white/60 hidden sm:inline">| Quick Screen Navigator:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          <button
            id="nav-to-splash-screen"
            onClick={() => setCurrentScreen('splash')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'splash'
                ? 'bg-[#8e004b] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            Splash Screen
          </button>
          <button
            id="nav-to-auth-screen"
            onClick={() => setCurrentScreen('auth')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'auth'
                ? 'bg-[#8e004b] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            Login / Sign Up
          </button>
          <button
            id="nav-to-home-screen"
            onClick={() => {
              setCurrentScreen('app');
              setActiveTab('home');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'app' && activeTab === 'home'
                ? 'bg-[#8e004b] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            Home
          </button>
          <button
            id="nav-to-directory-screen"
            onClick={() => {
              setCurrentScreen('app');
              setActiveTab('directory');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'app' && activeTab === 'directory'
                ? 'bg-[#8e004b] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            Directory
          </button>
          <button
            id="nav-to-shop-screen"
            onClick={() => {
              setCurrentScreen('app');
              setActiveTab('shop');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'app' && activeTab === 'shop'
                ? 'bg-[#8e004b] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            Shop
          </button>
          <button
            id="nav-to-profile-screen"
            onClick={() => {
              setCurrentScreen('app');
              setActiveTab('profile');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'app' && activeTab === 'profile'
                ? 'bg-[#8e004b] text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            Salon Dashboard
          </button>
        </div>
      </div>

      {/* Conditional Screen Rendering */}
      {currentScreen === 'splash' && (
        <SplashScreen
          onEnter={() => setCurrentScreen('app')}
          onGoToAuth={() => setCurrentScreen('auth')}
        />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setCurrentScreen('app');
          }}
          onBackToSplash={() => setCurrentScreen('splash')}
          onContinueAsGuest={() => setCurrentScreen('app')}
        />
      )}

      {currentScreen === 'app' && (
        <div className="flex-1 flex flex-col">
          {/* Top Sticky Navbar */}
          <TopNavbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
            wishlistCount={wishlistIds.length}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            reorderAlertCount={reorderAlertCount}
            user={user}
            onLogout={() => setUser(null)}
            onOpenAuth={() => setCurrentScreen('auth')}
            onGoToSplash={() => setCurrentScreen('splash')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Active Tab View */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <HomeScreen
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onSelectDistributor={handleSelectDistributor}
                setActiveTab={setActiveTab}
                onCategoryClick={handleCategoryClick}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                reels={reels}
                onLikeReel={handleLikeReel}
                onOpenDistributorProfile={(d) => setSelectedDistributorProfile(d)}
                onSelectDirectoryCity={(city) => {
                  setDirectoryCityFilter(city);
                  setActiveTab('directory');
                }}
                onSelectDirectoryCategory={(cat) => {
                  setDirectoryCategoryFilter(cat);
                  setActiveTab('directory');
                }}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
              />
            )}

            {activeTab === 'directory' && (
              <DirectoryScreen
                onSelectDistributor={handleSelectDistributor}
                onRequestQuote={(d) => setSelectedDistributorForQuote(d)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onOpenDistributorProfile={(d) => setSelectedDistributorProfile(d)}
                initialCity={directoryCityFilter}
                initialCategory={directoryCategoryFilter}
                setInitialCity={setDirectoryCityFilter}
                setInitialCategory={setDirectoryCategoryFilter}
                verifiedOnly={directoryVerifiedOnly}
                setVerifiedOnly={setDirectoryVerifiedOnly}
                minRating={directoryMinRating}
                setMinRating={setDirectoryMinRating}
                onClearFilters={() => {
                  setDirectoryCityFilter('All');
                  setDirectoryCategoryFilter('All');
                  setDirectoryVerifiedOnly(false);
                  setDirectoryMinRating(0);
                }}
              />
            )}

            {activeTab === 'shop' && (
              <ShopScreen
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                selectedCategoryFilter={categoryFilter}
                selectedDistributorFilter={selectedDistributorFilter}
                onSelectDistributor={handleSelectDistributor}
                onClearFilters={() => {
                  setCategoryFilter(null);
                  setSelectedDistributorFilter(null);
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onOpenDistributorProfile={(d) => setSelectedDistributorProfile(d)}
                onBackToDirectory={() => {
                  setSelectedDistributorFilter(null);
                  setActiveTab('directory');
                }}
                distributorOffers={distributorOffers}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                user={user || INITIAL_USER}
                orders={orders}
                onReorder={handleReorder}
                onViewInvoice={(o) => setSelectedInvoiceOrder(o)}
                onUpdateUser={(u) => setUser(u)}
                onLogout={() => {
                  setUser(null);
                  setCurrentScreen('auth');
                }}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onExploreShop={() => {
                  setCategoryFilter(null);
                  setSelectedDistributorFilter(null);
                  setActiveTab('shop');
                }}
              />
            )}

            {activeTab === 'booking' && (
              <BookingScreen
                setActiveTab={setActiveTab}
                onBackToHome={() => setActiveTab('home')}
              />
            )}
          </main>

          {/* Bottom Fixed Navigation on Mobile */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            reorderAlertCount={reorderAlertCount}
            onSearchClick={() => {
              setCategoryFilter(null);
              setSelectedDistributorFilter(null);
              setActiveTab('shop');
            }}
          />
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          user={user}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* Slide-over Wishlist Drawer */}
      {isWishlistOpen && (
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistProducts={wishlistProducts}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onClearWishlist={handleClearWishlist}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onExploreCatalog={() => {
            setCategoryFilter(null);
            setSelectedDistributorFilter(null);
            setActiveTab('shop');
          }}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onViewDistributor={(distId) => {
            setSelectedProduct(null);
            const dist = DISTRIBUTORS_DATA.find(
              (d) => d.id === distId || d.name.toLowerCase() === distId.toLowerCase() || d.name.toLowerCase().includes(distId.toLowerCase())
            );
            if (dist) {
              setSelectedDistributorProfile(dist);
            } else {
              setActiveTab('directory');
            }
          }}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          distributorOffers={distributorOffers}
        />
      )}

      {/* Quote Request Modal */}
      {selectedDistributorForQuote && (
        <QuoteModal
          distributor={selectedDistributorForQuote}
          onClose={() => setSelectedDistributorForQuote(null)}
        />
      )}

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          user={user}
          onClose={() => setSelectedInvoiceOrder(null)}
          onTrackOrder={(order) => setSelectedTrackingOrder(order)}
        />
      )}

      {/* Interactive Track Shipment Modal */}
      {selectedTrackingOrder && (
        <TrackShipmentModal
          order={selectedTrackingOrder}
          user={user}
          onClose={() => setSelectedTrackingOrder(null)}
          onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
          onReorder={handleReorder}
        />
      )}

      {/* Distributor Profile Modal & Video Reel Uploader */}
      {selectedDistributorProfile && (
        <DistributorProfileModal
          distributor={selectedDistributorProfile}
          products={products}
          reels={reels}
          orders={orders}
          user={user}
          warehouseLocations={warehouseLocations}
          distributorOffers={distributorOffers}
          onUploadReel={handleUploadReel}
          onEditReel={handleEditReel}
          onDeleteReel={handleDeleteReel}
          onToggleFeatureReel={handleToggleFeatureReel}
          onLikeReel={handleLikeReel}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onRequestQuote={(d) => setSelectedDistributorForQuote(d)}
          onClose={() => setSelectedDistributorProfile(null)}
          onAddProduct={handleAddProduct}
          onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateProductStock={handleUpdateProductStock}
          onAddWarehouseLocation={handleAddWarehouseLocation}
          onUpdateWarehouseLocation={handleUpdateWarehouseLocation}
          onSetDefaultWarehouseLocation={handleSetDefaultWarehouseLocation}
          onAssignDispatchLocation={handleAssignDispatchLocation}
          onAddOffer={handleAddOffer}
          onDeleteOffer={handleDeleteOffer}
          onToggleOfferStatus={handleToggleOfferStatus}
        />
      )}

      {/* Persistent Nexora WhatsApp/Live Support desk */}
      <NexoraSupport />

      {/* Global Mandatory Requirement Footer */}
      <footer className="bg-[#8e004b] text-white text-center py-2 px-4 text-xs font-black tracking-widest flex items-center justify-center gap-2.5 shadow-md mt-auto select-none print:hidden">
        <span className="material-symbols-outlined text-sm text-amber-300 animate-pulse">warning</span>
        <span>STITCH INDIA नहीं बनाता है</span>
        <span className="material-symbols-outlined text-sm text-amber-300 animate-pulse">warning</span>
      </footer>
    </div>
  );
}
