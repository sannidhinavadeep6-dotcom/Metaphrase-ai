import React from 'react';
import { 
  Bookmark, 
  X, 
  Trash2, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Clock
} from 'lucide-react';
import { sfx } from '../utils/audioUtils';

export default function SavedSnippetsModal({
  isOpen,
  onClose,
  favorites = [],
  onRemoveFavorite,
  onRestoreSnippet,
  onNotify
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = (fav) => {
    navigator.clipboard.writeText(fav.outputText);
    setCopiedId(fav.id);
    sfx.playSuccess();
    if (onNotify) onNotify('Copied saved snippet to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRestore = (fav) => {
    sfx.playWhoosh();
    onRestoreSnippet(fav.inputText, fav.outputText, fav.tone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C1C1C]">
                Saved Snippets & Bookmarks
              </h2>
              <p className="text-xs sm:text-sm text-[#646B81]">
                {favorites.length} saved transformation{favorites.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-grow overflow-y-auto py-5 space-y-3.5">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-3 bg-[#F9F9FB] rounded-2xl border border-dashed border-gray-200 p-6">
              <Bookmark className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-bold text-[#1C1C1C]">No saved snippets yet.</p>
              <p className="text-xs max-w-xs mx-auto text-[#646B81] leading-relaxed">
                Click the bookmark star icon on any transformed output to save it for quick reference and instant restoring.
              </p>
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 hover:border-emerald-300 hover:bg-white transition-all space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#027E6F] bg-[#E6F5F2] px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {fav.tone || 'Simple'} Tone
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{fav.date || (fav.timestamp ? new Date(fav.timestamp).toLocaleDateString() : 'Recent')}</span>
                  </div>
                </div>

                <div className="text-sm text-[#1C1C1C] font-semibold leading-relaxed">
                  "{fav.outputText}"
                </div>

                {fav.inputText && (
                  <div className="text-xs text-[#646B81] italic line-clamp-1 border-l-2 border-emerald-500/40 pl-2.5">
                    Orig: {fav.inputText}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60">
                  <button
                    onClick={() => handleCopy(fav)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {copiedId === fav.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#027E6F]" />
                        <span className="text-[#027E6F]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRestore(fav)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] hover:bg-[#027E6F] text-[#027E6F] hover:text-white border border-emerald-200 transition-all cursor-pointer"
                  >
                    <span>Use in Editor</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(fav.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove snippet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="grammarly-secondary-btn px-6 py-2 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
