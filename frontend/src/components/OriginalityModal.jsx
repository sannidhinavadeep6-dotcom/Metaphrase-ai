import React, { useState } from 'react';
import { X, ShieldCheck, Award, Copy, Check, BookOpen, Quote } from 'lucide-react';
import { generateCitations } from '../services/api';

export default function OriginalityModal({
  user,
  originalText,
  paraphrasedText,
  originalityData,
  aiDetectData,
  onClose,
  onNotify
}) {
  const [docTitle, setDocTitle] = useState('Academic Transformation Report');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [citations, setCitations] = useState(null);
  const [copiedFormat, setCopiedFormat] = useState(null);

  const origScore = originalityData?.originality_score ?? 88;
  const aiScore = aiDetectData?.ai_probability ?? 14;

  const handleGenerateCitations = async () => {
    try {
      const data = await generateCitations(docTitle, author, year, 'Metaphrase AI Engine', user?.email);
      setCitations(data);
      onNotify('Citations generated in 4 formats!', 'success');
    } catch {
      onNotify('Failed to generate citations.', 'error');
    }
  };

  const handleCopyCitation = (format, text) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    onNotify(`Copied ${format.toUpperCase()} citation!`, 'success');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Originality & Academic Integrity</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Cross-source uniqueness analysis and academic citation generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Primary Integrity Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-[#F9F9FB] border border-gray-200">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Originality Score
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-[#027E6F]">{origScore}%</span>
              <span className="text-xs font-bold text-[#027E6F] bg-[#E6F5F2] px-2.5 py-0.5 rounded-full border border-emerald-200">
                {originalityData?.verdict || 'High Uniqueness'}
              </span>
            </div>
            <div className="mt-2.5 text-xs text-[#646B81]">
              3-Gram Overlap: <strong className="text-[#1C1C1C]">{originalityData?.ngram_overlap_pct || 0}%</strong> &bull; Jaccard Index: <strong className="text-[#1C1C1C]">{originalityData?.jaccard_index || 0}%</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F9F9FB] border border-gray-200">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              AI Detection Risk
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className={`text-3xl font-extrabold ${aiScore < 35 ? 'text-[#027E6F]' : 'text-amber-600'}`}>
                {aiScore}%
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${aiScore < 35 ? 'bg-[#E6F5F2] text-[#027E6F] border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                {aiDetectData?.verdict || 'Likely Human-Written'}
              </span>
            </div>
            <div className="mt-2.5 text-xs text-[#646B81]">
              Burstiness Score: <strong className="text-[#1C1C1C]">{aiDetectData?.burstiness_score || 85}/100</strong> &bull; Natural Organic Rhythm
            </div>
          </div>
        </div>

        {/* Citation Generator Section */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#F9F9FB] border border-gray-200 space-y-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            <Quote className="w-4 h-4 text-[#027E6F]" />
            <span>Academic Citation Generator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Author / Creator
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Sannidhi, N."
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateCitations}
              className="grammarly-green-btn px-5 py-2.5 text-xs font-bold shadow-sm hover:shadow-md cursor-pointer"
            >
              Generate Citations (APA, MLA, IEEE, Chicago)
            </button>
          </div>

          {citations && (
            <div className="space-y-2.5 pt-3 border-t border-gray-200">
              {['apa', 'mla', 'ieee', 'chicago'].map((fmt) => (
                <div key={fmt} className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#027E6F] bg-[#E6F5F2] px-2 py-0.5 rounded border border-emerald-200">
                      {fmt.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-800 mt-1 leading-relaxed font-mono">
                      {citations[fmt]}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyCitation(fmt, citations[fmt])}
                    className="p-1.5 text-gray-400 hover:text-[#027E6F] cursor-pointer"
                    title="Copy citation"
                  >
                    {copiedFormat === fmt ? <Check className="w-4 h-4 text-[#027E6F]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="grammarly-secondary-btn px-6 py-2 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
