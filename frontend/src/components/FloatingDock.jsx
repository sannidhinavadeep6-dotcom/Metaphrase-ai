import React from 'react';
import { 
  BarChart3, 
  GitCompare, 
  Download, 
  Copy, 
  Trash2, 
  FileText, 
  Clock, 
  Sparkles,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FloatingDock({
  inputLength,
  inputWords,
  readingTime,
  activeTone,
  hasOutput,
  onCopyOutput,
  onClear,
  onLoadSample,
  onToggleDiff,
  onToggleMetrics,
  onToggleExport,
  isCopied
}) {
  const triggerConfetti = () => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.85 }
    });
    onCopyOutput();
  };

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto max-w-4xl z-40 px-4">
      <div className="glass-dock rounded-3xl p-3 shadow-2xl flex items-center justify-between gap-4 border border-white/80 animate-float">
        {/* Left: Live Statistics Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold text-sky-800 whitespace-nowrap">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Words: <strong>{inputWords}</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700 whitespace-nowrap">
            <span>Chars: <strong>{inputLength}</strong></span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Read: <strong>{readingTime}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{activeTone}</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onLoadSample('tech')}
            className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 hover:bg-slate-100/80 rounded-xl transition-all"
          >
            Sample
          </button>

          {inputLength > 0 && (
            <button
              onClick={onClear}
              title="Clear text"
              className="p-2 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {hasOutput && (
            <>
              <button
                onClick={onToggleDiff}
                title="Inspect Side-by-Side Diff"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 text-xs font-bold transition-all"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Diff</span>
              </button>

              <button
                onClick={onToggleMetrics}
                title="Linguistic Readability Metrics"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 border border-slate-200 text-xs font-bold transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">Metrics</span>
              </button>

              <button
                onClick={onToggleExport}
                title="Export Document"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 border border-slate-200 text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={triggerConfetti}
                title="Copy output to clipboard"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
