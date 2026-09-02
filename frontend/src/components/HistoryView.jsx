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
      <div className="glass-panel max-w-xl mx-auto rounded-3xl p-8 text-center my-12 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900">Sign in to Access History</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">History & Analytics</h2>
          <p className="text-sm text-slate-500">Track and restore your previous text transformations</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        )}
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Generations</div>
            <div className="text-2xl font-black text-slate-900">{history.length}</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Favorite Tone</div>
            <div className="text-2xl font-black text-indigo-600">{mostUsedTone}</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Performance</div>
            <div className="text-2xl font-black text-emerald-600">WAL &bull; &lt; 2ms</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-panel p-2 rounded-2xl shadow-xs flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400 ml-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past transformations by keyword or tone..."
          className="w-full bg-transparent p-2 text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
        />
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading history records...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center shadow-xs">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-700">No Transformations Found</h4>
          <p className="text-xs text-slate-500 mt-1">Transform text in the Paraphraser workspace to archive it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl p-5 sm:p-6 shadow-sm transition-all hover:shadow-md space-y-4"
            >
              {/* Header metadata */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 font-bold text-xs">
                    {item.difficulty} Tone
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.timestamp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRestoreToEditor(item.original_text, item.paraphrased_text, item.difficulty)}
                    title="Load into workspace"
                    className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 px-3 py-1.5 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    <span>Restore</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, item.paraphrased_text)}
                    title="Copy output"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete item"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed font-medium">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">Source Text</div>
                  <div className="text-slate-600 line-clamp-4">{item.original_text}</div>
                </div>

                <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200/80">
                  <div className="text-[11px] font-bold uppercase text-sky-700 mb-1">Paraphrased Output</div>
                  <div className="text-slate-800 line-clamp-4 font-semibold">{item.paraphrased_text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
