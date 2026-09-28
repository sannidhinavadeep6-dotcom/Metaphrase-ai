import React from 'react';
import { X, BarChart3, TrendingUp, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function FloatingMetricsModal({ metrics, onClose }) {
  if (!metrics) return null;
  const { summary = {}, table_data = [] } = metrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Readability & Linguistic Breakdown</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Structural clarity and Flesch-Kincaid readability assessment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Summary Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-[#F9F9FB] p-4 rounded-2xl border border-gray-200 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#027E6F]" />
              Reading Ease
            </div>
            <div className="text-2xl font-extrabold text-[#027E6F]">{summary.ease_para || 0}</div>
            <div className="inline-block text-[10px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-[#E6F5F2] text-[#027E6F] border border-emerald-200">
              {summary.ease_delta || '+0 pts'}
            </div>
          </div>

          <div className="bg-[#F9F9FB] p-4 rounded-2xl border border-gray-200 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Word Count
            </div>
            <div className="text-2xl font-extrabold text-blue-600">{summary.word_count_para || 0}</div>
            <div className="inline-block text-[10px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {summary.word_delta || '0 words'}
            </div>
          </div>

          <div className="bg-[#F9F9FB] p-4 rounded-2xl border border-gray-200 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Reading Time
            </div>
            <div className="text-2xl font-extrabold text-amber-600">{summary.read_time_para || '0s'}</div>
            <div className="inline-block text-[10px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Optimal Pace
            </div>
          </div>

          <div className="bg-[#F9F9FB] p-4 rounded-2xl border border-gray-200 text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Vocab Diversity
            </div>
            <div className="text-2xl font-extrabold text-purple-600">{summary.diversity_para || '0%'}</div>
            <div className="inline-block text-[10px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Enriched
            </div>
          </div>
        </div>

        {/* Detailed Metrics Comparison Table */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F9F9FB] text-gray-600 font-bold uppercase text-[11px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Linguistic Metric</th>
                  <th className="py-3 px-4">Original Text</th>
                  <th className="py-3 px-4">Paraphrased Text</th>
                  <th className="py-3 px-4 text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {table_data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1C1C1C]">{row.Metric}</td>
                    <td className="py-3 px-4 text-gray-500 font-normal">{row["Original Text"]}</td>
                    <td className="py-3 px-4 text-[#027E6F] font-semibold">{row["Paraphrased Text"]}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] border border-emerald-200">
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
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="grammarly-green-btn px-6 py-2.5 text-xs font-bold shadow-sm hover:shadow-md cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
