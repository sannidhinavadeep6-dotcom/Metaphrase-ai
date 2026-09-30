import React, { useMemo, useEffect } from 'react';
import { X, GitCompare } from 'lucide-react';

function computeWordDiff(origText = '', paraText = '') {
  if (!origText && !paraText) {
    return { origTokens: [], paraTokens: [], changedWords: 0, totalParaWords: 0 };
  }

  const oRaw = (origText || '').split(/(\s+)/);
  const pRaw = (paraText || '').split(/(\s+)/);

  const cleanWord = (w) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

  const oWords = [];
  const oWordIdxMap = [];
  oRaw.forEach((token, idx) => {
    if (/\S/.test(token)) {
      oWords.push(cleanWord(token));
      oWordIdxMap.push(idx);
    }
  });

  const pWords = [];
  const pWordIdxMap = [];
  pRaw.forEach((token, idx) => {
    if (/\S/.test(token)) {
      pWords.push(cleanWord(token));
      pWordIdxMap.push(idx);
    }
  });

  const N = Math.min(oWords.length, 3000);
  const M = Math.min(pWords.length, 3000);

  const dp = Array.from({ length: N + 1 }, () => new Uint16Array(M + 1));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (oWords[i] && oWords[i] === pWords[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const oMatched = new Set();
  const pMatched = new Set();
  let i = N, j = M;
  while (i > 0 && j > 0) {
    if (oWords[i - 1] && oWords[i - 1] === pWords[j - 1] && dp[i][j] === dp[i - 1][j - 1] + 1) {
      oMatched.add(oWordIdxMap[i - 1]);
      pMatched.add(pWordIdxMap[j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const origTokens = oRaw.map((text, idx) => {
    const isWord = /\S/.test(text);
    const isDiff = isWord && !oMatched.has(idx);
    return { text, isWord, isDiff };
  });

  const paraTokens = pRaw.map((text, idx) => {
    const isWord = /\S/.test(text);
    const isDiff = isWord && !pMatched.has(idx);
    return { text, isWord, isDiff };
  });

  const changedWords = paraTokens.filter(t => t.isDiff).length;
  return {
    origTokens,
    paraTokens,
    changedWords,
    totalParaWords: pWords.length
  };
}

export default function FloatingDiffModal({ originalText, paraphrasedText, onClose }) {
  const diffData = useMemo(() => {
    return computeWordDiff(originalText, paraphrasedText);
  }, [originalText, paraphrasedText]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[88vh] overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center shadow-2xs">
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
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs mb-5">
          <span className="font-bold text-gray-700">Diff Color Code:</span>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-red-100 border border-red-300 inline-block"></span>
              <span className="text-gray-700 font-medium">Light Red: Replaced in Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-yellow-200 border border-yellow-400 inline-block"></span>
              <span className="text-gray-700 font-medium">Yellow: Rewritten in Output</span>
            </div>
          </div>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Source Text */}
          <div className="bg-[#F9F9FB] p-5 rounded-2xl border border-gray-200 flex flex-col">
            <div className="text-xs uppercase font-bold text-gray-500 mb-3 flex items-center justify-between">
              <span>Original Source Text</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-gray-200">
                {originalText ? originalText.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <div className="text-gray-800 leading-relaxed text-sm font-normal whitespace-pre-wrap max-h-72 overflow-y-auto flex-1">
              {diffData.origTokens.length > 0 ? (
                diffData.origTokens.map((item, idx) => (
                  item.isDiff ? (
                    <span 
                      key={idx} 
                      className="bg-red-100 text-red-900 border border-red-200 px-1 py-0.5 rounded-sm mx-0.5 inline-block"
                      title="Original word replaced"
                    >
                      {item.text}
                    </span>
                  ) : (
                    <span key={idx}>{item.text}</span>
                  )
                ))
              ) : (
                'No source text provided.'
              )}
            </div>
          </div>

          {/* Transformed Output */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs flex flex-col">
            <div className="text-xs uppercase font-bold text-[#027E6F] mb-3 flex items-center justify-between">
              <span>Transformed Output</span>
              <span className="font-mono text-[11px] bg-emerald-50 text-[#027E6F] px-2 py-0.5 rounded-md border border-emerald-200">
                {diffData.totalParaWords} words
              </span>
            </div>
            <div className="text-[#1C1C1C] leading-relaxed text-sm font-medium whitespace-pre-wrap max-h-72 overflow-y-auto flex-1">
              {diffData.paraTokens.length > 0 ? (
                diffData.paraTokens.map((item, idx) => (
                  item.isDiff ? (
                    <span 
                      key={idx} 
                      className="bg-yellow-200 text-yellow-950 border border-yellow-300 px-1 py-0.5 rounded-sm font-semibold mx-0.5 inline-block shadow-2xs"
                      title="AI-Enhanced / Rewritten word"
                    >
                      {item.text}
                    </span>
                  ) : (
                    <span key={idx}>{item.text}</span>
                  )
                ))
              ) : (
                'No output text provided.'
              )}
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
