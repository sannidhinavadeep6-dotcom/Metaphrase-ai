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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Export & Download Center</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Save your transformed text in document formats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleDownloadDocx}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 hover:border-[#027E6F] hover:bg-white transition-all group text-left cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1C1C1C] group-hover:text-[#027E6F] transition-colors">
                  Microsoft Word Document (.docx)
                </div>
                <div className="text-xs text-[#646B81]">Clean formatted document with source comparison</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#027E6F] transition-colors" />
          </button>

          <button
            onClick={handleDownloadMd}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 hover:border-[#027E6F] hover:bg-white transition-all group text-left cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1C1C1C] group-hover:text-[#027E6F] transition-colors">
                  Markdown Document (.md)
                </div>
                <div className="text-xs text-[#646B81]">Developer & technical documentation format</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#027E6F] transition-colors" />
          </button>

          <button
            onClick={handleDownloadTxt}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 hover:border-[#027E6F] hover:bg-white transition-all group text-left cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#027E6F] border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1C1C1C] group-hover:text-[#027E6F] transition-colors">
                  Plain Text Document (.txt)
                </div>
                <div className="text-xs text-[#646B81]">Clean unformatted text for immediate pasting</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#027E6F] transition-colors" />
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="grammarly-secondary-btn px-6 py-2 text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
