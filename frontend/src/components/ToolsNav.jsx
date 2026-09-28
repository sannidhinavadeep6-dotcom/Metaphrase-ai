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
        <span className="w-5 h-5 rounded-full bg-[#027E6F]/10 text-[#027E6F] flex items-center justify-center font-bold text-xs">
          G
        </span>
      ),
      activeColor: '#027E6F'
    },
    {
      id: 'plagiarism',
      name: 'Plagiarism Checker',
      icon: (
        <Quote className="w-4 h-4 text-sky-500 fill-sky-500" />
      ),
      activeColor: '#0284C7'
    },
    {
      id: 'paraphrase',
      name: 'Paraphrasing Tool',
      icon: (
        <span className="text-sm">🎭</span>
      ),
      activeColor: '#D97706'
    },
    {
      id: 'detector',
      name: 'AI Detector',
      icon: (
        <div className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center text-[9px] font-extrabold text-emerald-700">
          Q
        </div>
      ),
      activeColor: '#059669'
    },
    {
      id: 'humanizer',
      name: 'AI Humanizer',
      icon: (
        <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-black tracking-tighter">
          HU
        </div>
      ),
      activeColor: '#E11D48'
    },
    {
      id: 'aichat',
      name: 'AI Chat',
      icon: (
        <div className="w-4 h-4 bg-emerald-700 text-white rounded flex items-center justify-center text-[10px] font-bold">
          +
        </div>
      ),
      activeColor: '#047857'
    },
    {
      id: 'translator',
      name: 'Translator',
      icon: (
        <Globe className="w-4 h-4 text-blue-600" />
      ),
      activeColor: '#2563EB'
    }
  ];

  return (
    <aside className="border-b border-[#E6E6E9] bg-white overflow-x-auto scrollbar-none sticky top-[68px] z-40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-4 min-w-max py-0" aria-label="Tools">
          {tools.map((tool) => {
            const isActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`relative flex items-center gap-2 py-3.5 px-3 text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#1C1C1C] font-semibold'
                    : 'text-[#646B81] hover:text-[#1C1C1C] hover:bg-gray-50/80 rounded-t'
                }`}
              >
                <span className="flex-shrink-0">{tool.icon}</span>
                <span>{tool.name}</span>

                {/* Active Underline Indicator matching Grammarly */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1C1C1C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
