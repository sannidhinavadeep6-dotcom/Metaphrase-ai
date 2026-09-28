import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  Copy, 
  Check, 
  FileDown, 
  BarChart3, 
  GitCompare, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck,
  RotateCcw,
  Zap,
  Globe,
  Sliders,
  ShieldCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TONES = [
  { id: 'Simple', label: 'Simple & Clear', icon: '🍃' },
  { id: 'Fluent', label: 'Natural & Fluent', icon: '✨' },
  { id: 'Academic', label: 'Academic & Formal', icon: '🎓' },
  { id: 'Executive', label: 'Executive & Concise', icon: '💼' }
];

export default function ParaphraseView({
  inputText,
  setInputText,
  outputText,
  setOutputText,
  loading,
  onParaphrase,
  activeTone,
  setActiveTone,
  metrics,
  onOpenDiffModal,
  onOpenMetricsModal,
  onOpenExportModal,
  onOpenBatchModal,
  onOpenCustomPersonaModal,
  onOpenOcrModal,
  onOpenOriginalityModal,
  onOpenSavedSnippets,
  activeCustomPersona,
  languages,
  targetLanguage,
  setTargetLanguage,
  intensity,
  setIntensity,
  user,
  onSaveSnippet,
  isSnippetSaved,
  onSentenceClick
}) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const fileInputRef = useRef(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const outputWordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;

  // Handle Copy with Confetti
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-speech
  const handleToggleTTS = () => {
    if (!outputText) return;
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(outputText);
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Sample texts
  const sampleTexts = [
    "The artificial intelligence system optimizes computational throughput across distributed neural networks while minimizing end-to-end request latency.",
    "We must strategically leverage our cross-functional team synergies to maximize quarterly profitability and stakeholder satisfaction.",
    "Academic research demonstrates that sustainable energy adoption substantially mitigates global carbon emissions over multi-decade time horizons."
  ];

  const handleTrySample = () => {
    const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setInputText(randomSample);
  };

  // Handle direct file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target?.result || '');
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
      // Direct to OCR
      onOpenOcrModal();
    } else {
      // Open batch processing modal for docx/pdf
      onOpenBatchModal();
    }
  };

  return (
    <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C1C1C] tracking-tight mb-3">
          Free Paraphrasing Tool
        </h1>
        <p className="text-lg sm:text-xl text-[#646B81] font-normal">
          Quickly reword sentences for essays, emails, articles, and more.
        </p>
      </div>

      {/* Tone & Language Quick Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1 px-1">Tone:</span>
          {TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setActiveTone(tone.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTone === tone.id && !activeCustomPersona
                  ? 'bg-[#027E6F] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              <span>{tone.icon}</span>
              <span>{tone.label}</span>
            </button>
          ))}

          {/* Custom Persona Button */}
          <button
            onClick={onOpenCustomPersonaModal}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeCustomPersona 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{activeCustomPersona ? activeCustomPersona.title : 'Custom Voice'}</span>
          </button>
        </div>

        {/* Right side: Language Selector & Batch Upload */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-hidden cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Italian">Italian (Italiano)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Chinese">Chinese (Simplified)</option>
            </select>
          </div>

          <button
            onClick={onOpenBatchModal}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#027E6F] bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
            title="Batch Document Processing (.docx / .txt)"
          >
            <FileText className="w-3.5 h-3.5 text-[#027E6F]" />
            <span>Doc Upload</span>
          </button>
        </div>
      </div>

      {/* Main 2-Panel Card Container */}
      <div className="grammarly-card grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E6E9] min-h-[420px] bg-white overflow-hidden shadow-lg border border-gray-200">
        
        {/* LEFT PANEL: Input Area */}
        <div className="flex flex-col h-full p-5 sm:p-6 justify-between bg-white">
          <div className="flex-1 flex flex-col">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type, paste, or upload your text."
              rows={12}
              className="w-full flex-1 resize-none bg-transparent border-none text-[#1C1C1C] placeholder-[#8A8F9E] text-[16px] leading-relaxed focus:outline-hidden font-normal"
            />
          </div>

          {/* Left Panel Bottom Toolbar */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 mt-auto">
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Primary Green Paraphrase Button */}
              <button
                onClick={onParaphrase}
                disabled={loading || !inputText.trim()}
                className={`grammarly-green-btn px-6 py-2.5 text-[15px] font-bold flex items-center gap-2 shadow-sm cursor-pointer ${
                  loading || !inputText.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Paraphrasing...</span>
                  </>
                ) : (
                  <span>Paraphrase</span>
                )}
              </button>

              {/* Upload File Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="grammarly-secondary-btn px-4 py-2 text-[14px] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Upload file</span>
                <Upload className="w-4 h-4 text-gray-500" />
              </button>
              <input 
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx,.doc,.pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Try sample text link */}
              <button
                onClick={handleTrySample}
                className="text-[14px] text-gray-500 hover:text-[#027E6F] font-medium hover:underline px-2 py-1 cursor-pointer"
              >
                Try sample text
              </button>
            </div>

            {/* Word & Character Counter */}
            <div className="text-xs text-gray-400 font-medium">
              {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} chars
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Output Area */}
        <div className="flex flex-col h-full p-5 sm:p-6 justify-between bg-white relative">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎭</span>
              <span className="font-semibold text-[15px] text-[#3E4049]">Paraphrased Text</span>
              {activeTone && (
                <span className="bg-emerald-50 text-[#027E6F] text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  {activeTone}
                </span>
              )}
            </div>

            {/* Output word count badge if populated */}
            {outputText && (
              <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                {outputWordCount} words
              </div>
            )}
          </div>

          {/* Content Body: Empty State vs Result */}
          <div className="flex-1 flex flex-col justify-center my-4 overflow-y-auto max-h-[360px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-[#027E6F] animate-spin mb-4" />
                <p className="text-sm font-semibold text-gray-700">Transforming your sentences with neural precision...</p>
                <p className="text-xs text-gray-400 mt-1">Preserving 100% semantic fidelity</p>
              </div>
            ) : outputText ? (
              <div className="text-[#1C1C1C] text-[16px] leading-relaxed select-text space-y-2 animate-fadeIn">
                {/* Sentence click highlighting for alternative suggestions */}
                {outputText.split(/(?<=[.?!])\s+/).map((sentence, idx) => (
                  <span
                    key={idx}
                    onClick={() => onSentenceClick && onSentenceClick(sentence)}
                    className="hover:bg-emerald-50 hover:text-emerald-950 transition-colors rounded px-1 py-0.5 cursor-pointer inline-block"
                    title="Click sentence to explore alternative rewrites & synonyms"
                  >
                    {sentence}{' '}
                  </span>
                ))}
              </div>
            ) : (
              /* Grammarly Exact SVG Illustration: Notebook + Pencil */
              <div className="flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="w-20 h-20 mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 80 80">
                    <g stroke="#3E4049" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Notebook Papers */}
                      <path fill="#F3F4F6" d="M74 14H28C26 34 8 48 12 74h46c6-26 14-40 16-60z"/>
                      <path fill="#FFFFFF" d="M70 10H24C22 30 5 44 9 70h46c5-26 12-40 15-60z"/>
                      <path fill="#FFFFFF" stroke="#027E6F" strokeWidth="2" d="M66 6H20C18 26 2 40 6 66h46c4-26 10-40 14-60z"/>
                      {/* Paper lines */}
                      <path d="M28 18h28M24 28h28M18 38h28M14 48h22" stroke="#D1D5DB" strokeWidth="1.5"/>
                      {/* Colorful Pencil */}
                      <path fill="#EAB308" d="M4 14a5 5 0 0 1 2-7 5 5 0 0 1 7 2l20 34-9 5z"/>
                      <path fill="#06B6D4" d="M4 14a5 5 0 0 1 2-7 5 5 0 0 1 7 2l4 7-9 5z"/>
                      <path fill="#EF4444" d="M4 14a5 5 0 0 1 2-7 5 5 0 0 1 7 2l1 2-9 5z"/>
                      <path fill="#1C1C1C" d="m24 47 9-5-.1 10z"/>
                    </g>
                  </svg>
                </div>
                <p className="text-[14px] text-[#646B81] font-normal">
                  Add your text and click Paraphrase to see results here
                </p>
              </div>
            )}
          </div>

          {/* Right Panel Bottom Action Toolbar (When output is available) */}
          {outputText && (
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 animate-fadeIn mt-auto">
              <div className="flex items-center gap-1.5">
                {/* 1-Click Copy Button */}
                <button
                  onClick={handleCopy}
                  className="grammarly-secondary-btn px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:border-emerald-600"
                  title="Copy paraphrased text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                {/* Diff Inspector Modal Trigger */}
                <button
                  onClick={onOpenDiffModal}
                  className="p-1.5 text-gray-500 hover:text-[#027E6F] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Inspect word-by-word diff"
                >
                  <GitCompare className="w-4 h-4" />
                </button>

                {/* Readability Metrics Trigger */}
                <button
                  onClick={onOpenMetricsModal}
                  className="p-1.5 text-gray-500 hover:text-[#027E6F] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="View readability metrics (Flesch ease, grade level)"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>

                {/* Audio TTS Trigger */}
                <button
                  onClick={handleToggleTTS}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isPlayingAudio ? 'text-emerald-700 bg-emerald-100' : 'text-gray-500 hover:text-[#027E6F] hover:bg-emerald-50'
                  }`}
                  title="Listen to paraphrased text"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Save Snippet / Bookmark */}
                <button
                  onClick={onSaveSnippet}
                  className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  title="Save to bookmarks"
                >
                  {isSnippetSaved ? <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-600" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Export / Download Menu */}
                <button
                  onClick={onOpenExportModal}
                  className="grammarly-secondary-btn px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#027E6F] border-emerald-300 hover:bg-emerald-50"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download .docx</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
