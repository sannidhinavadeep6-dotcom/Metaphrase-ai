import React from 'react';
import { X, GitCompare } from 'lucide-react';

export default function FloatingDiffModal({ originalText, paraphrasedText, onClose }) {
  const generateDiffElements = () => {
    const origWords = (originalText || '').trim().split(/\s+/);
    const paraWords = (paraphrasedText || '').trim().split(/\s+/);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/80">
          <div className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center justify-between">
            <span>Original Source Text</span>
            <span className="text-slate-400 font-mono">{origWords.length} words</span>
          </div>
          <div className="text-slate-700 leading-relaxed text-sm font-medium">
            {originalText}
          </div>
        </div>

        <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-200/80">
          <div className="text-xs uppercase font-bold text-sky-700 mb-3 flex items-center justify-between">
            <span>Paraphrased & Transformed Text</span>
            <span className="text-sky-600 font-mono">{paraWords.length} words</span>
          </div>
          <div className="text-slate-800 leading-relaxed text-sm font-medium">
            {paraphrasedText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Side-by-Side Diff Inspector</h3>
              <p className="text-xs text-slate-500">Compare original phrasing against AI transformed syntax</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {generateDiffElements()}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
