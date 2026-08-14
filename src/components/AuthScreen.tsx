import { useState, FormEvent } from 'react';
import { NEXORA_ASSETS, INITIAL_USER } from '../data/mockData';
import { User } from '../types';

interface AuthScreenProps {
  onSuccess: (user: User) => void;
  onBackToSplash: () => void;
  onContinueAsGuest: () => void;
}

export function AuthScreen({ onSuccess, onBackToSplash, onContinueAsGuest }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('riya.sharma@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Riya Sharma');
  const [mobile, setMobile] = useState('98765 43210');
  const [salonName, setSalonName] = useState('Aura Luxe Salon & Spa');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSuccess({
      ...INITIAL_USER,
      name: name || 'Riya Sharma',
      email: email || 'riya.sharma@example.com',
      phone: mobile ? `+91 ${mobile}` : '+91 98765 43210',
      salonName: salonName || 'Aura Luxe Salon & Spa',
    });
  };

  const handleQuickDemo = () => {
    onSuccess(INITIAL_USER);
  };

  return (
    <main className="flex min-h-screen w-full bg-[#FCF9F8] text-[#1c1b1b] relative">
      {/* Top back button */}
      <button
        id="auth-back-splash-btn"
        onClick={onBackToSplash}
        className="absolute top-4 left-4 z-30 flex items-center gap-1 text-sm font-medium text-[#594047] hover:text-[#8e004b] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E8E8E8] shadow-sm transition-all"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        <span>Back to Splash</span>
      </button>

      {/* Left Column: Editorial Image (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#F0EDEC] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
          data-alt="Editorial luxury beauty salon interior"
          style={{
            backgroundImage: `url("${NEXORA_ASSETS.authBg}")`,
          }}
        />
        {/* Soft dark overlay to ensure image doesn't overpower the brand */}
        <div className="absolute inset-0 bg-[#313030]/30 mix-blend-multiply" />
        <div className="absolute bottom-10 left-10 right-10 z-10 text-white p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-2 text-[#ffd9e2] font-semibold text-xs tracking-wider uppercase">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Direct Manufacturer Pricing</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">Empowering 25,000+ Salons Across India</h3>
          <p className="text-sm text-white/80">
            Access verified distributors, GST input tax credits, and bulk tier wholesale rates directly on Nexora.
          </p>
        </div>
      </div>

      {/* Right Column: Authentication Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 md:p-10 relative">
        <div className="w-full max-w-md flex flex-col gap-6 my-auto pt-10 pb-6">
          {/* Header / Brand Area */}
          <div className="flex flex-col gap-2 items-center text-center">
            <img
              alt="Nexora Logo"
              className="mx-auto w-36 md:w-44 object-contain mb-2 cursor-pointer hover:scale-105 transition-transform"
              src={NEXORA_ASSETS.logo}
              onClick={onBackToSplash}
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1c1b1b]">
                Salon जा रहे हो?<br />
                <span className="text-[#8e004b] tracking-tight">NEXORA</span> किया क्या?
              </h1>
              <p className="text-sm text-[#594047] mt-1 font-medium">
                Beauty Products • Distributors • Deals
              </p>
            </div>
          </div>

          {/* Auth Toggle Tabs */}
          <div className="flex border-b border-[#E8E8E8] w-full relative">
            <button
              id="tab-login"
              type="button"
              className={`w-1/2 py-3 text-center text-base font-semibold transition-all ${
                activeTab === 'login'
                  ? 'text-[#8e004b] border-b-2 border-[#8e004b]'
                  : 'text-[#594047] hover:text-[#8e004b]'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              id="tab-signup"
              type="button"
              className={`w-1/2 py-3 text-center text-base font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'text-[#8e004b] border-b-2 border-[#8e004b]'
                  : 'text-[#594047] hover:text-[#8e004b]'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Forms Container */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {activeTab === 'signup' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#594047] px-1" htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#594047]">
                      person
                    </span>
                    <input
                      id="signup-name"
                      className="nexora-input w-full bg-[#F0EDEC] py-3 pl-12 pr-4 text-[#1c1b1b] text-sm"
                      placeholder="Riya Sharma"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#594047] px-1" htmlFor="signup-salon">
                    Salon / Business Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#594047]">
                      storefront
                    </span>
                    <input
                      id="signup-salon"
                      className="nexora-input w-full bg-[#F0EDEC] py-3 pl-12 pr-4 text-[#1c1b1b] text-sm"
                      placeholder="Aura Luxe Salon & Spa"
                      type="text"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#594047] px-1" htmlFor="signup-mobile">
                    Mobile Number (WhatsApp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#594047] text-sm font-medium">
                      +91
                    </span>
                    <input
                      id="signup-mobile"
                      className="nexora-input w-full bg-[#F0EDEC] py-3 pl-14 pr-4 text-[#1c1b1b] text-sm tracking-wide"
                      placeholder="98765 43210"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#594047] px-1" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#594047]">
                  mail
                </span>
                <input
                  id="login-email"
                  className="nexora-input w-full bg-[#F0EDEC] py-3 pl-12 pr-4 text-[#1c1b1b] text-sm"
                  placeholder="riya.sharma@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#594047] px-1" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#594047]">
                  lock
                </span>
                <input
                  id="login-password"
                  className="nexora-input w-full bg-[#F0EDEC] py-3 pl-12 pr-12 text-[#1c1b1b] text-sm"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#594047] hover:text-[#8e004b] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {activeTab === 'login' && (
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  className="text-xs font-medium text-[#8e004b] hover:text-[#b90064] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full bg-[#8e004b] text-white font-semibold text-base py-3.5 rounded-lg mt-2 shadow-sm hover:shadow-md hover:bg-[#b90064] transition-all duration-200 active:scale-[0.98]"
            >
              {activeTab === 'login' ? 'Login to Nexora' : 'Create Salon Account'}
            </button>

            {/* Quick Helper Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E8E8E8]">
              <button
                id="instant-demo-btn"
                type="button"
                onClick={handleQuickDemo}
                className="w-full bg-[#FDE7F3] text-[#8e004b] hover:bg-[#ffd9e2] font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">bolt</span>
                <span>Instant Demo Login (Riya Sharma)</span>
              </button>

              <button
                id="guest-explore-btn"
                type="button"
                onClick={onContinueAsGuest}
                className="w-full text-xs text-[#594047] hover:text-[#8e004b] py-1.5 transition-colors text-center"
              >
                Or continue exploring as Guest →
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
