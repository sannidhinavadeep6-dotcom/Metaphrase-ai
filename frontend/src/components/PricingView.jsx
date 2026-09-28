import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight, Star, HelpCircle } from 'lucide-react';

export default function PricingView({ onBack, onOpenAuth, onOpenSolutionsModal, user, showToast }) {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'

  const plans = [
    {
      name: "Free",
      badge: "Basic Access",
      price: "$0",
      period: "forever",
      desc: "Essential paraphrasing, grammar, and basic tone transformations.",
      popular: false,
      ctaText: user ? "Active Plan" : "Sign Up Free",
      ctaAction: () => {
        if (user) {
          showToast?.("You are currently enjoying the Free plan!", "info");
        } else {
          onOpenAuth('register');
        }
      },
      features: [
        "Up to 500 words per transformation",
        "4 Standard Tones (Simple, Fluent, Academic, Executive)",
        "Basic AI Detector probability scan",
        "Multilingual translation (6 core languages)",
        "Standard response speed",
        "Web application access"
      ]
    },
    {
      name: "Premium Pro",
      badge: "Most Popular",
      price: billingCycle === 'annual' ? "$12" : "$19",
      period: billingCycle === 'annual' ? "/month (billed annually)" : "/month",
      desc: "For professionals, researchers, and creators needing full neural power.",
      popular: true,
      ctaText: user ? "Upgrade to Pro" : "Start 7-Day Pro Trial",
      ctaAction: () => {
        if (user) {
          showToast?.("Upgrading to Premium Pro... License active!", "success");
        } else {
          onOpenAuth('register');
        }
      },
      features: [
        "Unlimited words per transformation",
        "All 6+ Tone Personas + Unlimited Custom Personas",
        "Deep AI Humanizer (100% human score target)",
        "Full 14+ International Languages & dialects",
        "Batch File Processing (.docx, .pdf, .txt)",
        "OCR Image text extraction & transcription",
        "Flesch-Kincaid Readability metrics & Diff Inspector",
        "Sub-millisecond priority GPU response speed"
      ]
    },
    {
      name: "Enterprise",
      badge: "Organizations",
      price: billingCycle === 'annual' ? "$25" : "$35",
      period: "/member/month",
      desc: "For teams, universities, and businesses requiring team controls & SSO.",
      popular: false,
      ctaText: "Contact Sales / Demo",
      ctaAction: () => {
        if (onOpenSolutionsModal) {
          onOpenSolutionsModal('enterprise');
        } else {
          onOpenAuth('register');
        }
      },
      features: [
        "Everything in Premium Pro",
        "Centralized Admin Management Dashboard",
        "User activity audit logs & team analytics",
        "Shared Team Brand Voice guidelines & style sheets",
        "SAML 2.0 Single Sign-On (SSO) & SCIM provisioning",
        "Enterprise Data Privacy & Zero Model Retraining",
        "Dedicated account manager & 99.99% SLA uptime",
        "Custom API integration endpoints"
      ]
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Plans for Everyone</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C1C1C] tracking-tight mb-4">
          Upgrade your writing with Metaphrase AI
        </h1>
        <p className="text-lg text-[#646B81] leading-relaxed">
          Choose the plan that fits your workflow. From free individual rewrites to enterprise-grade team collaboration.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-[#1C1C1C]' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
            className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer relative ${
              billingCycle === 'annual' ? 'bg-[#027E6F]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-[#1C1C1C]' : 'text-gray-400'}`}>
            <span>Annual</span>
            <span className="bg-emerald-100 text-[#027E6F] text-[11px] font-bold px-2 py-0.5 rounded-full">
              Save 35%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
              plan.popular
                ? 'bg-white border-2 border-[#027E6F] shadow-xl ring-4 ring-[#027E6F]/10 scale-105 z-10'
                : 'bg-[#F9F9FB] border border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#027E6F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                ★ {plan.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-[#1C1C1C]">{plan.name}</h3>
                {!plan.popular && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#646B81] mb-6 min-h-[36px]">{plan.desc}</p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200/80">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#1C1C1C]">{plan.price}</span>
                  <span className="text-xs text-gray-500 font-medium">{plan.period}</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Includes:</p>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#027E6F] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={plan.ctaAction}
              className={`w-full py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                plan.popular
                  ? 'grammarly-green-btn shadow-md hover:shadow-lg'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>{plan.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Comparison FAQ Preview */}
      <div className="bg-[#F9F9FB] rounded-3xl p-8 sm:p-12 border border-gray-200 text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-3">Questions about plans or licensing?</h3>
        <p className="text-sm text-[#646B81] mb-6 max-w-xl mx-auto">
          Need a custom educational campus license or high-volume enterprise API access? Our team is available 24/7.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('register')}
            className="grammarly-green-btn px-6 py-2.5 text-sm font-bold cursor-pointer"
          >
            Contact Sales
          </button>
          <button
            onClick={onBack}
            className="grammarly-secondary-btn px-6 py-2.5 text-sm font-semibold cursor-pointer"
          >
            Back to Paraphraser
          </button>
        </div>
      </div>

    </div>
  );
}
