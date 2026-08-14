import { useState, useEffect } from 'react';
import { NEXORA_ASSETS } from '../data/mockData';
import splashDesktopImg from '../assets/images/luxury_beauty_splash_1786687069868.jpg';
import splashMobileImg from '../assets/images/luxury_splash_mob_1786687082528.jpg';

interface SplashScreenProps {
  onEnter?: () => void;
  onGoToAuth: () => void;
}

export function SplashScreen({ onGoToAuth }: SplashScreenProps) {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: Logo & background presence
    const t1 = setTimeout(() => setStage(1), 150);
    // Stage 2: Tagline reveal
    const t2 = setTimeout(() => setStage(2), 700);
    // Stage 3: Loading indicator activation
    const t3 = setTimeout(() => setStage(3), 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Smooth progress bar simulation
  useEffect(() => {
    if (stage < 3) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Smooth exponential-feeling increments
        const step = prev < 60 ? 3 : prev < 90 ? 2 : 1;
        return Math.min(100, prev + step);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [stage]);

  // Navigate smoothly to Auth screen once complete
  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 250);

      const navTimer = setTimeout(() => {
        onGoToAuth();
      }, 700);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(navTimer);
      };
    }
  }, [progress, onGoToAuth]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onGoToAuth();
    }, 300);
  };

  return (
    <main
      id="splash-screen"
      onClick={handleSkip}
      className={`fixed inset-0 z-50 w-screen h-screen overflow-hidden flex flex-col items-center justify-between cursor-pointer select-none bg-[#0e0a0d] transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
      }`}
      aria-label="Nexora Luxury Beauty Platform Splash Screen"
    >
      {/* Background Imagery Layer with Intelligent Mobile/Desktop Responsive Art Direction */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Desktop / Tablet Background Image */}
        <div
          className={`hidden sm:block absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
            stage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url('${splashDesktopImg || NEXORA_ASSETS.splashBg}')`,
          }}
        />

        {/* Mobile Portrait Tailored Background Image */}
        <div
          className={`block sm:hidden absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
            stage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url('${splashMobileImg || splashDesktopImg || NEXORA_ASSETS.splashBg}')`,
          }}
        />

        {/* Cinematic Luxury Dark Burgundy & Soft Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a0d] via-[#120b10]/75 to-[#1a0c16]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0e0a0d]/50 to-[#0a0709]/95" />
        <div className="absolute inset-0 bg-[#8e004b]/15 mix-blend-color-dodge" />
      </div>

      {/* Top Subtle Ambient Brand Bar */}
      <header className="relative z-10 w-full pt-8 sm:pt-10 px-6 sm:px-12 flex items-center justify-center pointer-events-none">
        <div
          className={`transition-all duration-700 delay-100 transform ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff85ad] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#ffccd9]/90">
              India's Professional Salon B2B Platform
            </span>
          </div>
        </div>
      </header>

      {/* Center Hero Identity: Logo + Brand Tagline */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-2xl my-auto">
        {/* Nexora Emblem / Logo with Luxury Radiant Glow */}
        <div
          className={`relative transition-all duration-1000 ease-out transform ${
            stage >= 1
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-90'
          }`}
        >
          {/* Ambient Glow behind emblem */}
          <div className="absolute -inset-6 bg-[#8e004b]/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
          
          <img
            src={NEXORA_ASSETS.logo}
            alt="NEXORA B2B Beauty Platform"
            className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain mx-auto drop-shadow-[0_12px_32px_rgba(0,0,0,0.8)] filter brightness-105"
          />
        </div>

        {/* Brand Tagline in Elegant Hindi + English Typography */}
        <div
          className={`mt-4 sm:mt-6 transition-all duration-1000 delay-300 ease-out transform ${
            stage >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="space-y-1 sm:space-y-1.5">
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#f5eff2] tracking-normal leading-tight font-sans drop-shadow-md">
              Salon जा रहे हो?
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide leading-tight drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff85ad] via-[#ffb0c8] to-[#ffffff]">
                NEXORA
              </span>{' '}
              <span className="font-normal text-[#f5eff2]">किया क्या?</span>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#ffccd9]/80 font-medium tracking-wider uppercase mt-4 sm:mt-5 drop-shadow-xs">
            Authentic Wholesale Products • Direct Verified Distributorships
          </p>
        </div>
      </section>

      {/* Bottom Loading Progress & Transition Status */}
      <footer className="relative z-10 w-full pb-10 sm:pb-12 px-6 flex flex-col items-center gap-3.5">
        <div
          className={`w-48 sm:w-56 flex flex-col items-center gap-2.5 transition-all duration-700 ease-out ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Subtle Ultra-Thin Glowing Progress Bar */}
          <div className="w-full h-[2.5px] bg-white/15 rounded-full overflow-hidden backdrop-blur-sm relative">
            <div
              className="h-full bg-gradient-to-r from-[#8e004b] via-[#ff85ad] to-white rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,133,173,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Minimalist Micro Status Indicator */}
          <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-[#ffccd9]/60">
            <span className="uppercase">
              {progress < 100 ? 'Authenticating Network' : 'Ready'}
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Subtle touch hint */}
        <p className="text-[10px] text-white/30 tracking-wider">
          Tap anywhere to continue
        </p>
      </footer>
    </main>
  );
}
