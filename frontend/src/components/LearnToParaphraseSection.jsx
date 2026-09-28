import React from 'react';
import { ArrowUpRight, BookOpen, FileCheck, Lightbulb, Compass } from 'lucide-react';

export default function LearnToParaphraseSection() {
  const articles = [
    {
      title: "How to Paraphrase (Without Plagiarizing a Thing)",
      tag: "Writing Guide",
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      bgGradient: "from-emerald-500/10 to-teal-500/5",
      desc: "Learn the core techniques for restating complex source material authentically while retaining 100% meaning."
    },
    {
      title: "Citing Paraphrased Texts in Academic Writing",
      tag: "Academic Integrity",
      icon: <FileCheck className="w-5 h-5 text-blue-600" />,
      bgGradient: "from-blue-500/10 to-indigo-500/5",
      desc: "A complete step-by-step handbook on APA 7th, MLA 9th, and Chicago style citation for paraphrased passages."
    },
    {
      title: "A How-To Guide for Retelling Key Concepts",
      tag: "Strategy & Clarity",
      icon: <Lightbulb className="w-5 h-5 text-amber-600" />,
      bgGradient: "from-amber-500/10 to-yellow-500/5",
      desc: "How to extract the core thesis and rewrite high-density articles for diverse executive and consumer audiences."
    },
    {
      title: "Understanding Key Differences: Paraphrase vs Summary",
      tag: "Linguistics",
      icon: <Compass className="w-5 h-5 text-purple-600" />,
      bgGradient: "from-purple-500/10 to-pink-500/5",
      desc: "Discover when to condense an entire document versus when to preserve granular sentence-by-sentence fidelity."
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E6E6E9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight mb-4">
            Learn how to paraphrase
          </h2>
          <p className="text-lg text-[#646B81] leading-relaxed">
            Want to be better at paraphrasing? Metaphrase AI can help you quickly put any text, from articles to books and more, into your own words. Check out the guides below to create polished, original paraphrases.
          </p>
        </div>

        {/* 4 Article Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group bg-[#F9F9FB] rounded-2xl p-6 border border-gray-200 hover:border-emerald-600 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#027E6F] mb-2 block">
                  {item.tag}
                </span>
                <h3 className="font-bold text-lg text-[#1C1C1C] group-hover:text-[#027E6F] transition-colors leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-[#646B81] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold text-[#1C1C1C] group-hover:text-[#027E6F]">
                <span>Read guide</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
