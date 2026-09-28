import React, { useState } from 'react';
import { X, Building2, Users, Briefcase, Headphones, Megaphone, Code, GraduationCap, School, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const SOLUTIONS = {
  enterprise: {
    title: "Enterprise Solutions",
    tag: "Scale & Security",
    icon: <Building2 className="w-6 h-6 text-[#027E6F]" />,
    hero: "Empower thousands of knowledge workers with secure, aligned AI writing workflows.",
    points: [
      "SOC-2 Type II compliant with zero training on customer data",
      "SAML 2.0 Single Sign-On (SSO) & SCIM user provisioning",
      "Centralized Admin analytics and organization-wide usage governance",
      "Dedicated Customer Success Manager & 99.99% uptime SLA"
    ],
    recommendedTone: "Executive",
    roi: "Save 3.2 hours per employee every week on reports, emails, and documentation."
  },
  teams: {
    title: "Teams & Small Businesses",
    tag: "Team Productivity",
    icon: <Users className="w-6 h-6 text-blue-600" />,
    hero: "Keep your entire team speaking with one unified, polished brand voice.",
    points: [
      "Shared team style guides and custom brand voice personas",
      "Collaborative document transformation and batch exporting",
      "Real-time readability metrics and clarity benchmarks",
      "Central billing and flexible team seat management"
    ],
    recommendedTone: "Fluent",
    roi: "Accelerate proposal turnarounds by 45% while eliminating typos and jargon."
  },
  professionals: {
    title: "Individuals & Professionals",
    tag: "Career & Output",
    icon: <Briefcase className="w-6 h-6 text-purple-600" />,
    hero: "Write with executive clarity, dynamic tone, and complete confidence.",
    points: [
      "Instant 1-click tone shifts: Formal, Persuasive, Academic, Executive",
      "AI Detection shielding & natural Humanizer engine",
      "Sentence-by-sentence alternative suggestions and contextual synonyms",
      "Instant Word (.docx) & Markdown export"
    ],
    recommendedTone: "Executive",
    roi: "Craft high-stakes emails, memos, and pitches in seconds instead of hours."
  },
  support: {
    title: "Customer Support Teams",
    tag: "Empathy & Resolution",
    icon: <Headphones className="w-6 h-6 text-amber-600" />,
    hero: "Deliver empathetic, crystal-clear support responses across any language.",
    points: [
      "De-escalate tickets with empathetic tone calibrations",
      "Multilingual translation across 14+ languages for global customers",
      "Saved response snippets and instant canned alternative generation",
      "Simplified technical explanations for non-technical users"
    ],
    recommendedTone: "Simple",
    roi: "Boost CSAT scores by 18% and cut ticket response latency in half."
  },
  marketing: {
    title: "Marketing & Content Teams",
    tag: "Creativity & Reach",
    icon: <Megaphone className="w-6 h-6 text-rose-600" />,
    hero: "Repurpose campaign content for blogs, social media, ads, and email in seconds.",
    points: [
      "Adapt one core message for LinkedIn, Instagram, newsletters, and landing pages",
      "Action-verb and persuasive psychological tone calibrations",
      "Originality scoring and academic citation validation",
      "Batch paragraph rewriter for multi-page copy decks"
    ],
    recommendedTone: "Fluent",
    roi: "10x content output velocity without adding agency or headcount overhead."
  },
  engineering: {
    title: "Engineering & IT",
    tag: "Technical Documentation",
    icon: <Code className="w-6 h-6 text-indigo-600" />,
    hero: "Turn dense architectural specs and code comments into readable documentation.",
    points: [
      "Translate complex distributed systems jargon into stakeholder-friendly prose",
      "Automated release notes and changelog summarization",
      "API documentation formatting and Markdown structure generation",
      "OCR diagram and screenshot text extraction"
    ],
    recommendedTone: "Simple",
    roi: "Reduce developer documentation onboarding friction by over 40%."
  },
  students: {
    title: "Students & Researchers",
    tag: "Academic Excellence",
    icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
    hero: "Paraphrase research papers responsibly while maintaining academic integrity.",
    points: [
      "Academic & Formal tone profile tailored for dissertations and essays",
      "Automated APA 7th, MLA 9th, and Chicago style citation generator",
      "Originality & Plagiarism avoidance verification",
      "Reading grade level and lexical diversity metrics"
    ],
    recommendedTone: "Academic",
    roi: "Deepen understanding of source papers and craft authentic, properly cited work."
  },
  institutions: {
    title: "Universities & Institutions",
    tag: "Campus-Wide Integrity",
    icon: <School className="w-6 h-6 text-blue-700" />,
    hero: "Provide students and faculty with responsible AI writing tools that uphold academic standards.",
    points: [
      "Campus-wide student & faculty licensing with LMS integrations",
      "AI detection awareness and responsible paraphrasing guidance",
      "Institutional plagiarism prevention and citation verification",
      "Administrative dashboard with aggregated student engagement insights"
    ],
    recommendedTone: "Academic",
    roi: "Empower equitable student writing success and strengthen academic standards."
  }
};

export default function SolutionsModal({ initialKey = 'enterprise', onClose, onOpenAuth, onSelectTone }) {
  const [selectedKey, setSelectedKey] = useState(initialKey || 'enterprise');
  const solution = SOLUTIONS[selectedKey] || SOLUTIONS.enterprise;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 border-b border-gray-100 mb-6">
          {Object.entries(SOLUTIONS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedKey === key
                  ? 'bg-[#027E6F] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                {solution.icon}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#027E6F]">
                  {solution.tag}
                </span>
                <h3 className="text-2xl font-bold text-[#1C1C1C]">
                  {solution.title}
                </h3>
              </div>
            </div>

            <p className="text-base text-[#3E4049] leading-relaxed font-medium">
              {solution.hero}
            </p>

            <div className="space-y-2.5 pt-2">
              {solution.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#027E6F] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* ROI Highlight */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-950 font-medium">
              <strong className="text-[#027E6F]">Proven Impact:</strong> {solution.roi}
            </div>
          </div>

          {/* Right Action Card */}
          <div className="bg-[#F9F9FB] rounded-2xl p-5 border border-gray-200 space-y-4 flex flex-col justify-between h-full">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Recommended Setup
              </div>
              <div className="text-sm font-bold text-[#1C1C1C] mb-1">
                Tone: {solution.recommendedTone}
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Instantly calibrates the paraphrasing engine for this workflow.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (onSelectTone) onSelectTone(solution.recommendedTone);
                  onClose();
                }}
                className="grammarly-green-btn w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Activate {solution.recommendedTone} Mode</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAuth('register');
                }}
                className="w-full py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                Request Team Demo
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
