import React from 'react';
import { Sparkles, Cpu, Layers, Download, Award, Mail, Globe, ArrowLeft } from 'lucide-react';

export default function AboutView({ onBack }) {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#027E6F] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Paraphraser</span>
        </button>
      )}

      {/* Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E6E9] shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F]">
          <Sparkles className="w-4 h-4" />
          <span>Neural Language Transformation Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight leading-tight">
          Engineered for Extreme Clarity, Speed, and Structural Precision.
        </h1>

        <p className="text-[#646B81] text-sm sm:text-base leading-relaxed font-normal">
          <strong className="text-[#1C1C1C] font-semibold">Metaphrase AI 3.0</strong> is built for high-throughput text restructuring. 
          Unlike conventional word-spinners or simple synonym replacers, Metaphrase utilizes advanced attention-guided 
          reasoning models to deconstruct source sentences, optimize semantic weight, and regenerate 
          prose tailored specifically to your chosen tone.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
          <div className="bg-[#F9F9FB] flex items-start gap-3.5 p-4 rounded-2xl border border-gray-200">
            <div className="w-9 h-9 rounded-xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-200 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1C] text-sm">Gemini Flash AI</h4>
              <p className="text-xs text-[#646B81] mt-0.5">Multi-tier model fallback with sub-second response times</p>
            </div>
          </div>

          <div className="bg-[#F9F9FB] flex items-start gap-3.5 p-4 rounded-2xl border border-gray-200">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1C] text-sm">Linguistic Suite</h4>
              <p className="text-xs text-[#646B81] mt-0.5">Real-time Flesch Reading Ease, Grade level & Fog analysis</p>
            </div>
          </div>

          <div className="bg-[#F9F9FB] flex items-start gap-3.5 p-4 rounded-2xl border border-gray-200">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1C1C] text-sm">Document Exporter</h4>
              <p className="text-xs text-[#646B81] mt-0.5">1-click Microsoft Word (.docx), Markdown, and TXT downloads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E6E9] shadow-xl space-y-6">
        <h3 className="font-bold text-xl text-[#1C1C1C] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-200 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <span>Lead Developer & Architect</span>
        </h3>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#027E6F] text-white font-extrabold text-3xl flex items-center justify-center shadow-md shrink-0">
            N
          </div>

          <div className="space-y-3 text-center md:text-left flex-grow">
            <div>
              <h4 className="text-xl font-bold text-[#1C1C1C]">Navadeep Sannidhi</h4>
              <p className="text-xs font-semibold text-[#027E6F]">Full-Stack AI Engineer & Deep Learning Specialist</p>
            </div>

            <p className="text-xs sm:text-sm text-[#646B81] leading-relaxed font-normal">
              Navadeep is an AI engineer and developer specializing in Large Language Models, Neural Text Processing, 
              Cloud Architecture, and high-performance Web Systems. He builds practical, zero-latency intelligent applications 
              that redefine text transformation and automated linguistic analysis.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F9FB] border border-gray-200 text-gray-700 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#027E6F]" />
                sannidhinavadeep6@gmail.com
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9F9FB] border border-gray-200 text-gray-700 font-semibold">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Python &bull; React &bull; FastAPI &bull; Gemini AI &bull; PyTorch
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
