import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Check, 
  Download, 
  Sparkles, 
  Zap, 
  Globe, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { uploadBatchDocument, downloadDocx } from '../services/api';

export default function BatchProcessingModal({ 
  onClose, 
  user, 
  languages = [], 
  tones = [], 
  onNotify 
}) {
  const [file, setFile] = useState(null);
  const [selectedTone, setSelectedTone] = useState('Simple');
  const [selectedLang, setSelectedLang] = useState('English');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['docx', 'txt'].includes(ext)) {
      onNotify('Please upload a .docx or .txt document.', 'error');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      onNotify('File size exceeds 10MB limit.', 'error');
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      onNotify('Please select a file to process.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await uploadBatchDocument(
        file,
        selectedTone,
        null,
        selectedLang,
        user?.email
      );
      setResult(data);
      onNotify(`Batch document processed (${data.total_chunks} chunks)!`, 'success');
    } catch (err) {
      onNotify(err.message || 'Batch processing failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!result) return;
    try {
      await downloadDocx(result.original_text, result.paraphrased_text, selectedTone, selectedLang);
      onNotify('Word (.docx) downloaded successfully.', 'success');
    } catch {
      onNotify('Failed to download Word document.', 'error');
    }
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const blob = new Blob([result.paraphrased_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Metaphrase_${result.filename.replace(/\.[^/.]+$/, '')}_Output.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    onNotify('Text (.txt) downloaded.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Document Batch Processing</h3>
              <p className="text-xs text-slate-500">Upload entire .docx or .txt files for chunked AI transformation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Row: Tone & Target Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Target Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full bg-white/90 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="Simple">Simple & Clear</option>
              <option value="Fluent">Natural & Fluent</option>
              <option value="Academic">Academic & Formal</option>
              <option value="Executive">Executive & Concise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Target Language
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full bg-white/90 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="English">English</option>
              <option value="Spanish (Español)">Spanish</option>
              <option value="French (Français)">French</option>
              <option value="German (Deutsch)">German</option>
              <option value="Hindi (हिन्दी)">Hindi</option>
              <option value="Telugu (తెలుగు)">Telugu</option>
              <option value="Japanese (日本語)">Japanese</option>
              <option value="Chinese (Simplified)">Chinese</option>
              <option value="Arabic (العربية)">Arabic</option>
              <option value="Portuguese (Português)">Portuguese</option>
              <option value="Italian (Italiano)">Italian</option>
              <option value="Russian (Русский)">Russian</option>
            </select>
          </div>
        </div>

        {/* Dropzone */}
        {!result && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-sky-500 bg-sky-50/50 scale-[1.01]' 
                : 'border-slate-300 hover:border-sky-400 bg-white/60 hover:bg-slate-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            {file ? (
              <div>
                <div className="font-bold text-slate-900 text-base">{file.name}</div>
                <div className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB &bull; Click or drop another to replace</div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-slate-800 text-base">Drop your .docx or .txt file here</div>
                <div className="text-xs text-slate-500 mt-1">Supports Microsoft Word (.docx) and Plain Text (.txt) up to 10MB</div>
              </div>
            )}
          </div>
        )}

        {/* Action Button when file selected */}
        {file && !result && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleProcess}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 text-sky-400 animate-spin" />
                  <span>Processing Chunks & Transforming...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Process Entire Document</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Preview & Export */}
        {result && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-emerald-950">Document Transformed Successfully</div>
                  <div className="text-xs text-emerald-700">
                    {result.total_paragraphs} paragraphs &bull; {result.total_chunks} concurrent chunks &bull; {result.target_language}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setResult(null); setFile(null); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white/80 transition-all cursor-pointer"
              >
                Upload Another
              </button>
            </div>

            {/* Side-by-side snippet view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 max-h-60 overflow-y-auto">
                <div className="text-[11px] uppercase font-bold text-slate-500 mb-2">Original Document Content</div>
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{result.original_text}</div>
              </div>

              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200/80 max-h-60 overflow-y-auto">
                <div className="text-[11px] uppercase font-bold text-sky-700 mb-2">Transformed Document Output</div>
                <div className="text-slate-900 whitespace-pre-wrap leading-relaxed">{result.paraphrased_text}</div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
              <button
                onClick={handleDownloadDocx}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Transformed Word (.docx)
              </button>

              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Plain Text (.txt)
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
