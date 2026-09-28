import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { checkGrammar } from '../../services/api';

export default function GrammarCheckerTool({ user, showToast }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleCheck = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter text to check grammar.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await checkGrammar(inputText, user?.email);
      setResult(data);
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
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#027E6F]" />
                <span>Input Text</span>
              </span>
              {!inputText && (
                <button
                  onClick={() => setInputText(sampleGrammarText)}
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
              placeholder="Paste or type your text here to check grammar, spelling, punctuation, and style clarity..."
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
                      {result.issues.map((issue) => (
                        <div
                          key={issue.id}
                          className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 transition-all space-y-1.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#027E6F] bg-[#E6F5F2] px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase">
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
                            <span className="line-through text-rose-500 mr-1.5 font-semibold">{issue.original}</span>
                            <ArrowRight className="w-3 h-3 inline text-gray-400 mr-1.5" />
                            <span className="text-[#027E6F] font-bold">{issue.suggestion}</span>
                          </div>

                          <p className="text-[11px] text-[#646B81]">{issue.explanation}</p>
                        </div>
                      ))}
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
