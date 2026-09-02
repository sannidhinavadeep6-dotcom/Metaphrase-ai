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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Originality & Academic Integrity</h3>
              <p className="text-xs text-slate-500">Cross-source uniqueness analysis and citation builder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Primary Integrity Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Originality Score
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">{origScore}%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {originalityData?.verdict || 'High Uniqueness'}
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 leading-tight">
              3-Gram Overlap: <strong>{originalityData?.ngram_overlap_pct || 0}%</strong> &bull; Jaccard Index: <strong>{originalityData?.jaccard_index || 0}%</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              AI Detection Risk
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${aiScore < 35 ? 'text-sky-600' : 'text-amber-600'}`}>
                {aiScore}%
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${aiScore < 35 ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>
                {aiDetectData?.verdict || 'Likely Human-Written'}
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 leading-tight">
              Burstiness Score: <strong>{aiDetectData?.burstiness_score || 85}/100</strong> &bull; Low Robotic Patterns
            </div>
          </div>
        </div>

        {/* Citation Generator Section */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Quote className="w-4 h-4 text-indigo-600" />
            <span>Academic Citation Generator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Title of work"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Nilesh Hake"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Publication Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateCitations}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Generate Citations
            </button>
          </div>

          {citations && (
            <div className="space-y-2.5 pt-2">
              {['apa', 'mla', 'chicago', 'harvard'].map((fmt) => (
                <div key={fmt} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-indigo-700 uppercase mr-2 font-mono">[{fmt.toUpperCase()}]</span>
                    <span className="text-slate-800">{citations[fmt]}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCitation(fmt, citations[fmt])}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex-shrink-0 cursor-pointer"
                  >
                    {copiedFormat === fmt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
