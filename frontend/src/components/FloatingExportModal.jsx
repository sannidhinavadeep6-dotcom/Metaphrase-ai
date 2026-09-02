import React from 'react';
import { X, Download, FileText, FileCode } from 'lucide-react';
import { downloadDocx, logUserActivity } from '../services/api';

export default function FloatingExportModal({ user, originalText, paraphrasedText, tone, onClose, onNotify }) {
  const handleDownloadDocx = async () => {
    try {
      await downloadDocx(originalText, paraphrasedText, tone, 'English', user?.email);
      onNotify('Word (.docx) downloaded successfully.', 'success');
    } catch (err) {
      onNotify('Failed to download Word document.', 'error');
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([paraphrasedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Metaphrase_Output.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    if (user?.email) {
      logUserActivity(user.email, 'Document Export', 'Exported Plain Text (.txt)', `Tone: ${tone}`, paraphrasedText.split(/\s+/).length);
    }
    onNotify('Text (.txt) downloaded.', 'success');
  };

  const handleDownloadMd = () => {
    const content = `# Metaphrase AI — Transformation Report\n\n**Tone Profile:** ${tone}\n\n## Transformed Output\n\n${paraphrasedText}\n\n---\n\n### Original Source Text\n\n${originalText}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Metaphrase_Report.md';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    if (user?.email) {
      logUserActivity(user.email, 'Document Export', 'Exported Markdown (.md)', `Tone: ${tone}`, paraphrasedText.split(/\s+/).length);
    }
    onNotify('Markdown (.md) downloaded.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Export & Download Center</h3>
              <p className="text-xs text-slate-500">Save your transformed text in document formats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadDocx}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/90 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 transition-all group shadow-xs text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  Microsoft Word Document (.docx)
                </div>
                <div className="text-xs text-slate-500">Professional layout with headers and metadata</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </button>

          <button
            onClick={handleDownloadMd}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/90 hover:bg-purple-50/80 border border-slate-200/80 hover:border-purple-300 transition-all group shadow-xs text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  Markdown Document (.md)
                </div>
                <div className="text-xs text-slate-500">Formatted documentation ready for web or notes</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </button>

          <button
            onClick={handleDownloadTxt}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/90 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 transition-all group shadow-xs text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  Plain Text File (.txt)
                </div>
                <div className="text-xs text-slate-500">Lightweight plain text without formatting</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
