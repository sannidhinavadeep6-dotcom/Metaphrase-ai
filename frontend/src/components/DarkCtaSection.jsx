import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function DarkCtaSection({ onOpenAuth }) {
  return (
    <section className="py-24 bg-[#111625] text-white">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Find the right words with Metaphrase AI
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join more than 40 million people who use Metaphrase AI to transform their writing every day.
        </p>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          
          {/* White Primary Button */}
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto bg-white text-[#111625] hover:bg-gray-100 px-7 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span><strong>Sign Up</strong> It's free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Google Sign Up Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto bg-[#1C2338] hover:bg-[#252E48] text-white border border-gray-700 px-6 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>

        </div>

        <p className="text-xs text-gray-400">
          By signing up, you agree to the{' '}
          <a href="#" className="text-white underline hover:text-emerald-400">Terms and Conditions</a>{' '}
          and{' '}
          <a href="#" className="text-white underline hover:text-emerald-400">Privacy Policy</a>.
        </p>

      </div>
    </section>
  );
}
