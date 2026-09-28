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
  Check, 
  Bookmark, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/audioUtils';

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
  isCopied,
  isFavorite,
  onToggleFavorite,
  isPlayingTts,
  onToggleTts
}) {
  const triggerConfetti = () => {
    sfx.playSuccess();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 }
    });
    onCopyOutput();
  };

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto max-w-4xl z-40 px-4">
      <div className="dual-tone-dock rounded-2xl p-2.5 shadow-lg flex items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
        {/* Left: Live Statistics Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <div className="dual-tone-pill flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Words: <strong className="font-semibold text-slate-900 dark:text-white">{inputWords}</strong></span>
          </div>

          <div className="dual-tone-pill hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap">
            <span>Chars: <strong className="font-semibold text-slate-900 dark:text-white">{inputLength}</strong></span>
          </div>

          <div className="dual-tone-pill hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Read: <strong className="font-semibold text-slate-900 dark:text-white">{readingTime}</strong></span>
          </div>

          <div className="dual-tone-pill flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{activeTone}</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              sfx.playPop();
              onLoadSample('tech');
            }}
            className="dual-tone-pill hidden sm:inline-block px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Sample
          </button>

          {inputLength > 0 && (
            <button
              onClick={() => {
                sfx.playWhoosh();
                onClear();
              }}
              title="Clear workspace"
              className="dual-tone-pill p-1.5 rounded-lg text-slate-500 hover:text-rose-600 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {hasOutput && (
            <>
              {/* Voice TTS Reader */}
              <button
                onClick={() => {
                  sfx.playClick();
                  onToggleTts();
                }}
                title={isPlayingTts ? "Stop speech" : "Read output aloud (TTS)"}
                className={`dual-tone-pill flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  isPlayingTts ? 'text-amber-600 animate-pulse' : ''
                }`}
              >
                {isPlayingTts ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
                <span className="hidden sm:inline">{isPlayingTts ? "Stop" : "Listen"}</span>
              </button>

              {/* Bookmark output */}
              <button
                onClick={() => {
                  sfx.playPop();
                  onToggleFavorite();
                }}
                title={isFavorite ? "Remove from bookmarks" : "Save output snippet"}
                className="dual-tone-pill p-1.5 rounded-lg cursor-pointer"
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
              </button>

              <button
                onClick={() => {
                  sfx.playClick();
                  onToggleDiff();
                }}
                title="Inspect Side-by-Side Diff"
                className="dual-tone-pill flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Diff</span>
              </button>

              <button
                onClick={() => {
                  sfx.playClick();
                  onToggleMetrics();
                }}
                title="Linguistic Readability Metrics"
                className="dual-tone-pill flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Metrics</span>
              </button>

              <button
                onClick={() => {
                  sfx.playClick();
                  onToggleExport();
                }}
                title="Export Document"
                className="dual-tone-pill flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={triggerConfetti}
                title="Copy output to clipboard"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
