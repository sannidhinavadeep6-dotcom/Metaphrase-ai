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
  AlertCircle,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { uploadBatchDocument, downloadDocx } from '../services/api';

const SUPPORTED_EXTS = ['pdf', 'docx', 'doc', 'txt', 'md', 'rtf', 'csv', 'json', 'html', 'rst', 'log', 'tsv'];

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
    if (!SUPPORTED_EXTS.includes(ext)) {
      onNotify(`Unsupported format. Supported types: ${SUPPORTED_EXTS.map(x => '.' + x).join(', ')}`, 'error');
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      onNotify('File size exceeds 25MB limit.', 'error');
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

  const getFileBadge = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">PDF</span>;
    if (['docx', 'doc'].includes(ext)) return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">WORD</span>;
    if (['txt', 'md', 'rtf'].includes(ext)) return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">TEXT</span>;
    return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-bold text-[10px] uppercase">{ext}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C]">Document Batch Transformation</h3>
              <p className="text-xs sm:text-sm text-[#646B81]">Upload PDF, Word (.docx/.doc), Markdown, Text, RTF & CSV files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Row: Tone & Target Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#027E6F]" />
              <span>Target Tone</span>
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full bg-[#F9F9FB] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 cursor-pointer"
            >
              <option value="Simple">Simple & Clear</option>
              <option value="Fluent">Natural & Fluent</option>
              <option value="Academic">Academic & Formal</option>
              <option value="Executive">Executive & Concise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#027E6F]" />
              <span>Target Language</span>
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full bg-[#F9F9FB] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 cursor-pointer"
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
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-[#027E6F] bg-emerald-50/60' 
                : 'border-gray-300 hover:border-[#027E6F] bg-[#F9F9FB] hover:bg-emerald-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md,.rtf,.csv,.json,.html,.rst,.log,.tsv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            {file ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  {getFileBadge(file.name)}
                  <span className="font-bold text-[#1C1C1C] text-sm sm:text-base">{file.name}</span>
                </div>
                <div className="text-xs text-[#646B81]">
                  {(file.size / 1024).toFixed(1)} KB &bull; <span className="text-[#027E6F] font-semibold">Click to replace file</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-bold text-[#1C1C1C] text-sm sm:text-base">
                  Drop any PDF, Word, or Document file here
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">.PDF</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">.DOCX / .DOC</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">.TXT / .MD</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">.RTF / .CSV</span>
                </div>
                <p className="text-[11px] text-[#646B81] pt-1">
                  Automatic page & paragraph chunking up to 25MB
                </p>
              </div>
            )}
          </div>
        )}

        {/* Process Action Button */}
        {!result && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="grammarly-secondary-btn px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              disabled={!file || loading}
              className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Processing Chunks...' : 'Transform Entire Document'}</span>
            </button>
          </div>
        )}

        {/* Result View */}
        {result && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#E6F5F2] border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#027E6F] text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-emerald-950">
                    Transformation Complete ({result.total_chunks} Chunks Processed)
                  </span>
                  <div className="text-[11px] text-emerald-800">
                    Tone: <strong>{result.tone}</strong> &bull; Language: <strong>{result.target_language}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadDocx}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#027E6F] font-bold text-xs border border-emerald-300 shadow-2xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .DOCX</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#027E6F] hover:bg-[#006356] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Original Document Text</div>
                <div className="text-xs text-[#1C1C1C] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {result.original_text}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#027E6F]/30 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#027E6F] mb-2">Paraphrased Output</div>
                <div className="text-xs text-[#1C1C1C] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed font-medium">
                  {result.paraphrased_text}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
                className="grammarly-secondary-btn px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                Process Another File
              </button>
              <button
                onClick={onClose}
                className="grammarly-green-btn px-6 py-2 text-xs font-bold cursor-pointer"
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
