import React, { useState, FormEvent } from 'react';
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

  // Form Fields
  const [email, setEmail] = useState('riya.sharma@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Riya Sharma');
  const [mobile, setMobile] = useState('98765 43210');
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation Shake State
  const [isShaking, setIsShaking] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const triggerError = (msg: string, fields: string[]) => {
    setError(msg);
    setInvalidFields(fields);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const clearFieldError = (fieldName: string) => {
    if (invalidFields.includes(fieldName)) {
      setInvalidFields((prev) => prev.filter((f) => f !== fieldName));
    }
    if (invalidFields.length <= 1) {
      setError(null);
    }
  };

  const getInputClasses = (fieldName: string, extraPadding = 'pl-10 pr-4') => {
    const isInvalid = invalidFields.includes(fieldName);
    const base = `w-full bg-[#F0EDEC] border text-[#1c1b1b] rounded-[8px] ${extraPadding} py-3 text-xs sm:text-sm focus:bg-white focus:border-[#8e004b] focus:ring-2 focus:ring-[#8e004b]/20 outline-none transition-all`;
    const errorStyle = isInvalid ? 'border-red-500 bg-red-50/40 ring-2 ring-red-500/20' : 'border-[#E8E8E8]';
    const shakeStyle = isShaking && isInvalid ? 'animate-shake' : '';
    return `${base} ${errorStyle} ${shakeStyle}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'login') {
      const missing: string[] = [];
      if (!email.trim()) missing.push('email');
      if (!password.trim()) missing.push('password');

      if (missing.length > 0) {
        const msg = missing.length > 1 
          ? 'Please enter both Email ID and Password.' 
          : missing.includes('email') 
            ? 'Please enter a valid Email ID.' 
            : 'Please enter your password.';
        triggerError(msg, missing);
        return;
      }

      onSuccess({
        ...INITIAL_USER,
        email: email.trim(),
      });
    } else {
      const missing: string[] = [];
      if (!name.trim()) missing.push('name');
      if (!email.trim()) missing.push('email');
      if (!mobile.trim()) missing.push('mobile');
      if (!password.trim()) missing.push('password');

      if (missing.length > 0) {
        const msg = missing.length > 1 
          ? 'Please fill in all required fields.' 
          : missing.includes('name')
            ? 'Please enter your Name.'
            : missing.includes('email')
              ? 'Please enter a valid Email ID.'
              : missing.includes('mobile')
                ? 'Please enter your Mobile Number.'
                : 'Please create a password.';
        triggerError(msg, missing);
        return;
      }

      onSuccess({
        ...INITIAL_USER,
        name: name.trim(),
        email: email.trim(),
        phone: mobile.startsWith('+91') ? mobile.trim() : `+91 ${mobile.trim()}`,
      });
    }
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      triggerError('Please enter your registered Email ID.', ['forgotEmail']);
      return;
    }
    setError(null);
    setInvalidFields([]);
    setResetSent(true);
  };

  const handleQuickDemo = () => {
    onSuccess(INITIAL_USER);
  };

  return (
    <main className="min-h-screen w-full bg-[#FCF9F8] text-[#1c1b1b] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-x-hidden font-sans">
      {/* Top Header Navigation */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30">
        <button
          id="auth-back-splash-btn"
          type="button"
          onClick={onBackToSplash}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#594047] hover:text-[#8e004b] bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#E8E8E8] shadow-xs hover:shadow-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Splash</span>
        </button>
      </div>

      {/* Main Luxury Frame Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-[#E8E8E8] overflow-hidden flex flex-col lg:flex-row my-auto animate-fade-in relative">
        {/* Left / Top Column: Luxury Beauty Editorial Image */}
        <div className="w-full lg:w-1/2 relative bg-[#1c1b1b] min-h-[220px] sm:min-h-[280px] lg:min-h-[620px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-hidden">
          {/* Background Photography */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-1000 scale-105 hover:scale-100"
            style={{
              backgroundImage: `url("${NEXORA_ASSETS.authBg}")`,
            }}
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Top Luxury Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>India's #1 B2B Salon Network</span>
            </span>
          </div>

          {/* Mobile Image Overlay Nexora Logo */}
          <div className="relative z-10 my-auto lg:hidden text-center py-2">
            <img
              src={NEXORA_ASSETS.logo}
              alt="Nexora Logo"
              className="h-10 sm:h-12 object-contain mx-auto drop-shadow-md brightness-200 contrast-200"
            />
          </div>

          {/* Bottom Editorial Quote */}
          <div className="relative z-10 space-y-2 mt-auto text-white hidden lg:block">
            <div className="flex items-center gap-1 text-amber-300 text-xs font-bold tracking-wide">
              <span>★ ★ ★ ★ ★</span>
              <span className="text-white/80 font-normal ml-1">Trusted by 25,000+ Salons</span>
            </div>

            <h2 className="text-xl lg:text-2xl font-bold leading-tight text-white tracking-tight">
              Direct Distributor Pricing & Claimable 18% GST Invoices
            </h2>

            <p className="text-xs text-stone-300 leading-relaxed max-w-md">
              Order authentic haircare, skincare, equipment & beauty supplies from verified regional distributors with same-day dispatch across India.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-white/90">
              <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                ✓ 100% Authentic Brands
              </span>
              <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                ✓ Bulk Volume Discounts
              </span>
              <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                ✓ Express Doorstep Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Refined Login / Sign Up Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Nexora Branding & Taglines */}
            <div className="text-center space-y-2">
              <img
                src={NEXORA_ASSETS.logo}
                alt="Nexora Logo"
                onClick={onBackToSplash}
                className="h-10 sm:h-12 object-contain mx-auto cursor-pointer hover:scale-105 transition-transform duration-200"
              />

              <div className="pt-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight leading-tight">
                  Salon जा रहे हो?<br />
                  <span className="text-[#8e004b] tracking-tight">NEXORA</span> किया क्या?
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#8e004b] tracking-wider uppercase mt-2 bg-[#FDE7F3]/60 py-1 px-3 rounded-full inline-block border border-[#8e004b]/20">
                  Beauty Products • Distributors • Deals
                </p>
              </div>
            </div>

            {/* Error Banner if any */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-base text-red-600">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Forgot Password Flow */}
            {forgotMode ? (
              <div className="space-y-5 animate-fade-in pt-2">
                <div className="space-y-1 text-center">
                  <h3 className="text-base font-bold text-[#1c1b1b]">Reset Your Password</h3>
                  <p className="text-xs text-[#594047]">
                    Enter your registered email address to receive password reset instructions.
                  </p>
                </div>

                {resetSent ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-xl">mark_email_read</span>
                    </div>
                    <p className="text-xs font-semibold">
                      Password reset link sent to <strong>{forgotEmail}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(false);
                        setResetSent(false);
                      }}
                      className="text-xs font-bold text-[#8e004b] hover:underline"
                    >
                      Return to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="forgot-email" className="block text-xs font-bold text-[#594047]">
                        Email ID
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                          mail
                        </span>
                        <input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            clearFieldError('forgotEmail');
                          }}
                          placeholder="Enter Email ID"
                          className={getInputClasses('forgotEmail')}
                          required
                        />
                      </div>
                    </div>

                    <button
                      id="forgot-submit-btn"
                      type="submit"
                      className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 rounded-[8px] shadow-md hover:shadow-lg shadow-[#8e004b]/25 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Send Reset Link</span>
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setForgotMode(false)}
                        className="text-xs font-semibold text-[#594047] hover:text-[#8e004b] transition-colors"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* Auth Mode Segmented Control Switch */}
                <div className="bg-[#F0EDEC] p-1 rounded-xl flex items-center border border-[#E8E8E8] relative">
                  <button
                    id="tab-login"
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError(null);
                      setInvalidFields([]);
                    }}
                    className={`w-1/2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 text-center ${
                      activeTab === 'login'
                        ? 'bg-white text-[#8e004b] shadow-xs'
                        : 'text-[#594047] hover:text-[#1c1b1b]'
                    }`}
                  >
                    Login
                  </button>

                  <button
                    id="tab-signup"
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setError(null);
                      setInvalidFields([]);
                    }}
                    className={`w-1/2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 text-center ${
                      activeTab === 'signup'
                        ? 'bg-white text-[#8e004b] shadow-xs'
                        : 'text-[#594047] hover:text-[#1c1b1b]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Authentication Form */}
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" noValidate>
                  {/* SIGN UP FIELDS */}
                  {activeTab === 'signup' && (
                    <>
                      {/* Name Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="signup-name" className="block text-xs font-bold text-[#594047]">
                          Name
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                            person
                          </span>
                          <input
                            id="signup-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              clearFieldError('name');
                            }}
                            placeholder="Enter Name"
                            className={getInputClasses('name')}
                            required
                          />
                        </div>
                      </div>

                      {/* Email ID Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="signup-email" className="block text-xs font-bold text-[#594047]">
                          Email ID
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                            mail
                          </span>
                          <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearFieldError('email');
                            }}
                            placeholder="Enter Email ID"
                            className={getInputClasses('email')}
                            required
                          />
                        </div>
                      </div>

                      {/* Mobile Number Field (Single field for mobile) */}
                      <div className="space-y-1.5">
                        <label htmlFor="signup-mobile" className="block text-xs font-bold text-[#594047]">
                          Mobile Number
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-[#594047] text-xs font-bold border-r border-[#E8E8E8] pr-2 pointer-events-none">
                            +91
                          </span>
                          <input
                            id="signup-mobile"
                            type="tel"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(e.target.value);
                              clearFieldError('mobile');
                            }}
                            placeholder="Enter Mobile Number"
                            className={getInputClasses('mobile', 'pl-14 pr-4')}
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="signup-password" className="block text-xs font-bold text-[#594047]">
                          Password
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                            lock
                          </span>
                          <input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              clearFieldError('password');
                            }}
                            placeholder="Create Password"
                            className={getInputClasses('password', 'pl-10 pr-12')}
                            required
                          />
                          <button
                            id="signup-toggle-password-btn"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#594047] hover:text-[#8e004b] transition-colors p-1"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Create Account CTA */}
                      <button
                        id="auth-signup-submit-btn"
                        type="submit"
                        className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 rounded-[8px] shadow-md hover:shadow-lg shadow-[#8e004b]/25 transition-all duration-200 active:scale-[0.99] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
                      >
                        <span>CREATE ACCOUNT</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>

                      {/* Switch to Login Link */}
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('login');
                            setError(null);
                            setInvalidFields([]);
                          }}
                          className="text-xs font-semibold text-[#594047] hover:text-[#8e004b] transition-colors"
                        >
                          Already have an account? <span className="text-[#8e004b] font-bold underline ml-1">Login</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* LOGIN FIELDS */}
                  {activeTab === 'login' && (
                    <>
                      {/* Email ID Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="login-email" className="block text-xs font-bold text-[#594047]">
                          Email ID
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                            mail
                          </span>
                          <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearFieldError('email');
                            }}
                            placeholder="Enter Email ID"
                            className={getInputClasses('email')}
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="login-password" className="block text-xs font-bold text-[#594047]">
                          Password
                        </label>

                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#594047] text-lg">
                            lock
                          </span>
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              clearFieldError('password');
                            }}
                            placeholder="Enter Password"
                            className={getInputClasses('password', 'pl-10 pr-12')}
                            required
                          />
                          <button
                            id="login-toggle-password-btn"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#594047] hover:text-[#8e004b] transition-colors p-1"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password Options Row */}
                      <div className="flex items-center justify-between pt-1">
                        <label
                          htmlFor="remember-me-checkbox"
                          className="flex items-center gap-2 text-xs font-semibold text-[#594047] cursor-pointer select-none group"
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              id="remember-me-checkbox"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-4 h-4 rounded border border-[#d2c9cc] bg-[#F0EDEC] peer-checked:bg-[#8e004b] peer-checked:border-[#8e004b] peer-focus:ring-2 peer-focus:ring-[#8e004b]/20 transition-all flex items-center justify-center group-hover:border-[#8e004b]">
                              {rememberMe && (
                                <span className="material-symbols-outlined text-white text-[12px] font-bold leading-none select-none">
                                  check
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="group-hover:text-[#1c1b1b] transition-colors">
                            Remember me
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setForgotMode(true);
                            setForgotEmail(email);
                            setError(null);
                            setInvalidFields([]);
                          }}
                          className="text-xs font-bold text-[#8e004b] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {/* LOGIN CTA */}
                      <button
                        id="auth-login-submit-btn"
                        type="submit"
                        className="w-full bg-[#8e004b] hover:bg-[#b90064] text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 rounded-[8px] shadow-md hover:shadow-lg shadow-[#8e004b]/25 transition-all duration-200 active:scale-[0.99] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
                      >
                        <span>LOGIN</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>

                      {/* Switch to Sign Up Link */}
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('signup');
                            setError(null);
                          }}
                          className="text-xs font-semibold text-[#594047] hover:text-[#8e004b] transition-colors"
                        >
                          New to Nexora? <span className="text-[#8e004b] font-bold underline ml-1">Sign Up</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Demo Login & Guest Access Shortcut Section */}
                  <div className="pt-4 border-t border-[#E8E8E8] space-y-2">
                    <button
                      id="instant-demo-btn"
                      type="button"
                      onClick={handleQuickDemo}
                      className="w-full bg-[#FDE7F3] hover:bg-[#ffd9e2] text-[#8e004b] font-bold text-xs py-2.5 px-4 rounded-xl transition-all border border-[#8e004b]/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">bolt</span>
                      <span>Instant Demo Login (Riya Sharma)</span>
                    </button>

                    <button
                      id="guest-explore-btn"
                      type="button"
                      onClick={onContinueAsGuest}
                      className="w-full text-xs font-semibold text-[#594047] hover:text-[#8e004b] py-1 transition-colors text-center block"
                    >
                      Or continue exploring as Guest →
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
