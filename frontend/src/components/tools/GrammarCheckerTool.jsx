import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Upload, 
  AlertCircle,
  Wand2,
  FileCheck,
  Zap,
  ArrowRight,
  Edit3,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { checkGrammar, extractDocumentText } from '../../services/api';

export default function GrammarCheckerTool({ user, showToast }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'scan'
  const fileInputRef = useRef(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const data = await extractDocumentText(file, user?.email);
      if (data.text) {
        setInputText(data.text);
        setResult(null);
        setViewMode('editor');
        showToast?.(`Extracted ${file.name} successfully!`, 'success');
      }
    } catch (err) {
      showToast?.(err.message || 'Failed to extract text from file.', 'error');
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCheck = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter text to check grammar.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await checkGrammar(inputText, user?.email);
      setResult(data);
      setViewMode('scan');
      showToast?.(`Grammar scan complete! Score: ${data.score}/100`, 'success');
    } catch (err) {
      showToast?.(err.message || 'Grammar check failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = (issue) => {
    if (!result) return;
    const newText = inputText.replace(issue.original, issue.suggestion);
    setInputText(newText);
    const updatedIssues = result.issues.filter((i) => i.id !== issue.id);
    setResult({
      ...result,
      issues: updatedIssues,
      score: Math.min(100, result.score + 5)
    });
    showToast?.(`Fixed "${issue.original}" → "${issue.suggestion}"`, 'success');
  };

  const handleApplyAllFixes = () => {
    if (!result?.corrected_text) return;
    setInputText(result.corrected_text);
    setResult({
      ...result,
      issues: [],
      score: 100
    });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    showToast?.('All grammar & spelling fixes applied!', 'success');
  };

  const handleCopy = () => {
    const textToCopy = result?.corrected_text || inputText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast?.('Copied to clipboard!', 'info');
  };

  const sampleGrammarText = "Their is many mistake in this sentence that needs fixing in order to improve teh readability and make it very unique.";

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] mb-3">
          <span className="w-4 h-4 rounded-full bg-[#027E6F] text-white flex items-center justify-center text-[10px] font-bold">G</span>
          <span>Free Online Grammar Checker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Check Grammar, Spelling & Punctuation
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Eliminate typos, syntax errors, and awkward phrasing instantly with Metaphrase AI's real-time linguistic engine.
        </p>
      </div>

      {/* Main 2-Column Card */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden mb-8 grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E6E6E9]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#027E6F]" />
                  <span>Input Text</span>
                </span>
                {result && (
                  <div className="inline-flex p-0.5 bg-gray-100 rounded-lg border border-gray-200 text-xs">
                    <button
                      onClick={() => setViewMode('editor')}
                      className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                        viewMode === 'editor' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setViewMode('scan')}
                      className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                        viewMode === 'scan' ? 'bg-white text-[#027E6F] shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Scan View</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.md,.rtf,.csv"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDoc}
                  className="text-xs text-[#027E6F] hover:text-[#006356] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>{uploadingDoc ? 'Uploading...' : 'Upload Doc/PDF'}</span>
                </button>
                {!inputText && (
                  <button
                    onClick={() => {
                      setInputText(sampleGrammarText);
                      setResult(null);
                      setViewMode('editor');
                    }}
                    className="text-xs text-[#027E6F] hover:underline font-semibold cursor-pointer"
                  >
                    Try Sample
                  </button>
                )}
              </div>
            </div>

            {result && viewMode === 'scan' && result.issues?.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-bold text-gray-700">Issue Color Codes:</span>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-200 border border-rose-400 inline-block"></span>
                      <span className="text-rose-900 font-semibold">Red: Spelling/Grammar</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-yellow-200 border border-yellow-400 inline-block"></span>
                      <span className="text-yellow-950 font-semibold">Yellow: Clarity/Style</span>
                    </span>
                  </div>
                </div>

                <div className="w-full text-[#1C1C1C] text-sm sm:text-base leading-relaxed p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 min-h-[200px] max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {(() => {
                    let rendered = inputText;
                    return (
                      <div className="space-y-2">
                        {inputText.split(/\s+/).map((word, wIdx) => {
                          const cleanW = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
                          const matchingIssue = result.issues.find(iss => 
                            iss.original.toLowerCase().includes(cleanW) || cleanW.includes(iss.original.toLowerCase())
                          );
                          if (matchingIssue) {
                            const isGrammarOrSpelling = ['spelling', 'grammar', 'punctuation'].includes(matchingIssue.type.toLowerCase());
                            return (
                              <span
                                key={wIdx}
                                onClick={() => handleApplyFix(matchingIssue)}
                                className={`px-1.5 py-0.5 rounded-sm mx-0.5 inline-block font-semibold cursor-pointer transition-all ${
                                  isGrammarOrSpelling
                                    ? 'bg-rose-100 text-rose-900 border border-rose-300 line-through hover:bg-rose-200'
                                    : 'bg-yellow-200 text-yellow-950 border border-yellow-400 hover:bg-yellow-300'
                                }`}
                                title={`Click to apply fix: ${matchingIssue.original} → ${matchingIssue.suggestion} (${matchingIssue.explanation})`}
                              >
                                {word}{' '}
                              </span>
                            );
                          }
                          return <span key={wIdx}>{word} </span>;
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <textarea
                rows={12}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (result) setResult(null);
                }}
                placeholder="Paste or type your text here to check grammar, spelling, punctuation, and style clarity..."
                className="w-full text-[#1C1C1C] text-sm sm:text-base leading-relaxed placeholder:text-gray-400 focus:outline-none resize-none bg-transparent"
              />
            )}
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
                    <span>Checking Grammar...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check Grammar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results & Issues Breakdown */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F9F9FB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Grammar Health & Issues
              </span>
              {result && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  result.score >= 90
                    ? 'bg-[#E6F5F2] text-[#027E6F] border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  Score: {result.score}/100
                </span>
              )}
            </div>

            {!result && (
              <div className="py-16 text-center text-gray-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#027E6F] flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No issues checked yet</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click "Check Grammar" to detect spelling typos, grammatical errors, and sentence clarity enhancements.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {result.issues.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white border border-emerald-200 text-center space-y-2 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-[#E6F5F2] text-[#027E6F] flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-[#1C1C1C] text-sm sm:text-base">Flawless! No errors detected.</div>
                    <div className="text-xs text-[#646B81]">Your text follows accurate grammar, spelling, and punctuation standards.</div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">
                        Found {result.issues.length} suggested fix{result.issues.length === 1 ? '' : 'es'}:
                      </span>
                      <button
                        onClick={handleApplyAllFixes}
                        className="text-xs font-bold text-[#027E6F] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Fix All ({result.issues.length})</span>
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {result.issues.map((issue) => {
                        const isGrammarOrSpelling = ['spelling', 'grammar', 'punctuation'].includes(issue.type.toLowerCase());
                        return (
                          <div
                            key={issue.id}
                            className={`p-3.5 rounded-2xl bg-white border transition-all space-y-1.5 shadow-2xs ${
                              isGrammarOrSpelling ? 'border-rose-200 hover:border-rose-400' : 'border-amber-200 hover:border-amber-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase border ${
                                isGrammarOrSpelling
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {issue.type}
                              </span>
                              <button
                                onClick={() => handleApplyFix(issue)}
                                className="px-2.5 py-1 rounded-full bg-[#027E6F] hover:bg-[#006356] text-white text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Apply Fix
                              </button>
                            </div>

                            <div className="text-xs text-gray-800">
                              <span className="line-through text-rose-600 mr-1.5 font-semibold bg-rose-50 px-1 rounded">{issue.original}</span>
                              <ArrowRight className="w-3 h-3 inline text-gray-400 mr-1.5" />
                              <span className="text-[#027E6F] font-bold bg-emerald-50 px-1 rounded border border-emerald-200">{issue.suggestion}</span>
                            </div>

                            <p className="text-[11px] text-[#646B81]">{issue.explanation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#027E6F]" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                <span>{copied ? 'Copied' : 'Copy Corrected Text'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
