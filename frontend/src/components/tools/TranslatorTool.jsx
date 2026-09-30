import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  RotateCcw, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translateDirect } from '../../services/api';

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

export default function TranslatorTool({ user, showToast }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('French (Français)');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      showToast?.('Please enter text to translate.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await translateDirect(inputText, targetLang, sourceLang, user?.email);
      setOutputText(data.translated_text);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      showToast?.(`Translated into ${targetLang}!`, 'success');
    } catch (err) {
      showToast?.(err.message || 'Translation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast?.('Translation copied to clipboard!', 'info');
  };

  const handleTTS = () => {
    if (!outputText) return;
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const u = new SpeechSynthesisUtterance(outputText);
        u.onend = () => setIsPlaying(false);
        u.onerror = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(u);
      }
    }
  };

  const sampleTranslation = "Metaphrase AI gives you the power to transform complex technical prose into crystal-clear communication.";

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Neural Multilingual Translator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Translate Across 14+ Languages
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Accurate, culturally nuanced dialect translations preserving 100% semantic fidelity and formatting.
        </p>
      </div>

      {/* Main 2-Column Card */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden mb-8 grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left: Source Text */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E6E6E9]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-[#F9F9FB] border border-gray-300 text-[#1C1C1C] font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#027E6F] cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              {!inputText && (
                <button
                  onClick={() => setInputText(sampleTranslation)}
                  className="text-xs text-[#027E6F] hover:underline font-semibold cursor-pointer"
                >
                  Try Sample Text
                </button>
              )}
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
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
                  onClick={() => { setInputText(''); setOutputText(''); }}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Clear text"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleTranslate}
                disabled={loading || !inputText.trim()}
                className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-sm font-bold shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 text-white animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Target Translation Output */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-[#F9F9FB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSwap}
                  className="p-1.5 text-gray-500 hover:text-[#027E6F] rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
                  title="Swap languages"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-white border border-gray-300 text-[#027E6F] font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#027E6F] cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {outputText && (
                <span className="text-xs font-bold text-[#027E6F] bg-[#E6F5F2] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Translation Ready
                </span>
              )}
            </div>

            {outputText ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                  <span className="font-bold text-blue-950">Localized Output ({targetLang}):</span>
                  <span className="text-[11px] text-blue-800 font-semibold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    High Native Fluency &bull; 100% Meaning Preserved
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-2xs space-y-2">
                  <div className="text-[#1C1C1C] text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {outputText.split(/(?<=[.?!])\s+/).map((sentence, idx) => (
                      <span
                        key={idx}
                        className="hover:bg-blue-50/80 transition-colors rounded-sm px-1 py-0.5 inline-block"
                      >
                        {sentence}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#027E6F] flex items-center justify-center mx-auto shadow-2xs">
                  <Globe className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Translation workspace</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Select your target language and click "Translate" to produce natural native phrasing.
                </p>
              </div>
            )}
          </div>

          {outputText && (
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={handleTTS}
                className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Listen to translation"
              >
                {isPlaying ? <VolumeX className="w-4 h-4 text-[#027E6F]" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleCopy}
                className="grammarly-green-btn flex items-center gap-1.5 px-5 py-2 text-xs font-bold shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Translation'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
