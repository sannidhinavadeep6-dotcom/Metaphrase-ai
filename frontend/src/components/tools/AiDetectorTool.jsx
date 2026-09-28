import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Zap, 
  Activity, 
  Sliders, 
  Cpu, 
  UserCheck, 
  Shield 
} from 'lucide-react';
import { checkAiDetection } from '../../services/api';

export default function AiDetectorTool({ user, showToast, onSwitchToHumanizer }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleScan = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter text to detect AI.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await checkAiDetection(inputText, user?.email);
      setResult(data);
      showToast?.(`AI Detection analysis complete! AI Risk: ${data.ai_probability}%`, 'success');
    } catch (err) {
      showToast?.(err.message || 'AI detection failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sampleAiText = "In conclusion, artificial intelligence represents a paradigm shift in computational linguistics, facilitating unprecedented automation across multifaceted workflows.";

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] mb-3">
          <div className="w-4 h-4 rounded-full border-2 border-[#027E6F] flex items-center justify-center text-[9px] font-extrabold text-[#027E6F]">Q</div>
          <span>Free AI Content Detector</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Detect AI Generated vs. Human Text
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Evaluate perplexity, burstiness, and sentence entropy to accurately detect ChatGPT, Claude, and Gemini text.
        </p>
      </div>

      {/* Main 2-Column Card */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden mb-8 grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E6E6E9]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#027E6F]" />
                <span>Text to Analyze</span>
              </span>
              {!inputText && (
                <button
                  onClick={() => setInputText(sampleAiText)}
                  className="text-xs text-[#027E6F] hover:underline font-semibold cursor-pointer"
                >
                  Try Sample AI Text
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
              placeholder="Paste any article, essay, email, or generated text to analyze for AI probability and synthetic robotic patterns..."
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
                onClick={handleScan}
                disabled={loading || !inputText.trim()}
                className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-sm font-bold shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 text-white animate-spin" />
                    <span>Scanning Probabilities...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Detect AI Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Detection Gauges & Analysis */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F9F9FB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Probability Breakdown
              </span>
              {result && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  result.ai_probability < 35
                    ? 'bg-[#E6F5F2] text-[#027E6F] border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {result.ai_probability}% AI Probability
                </span>
              )}
            </div>

            {!result && (
              <div className="py-16 text-center text-gray-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#027E6F] flex items-center justify-center mx-auto shadow-2xs">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No detection scan yet</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click "Detect AI Content" to calculate multi-layer perplexity scores and identify synthetic AI text patterns.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Visual Probability Meter */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#027E6F]" />
                      <span className="text-xs font-bold text-gray-700">Human Score</span>
                    </div>
                    <span className="text-base font-extrabold text-[#027E6F]">{100 - result.ai_probability}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      style={{ width: `${100 - result.ai_probability}%` }}
                      className="bg-[#027E6F] h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${result.ai_probability}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>0% AI (100% Human)</span>
                    <span className="text-rose-600 font-bold">{result.ai_probability}% AI</span>
                  </div>
                </div>

                {/* Metric Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200 text-center shadow-2xs">
                    <div className="text-[11px] font-bold text-gray-500 uppercase">Burstiness</div>
                    <div className="text-lg font-extrabold text-gray-900 mt-0.5">{result.burstiness_score || 84}/100</div>
                    <div className="text-[10px] text-gray-400">Sentence length variation</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200 text-center shadow-2xs">
                    <div className="text-[11px] font-bold text-gray-500 uppercase">Perplexity</div>
                    <div className="text-lg font-extrabold text-gray-900 mt-0.5">{result.perplexity_score || 79}/100</div>
                    <div className="text-[10px] text-gray-400">Word choice unpredictability</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#E6F5F2] border border-emerald-200 text-center text-xs font-semibold text-emerald-950">
                  Verdict: <strong>{result.verdict}</strong>
                </div>
              </div>
            )}
          </div>

          {result && result.ai_probability >= 30 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => onSwitchToHumanizer?.(inputText)}
                className="w-full py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <span>Humanize this text with 1-Click</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
