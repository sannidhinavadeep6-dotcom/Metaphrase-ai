import React, { useState } from 'react';
import { 
  Quote, 
  ShieldCheck, 
  Search, 
  RotateCcw, 
  ExternalLink, 
  Check, 
  Copy, 
  AlertTriangle,
  Zap,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { checkPlagiarism, generateCitations } from '../../services/api';

export default function PlagiarismCheckerTool({ user, showToast }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [citationFormat, setCitationFormat] = useState('apa');
  const [copiedCitation, setCopiedCitation] = useState(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleCheck = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter text to check plagiarism.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await checkPlagiarism(inputText, user?.email);
      setResult(data);
      showToast?.(`Plagiarism audit complete! Originality: ${data.originality_score}%`, 'success');
    } catch (err) {
      showToast?.(err.message || 'Plagiarism check failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const samplePlagiarismText = "Distributed consensus protocols like Raft and Paxos ensure fault-tolerant state machine replication across unreliable networks. Leader election mechanisms allow cluster nodes to maintain operational consistency.";

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] mb-3">
          <Quote className="w-3.5 h-3.5 fill-[#027E6F]" />
          <span>Academic & Web Plagiarism Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Verify Uniqueness & Detect Plagiarism
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Scan billion-document web indices, journals, and publications to ensure 100% authentic, properly referenced writing.
        </p>
      </div>

      {/* Main 2-Column Card */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden mb-8 grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E6E6E9]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#027E6F]" />
                <span>Document Text</span>
              </span>
              {!inputText && (
                <button
                  onClick={() => setInputText(samplePlagiarismText)}
                  className="text-xs text-[#027E6F] hover:underline font-semibold cursor-pointer"
                >
                  Try Sample Text
                </button>
              )}
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (result) setResult(null);
              }}
              placeholder="Paste your essay, article, or research paper draft to scan for matching web sources and plagiarism..."
              className="w-full text-[#1C1C1C] text-sm sm:text-base leading-relaxed placeholder:text-gray-400 focus:outline-none resize-none bg-transparent"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="text-xs text-[#646B81] font-medium">
              {wordCount} words &bull; {charCount} characters
            </div>

            <div className="flex items-center gap-2.5">
              {inputText && (
                <button
                  onClick={() => { setInputText(''); setResult(null); }}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Clear text"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleCheck}
                disabled={loading || !inputText.trim()}
                className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-sm font-bold shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 text-white animate-spin" />
                    <span>Auditing Plagiarism...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Scan for Plagiarism</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results & Matching Sources */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F9F9FB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Originality Audit
              </span>
              {result && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  result.originality_score >= 85
                    ? 'bg-[#E6F5F2] text-[#027E6F] border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {result.originality_score}% Original
                </span>
              )}
            </div>

            {!result && (
              <div className="py-16 text-center text-gray-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#027E6F] flex items-center justify-center mx-auto shadow-2xs">
                  <Quote className="w-6 h-6 fill-[#027E6F]" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No scan performed yet</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click "Scan for Plagiarism" to verify uniqueness against billions of academic journals, web archives, and publications.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Score Summary Box */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-extrabold text-[#027E6F]">{result.originality_score}%</div>
                      <div className="text-xs text-[#646B81]">Originality Score</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-gray-800">{result.plagiarism_percentage}%</div>
                      <div className="text-xs text-[#646B81]">Similarity Match</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-xs font-semibold text-emerald-900 bg-[#E6F5F2] p-2 rounded-xl text-center">
                    {result.verdict}
                  </div>
                </div>

                {/* Sources List */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Identified Web Sources ({result.sources.length})
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {result.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-all shadow-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#1C1C1C] truncate max-w-[200px]">
                            {src.title}
                          </span>
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {src.similarity_pct}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-[#646B81] italic line-clamp-2">
                          "{src.matched_snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-[#646B81] text-center">
                Need citation assistance? Use our Citation Handbook under <strong>Education</strong> dropdown.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
