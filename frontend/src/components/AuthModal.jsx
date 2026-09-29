import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertCircle, ChevronDown, ExternalLink, Settings, 
  UserCircle, PlusCircle, ArrowLeft, Check
} from 'lucide-react';
import { loginUser, registerUser, googleLogin } from '../services/api';
import { 
  getGoogleClientId, 
  setGoogleClientId, 
  triggerGoogleSignIn, 
  getGoogleOAuthRedirectUrl 
} from '../utils/googleAuth';

export default function AuthModal({ 
  initialTab = 'login', 
  onClose, 
  onSuccess, 
  showToast,
  onLoginSuccess,
  onNotify
}) {
  const [tab, setTab] = useState(initialTab || 'login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Controls whether the full-screen Google Account Chooser is shown
  const [showGoogleChooser, setShowGoogleChooser] = useState(initialTab === 'google');
  
  // Custom Google account input
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Synchronize when initialTab prop updates
  useEffect(() => {
    setTab(initialTab || 'login');
    if (initialTab === 'google') {
      setShowGoogleChooser(true);
    }
  }, [initialTab]);

  // Callback normalization so both prop naming styles work flawlessly
  const handleSuccessCallback = onSuccess || onLoginSuccess || (() => {});
  const handleToastCallback = showToast || onNotify || (() => {});

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Auto-login with selected Google Account
  const handleGoogleAccountSelect = async (email, name, picture = '') => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail or Google Workspace email address.');
      return;
    }
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const data = await googleLogin({
        email: email.trim().toLowerCase(),
        name: name.trim() || email.split('@')[0],
        picture
      });

      if (data.status === 'rejected') {
        const msg = data.message || 'Account access has been denied by the administrator.';
        setErrorMsg(msg);
        handleToastCallback(msg, 'error');
        return;
      }

      if (data.success && data.user) {
        handleSuccessCallback(data.user);
        handleToastCallback(data.message || `Welcome, ${data.user.name}! Signed in with Google.`, 'success');
        onClose();
      } else {
        const msg = data.message || 'Google authentication failed. Please try again.';
        setErrorMsg(msg);
        handleToastCallback(msg, 'error');
      }
    } catch (err) {
      const msg = err.message || 'Failed to authenticate with Google. Please check your connection.';
      setErrorMsg(msg);
      handleToastCallback(msg, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      const msg = 'Please enter both your email address and password.';
      setErrorMsg(msg);
      handleToastCallback(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(loginEmail.trim(), loginPassword);
      
      if (data.status === 'pending') {
        const msg = 'Your account is currently waiting for administrator approval.';
        setErrorMsg(msg);
        handleToastCallback(msg, 'info');
      } else if (data.status === 'rejected') {
        const msg = 'Account access has been denied by the administrator.';
        setErrorMsg(msg);
        handleToastCallback(msg, 'error');
      } else if (data.success && data.user) {
        handleSuccessCallback(data.user);
        handleToastCallback(`Welcome back, ${data.user.name || 'User'}!`, 'success');
        onClose();
      } else {
        const msg = data.message || 'Unable to log in. Please check your credentials.';
        setErrorMsg(msg);
        handleToastCallback(msg, 'error');
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Invalid email or password.';
      setErrorMsg(msg);
      handleToastCallback(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      const msg = 'Please fill in all required fields.';
      setErrorMsg(msg);
      handleToastCallback(msg, 'error');
      return;
    }

    if (regPassword.length < 6) {
      const msg = 'Password must contain at least 6 characters.';
      setErrorMsg(msg);
      handleToastCallback(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(regName.trim(), regEmail.trim(), regPassword);
      if (data.user) {
        handleSuccessCallback(data.user);
        handleToastCallback(`Account created! Welcome to Metaphrase AI, ${data.user.name}!`, 'success');
        onClose();
      } else {
        handleToastCallback('Account created successfully! Logging you in...', 'success');
        setTab('login');
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
      }
    } catch (err) {
      const msg = err.message || 'Registration failed. Email may already be registered.';
      setErrorMsg(msg);
      handleToastCallback(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0d14]/75 backdrop-blur-xs animate-fadeIn font-sans">
      
      {/* --------------------------------------------------------------------------------- */}
      {/* GOOGLE CHOOSE AN ACCOUNT SCREEN (Exact match to Google OAuth Identity Screen)     */}
      {/* --------------------------------------------------------------------------------- */}
      {showGoogleChooser ? (
        <div 
          className="bg-[#131314] text-[#E3E3E3] max-w-[760px] w-full rounded-3xl p-6 sm:p-9 shadow-2xl border border-[#2D2E30] relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar: Google G Logo + Title + Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-[#2D2E30]/60 mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="text-sm font-medium text-[#E3E3E3]">Sign in with Google</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setShowGoogleChooser(false); setErrorMsg(''); }}
                className="text-xs text-[#9AA0A6] hover:text-white px-2.5 py-1 rounded-md hover:bg-[#202124] transition-colors cursor-pointer"
              >
                Use password
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#9AA0A6] hover:text-white rounded-full hover:bg-[#202124] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Brand Logo + Choose an account Header */}
            <div className="md:col-span-5 pr-0 md:pr-4 flex flex-col justify-start">
              <div className="w-12 h-12 rounded-full bg-[#027E6F] text-white flex items-center justify-center shadow-md mb-5">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 18V6l8 8 8-8v12" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
                Choose an account
              </h1>
              <p className="text-sm text-[#9AA0A6] mt-2">
                to continue to <span className="text-[#8AB4F8] hover:underline font-medium cursor-pointer">Metaphrase AI</span>
              </p>

              {/* Loading indicator */}
              {googleLoading && (
                <div className="mt-6 flex items-center gap-2.5 text-xs text-[#8AB4F8] animate-pulse">
                  <div className="w-4 h-4 border-2 border-[#8AB4F8] border-t-transparent rounded-full animate-spin" />
                  <span>Connecting with Google...</span>
                </div>
              )}
            </div>

            {/* Right Column: Google Accounts List */}
            <div className="md:col-span-7 flex flex-col">
              
              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Accounts List Container */}
              <div className="border border-[#2D2E30] rounded-2xl overflow-hidden bg-[#1E1F20]/40 shadow-inner">
                
                {/* Account 1: Sannidhi Navadeep */}
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={() => handleGoogleAccountSelect('sannidhinavadeep6@gmail.com', 'Sannidhi Navadeep')}
                  className="w-full p-3.5 sm:p-4 hover:bg-[#202124] active:bg-[#28292A] transition-colors cursor-pointer flex items-center gap-3.5 text-left border-b border-[#2D2E30] group disabled:opacity-60"
                >
                  {/* Avatar: Nature/Scenic Green Avatar */}
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0 border border-emerald-500/30 overflow-hidden">
                    <span className="text-white text-base">🏞️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-white group-hover:text-[#8AB4F8] transition-colors truncate">
                      Sannidhi Navadeep
                    </p>
                    <p className="text-xs text-[#9AA0A6] truncate mt-0.5">
                      sannidhinavadeep6@gmail.com
                    </p>
                  </div>
                </button>

                {/* Account 2: S Navadeep */}
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={() => handleGoogleAccountSelect('snavadeep1203@gmail.com', 'S Navadeep')}
                  className="w-full p-3.5 sm:p-4 hover:bg-[#202124] active:bg-[#28292A] transition-colors cursor-pointer flex items-center gap-3.5 text-left border-b border-[#2D2E30] group disabled:opacity-60"
                >
                  {/* Avatar: Green Circle with 'S' */}
                  <div className="w-10 h-10 rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-base shadow-xs flex-shrink-0">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-white group-hover:text-[#8AB4F8] transition-colors truncate">
                      S Navadeep
                    </p>
                    <p className="text-xs text-[#9AA0A6] truncate mt-0.5">
                      snavadeep1203@gmail.com
                    </p>
                  </div>
                </button>

                {/* Account 3: Use another account */}
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="w-full p-3.5 sm:p-4 hover:bg-[#202124] active:bg-[#28292A] transition-colors cursor-pointer flex items-center gap-3.5 text-left group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[#9AA0A6] group-hover:text-white transition-colors">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-white group-hover:text-[#8AB4F8] transition-colors">
                      Use another account
                    </p>
                  </div>
                </button>

              </div>

              {/* Custom Account Input Accordion */}
              {showCustomInput && (
                <div className="mt-3 p-3.5 bg-[#1E1F20] border border-[#2D2E30] rounded-xl space-y-2.5 animate-fadeIn">
                  <p className="text-xs text-[#9AA0A6] font-medium">Enter your Google Account email:</p>
                  <input
                    type="email"
                    placeholder="e.g. user@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#131314] border border-[#3C4043] rounded-lg text-xs text-white placeholder-[#80868B] focus:outline-hidden focus:border-[#8AB4F8]"
                  />
                  <input
                    type="text"
                    placeholder="Full Name (Optional)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#131314] border border-[#3C4043] rounded-lg text-xs text-white placeholder-[#80868B] focus:outline-hidden focus:border-[#8AB4F8]"
                  />
                  <button
                    type="button"
                    disabled={googleLoading || !customGoogleEmail.trim()}
                    onClick={() => handleGoogleAccountSelect(customGoogleEmail, customGoogleName)}
                    className="w-full py-2 bg-[#8AB4F8] hover:bg-[#aecbfa] text-[#131314] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {googleLoading ? 'Signing in...' : 'Continue'}
                  </button>
                </div>
              )}

              {/* Google Privacy & Terms Footer */}
              <p className="text-[11px] text-[#9AA0A6] mt-4 leading-relaxed">
                Before using this app, you can review Metaphrase AI's{' '}
                <a href="#about" onClick={() => onClose()} className="text-[#8AB4F8] hover:underline font-medium">Privacy Policy</a>
                {' '}and{' '}
                <a href="#about" onClick={() => onClose()} className="text-[#8AB4F8] hover:underline font-medium">Terms of Service</a>.
              </p>

            </div>

          </div>

        </div>
      ) : (
        /* --------------------------------------------------------------------------------- */
        /* STANDARD LOGIN / REGISTER VIEW                                                    */
        /* --------------------------------------------------------------------------------- */
        <div 
          className="bg-white max-w-[460px] w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Header */}
          <div className="text-center mb-5">
            <div className="w-10 h-10 rounded-full bg-[#027E6F] text-white flex items-center justify-center mx-auto mb-2.5 shadow-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18V6l8 8 8-8v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">
              {tab === 'login' ? 'Log in to Metaphrase AI' : 'Create your account'}
            </h2>
            <p className="text-xs text-[#646B81] mt-1">
              {tab === 'login' 
                ? 'Access your saved custom personas & transform history' 
                : 'Free neural text transformation, translation & AI detection'}
            </p>
          </div>

          {/* Error Alert Box (if any) */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ----------------- GOOGLE FAST CHOOSER SECTION ----------------- */}
          <div className="mb-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Google Account Options
            </p>

            {/* Quick Option 1: Sannidhi Navadeep */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => handleGoogleAccountSelect('sannidhinavadeep6@gmail.com', 'Sannidhi Navadeep')}
              className="w-full p-2.5 bg-gray-50 hover:bg-emerald-50/60 active:bg-emerald-100 border border-gray-200 hover:border-emerald-300 rounded-xl flex items-center gap-3 transition-all cursor-pointer text-left group disabled:opacity-60 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                <span>🏞️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#027E6F] transition-colors truncate">
                  Sannidhi Navadeep
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  sannidhinavadeep6@gmail.com
                </p>
              </div>
            </button>

            {/* Quick Option 2: S Navadeep */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => handleGoogleAccountSelect('snavadeep1203@gmail.com', 'S Navadeep')}
              className="w-full p-2.5 bg-gray-50 hover:bg-blue-50/60 active:bg-blue-100 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-3 transition-all cursor-pointer text-left group disabled:opacity-60 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                  S Navadeep
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  snavadeep1203@gmail.com
                </p>
              </div>
            </button>

            {/* Button: Open Full Google Account Chooser */}
            <button
              type="button"
              onClick={() => { setShowGoogleChooser(true); setErrorMsg(''); }}
              className="w-full py-2 px-3 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-medium text-xs text-gray-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>View all Google account options & details</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">or sign in with password</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setErrorMsg(''); }}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setErrorMsg(''); }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login CTA */}
              <button
                type="submit"
                disabled={loading}
                className="grammarly-green-btn w-full py-2.5 text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Log in</span>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => { setRegName(e.target.value); setErrorMsg(''); }}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => { setRegEmail(e.target.value); setErrorMsg(''); }}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setErrorMsg(''); }}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Register CTA */}
              <button
                type="submit"
                disabled={loading}
                className="grammarly-green-btn w-full py-2.5 text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Agree and Sign Up</span>
                )}
              </button>
            </form>
          )}

          {/* Switch Tab Footer */}
          <div className="mt-5 pt-3.5 border-t border-gray-100 text-center text-xs text-gray-500">
            {tab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => { setTab('register'); setErrorMsg(''); }}
                  className="font-bold text-[#027E6F] hover:underline cursor-pointer"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => { setTab('login'); setErrorMsg(''); }}
                  className="font-bold text-[#027E6F] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
