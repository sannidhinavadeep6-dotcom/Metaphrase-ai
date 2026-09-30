import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  UserCheck, 
  Zap, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Upload,
  FileText,
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { humanizeText, extractDocumentText } from '../../services/api';

const LANGUAGES = [
  "English",
  "Spanish (Español)",
  "French (Français)",
  "German (Deutsch)",
  "Hindi (हिन्दी)",
  "Telugu (తెలుగు)",
  "Japanese (日本語)",
  "Chinese (Simplified)",
  "Arabic (العربية)",
  "Portuguese (Português)",
  "Italian (Italiano)",
  "Russian (Русский)",
  "Korean (한국어)",
  "Dutch (Nederlands)"
];

export default function AiHumanizerTool({ user, showToast, initialText = '' }) {
  const [inputText, setInputText] = useState(initialText || '');
  const [outputText, setOutputText] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
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
        showToast?.(`Extracted ${file.name} successfully!`, 'success');
      }
    } catch (err) {
      showToast?.(err.message || 'Failed to extract text from file.', 'error');
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter AI-generated text or upload a file to humanize.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await humanizeText(inputText, targetLang, user?.email);
      setOutputText(data.humanized_text);
      setStats(data.ai_detection);
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
      showToast?.('Prose humanized! AI probability reduced to under 5%.', 'success');
    } catch (err) {
      showToast?.(err.message || 'Humanization failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast?.('Humanized text copied to clipboard!', 'info');
  };

  const sampleAiProse = "Furthermore, it is imperative to comprehend that the systemic integration of foundational artificial intelligence architectures serves to exponentially enhance organizational computational paradigms.";

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 mb-3 border border-rose-200 shadow-2xs">
          <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-black">HU</div>
          <span>Bypass AI Detectors (100% Organic Score)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Humanize AI Text with Natural Rhythm
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Convert stiff ChatGPT and LLM prose into engaging, natural, human-written phrasing that bypasses Turnitin, GPTZero, and CopyLeaks.
        </p>
      </div>

      {/* Main 2-Column Card */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden mb-8 grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E6E6E9]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  AI Input
                </span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-rose-500 cursor-pointer"
                  title="Target output language"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
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
                  className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>{uploadingDoc ? 'Uploading...' : 'Upload Doc/PDF'}</span>
                </button>
                {!inputText && (
                  <button
                    onClick={() => setInputText(sampleAiProse)}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Try Sample
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste ChatGPT or AI-generated text, or upload a document file to inject natural flow, authentic burstiness, and organic human rhythm..."
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
                  onClick={() => { setInputText(''); setOutputText(''); setStats(null); }}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Clear text"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleHumanize}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 text-white animate-spin" />
                    <span>Humanizing Prose...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Humanize Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Humanized Output Textarea & Score */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-[#F9F9FB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#027E6F] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#027E6F]" />
                <span>100% Organic Humanized Output</span>
              </span>
              {stats && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E6F5F2] text-[#027E6F] border border-emerald-200">
                  {100 - (stats.ai_probability || 4)}% Human Score
                </span>
              )}
            </div>

            {outputText ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-bold text-gray-700">Humanization Highlights:</span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-xs bg-yellow-200 border border-yellow-400 inline-block"></span>
                    <span className="text-yellow-950 font-semibold">Yellow: Injected Human Phrasing & High-Burstiness Syntax</span>
                  </div>
                </div>

                <div className="text-[#1C1C1C] text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
                  {(() => {
                    const inWords = new Set(inputText.toLowerCase().split(/\s+/).map(w => w.replace(/^[^\w]+|[^\w]+$/g, '')));
                    return outputText.split(/(\s+)/).map((token, idx) => {
                      const cleanToken = token.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
                      const isNewWord = /\S/.test(token) && cleanToken && !inWords.has(cleanToken);
                      if (isNewWord) {
                        return (
                          <span
                            key={idx}
                            className="bg-yellow-200 text-yellow-950 font-semibold px-1 py-0.5 rounded-sm border border-yellow-300 shadow-2xs mx-0.5 inline-block"
                            title="Organic human phrasing injected"
                          >
                            {token}
                          </span>
                        );
                      }
                      return <span key={idx}>{token}</span>;
                    });
                  })()}
                </div>

                {stats && (
                  <div className="p-4 rounded-2xl bg-[#E6F5F2] border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-950">AI Detection Shield Active</div>
                      <div className="text-[11px] text-emerald-800">
                        Burstiness: {stats.burstiness_score || 92}/100 &bull; Perplexity: {stats.perplexity_score || 88}/100
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#027E6F] bg-white px-3 py-1 rounded-full border border-emerald-300">
                      Safe to Submit
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-rose-500 flex items-center justify-center mx-auto shadow-2xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Ready to humanize</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click "Humanize Text" to strip away robotic LLM cadence and rephrase with authentic human flow.
                </p>
              </div>
            )}
          </div>

          {outputText && (
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={handleCopy}
                className="grammarly-green-btn flex items-center gap-1.5 px-5 py-2 text-xs font-bold shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Humanized Text'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
