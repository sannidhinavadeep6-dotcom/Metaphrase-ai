import React from 'react';
import { X, BarChart3, TrendingUp, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function FloatingMetricsModal({ metrics, onClose }) {
  if (!metrics) return null;
  const { summary = {}, table_data = [] } = metrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Readability & Linguistic Breakdown</h3>
              <p className="text-xs text-slate-500">Structural and semantic readability assessment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Summary Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              Reading Ease
            </div>
            <div className="text-2xl font-black text-sky-600">{summary.ease_para || 0}</div>
            <div className="inline-block text-[11px] font-bold px-2 py-0.5 mt-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {summary.ease_delta || '+0 pts'}
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              Word Count
            </div>
            <div className="text-2xl font-black text-indigo-600">{summary.word_count_para || 0}</div>
            <div className="inline-block text-[11px] font-bold px-2 py-0.5 mt-1 rounded-full bg-slate-100 text-slate-600">
              {summary.word_delta || '0 words'}
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Reading Time
            </div>
            <div className="text-2xl font-black text-amber-600">{summary.read_time_para || '0s'}</div>
            <div className="inline-block text-[11px] font-bold px-2 py-0.5 mt-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              Optimal
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Vocab Diversity
            </div>
            <div className="text-2xl font-black text-purple-600">{summary.diversity_para || '0%'}</div>
            <div className="inline-block text-[11px] font-bold px-2 py-0.5 mt-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
              Enriched
            </div>
          </div>
        </div>

        {/* Detailed Metrics Comparison Table */}
        <div className="bg-white/90 rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Linguistic Metric</th>
                  <th className="py-3 px-4">Original Text</th>
                  <th className="py-3 px-4">Paraphrased Text</th>
                  <th className="py-3 px-4 text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table_data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.Metric}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{row["Original Text"]}</td>
                    <td className="py-3.5 px-4 text-sky-700 font-bold">{row["Paraphrased Text"]}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200/60">
                        {row.Impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
