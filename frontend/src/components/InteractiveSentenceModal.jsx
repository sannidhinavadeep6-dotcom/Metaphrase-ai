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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Sentence & Synonym Inspector</h3>
              <p className="text-xs text-slate-500">Fine-tune localized phrasing with 1-click replacement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Sentence Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Selected Sentence
          </div>
          <div className="text-sm font-semibold text-slate-800 leading-relaxed">
            "{sentence}"
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100/90 p-1 rounded-2xl mb-5 border border-slate-200/70">
          <button
            onClick={() => setTab('rewrite')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'rewrite'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sentence Alternatives
          </button>
          <button
            onClick={() => setTab('synonyms')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'synonyms'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Word Synonyms
          </button>
        </div>

        {/* Content: Sentence Alternatives */}
        {tab === 'rewrite' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Alternative Phrasings
              </span>
              <button
                onClick={loadRewrites}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-slate-400 text-sm">Generating alternatives...</div>
            ) : (
              alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onReplaceSentence(sentence, alt);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-white hover:bg-sky-50/70 border border-slate-200/80 hover:border-sky-300 transition-all cursor-pointer group shadow-xs flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-medium text-slate-800 group-hover:text-sky-950 leading-relaxed">
                    {alt}
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 group-hover:bg-sky-600 text-sky-700 group-hover:text-white font-bold text-xs transition-all flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Content: Contextual Synonyms */}
        {tab === 'synonyms' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Click a word from the sentence or type below:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3 p-3 bg-white rounded-xl border border-slate-200">
                {sentence.split(/\s+/).map((w, i) => {
                  const cleanW = w.replace(/[^\w]/g, '');
                  if (!cleanW) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSearchSynonyms(cleanW)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedWord.toLowerCase() === cleanW.toLowerCase()
                          ? 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-100'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                      }`}
                    >
                      {cleanW}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-6 text-slate-400 text-sm">Searching contextual synonyms...</div>
            ) : synonyms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {synonyms.map((syn, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (selectedWord) {
                        const regex = new RegExp(`\\b${selectedWord}\\b`, 'gi');
                        const newSentence = sentence.replace(regex, syn.word);
                        onReplaceSentence(sentence, newSentence);
                        onClose();
                      }
                    }}
                    className="p-3.5 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer group shadow-xs"
                  >
                    <div className="font-bold text-sm text-slate-900 group-hover:text-sky-700">{syn.word}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{syn.nuance}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Select a word above to see contextual replacements.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
