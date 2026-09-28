import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function MoreToolsSection({ setActiveTab }) {
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = {
    general: [
      { title: 'AI Article Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Outline Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Sentence Checker', action: () => setActiveTab('grammar') },
      { title: 'AI Summarizer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Brainstorming Generator', action: () => setActiveTab('aichat') },
      { title: 'AI Paragraph Rewriter', action: () => setActiveTab('paraphrase') },
      { title: 'AI Sentence Rewriter', action: () => setActiveTab('paraphrase') },
      { title: 'AI Title Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Chat Tool', action: () => setActiveTab('aichat') },
      { title: 'AI Formal Letter Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Paraphrasing Tool', action: () => setActiveTab('paraphrase') },
      { title: 'AI Grammar Checker', action: () => setActiveTab('grammar') },
      { title: 'AI Rewording Tool', action: () => setActiveTab('paraphrase') },
      { title: 'Character & Word Counter', action: () => setActiveTab('paraphrase') },
      { title: 'AI Spell-Checker', action: () => setActiveTab('grammar') },
      { title: 'Neural Translator', action: () => setActiveTab('translator') }
    ],
    work: [
      { title: 'AI Blog Post Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Business Report Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Instagram Caption Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Meta Title Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Email Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Job Description Tool', action: () => setActiveTab('paraphrase') },
      { title: 'AI Product Description Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Executive Summary Tool', action: () => setActiveTab('paraphrase') },
      { title: 'AI Letter of Resignation Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Slogan Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Business Plan Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Value Proposition Writer', action: () => setActiveTab('paraphrase') }
    ],
    school: [
      { title: 'AI Abstract Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Conclusion Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Humanizer Tool', action: () => setActiveTab('humanizer') },
      { title: 'Plagiarism Checker', action: () => setActiveTab('plagiarism') },
      { title: 'APA Citation Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Detector Tool', action: () => setActiveTab('detector') },
      { title: 'AI Thesis Statement Writer', action: () => setActiveTab('paraphrase') },
      { title: 'Chicago Citation Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Essay Checker', action: () => setActiveTab('grammar') },
      { title: 'MLA Citation Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Topic Sentence Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Personal Statement Writer', action: () => setActiveTab('paraphrase') }
    ],
    job: [
      { title: 'AI Cover Letter Generator', action: () => setActiveTab('paraphrase') },
      { title: 'AI Résumé Skills Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI LinkedIn Headline Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI LinkedIn Post Writer', action: () => setActiveTab('paraphrase') },
      { title: 'AI Résumé Objective Tool', action: () => setActiveTab('paraphrase') },
      { title: 'AI Interview Prep Assistant', action: () => setActiveTab('aichat') }
    ]
  };

  return (
    <section className="py-20 bg-[#F9F9FB] border-b border-[#E6E6E9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight">
            More AI writing tools
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-12 overflow-x-auto scrollbar-none">
          <div className="inline-flex p-1.5 bg-gray-200/70 rounded-full border border-gray-200">
            {[
              { id: 'general', label: 'General writing' },
              { id: 'work', label: 'Work writing' },
              { id: 'school', label: 'School writing' },
              { id: 'job', label: 'Job searching' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#1C1C1C] shadow-sm font-bold'
                    : 'text-[#646B81] hover:text-[#1C1C1C]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
          {categories[activeCategory].map((tool, idx) => (
            <button
              key={idx}
              onClick={() => {
                tool.action();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left text-sm font-medium text-gray-700 hover:text-[#027E6F] hover:underline py-1.5 flex items-center justify-between group cursor-pointer"
            >
              <span>{tool.title}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#027E6F] text-xs">→</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
