import React from 'react';
import { X, GitCompare } from 'lucide-react';

export default function FloatingDiffModal({ originalText, paraphrasedText, onClose }) {
  const origWords = (originalText || '').trim().split(/\s+/).filter(Boolean);
  const paraWords = (paraphrasedText || '').trim().split(/\s+/).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Side-by-Side Diff Inspector</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Compare original phrasing against AI transformed syntax</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-[#F9F9FB] p-5 rounded-2xl border border-gray-200">
            <div className="text-xs uppercase font-bold text-gray-500 mb-3 flex items-center justify-between">
              <span>Original Source Text</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-gray-200">{origWords.length} words</span>
            </div>
            <div className="text-gray-800 leading-relaxed text-sm font-normal whitespace-pre-wrap max-h-72 overflow-y-auto">
              {originalText || 'No source text provided.'}
            </div>
          </div>

          <div className="bg-[#E6F5F2]/40 p-5 rounded-2xl border border-emerald-200">
            <div className="text-xs uppercase font-bold text-[#027E6F] mb-3 flex items-center justify-between">
              <span>Transformed Output</span>
              <span className="font-mono text-[11px] bg-white text-[#027E6F] px-2 py-0.5 rounded-md border border-emerald-200">{paraWords.length} words</span>
            </div>
            <div className="text-[#1C1C1C] leading-relaxed text-sm font-medium whitespace-pre-wrap max-h-72 overflow-y-auto">
              {paraphrasedText || 'No output text provided.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="grammarly-green-btn px-6 py-2.5 text-xs font-bold shadow-sm hover:shadow-md cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
