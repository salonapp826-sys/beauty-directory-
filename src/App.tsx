import { useState } from 'react';
import {
  Product,
  Distributor,
  CartItem,
  User,
  Order,
  ActiveTab,
  AppScreen,
} from './types';
import {
  INITIAL_USER,
  PRODUCTS_DATA,
  INITIAL_ORDERS,
} from './data/mockData';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { TopNavbar } from './components/TopNavbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { ShopScreen } from './components/ShopScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { QuoteModal } from './components/QuoteModal';
import { TrackShipmentModal } from './components/TrackShipmentModal';
import { WishlistDrawer } from './components/WishlistDrawer';

export default function App() {
  // Screen management
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('app');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

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
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

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
    setSelectedInvoiceOrder(order);
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
              />
            )}

            {activeTab === 'directory' && (
              <DirectoryScreen
                onSelectDistributor={handleSelectDistributor}
                onRequestQuote={(d) => setSelectedDistributorForQuote(d)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {activeTab === 'shop' && (
              <ShopScreen
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                selectedCategoryFilter={categoryFilter}
                selectedDistributorFilter={selectedDistributorFilter}
                onClearFilters={() => {
                  setCategoryFilter(null);
                  setSelectedDistributorFilter(null);
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
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
          </main>

          {/* Bottom Fixed Navigation on Mobile */}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {/* Slide-over Cart Drawer */}
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

      {/* Slide-over Wishlist Drawer */}
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onViewDistributor={(distId) => {
          setSelectedProduct(null);
          setActiveTab('directory');
        }}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        distributor={selectedDistributorForQuote}
        onClose={() => setSelectedDistributorForQuote(null)}
      />

      {/* Tax Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        user={user}
        onClose={() => setSelectedInvoiceOrder(null)}
        onTrackOrder={(order) => setSelectedTrackingOrder(order)}
      />

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
    </div>
  );
}
