import React from 'react';
import { Sparkles, Cpu, Layers, Download, Award, Mail, Phone, Globe } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Hero */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-bold text-sky-700">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Neural Language Transformation Platform</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Engineered for Extreme Clarity, Speed, and Structural Precision.
        </h2>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
          <strong>Metaphrase AI 3.0</strong> is built for high-throughput text restructuring. 
          Unlike conventional word-spinners or simple synonym replacers, Metaphrase utilizes advanced attention-guided 
          reasoning models to deconstruct source sentences, optimize semantic weight, and regenerate 
          prose tailored specifically to your chosen tone.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Gemini Flash AI</h4>
              <p className="text-xs text-slate-500 mt-0.5">Multi-tier model fallback with sub-second response times</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Linguistic Suite</h4>
              <p className="text-xs text-slate-500 mt-0.5">Real-time Flesch Reading Ease, Grade level & Fog analysis</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Document Exporter</h4>
              <p className="text-xs text-slate-500 mt-0.5">1-click Microsoft Word (.docx), Markdown, and TXT downloads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Profile Card */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-xl">
        <h3 className="font-black text-2xl text-slate-900 mb-6 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <span>Lead Developer</span>
        </h3>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-sky-50 text-sky-700 border border-sky-200/80 font-black text-3xl flex items-center justify-center shadow-md flex-shrink-0">
            N
          </div>

          <div className="space-y-3 text-center md:text-left flex-grow">
            <div>
              <h4 className="text-2xl font-bold text-slate-900">Nilesh Hake</h4>
              <p className="text-sm font-semibold text-sky-600">Full-Stack AI Engineer & Distributed Systems Developer</p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Nilesh is a computer science specialist focusing on Machine Learning (Deep Neural Networks, Computer Vision, CNNs), 
              Cloud Architecture (AWS), and high-performance Web Engineering. He builds practical, zero-latency AI systems 
              that solve real-world productivity bottlenecks.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                +91 9014667048
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                nileshhake@gmail.com
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                Python &bull; React &bull; FastAPI &bull; AWS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
