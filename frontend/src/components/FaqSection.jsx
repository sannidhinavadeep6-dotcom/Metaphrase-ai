import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What does paraphrasing mean?",
      a: "Paraphrasing means restating someone else’s ideas in your own words while keeping the original meaning accurate. It’s an important skill for demonstrating understanding and avoiding plagiarism. When done responsibly, paraphrasing shows that you’ve engaged with the material and can express it authentically."
    },
    {
      q: "What is an example of a paraphrase?",
      a: "Here’s an example:\n• Original: “Effective communication is key to successful teamwork.”\n• Paraphrased: “Strong collaboration depends on clear and effective communication.”\nThe meaning stays the same, but the phrasing and structure change. Paraphrasing in this way shows comprehension, helps you avoid direct copying, and supports academic and professional integrity."
    },
    {
      q: "Who would benefit from using a paraphrasing tool?",
      a: "A paraphrasing tool can help anyone restate ideas clearly, adapt content for new contexts, and maintain originality when writing. This includes professionals (summarizing reports), students (rephrasing research with citations), researchers (simplifying technical jargon), teachers (adapting materials), copywriters & marketers (refreshing messaging), and authors."
    },
    {
      q: "What are the benefits of using a paraphrasing tool?",
      a: "A paraphrasing tool can help you: save time by instantly rewriting text while maintaining meaning, improve clarity and readability, learn new ways to phrase ideas and expand your vocabulary, adapt tone and style for different audiences, and avoid accidental plagiarism when used responsibly with proper citations."
    },
    {
      q: "What are the limitations of a paraphrasing tool?",
      a: "Paraphrasing tools are powerful, but they have limits. They might miss subtle nuances or context from the original text, or produce phrasing that sounds less natural without light editing. Always review AI-generated paraphrases to ensure your writing remains accurate, authentic, and aligned with your voice."
    },
    {
      q: "How does Metaphrase AI’s paraphrasing tool work?",
      a: "Metaphrase AI’s free Paraphraser tool uses state-of-the-art Google Gemini 3.5 Flash neural models to rewrite your text while keeping the meaning accurate and original. It analyzes your writing syntax to suggest alternative phrasing that fits your style, tone, and audience."
    },
    {
      q: "How do I use Metaphrase AI’s paraphrasing tool?",
      a: "Type or paste your text into the input box and select Paraphrase. Metaphrase AI will instantly suggest a rewritten version that maintains your original meaning. You can choose different tones (Simple, Fluent, Academic, Executive), refine sentence alternatives, or copy the output with 1 click."
    },
    {
      q: "Can Metaphrase AI paraphrase in other languages?",
      a: "Yes! Metaphrase AI includes multilingual capabilities and supports 14+ languages: English, Spanish, French, German, Portuguese, Italian, Hindi, Telugu, Japanese, Chinese, and more. You can paraphrase and translate simultaneously."
    },
    {
      q: "Is using a paraphrasing tool considered cheating?",
      a: "No, paraphrasing isn’t cheating when it’s used to express ideas responsibly. It’s part of learning how to understand information and express it in your own voice. The key is ensuring that your writing reflects your comprehension of the source and that proper credit is given where due."
    },
    {
      q: "How do you cite paraphrased text?",
      a: "Even when you put someone else’s ideas into your own words, crediting the source helps you maintain academic and professional integrity. The format depends on your citation style (APA 7th, MLA 9th, Chicago, etc.). Metaphrase AI also provides an automated citation generator."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white border-b border-[#E6E6E9]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-lg text-[#1C1C1C] hover:text-[#027E6F] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#027E6F]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 text-base text-[#565965] leading-relaxed whitespace-pre-line animate-fadeIn pr-6">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
