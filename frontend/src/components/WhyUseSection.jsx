import React, { useState } from 'react';
import { Sparkles, Check, Globe, Sliders, Layers, UserCheck } from 'lucide-react';

export default function WhyUseSection() {
  const [selectedDemoTone, setSelectedDemoTone] = useState('Fluent');
  const [selectedDemoLang, setSelectedDemoLang] = useState('French');

  const toneDemos = {
    'Simple': 'AI boosts computer speed and helps reduce waiting times.',
    'Fluent': 'The artificial intelligence system optimizes processing speed across nodes seamlessly.',
    'Academic': 'Computational throughput is maximized utilizing neural algorithmic paradigms.',
    'Executive': 'AI architecture drives bottom-line compute efficiency and cuts operational latency.'
  };

  const langDemos = {
    'French': 'Le système d\'intelligence artificielle optimise le débit de traitement.',
    'Spanish': 'El sistema de inteligencia artificial optimiza el rendimiento de procesamiento.',
    'German': 'Das System der künstlichen Intelligenz optimiert den Verarbeitungsdurchsatz.',
    'Portuguese': 'O sistema de inteligência artificial otimiza o rendimento do processamento.'
  };

  return (
    <section className="py-16 bg-[#F9F9FB] border-t border-b border-[#E6E6E9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
            Why use Metaphrase AI’s Paraphraser?
          </h2>
          <p className="text-lg text-[#646B81] leading-relaxed">
            Metaphrase AI’s Paraphraser agent helps you rewrite with clarity and confidence. With a free Metaphrase AI account, you get natural, accurate rewrites that stay true to your meaning and your voice.
          </p>
        </div>

        {/* Feature 1: Pick your writing style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Interactive Visual Left */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#027E6F]" />
              <span>Interactive Tone Adaptor</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['Simple', 'Fluent', 'Academic', 'Executive'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedDemoTone(tone)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedDemoTone === tone
                      ? 'bg-[#027E6F] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="text-xs font-semibold text-[#027E6F] mb-1">Original Text:</div>
              <div className="text-xs text-gray-500 mb-3 italic">
                "The artificial intelligence system optimizes computational throughput across distributed neural networks."
              </div>
              <div className="text-xs font-semibold text-emerald-800 mb-1">Adapted Rewrite ({selectedDemoTone}):</div>
              <div className="text-sm font-medium text-gray-900 animate-fadeIn">
                "{toneDemos[selectedDemoTone]}"
              </div>
            </div>
          </div>

          {/* Copy Right */}
          <div className="lg:pl-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] tracking-tight mb-4">
              Pick your writing style
            </h3>
            <p className="text-base sm:text-lg text-[#646B81] leading-relaxed mb-6">
              Choose from six preset styles to instantly adapt your text to any context. The Paraphraser agent fine-tunes your tone and phrasing so every rewrite sounds natural, consistent, and on point.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#027E6F] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Formal, fluent, academic, and executive calibrations</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#027E6F] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Zero factual drift or altered semantic meaning</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Feature 2: Customize your voice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Copy Left */}
          <div className="order-2 lg:order-1 lg:pr-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] tracking-tight mb-4">
              Customize your voice
            </h3>
            <p className="text-base sm:text-lg text-[#646B81] leading-relaxed mb-6">
              Add in tone and style direction to create a custom voice. The Paraphraser agent learns your style and applies it to future rewrites, keeping your writing consistent, personal, and unmistakably yours.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Create custom personas with specific system rules</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Save tailored presets for emails, marketing pitches, or legal memos</span>
              </li>
            </ul>
          </div>

          {/* Interactive Visual Right */}
          <div className="order-1 lg:order-2 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Custom Persona Profile</span>
              </span>
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded">Active</span>
            </div>

            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 mb-4">
              <div className="font-bold text-sm text-gray-900 mb-1">Corporate Marketing Lead</div>
              <div className="text-xs text-gray-600">
                "Rewrite with energetic verbs, persuasive tone, and crisp bullet-ready takeaways."
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs font-semibold text-gray-500 mb-1">Transformed Output:</div>
              <div className="text-sm font-semibold text-purple-950">
                "Accelerate your workflow with enterprise AI that turns complex data into actionable strategy in seconds."
              </div>
            </div>
          </div>

        </div>

        {/* Feature 3: Rewrite in multiple languages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Interactive Visual Left */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-[#027E6F] uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#E6F5F2] flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-[#027E6F]" />
              </div>
              <span>Multilingual Paraphrasing Engine</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['French', 'Spanish', 'German', 'Portuguese'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedDemoLang(lang)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedDemoLang === lang
                      ? 'bg-[#027E6F] text-white shadow-xs'
                      : 'bg-[#F9F9FB] text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="p-5 bg-[#F9F9FB] rounded-2xl border border-emerald-100/80">
              <div className="text-xs font-bold text-[#027E6F] mb-1.5">{selectedDemoLang} Translation & Paraphrase:</div>
              <div className="text-sm font-semibold text-[#1C1C1C] leading-relaxed animate-fadeIn">
                "{langDemos[selectedDemoLang]}"
              </div>
            </div>
          </div>

          {/* Copy Right */}
          <div className="lg:pl-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] tracking-tight mb-4">
              Rewrite in multiple languages
            </h3>
            <p className="text-base sm:text-lg text-[#646B81] leading-relaxed mb-6">
              Paraphrase seamlessly in English, Spanish, French, German, Portuguese, Italian, Hindi, and more. The Paraphraser agent keeps your message clear and accurate, so nothing gets lost in translation.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#027E6F] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>14+ international language profiles with cultural nuance matching</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#027E6F] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Simultaneous translation and syntactic simplification</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
