import React from 'react';
import { 
  CheckCircle2, 
  Quote, 
  Sparkles, 
  Search, 
  Flame, 
  MessageSquare, 
  Globe 
} from 'lucide-react';

export default function ToolsNav({ activeTab, setActiveTab }) {
  const tools = [
    {
      id: 'grammar',
      name: 'Grammar Check',
      icon: (
        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black text-xs shadow-2xs">
          G
        </span>
      ),
      activeColor: '#027E6F',
      activeBg: 'bg-emerald-50 text-emerald-950 font-bold',
      underlineColor: 'bg-[#027E6F]'
    },
    {
      id: 'plagiarism',
      name: 'Plagiarism Checker',
      icon: (
        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 border border-sky-300 flex items-center justify-center font-bold text-xs shadow-2xs">
          <Quote className="w-3 h-3 text-sky-600 fill-sky-600" />
        </span>
      ),
      activeColor: '#0284C7',
      activeBg: 'bg-sky-50 text-sky-950 font-bold',
      underlineColor: 'bg-[#0284C7]'
    },
    {
      id: 'paraphrase',
      name: 'Paraphrasing Tool',
      icon: (
        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-xs shadow-2xs">
          🎭
        </span>
      ),
      activeColor: '#D97706',
      activeBg: 'bg-amber-50 text-amber-950 font-bold',
      underlineColor: 'bg-[#D97706]'
    },
    {
      id: 'detector',
      name: 'AI Detector',
      icon: (
        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center font-black text-[10px] shadow-2xs">
          Q
        </span>
      ),
      activeColor: '#7C3AED',
      activeBg: 'bg-purple-50 text-purple-950 font-bold',
      underlineColor: 'bg-[#7C3AED]'
    },
    {
      id: 'humanizer',
      name: 'AI Humanizer',
      icon: (
        <span className="w-5 h-5 rounded-full bg-rose-500 text-white border border-rose-600 flex items-center justify-center font-black text-[9px] shadow-2xs tracking-tighter">
          HU
        </span>
      ),
      activeColor: '#E11D48',
      activeBg: 'bg-rose-50 text-rose-950 font-bold',
      underlineColor: 'bg-[#E11D48]'
    },
    {
      id: 'aichat',
      name: 'AI Chat',
      icon: (
        <span className="w-5 h-5 rounded-full bg-teal-600 text-white border border-teal-700 flex items-center justify-center font-black text-xs shadow-2xs">
          +
        </span>
      ),
      activeColor: '#0D9488',
      activeBg: 'bg-teal-50 text-teal-950 font-bold',
      underlineColor: 'bg-[#0D9488]'
    },
    {
      id: 'translator',
      name: 'Translator',
      icon: (
        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 flex items-center justify-center text-xs shadow-2xs">
          <Globe className="w-3 h-3 text-blue-600" />
        </span>
      ),
      activeColor: '#2563EB',
      activeBg: 'bg-blue-50 text-blue-950 font-bold',
      underlineColor: 'bg-[#2563EB]'
    }
  ];

  return (
    <aside className="border-b border-[#E6E6E9] bg-white overflow-x-auto scrollbar-none sticky top-[68px] z-40 shadow-2xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-3 min-w-max py-0" aria-label="Tools">
          {tools.map((tool) => {
            const isActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`relative flex items-center gap-2 py-3 px-3.5 text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
                  isActive
                    ? `${tool.activeBg} shadow-2xs`
                    : 'text-[#646B81] hover:text-[#1C1C1C] hover:bg-gray-50'
                }`}
              >
                <span className="flex-shrink-0">{tool.icon}</span>
                <span>{tool.name}</span>

                {/* Active Colored Underline Indicator */}
                {isActive && (
                  <span className={`absolute bottom-0 left-2 right-2 h-[3px] ${tool.underlineColor} rounded-full`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
