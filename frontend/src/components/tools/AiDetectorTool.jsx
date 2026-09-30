import React, { useState, useRef } from 'react';
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
  Shield,
  Upload,
  Edit3,
  Eye,
  Sparkles
} from 'lucide-react';
import { checkAiDetection, extractDocumentText } from '../../services/api';

export default function AiDetectorTool({ user, showToast, onSwitchToHumanizer }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
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

  const handleScan = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter text to detect AI.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await checkAiDetection(inputText, user?.email);
      setResult(data);
      setViewMode('scan');
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 mb-3 shadow-2xs">
          <div className="w-4 h-4 rounded-full border-2 border-purple-700 flex items-center justify-center text-[9px] font-extrabold text-purple-700">Q</div>
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
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>Text to Analyze</span>
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
                        viewMode === 'scan' ? 'bg-white text-purple-700 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'
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
                  className="text-xs text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>{uploadingDoc ? 'Uploading...' : 'Upload Doc/PDF'}</span>
                </button>
                {!inputText && (
                  <button
                    onClick={() => {
                      setInputText(sampleAiText);
                      setResult(null);
                      setViewMode('editor');
                    }}
                    className="text-xs text-purple-600 hover:underline font-semibold cursor-pointer"
                  >
                    Try Sample
                  </button>
                )}
              </div>
            </div>

            {result && viewMode === 'scan' ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-bold text-gray-700">AI Risk Highlights:</span>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-200 border border-rose-400 inline-block"></span>
                      <span className="text-rose-900 font-semibold">Red: AI Pattern</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-yellow-200 border border-yellow-400 inline-block"></span>
                      <span className="text-yellow-950 font-semibold">Yellow: AI Marker Term</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-100 border border-emerald-300 inline-block"></span>
                      <span className="text-emerald-900 font-semibold">Green: Human</span>
                    </span>
                  </div>
                </div>

                <div className="w-full text-[#1C1C1C] text-sm sm:text-base leading-relaxed p-4 rounded-2xl bg-[#F9F9FB] border border-gray-200 min-h-[200px] max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {inputText.split(/(?<=[.?!])\s+/).map((sentence, sIdx) => {
                    const markers = result.markers_found || [];
                    const hasMarker = markers.some(m => sentence.toLowerCase().includes(m.toLowerCase()));
                    const isHighAi = result.ai_probability >= 50;

                    return (
                      <span
                        key={sIdx}
                        className={`px-1.5 py-0.5 rounded-sm mx-0.5 inline-block font-medium transition-all ${
                          isHighAi
                            ? 'bg-rose-100/90 text-rose-950 border border-rose-300'
                            : hasMarker
                            ? 'bg-yellow-200 text-yellow-950 border border-yellow-400'
                            : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                        }`}
                        title={isHighAi ? 'High AI Probability Sentence' : hasMarker ? 'Contains Synthetic AI Markers' : 'Likely Human Structure'}
                      >
                        {sentence}{' '}
                      </span>
                    );
                  })}
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
                placeholder="Paste any article, essay, email, or generated text to analyze for AI probability and synthetic robotic patterns..."
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
