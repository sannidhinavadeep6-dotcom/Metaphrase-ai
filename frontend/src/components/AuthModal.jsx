import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertCircle, ChevronDown, ExternalLink, Settings
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
  
  // Custom Google account input / prompt
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Synchronize when initialTab prop updates
  useEffect(() => {
    setTab(initialTab || 'login');
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

  // Main Google button click handler
  const handleGoogleBtnClick = () => {
    const activeClientId = getGoogleClientId();
    
    // If a Google Client ID is configured, trigger Google Identity Services / OAuth
    if (activeClientId) {
      setGoogleLoading(true);
      triggerGoogleSignIn({
        clientId: activeClientId,
        mode: 'popup',
        onSuccess: async (profile) => {
          await handleGoogleAccountSelect(profile.email, profile.name, profile.picture);
        },
        onError: (err) => {
          console.warn('Google popup error:', err);
          setShowCustomInput(true);
          setGoogleLoading(false);
        },
        onRequireClientId: () => {
          setShowCustomInput(true);
        }
      });
    } else {
      // Prompt user to enter their Google account email
      setShowCustomInput(true);
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
      <div 
        className="bg-white max-w-[440px] w-full rounded-2xl p-7 sm:p-8 shadow-2xl border border-[#E6E6E9] relative animate-fadeIn"
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
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#027E6F] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
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

        {/* Grammarly Style Google Auth Button */}
        <div className="mb-4 space-y-2.5">
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleBtnClick}
            className="w-full py-2.5 px-4 border border-gray-300 hover:border-gray-400 hover:bg-gray-50/80 active:bg-gray-100 rounded-full font-semibold text-sm text-gray-700 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>{tab === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>

          {/* Expandable Google Sign-In Input */}
          {showCustomInput && (
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700">Enter your Google Account email:</p>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  Cancel
                </button>
              </div>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-1 focus:ring-[#027E6F]"
              />
              <input
                type="text"
                placeholder="Full Name (Optional)"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#027E6F] focus:ring-1 focus:ring-[#027E6F]"
              />
              <button
                type="button"
                disabled={googleLoading || !customGoogleEmail.trim()}
                onClick={() => handleGoogleAccountSelect(customGoogleEmail, customGoogleName)}
                className="w-full py-2 bg-[#027E6F] hover:bg-[#026b5e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login CTA */}
            <button
              type="submit"
              disabled={loading}
              className="grammarly-green-btn w-full py-3 text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
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
          <form onSubmit={handleRegister} className="space-y-3.5">
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
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Register CTA */}
            <button
              type="submit"
              disabled={loading}
              className="grammarly-green-btn w-full py-3 text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
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
        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          {tab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMsg(''); setShowCustomInput(false); }}
                className="font-bold text-[#027E6F] hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(''); setShowCustomInput(false); }}
                className="font-bold text-[#027E6F] hover:underline cursor-pointer"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
