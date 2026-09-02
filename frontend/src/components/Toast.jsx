import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-bounce duration-300">
      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl px-5 py-3.5 rounded-2xl text-slate-800 text-sm font-semibold">
        {iconMap[toast.type] || iconMap.info}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
