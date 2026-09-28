import React, { useState } from 'react';
import { ArrowRight, Bot, FileText, Laptop, Check } from 'lucide-react';

export default function WritingSupportSection({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'agents',
      title: 'AI agents',
      heading: 'AI collaborators that act on your goals',
      desc: 'AI agents are digital collaborators that understand your objectives and take action on your behalf. They anticipate your reader’s reactions, surface relevant sources, and streamline complex writing tasks to help you achieve stronger results, faster.',
      icon: <Bot className="w-4 h-4" />,
      tag: 'Autonomous Intelligence'
    },
    {
      id: 'docs',
      title: 'Docs',
      heading: 'Your all-in-one writing space',
      desc: 'Docs is your focused space for deep thinking and seamless writing. AI Chat and specialized agents help you organize ideas, refine tone, and turn early drafts into polished work. And with sharing, commenting, and co-editing built into the writing surface, your entire writing process stays in one place.',
      icon: <FileText className="w-4 h-4" />,
      tag: 'Deep Focus Editor'
    },
    {
      id: 'assistant',
      title: 'AI assistant',
      heading: 'AI that works wherever you do',
      desc: 'Metaphrase AI is the assistant that stays with you across every app, tab, and workflow. It understands your context and offers help before you ask, so you can write, reply, brainstorm, and create with clarity and confidence. You can access Metaphrase AI via web and browser extensions.',
      icon: <Laptop className="w-4 h-4" />,
      tag: 'Ubiquitous Workflow'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E6E6E9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
            Metaphrase AI’s writing support for every idea, draft, and project
          </h2>
          <p className="text-lg text-[#646B81] leading-relaxed">
            AI agents, docs, and intelligent assistants work together to support you everywhere you write and work. They bring focus, flexibility, and intelligence to every stage of your process.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-12 overflow-x-auto scrollbar-none">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-full border border-gray-200">
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

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#F9F9FB] rounded-3xl p-8 sm:p-12 border border-gray-200">
          
          <div>
            <span className="text-xs font-bold text-[#027E6F] uppercase tracking-wider mb-2 block">
              {tabs[activeTab].tag}
            </span>
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
              <span>Get started with Metaphrase AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#027E6F] text-white flex items-center justify-center font-bold text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">Contextual Rewrite Engine</div>
                  <div className="text-xs text-gray-600">Preserves critical terminology and structural coherence.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">Sub-Millisecond Query Response</div>
                  <div className="text-xs text-gray-600">LRU cache & multi-threaded async processing.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">Enterprise Data Privacy</div>
                  <div className="text-xs text-gray-600">Zero data retention for AI model retraining.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
