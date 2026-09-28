import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Zap,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { fetchUserHistory, clearAllHistory, deleteHistoryRecord } from '../services/api';

export default function HistoryView({ user, onRestoreToEditor, onNotify }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const loadHistory = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchUserHistory(user.email);
      setHistory(data.history || []);
    } catch (err) {
      onNotify('Failed to load history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all transformation records?')) return;
    try {
      await clearAllHistory(user.email);
      setHistory([]);
      onNotify('History cleared.', 'info');
    } catch (err) {
      onNotify('Failed to clear history.', 'error');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteHistoryRecord(id, user.email);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      onNotify('Record deleted.', 'info');
    } catch (err) {
      onNotify('Failed to delete item.', 'error');
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify('Copied to clipboard.', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.original_text || '').toLowerCase().includes(q) ||
      (item.paraphrased_text || '').toLowerCase().includes(q) ||
      (item.difficulty || '').toLowerCase().includes(q)
    );
  });

  const toneCounts = history.reduce((acc, curr) => {
    acc[curr.difficulty] = (acc[curr.difficulty] || 0) + 1;
    return acc;
  }, {});

  const mostUsedTone = Object.keys(toneCounts).length > 0 
    ? Object.keys(toneCounts).reduce((a, b) => toneCounts[a] > toneCounts[b] ? a : b)
    : 'None';

  if (!user) {
    return (
      <div className="dual-tone-panel max-w-xl mx-auto rounded-2xl p-8 text-center my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto mb-4">
          <History className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to Access History</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Your transformations, tone analytics, and past versions are securely archived to your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">History & Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Track and restore your previous text transformations</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-100 font-semibold text-xs border border-rose-200 dark:border-rose-800 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="dual-tone-card p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Generations</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{history.length}</div>
          </div>
        </div>

        <div className="dual-tone-card p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Favorite Tone</div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{mostUsedTone}</div>
          </div>
        </div>

        <div className="dual-tone-card p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Storage Performance</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">WAL &bull; &lt; 2ms</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="dual-tone-card p-2 rounded-xl flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past transformations by keyword or tone..."
          className="w-full bg-transparent p-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400 font-normal"
        />
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs sm:text-sm">Loading history records...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="dual-tone-panel rounded-2xl p-12 text-center">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Transformations Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Transform text in the Paraphraser workspace to archive it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="dual-tone-panel rounded-2xl p-4 sm:p-5 space-y-3"
            >
              {/* Header metadata */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold text-xs">
                    {item.difficulty} Tone
                  </span>
                  <span className="text-xs text-slate-400">{item.timestamp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRestoreToEditor(item.original_text, item.paraphrased_text, item.difficulty)}
                    title="Load into workspace"
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
                  >
                    <span>Restore</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, item.paraphrased_text)}
                    title="Copy output"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete item"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm leading-relaxed">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Source Text</div>
                  <div className="text-slate-600 dark:text-slate-300 line-clamp-3 font-normal">{item.original_text}</div>
                </div>

                <div className="bg-blue-50/60 dark:bg-blue-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60">
                  <div className="text-[10px] font-semibold uppercase text-blue-700 dark:text-blue-300 mb-1">Paraphrased Output</div>
                  <div className="text-slate-800 dark:text-slate-100 line-clamp-3 font-medium">{item.paraphrased_text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
