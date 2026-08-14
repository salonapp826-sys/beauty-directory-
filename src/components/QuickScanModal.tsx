import { useState, useEffect, useRef, FormEvent } from 'react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/mockData';

interface QuickScanModalProps {
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export function QuickScanModal({ onClose, onAddToCart, onSelectProduct }: QuickScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [reorderQty, setReorderQty] = useState(2);
  const [manualCode, setManualCode] = useState('');
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  // Web Audio API beep sound helper
  const playScanBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz pitch (A5)
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio fallback silent ignore
    }
  };

  // Start Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError('Camera API is not supported in this browser environment.');
          setHasCameraPermission(false);
          return;
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        activeStream = mediaStream;
        setStream(mediaStream);
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: unknown) {
        console.warn('Camera access warning/error:', err);
        setHasCameraPermission(false);
        setCameraError(
          'Camera access not granted or unavailable in this iframe session. You can use the instant sample QR scan options below to test inventory tracking.'
        );
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSelectSampleProduct = (product: Product) => {
    playScanBeep();
    setScannedProduct(product);
    setReorderQty(2);
    setAddedToCartSuccess(false);
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const norm = manualCode.trim().toLowerCase();
    const matched = PRODUCTS_DATA.find(
      (p) =>
        p.id.toLowerCase().includes(norm) ||
        p.name.toLowerCase().includes(norm) ||
        p.brand.toLowerCase().includes(norm)
    );

    if (matched) {
      handleSelectSampleProduct(matched);
    } else {
      // fallback to first product if code is custom
      handleSelectSampleProduct(PRODUCTS_DATA[0]);
    }
  };

  const handleAddToCartClick = () => {
    if (!scannedProduct) return;
    onAddToCart(scannedProduct, reorderQty);
    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
    }, 2500);
  };

  const toggleFlashlight = () => {
    setIsFlashlightOn(!isFlashlightOn);
    if (stream) {
      const track = stream.getVideoTracks()[0];
      if (track && 'applyConstraints' in track) {
        try {
          (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
            advanced: [{ torch: !isFlashlightOn }],
          });
        } catch {
          // ignore if torch not supported on hardware
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-2xl border border-[#8e004b]/30 relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center font-bold shadow-2xs">
              <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1c1b1b]">Salon Quick Scan</h2>
              <p className="text-[11px] text-[#594047]">Instant Stock Check & Wholesale Reordering</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            title="Close QR Scanner"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* MODE 1: SCANNED PRODUCT DISPLAYED */}
        {scannedProduct ? (
          <div className="space-y-4 animate-fade-in">
            {/* Success Banner */}
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
              <div className="text-xs">
                <p className="font-extrabold text-emerald-950">QR Code Recognized!</p>
                <p className="text-[11px] text-emerald-800">Inventory record retrieved from Nexora B2B catalog.</p>
              </div>
            </div>

            {/* Product Card */}
            <div className="bg-[#FCF9F8] border border-[#E8E8E8] rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3.5">
                <img
                  src={scannedProduct.image}
                  alt={scannedProduct.name}
                  className="w-20 h-20 rounded-xl object-cover border border-[#E8E8E8] bg-white shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold text-[#8e004b] uppercase tracking-wider block">
                    {scannedProduct.brand}
                  </span>
                  <h3 className="text-sm font-bold text-[#1c1b1b] line-clamp-2">{scannedProduct.name}</h3>
                  <p className="text-xs text-[#594047] mt-0.5">
                    Category: <span className="font-semibold text-[#1c1b1b]">{scannedProduct.category}</span>
                  </p>
                  <p className="text-xs font-black text-[#8e004b] mt-1">
                    Wholesale Price: ₹{scannedProduct.price.toLocaleString('en-IN')} / unit
                  </p>
                </div>
              </div>

              {/* Salon Inventory Status Details */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E8E8E8] text-[11px]">
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E8E8]">
                  <p className="text-stone-500 font-semibold text-[10px]">Salon Stock Status:</p>
                  <p className="font-extrabold text-amber-700 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-xs text-amber-600">warning</span>
                    <span>Low Stock (3 Units)</span>
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E8E8]">
                  <p className="text-stone-500 font-semibold text-[10px]">Batch & Expiry:</p>
                  <p className="font-mono font-bold text-stone-800 text-[11px] mt-0.5">NX-2026-B8 | Nov 2027</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E8E8]">
                  <p className="text-stone-500 font-semibold text-[10px]">Distributor Partner:</p>
                  <p className="font-bold text-[#1c1b1b] truncate mt-0.5">{scannedProduct.distributorName}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E8E8E8]">
                  <p className="text-stone-500 font-semibold text-[10px]">Usage Cycle Rate:</p>
                  <p className="font-extrabold text-rose-700 mt-0.5">85% Consumed</p>
                </div>
              </div>

              {/* Reorder Quantity Selector */}
              <div className="pt-2 flex items-center justify-between bg-white p-3 rounded-xl border border-[#E8E8E8]">
                <div>
                  <span className="text-xs font-bold text-[#1c1b1b] block">Reorder Stock Quantity:</span>
                  <span className="text-[10px] text-stone-500">
                    Total: ₹{(scannedProduct.price * reorderQty).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2 border border-[#E8E8E8] rounded-xl p-1 bg-[#FCF9F8]">
                  <button
                    type="button"
                    onClick={() => setReorderQty(Math.max(1, reorderQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E8E8E8] font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-extrabold text-xs text-[#1c1b1b]">{reorderQty}</span>
                  <button
                    type="button"
                    onClick={() => setReorderQty(reorderQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E8E8E8] font-bold text-stone-700 hover:bg-stone-100 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleAddToCartClick}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 ${
                  addedToCartSuccess
                    ? 'bg-green-700 text-white'
                    : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {addedToCartSuccess ? 'check_circle' : 'add_shopping_cart'}
                </span>
                <span>
                  {addedToCartSuccess
                    ? `Added ${reorderQty} Units to Cart! ✓`
                    : `Add ${reorderQty} Units to Reorder Cart (₹${(
                        scannedProduct.price * reorderQty
                      ).toLocaleString('en-IN')})`}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScannedProduct(null)}
                  className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                  <span>Scan Next Item</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectProduct(scannedProduct);
                    onClose();
                  }}
                  className="py-2.5 bg-[#FDE7F3] hover:bg-[#fce4ec] text-[#8e004b] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Full Product Specs</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MODE 2: ACTIVE SCANNING CAMERA VIEW */
          <div className="space-y-4">
            {/* Live Camera Viewport Box */}
            <div className="relative w-full h-56 md:h-64 bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-800 flex items-center justify-center shadow-inner group">
              {/* Video Element */}
              {hasCameraPermission ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-stone-400 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-stone-600 animate-pulse">
                    videocam_off
                  </span>
                  <p className="text-xs text-stone-300 font-semibold">Camera Feed Standby</p>
                  <p className="text-[10px] text-stone-500 max-w-xs mx-auto">
                    {cameraError || 'Allow camera permission or use instant QR testing buttons below.'}
                  </p>
                </div>
              )}

              {/* Scanning Overlay Reticle Frame */}
              <div className="absolute inset-0 border-[32px] border-black/40 pointer-events-none flex items-center justify-center">
                <div className="w-36 h-36 border-2 border-[#8e004b] rounded-2xl relative shadow-[0_0_15px_rgba(142,0,75,0.6)]">
                  {/* Corner Target Accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-amber-400 rounded-tl-sm"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-amber-400 rounded-tr-sm"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-amber-400 rounded-bl-sm"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-amber-400 rounded-br-sm"></div>

                  {/* Animated Scanning Laser */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce shadow-[0_0_8px_#f43f5e]"></div>
                </div>
              </div>

              {/* Torch/Flash Controls Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white text-[11px]">
                <span className="font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Align product QR code in frame</span>
                </span>

                <button
                  type="button"
                  onClick={toggleFlashlight}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 font-bold ${
                    isFlashlightOn ? 'bg-amber-500 text-stone-900' : 'bg-stone-800 hover:bg-stone-700 text-white'
                  }`}
                  title="Toggle Light"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isFlashlightOn ? 'flashlight_on' : 'flashlight_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Instant Sample Product QR Triggers (For testing & immediate salon convenience) */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-[#8e004b] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">qr_code_2</span>
                  <span>Instant Test QR Codes (Salon Stock)</span>
                </p>
                <span className="text-[10px] text-stone-500 font-medium">Click to simulate camera scan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRODUCTS_DATA.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectSampleProduct(p)}
                    className="p-2 bg-[#FCF9F8] hover:bg-[#FDE7F3] border border-[#E8E8E8] hover:border-[#8e004b]/40 rounded-xl text-left transition-all flex items-center gap-2 group shadow-2xs"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#E8E8E8]"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#1c1b1b] truncate group-hover:text-[#8e004b]">
                        {p.name}
                      </p>
                      <p className="text-[9px] text-stone-500 font-medium">QR Tag #{p.id.toUpperCase()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Barcode / SKU Code Entry Input */}
            <form onSubmit={handleManualSubmit} className="pt-2 border-t border-[#E8E8E8] space-y-2">
              <label className="text-xs font-bold text-[#1c1b1b] block">
                Or Enter Product Barcode / SKU Number Manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. prod-1 or Aura Serum..."
                  className="flex-1 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-[#8e004b] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs shrink-0"
                >
                  Lookup Code
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
