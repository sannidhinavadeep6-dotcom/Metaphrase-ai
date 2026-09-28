import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Paraphraser has become my go-to. This agent streamlines and simplifies my writing in ways I used to spend so much time doing manually.",
      name: "Jonathan Linke",
      role: "Marketing Manager, Henry Schein"
    },
    {
      quote: "Paraphraser makes it easy to repurpose content for different audiences. I can take the same text and instantly adapt it for Instagram’s education-focused audience or LinkedIn’s personal brand crowd. It’s a game-changer.",
      name: "Evelyn Chavez",
      role: "Founder/CEO and Content Educator, Social & Lattes Creative"
    }
  ];

  return (
    <section className="py-20 bg-[#F9F9FB] border-b border-[#E6E6E9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] tracking-tight">
            Why people love Metaphrase AI
          </h2>
        </div>

        {/* 2 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* 5 Star Rating */}
                <div className="flex items-center gap-1 mb-6 text-emerald-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-600" />
                  ))}
                </div>

                <blockquote className="text-lg sm:text-xl font-medium text-[#1C1C1C] leading-relaxed mb-8">
                  “{t.quote}”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#027E6F] font-bold flex items-center justify-center text-sm">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-[#1C1C1C] text-sm">{t.name}</div>
                  <div className="text-xs text-[#646B81]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
