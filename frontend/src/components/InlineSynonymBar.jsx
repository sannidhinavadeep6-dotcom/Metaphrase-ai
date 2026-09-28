import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { fetchSynonyms } from '../services/api';
import { sfx } from '../utils/audioUtils';

export default function InlineSynonymBar({ word, sentenceContext, onSelectSynonym, onClose }) {
  const [synonyms, setSynonyms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word) return;
    setLoading(true);
    fetchSynonyms(word, sentenceContext)
      .then((data) => {
        setSynonyms(data.synonyms || []);
      })
      .catch(() => {
        setSynonyms([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [word, sentenceContext]);

  if (!word) return null;

  return (
    <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex items-center gap-2.5 flex-wrap animate-fadeIn text-xs z-30">
      <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Synonyms for <strong>"{word}"</strong>:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {loading ? (
          <div className="flex items-center gap-1.5 text-slate-400">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Finding synonyms...</span>
          </div>
        ) : synonyms.length > 0 ? (
          synonyms.slice(0, 5).map((syn, idx) => (
            <button
              key={idx}
              onClick={() => {
                sfx.playSuccess();
                onSelectSynonym(word, syn);
              }}
              className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800 transition-all cursor-pointer"
            >
              {syn}
            </button>
          ))
        ) : (
          <span className="text-slate-400 italic">No alternative suggestions</span>
        )}
      </div>

      <button
        onClick={onClose}
        className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
