import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, RefreshCw, BookOpen } from 'lucide-react';
import { rewriteSentence, fetchSynonyms } from '../services/api';

export default function InteractiveSentenceModal({
  user,
  sentence,
  fullContext,
  tone,
  onReplaceSentence,
  onClose,
  onNotify
}) {
  const [tab, setTab] = useState('rewrite'); // 'rewrite' | 'synonyms'
  const [alternatives, setAlternatives] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [loading, setLoading] = useState(true);

  // Load sentence rewrites on mount
  useEffect(() => {
    loadRewrites();
  }, [sentence]);

  const loadRewrites = async () => {
    setLoading(true);
    try {
      const data = await rewriteSentence(sentence, fullContext, tone, user?.email);
      setAlternatives(data.alternatives || []);
    } catch {
      onNotify('Failed to generate sentence variations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSynonyms = async (word) => {
    if (!word.trim()) return;
    setSelectedWord(word.trim());
    setLoading(true);
    try {
      const data = await fetchSynonyms(word.trim(), sentence, user?.email);
      setSynonyms(data.synonyms || []);
    } catch {
      onNotify('Failed to fetch synonyms.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Sentence & Synonym Inspector</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Fine-tune localized phrasing with 1-click replacement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Sentence Box */}
        <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            Selected Sentence
          </div>
          <div className="text-sm font-semibold text-[#1C1C1C] leading-relaxed">
            "{sentence}"
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#F9F9FB] p-1 rounded-full mb-5 border border-gray-200">
          <button
            onClick={() => setTab('rewrite')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === 'rewrite'
                ? 'bg-[#027E6F] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sentence Alternatives
          </button>
          <button
            onClick={() => setTab('synonyms')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === 'synonyms'
                ? 'bg-[#027E6F] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Word Synonyms
          </button>
        </div>

        {/* TAB 1: Rewrite Alternatives */}
        {tab === 'rewrite' && (
          <div className="space-y-3">
            {loading ? (
              <div className="py-8 text-center text-gray-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#027E6F]" />
                <span className="text-xs text-[#646B81]">Generating neural phrasing variations...</span>
              </div>
            ) : alternatives.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-xs">
                No alternative sentences returned.
              </div>
            ) : (
              alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 hover:border-emerald-300 hover:bg-white transition-all flex items-start justify-between gap-3 shadow-2xs group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#027E6F] tracking-wider">
                      Variation {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#1C1C1C] leading-relaxed font-semibold">
                      "{alt}"
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onReplaceSentence(sentence, alt);
                      onClose();
                    }}
                    className="grammarly-green-btn flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Synonyms Finder */}
        {tab === 'synonyms' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Click a word from the sentence or type one below:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3.5 p-3 rounded-2xl bg-[#F9F9FB] border border-gray-200">
                {sentence.split(/\s+/).map((w, idx) => {
                  const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');
                  if (!clean) return null;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSearchSynonyms(clean)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        selectedWord.toLowerCase() === clean.toLowerCase()
                          ? 'bg-[#027E6F] text-white shadow-2xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#027E6F]'
                      }`}
                    >
                      {clean}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type any word to find synonyms..."
                  value={selectedWord}
                  onChange={(e) => setSelectedWord(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSynonyms(selectedWord);
                  }}
                  className="flex-grow bg-[#F9F9FB] border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20"
                />
                <button
                  onClick={() => handleSearchSynonyms(selectedWord)}
                  disabled={loading || !selectedWord.trim()}
                  className="grammarly-green-btn px-5 py-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-6 text-center text-gray-400 flex flex-col items-center gap-1.5">
                <RefreshCw className="w-5 h-5 animate-spin text-[#027E6F]" />
                <span className="text-xs text-[#646B81]">Looking up contextual synonyms...</span>
              </div>
            ) : synonyms.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700">
                  Recommended Synonyms for <span className="text-[#027E6F] font-bold">"{selectedWord}"</span>:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {synonyms.map((syn, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F9F9FB] border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-[#1C1C1C]">{syn}</span>
                      <button
                        onClick={() => {
                          const newSent = sentence.replace(new RegExp(`\\b${selectedWord}\\b`, 'i'), syn);
                          onReplaceSentence(sentence, newSent);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-[#027E6F] hover:underline cursor-pointer"
                      >
                        Replace
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedWord ? (
              <div className="py-4 text-center text-gray-500 text-xs">
                No synonyms found for "{selectedWord}".
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
