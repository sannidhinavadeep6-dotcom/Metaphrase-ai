import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function JoinBanner({ onOpenAuth }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <button 
        onClick={() => onOpenAuth('register')}
        className="w-full bg-[#111625] hover:bg-[#1A2238] transition-all rounded-2xl py-4 sm:py-5 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg group cursor-pointer"
      >
        <span className="text-white text-lg sm:text-xl font-semibold tracking-tight">
          Join millions who write better, faster with Metaphrase AI.
        </span>
        <div className="bg-white text-[#111625] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 group-hover:bg-[#E6F5F2] group-hover:text-[#027E6F] transition-colors whitespace-nowrap shadow-xs">
          <span><strong>Sign Up</strong> It's free</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </div>
  );
}
