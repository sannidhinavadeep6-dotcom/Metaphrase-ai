import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  FileSpreadsheet,
  GitCompare,
  Eye,
  EyeOff
} from 'lucide-react';
import { uploadBatchDocument, downloadDocx } from '../services/api';

const SUPPORTED_EXTS = ['pdf', 'docx', 'doc', 'txt', 'md', 'rtf', 'csv', 'json', 'html', 'rst', 'log', 'tsv'];

/**
 * Robust Word-level LCS Diff Engine
 * Accurately detects and maps modified vs unchanged words across paragraphs
 */
function computeWordDiff(origText = '', paraText = '') {
  if (!origText && !paraText) {
    return { origTokens: [], paraTokens: [], changedWords: 0, totalParaWords: 0, changeRate: 0 };
  }

  // Tokenize preserving spaces, tabs and newlines
  const oRaw = (origText || '').split(/(\s+)/);
  const pRaw = (paraText || '').split(/(\s+)/);

  const cleanWord = (w) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

  const oWords = [];
  const oWordIdxMap = [];
  oRaw.forEach((token, idx) => {
    if (/\S/.test(token)) {
      oWords.push(cleanWord(token));
      oWordIdxMap.push(idx);
    }
  });

  const pWords = [];
  const pWordIdxMap = [];
  pRaw.forEach((token, idx) => {
    if (/\S/.test(token)) {
      pWords.push(cleanWord(token));
      pWordIdxMap.push(idx);
    }
  });

  const N = Math.min(oWords.length, 3000);
  const M = Math.min(pWords.length, 3000);

  // Dynamic programming LCS table
  const dp = Array.from({ length: N + 1 }, () => new Uint16Array(M + 1));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (oWords[i] && oWords[i] === pWords[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack matched indices
  const oMatched = new Set();
  const pMatched = new Set();
  let i = N, j = M;
  while (i > 0 && j > 0) {
    if (oWords[i - 1] && oWords[i - 1] === pWords[j - 1] && dp[i][j] === dp[i - 1][j - 1] + 1) {
      oMatched.add(oWordIdxMap[i - 1]);
      pMatched.add(pWordIdxMap[j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  // Generate tokens with diff status
  const origTokens = oRaw.map((text, idx) => {
    const isWord = /\S/.test(text);
    const isDiff = isWord && !oMatched.has(idx);
    return { text, isWord, isDiff };
  });

  const paraTokens = pRaw.map((text, idx) => {
    const isWord = /\S/.test(text);
    const isDiff = isWord && !pMatched.has(idx);
    return { text, isWord, isDiff };
  });

  const changedWords = paraTokens.filter(t => t.isDiff).length;
  const totalParaWords = pWords.length;
  const changeRate = totalParaWords > 0 ? Math.round((changedWords / totalParaWords) * 100) : 0;

  return {
    origTokens,
    paraTokens,
    changedWords,
    totalParaWords,
    changeRate
  };
}

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
  const [showHighlightDiff, setShowHighlightDiff] = useState(true);
  const fileInputRef = useRef(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Compute word diff tokens when result arrives
  const diffData = useMemo(() => {
    if (!result?.original_text || !result?.paraphrased_text) {
      return null;
    }
    return computeWordDiff(result.original_text, result.paraphrased_text);
  }, [result]);

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[92vh] overflow-y-auto cursor-default"
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
            aria-label="Close"
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
          <div className="mt-6 space-y-5 animate-fadeIn">
            {/* Header Status & Downloads */}
            <div className="p-4 rounded-2xl bg-[#E6F5F2] border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#027E6F] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-emerald-950">
                    Transformation Complete ({result.total_chunks} Chunks Processed)
                  </span>
                  <div className="text-[11px] text-emerald-800">
                    Tone: <strong>{result.tone}</strong> &bull; Language: <strong>{result.target_language}</strong>
                    {diffData && (
                      <span className="ml-2 font-semibold text-emerald-900">
                        &bull; {diffData.changeRate}% vocabulary rephrased
                      </span>
                    )}
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

            {/* Difference Highlighting Controls & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowHighlightDiff(!showHighlightDiff)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer border ${
                    showHighlightDiff 
                      ? 'bg-[#027E6F] text-white border-[#027E6F] shadow-2xs' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {showHighlightDiff ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showHighlightDiff ? 'Diff Highlighting Active' : 'Diff Highlighting Off'}</span>
                </button>
                <span className="text-gray-400 hidden sm:inline">|</span>
              </div>

              {/* Color Code Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-red-100 border border-red-300 inline-block"></span>
                  <span className="text-gray-700 font-medium">Light Red: Replaced/Removed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-yellow-200 border border-yellow-400 inline-block"></span>
                  <span className="text-gray-700 font-medium">Yellow: Changed/Paraphrased</span>
                </div>
              </div>
            </div>

            {/* Side-by-side comparison with Colored Diff Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Document Text Column */}
              <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center justify-between">
                  <span>Original Document Text</span>
                  <span className="text-[10px] text-gray-400 font-mono">Source</span>
                </div>
                <div className="text-xs text-[#1C1C1C] max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed flex-1">
                  {showHighlightDiff && diffData ? (
                    diffData.origTokens.map((item, idx) => (
                      item.isDiff ? (
                        <span 
                          key={idx} 
                          className="bg-red-100/90 text-red-900 border border-red-200 px-1 py-0.5 rounded-sm mx-0.5 inline-block"
                          title="Original phrasing replaced"
                        >
                          {item.text}
                        </span>
                      ) : (
                        <span key={idx}>{item.text}</span>
                      )
                    ))
                  ) : (
                    result.original_text
                  )}
                </div>
              </div>

              {/* Paraphrased Output Column */}
              <div className="p-4 rounded-2xl bg-white border border-[#027E6F]/30 shadow-2xs flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-[#027E6F] mb-2.5 flex items-center justify-between">
                  <span>Paraphrased Output</span>
                  <span className="text-[10px] text-[#027E6F] font-mono font-bold">Transformed</span>
                </div>
                <div className="text-xs text-[#1C1C1C] max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed font-medium flex-1">
                  {showHighlightDiff && diffData ? (
                    diffData.paraTokens.map((item, idx) => (
                      item.isDiff ? (
                        <span 
                          key={idx} 
                          className="bg-yellow-200 text-yellow-950 border border-yellow-300 px-1 py-0.5 rounded-sm font-semibold mx-0.5 inline-block shadow-2xs"
                          title="Rewritten / AI-Enhanced phrasing"
                        >
                          {item.text}
                        </span>
                      ) : (
                        <span key={idx}>{item.text}</span>
                      )
                    ))
                  ) : (
                    result.paraphrased_text
                  )}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
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

