import React from 'react';
import { Sparkles, History, Shield, Info, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  return (
    <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="glass-panel rounded-3xl px-5 py-3.5 flex items-center justify-between shadow-lg">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('paraphrase')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/90 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Metaphrase
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/90">
                AI 3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
              Precision Rewriting Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
          <button
            onClick={() => setActiveTab('paraphrase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'paraphrase'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            Paraphraser
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <History className="w-4 h-4 text-slate-500" />
            History & Analytics
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Shield className="w-4 h-4 text-indigo-500" />
              Admin Console
            </button>
          )}

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Info className="w-4 h-4 text-slate-500" />
            About
          </button>
        </nav>

        {/* User Status / Auth Buttons */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user.name || user.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">{user.role || 'Member'}</span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2.5 rounded-xl bg-slate-100/90 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Sign In Button */}
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white/90 hover:bg-slate-100 border border-slate-200 shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>

              {/* Prominent Create Account Button */}
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
