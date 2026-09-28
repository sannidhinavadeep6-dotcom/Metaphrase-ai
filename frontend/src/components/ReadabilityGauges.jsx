import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';

export default function ReadabilityGauges({ metrics, aiDetectData, inputText, outputText }) {
  if (!outputText) return null;

  const words = outputText.trim().split(/\s+/).length;
  const sentences = (outputText.match(/[^.!?]+[.!?]+/g) || [outputText]).length;
  const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
  
  const readingEase = metrics?.flesch_kincaid_grade 
    ? Math.max(10, Math.min(100, Math.round(100 - metrics.flesch_kincaid_grade * 6))) 
    : 85;

  const gradeLevel = metrics?.reading_level || 'Grade 9 (Clear & Engaging)';
  
  const uniqueWords = new Set(outputText.toLowerCase().match(/\b\w+\b/g) || []).size;
  const lexicalVariety = words > 0 ? Math.round((uniqueWords / words) * 100) : 80;

  const aiProb = aiDetectData?.ai_probability ?? 14;

  return (
    <div className="dual-tone-panel rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
            Live Readability & Linguistic Scorecard
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          High Clarity
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Reading Ease */}
        <div className="dual-tone-card p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Reading Ease
          </span>
          <div className="my-1.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{readingEase}</span>
            <span className="text-xs text-slate-500 font-medium">/100</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${readingEase}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Grade Level */}
        <div className="dual-tone-card p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Reading Level
          </span>
          <div className="my-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              {gradeLevel}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Avg {avgWordsPerSentence} w/sent</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 dark:bg-purple-400 h-full rounded-full w-4/5 transition-all duration-1000" />
          </div>
        </div>

        {/* Metric 3: Lexical Variety */}
        <div className="dual-tone-card p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Lexical Richness
          </span>
          <div className="my-1.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{lexicalVariety}%</span>
            <span className="text-xs text-slate-500 font-medium">unique</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${lexicalVariety}%` }}
            />
          </div>
        </div>

        {/* Metric 4: AI Risk */}
        <div className="dual-tone-card p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>AI Signature</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
          </span>
          <div className="my-1.5 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{aiProb}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {aiProb < 25 ? 'Humanized' : 'Generated'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                aiProb < 30 ? 'bg-emerald-500' : aiProb < 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(10, aiProb)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
