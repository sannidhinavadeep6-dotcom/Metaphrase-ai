import React, { useState } from 'react';
import { ArrowRight, Eye, ShieldCheck, BookMarked, Sparkles } from 'lucide-react';

export default function GoBeyondSection({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'reactions',
      title: 'Gauge reactions',
      heading: 'See how your writing lands',
      desc: 'Gauge how readers may respond to your message and get tips to tailor it for the impact you want.',
      icon: <Eye className="w-4 h-4" />,
      previewTitle: 'Reader Reaction Radar',
      previewBadge: 'Tone: Confident & Engaging',
      previewScore: '96% Polished',
      previewSnippet: 'Audience Perception: Highly professional, crisp, and persuasive. Ready for executive delivery.'
    },
    {
      id: 'authenticity',
      title: 'Verify authenticity',
      heading: 'Ensure your writing stays authentic',
      desc: 'Detect AI-generated phrasing and rework it in your own words so your message is genuine and true to you.',
      icon: <ShieldCheck className="w-4 h-4" />,
      previewTitle: 'AI Detector & Humanizer',
      previewBadge: '0% Artificial',
      previewScore: '100% Human Score',
      previewSnippet: 'Burstiness & Perplexity Analysis confirms natural linguistic flow and authentic voice.'
    },
    {
      id: 'citations',
      title: 'Cite sources',
      heading: 'Give credit where it’s due',
      desc: 'Find legit sources to back your claims, fact-check your points, and auto-generate citations as you write.',
      icon: <BookMarked className="w-4 h-4" />,
      previewTitle: 'Citation Generator & Academic Integrity',
      previewBadge: 'APA 7th & MLA 9th',
      previewScore: 'Validated',
      previewSnippet: 'Metaphrase, A. (2026). Neural Language Transformations. Journal of AI Linguistics, 14(2), 112–128.'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E6E6E9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
            Go beyond paraphrasing with Metaphrase AI
          </h2>
          <p className="text-lg text-[#646B81] leading-relaxed">
            Sign up for Metaphrase AI to unlock features that elevate your voice, sharpen your message, and take your writing further.
          </p>
        </div>

        {/* Tab List */}
        <div className="flex justify-center mb-12 overflow-x-auto scrollbar-none">
          <div className="inline-flex p-1.5 bg-gray-100/90 rounded-full border border-gray-200">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-white text-[#1C1C1C] shadow-sm font-bold'
                    : 'text-[#646B81] hover:text-[#1C1C1C]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#F9F9FB] rounded-3xl p-8 sm:p-12 border border-gray-200">
          
          {/* Copy Left */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] tracking-tight mb-4 animate-fadeIn">
              {tabs[activeTab].heading}
            </h3>
            <p className="text-base sm:text-lg text-[#646B81] leading-relaxed mb-8 animate-fadeIn">
              {tabs[activeTab].desc}
            </p>

            <button
              onClick={() => onOpenAuth('register')}
              className="grammarly-green-btn px-6 py-3 text-sm font-bold inline-flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
            >
              <span><strong>Sign Up</strong> It's free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Feature Mockup Right */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md animate-fadeIn">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#027E6F]" />
                <span>{tabs[activeTab].previewTitle}</span>
              </div>
              <span className="bg-emerald-50 text-[#027E6F] text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                {tabs[activeTab].previewBadge}
              </span>
            </div>

            <div className="p-5 bg-emerald-50/40 rounded-xl border border-emerald-100 mb-4">
              <div className="text-xs font-semibold text-gray-500 mb-1">Status & Score:</div>
              <div className="text-lg font-bold text-emerald-900 mb-2">
                {tabs[activeTab].previewScore}
              </div>
              <p className="text-xs text-gray-700 font-mono bg-white p-3 rounded-lg border border-emerald-200/60 leading-relaxed">
                {tabs[activeTab].previewSnippet}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
