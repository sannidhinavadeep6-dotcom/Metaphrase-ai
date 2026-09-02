import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ initialTab = 'login', onClose, onLoginSuccess, onNotify }) {
  const [tab, setTab] = useState(initialTab || 'login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConf, setRegPasswordConf] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      onNotify('Please enter both email and password.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      if (data.status === 'pending') {
        onNotify('Your account is waiting for admin approval.', 'info');
      } else if (data.status === 'rejected') {
        onNotify('Account access denied.', 'error');
      } else if (data.success && data.user) {
        onLoginSuccess(data.user);
        onNotify(`Welcome back, ${data.user.name || 'User'}!`, 'success');
        onClose();
      }
    } catch (err) {
      onNotify(err.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      onNotify('Please fill in all required fields.', 'error');
      return;
    }
    if (regPassword !== regPasswordConf) {
      onNotify('Passwords do not match.', 'error');
      return;
    }
    if (regPassword.length < 6) {
      onNotify('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(regName, regEmail, regPassword);
      if (data.user) {
        onLoginSuccess(data.user);
        onNotify(`Account created! Welcome, ${data.user.name || 'User'}!`, 'success');
        onClose();
      } else {
        onNotify('Account created successfully! Logging you in...', 'success');
        setTab('login');
        setLoginEmail(regEmail);
      }
    } catch (err) {
      onNotify(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/90 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-2xl text-slate-900">Metaphrase Workspace</h3>
          <p className="text-xs text-slate-500 mt-1">Instant 24/7 access with auto-approved accounts</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/90 p-1 rounded-2xl mb-6 border border-slate-200/80">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Dr. Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={regPasswordConf}
                  onChange={(e) => setRegPasswordConf(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
