import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Copy, 
  Check, 
  Zap, 
  GitCompare, 
  BarChart3, 
  Download,
  BookOpen,
  GraduationCap,
  Briefcase,
  Globe,
  Layers,
  Camera,
  ShieldCheck,
  MousePointerClick,
  Plus,
  Heart
} from 'lucide-react';
import FloatingDock from './FloatingDock';

const STANDARD_TONES = [
  {
    key: 'Simple',
    label: 'Simple & Clear',
    icon: <BookOpen className="w-5 h-5" />,
    colorBg: 'bg-sky-50 text-sky-600 border-sky-200/80',
    desc: 'Plain everyday language with short, clear sentences.'
  },
  {
    key: 'Fluent',
    label: 'Natural & Fluent',
    icon: <Sparkles className="w-5 h-5" />,
    colorBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    desc: 'Engaging, articulate, and polished for general audiences.'
  },
  {
    key: 'Academic',
    label: 'Academic & Formal',
    icon: <GraduationCap className="w-5 h-5" />,
    colorBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
    desc: 'Scholarly syntax with precise domain terminology.'
  },
  {
    key: 'Executive',
    label: 'Executive & Concise',
    icon: <Briefcase className="w-5 h-5" />,
    colorBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    desc: 'Boardroom-ready, actionable, and authoritative prose.'
  }
];

export default function ParaphraseView({
  inputText,
  setInputText,
  outputText,
  setOutputText,
  activeTone,
  setActiveTone,
  activeCustomPersona,
  setActiveCustomPersona,
  userPersonas = [],
  targetLanguage,
  setTargetLanguage,
  languages = [],
  loading,
  aiDetectData,
  onTransform,
  onHumanize,
  onClear,
  onLoadSample,
  onToggleDiff,
  onToggleMetrics,
  onToggleExport,
  onToggleBatch,
  onToggleOcr,
  onToggleOriginality,
  onToggleCustomPersonaModal,
  onSelectSentenceToEdit,
  onCopyOutput,
  isCopied
}) {
  const [interactiveMode, setInteractiveMode] = useState(true);

  const inputWords = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const inputLength = inputText.length;
  const readingTime = inputWords === 0 ? '0s' : `${Math.max(1, Math.round((inputWords / 200) * 60))}s`;

  // Parse output into interactive sentences
  const renderInteractiveSentences = () => {
    if (!outputText) return null;
    const sentences = outputText.match(/[^.!?]+[.!?]+|\S+$/g) || [outputText];

    return (
      <div className="text-slate-900 text-base leading-relaxed font-medium space-y-1">
        {sentences.map((sent, i) => (
          <span
            key={i}
            onClick={() => onSelectSentenceToEdit(sent.trim())}
            className="hover:bg-sky-100/70 hover:text-sky-950 px-1 py-0.5 rounded-lg transition-colors cursor-pointer inline-block"
            title="Click to rewrite this sentence or inspect synonyms"
          >
            {sent}{' '}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-28">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-bold text-sky-700 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Multimodal Gemini 3.5 & Humanizer Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Precision Text Transformation
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
          Interactive sentence-level editing, humanization, OCR scanning, and multilingual translation.
        </p>
      </div>

      {/* Top Utility Bar: Output Language, Batch Doc, and OCR Scan */}
      <div className="glass-panel p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Language Selector */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Output Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {languages.length > 0 ? (
                languages.map((l) => (
                  <option key={l.code} value={l.name}>{l.name}</option>
                ))
              ) : (
                <>
                  <option value="English">English</option>
                  <option value="Spanish (Español)">Spanish</option>
                  <option value="French (Français)">French</option>
                  <option value="German (Deutsch)">German</option>
                  <option value="Hindi (हिन्दी)">Hindi</option>
                  <option value="Telugu (తెలుగు)">Telugu</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Action Buttons: Batch Upload & OCR Scan */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOcr}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Image (OCR)</span>
          </button>

          <button
            onClick={onToggleBatch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batch Upload (.docx / .txt)</span>
          </button>
        </div>
      </div>

      {/* 1. Tone & Persona Selector */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Writing Tone & Persona
          </div>
          <button
            onClick={onToggleCustomPersonaModal}
            className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Custom Personas {userPersonas.length > 0 ? `(${userPersonas.length})` : ''}</span>
          </button>
        </div>

        {/* Active Custom Persona Banner */}
        {activeCustomPersona && (
          <div className="p-3.5 mb-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-900">Active Custom Persona: {activeCustomPersona.title}</span>
                <p className="text-[11px] text-indigo-700 line-clamp-1">{activeCustomPersona.instruction}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveCustomPersona(null)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-lg hover:bg-white/80 transition-all cursor-pointer"
            >
              Reset to Standard Tones
            </button>
          </div>
        )}

        {/* Standard Tone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STANDARD_TONES.map((t) => {
            const isActive = !activeCustomPersona && activeTone === t.key;
            return (
              <div
                key={t.key}
                onClick={() => {
                  setActiveCustomPersona(null);
                  setActiveTone(t.key);
                }}
                className={`glass-panel rounded-2xl p-5 cursor-pointer relative transition-all group flex flex-col justify-between ${
                  isActive
                    ? 'ring-2 ring-sky-500 bg-white shadow-xl shadow-sky-500/10 -translate-y-1'
                    : 'hover:-translate-y-1 hover:bg-white/90 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    ✓
                  </span>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${t.colorBg}`}>
                    {t.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${isActive ? 'text-sky-700' : 'text-slate-900'}`}>
                      {t.label}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Side-by-Side Textareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Editor */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <h2 className="font-extrabold text-base text-slate-800">Source Text</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onLoadSample('tech')}
                className="text-xs font-bold text-slate-500 hover:text-sky-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Sample Text
              </button>
              {inputText && (
                <button
                  onClick={onClear}
                  title="Clear input"
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your content here..."
            className="w-full flex-grow min-h-[300px] lg:min-h-[360px] bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none resize-none text-base leading-relaxed font-medium"
          />

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>{inputWords} words &bull; {inputLength} characters</span>
            <span>Est. {readingTime} read</span>
          </div>
        </div>

        {/* Right: Output Editor */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col shadow-lg relative bg-white/85">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/70 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="font-extrabold text-base text-slate-800">Transformed Output</h2>
              {outputText && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  {targetLanguage !== 'English' ? targetLanguage : 'Ready'}
                </span>
              )}
              {aiDetectData && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                  AI: {aiDetectData.ai_probability}%
                </span>
              )}
            </div>

            {outputText && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={onHumanize}
                  title="Humanize prose to bypass AI markers"
                  className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Humanize</span>
                </button>

                <button
                  onClick={onToggleOriginality}
                  title="Originality score and citations"
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Originality</span>
                </button>

                <button
                  onClick={onToggleDiff}
                  title="Diff view"
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                  Diff
                </button>

                <button
                  onClick={onToggleMetrics}
                  title="View metrics"
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-sky-600 px-2.5 py-1 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-sky-500" />
                  Metrics
                </button>

                <button
                  onClick={onToggleExport}
                  title="Export options"
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-600 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  Export
                </button>
              </div>
            )}
          </div>

          <div className="relative flex-grow flex flex-col">
            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center animate-spin">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-base">Reconstructing Sentences...</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Applying {activeCustomPersona ? activeCustomPersona.title : activeTone} rules &bull; {targetLanguage}
                  </div>
                </div>
              </div>
            ) : outputText ? (
              <div className="w-full flex-grow min-h-[300px] lg:min-h-[360px] p-1 overflow-y-auto">
                {renderInteractiveSentences()}
              </div>
            ) : (
              <div className="w-full flex-grow min-h-[300px] lg:min-h-[360px] flex items-center justify-center text-slate-400 text-sm font-medium">
                Transformed and translated prose will appear here...
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>
              {outputText ? `${outputText.trim().split(/\s+/).length} words` : '0 words'}
              {outputText && <span className="ml-2 text-slate-400">&bull; Click sentences to edit</span>}
            </span>
            {outputText && (
              <button
                onClick={onCopyOutput}
                className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Output'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Action Trigger */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onTransform}
          disabled={loading || !inputText.trim()}
          className="flex items-center gap-3 px-10 py-4 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 text-sky-400" />
          <span>{loading ? 'Transforming...' : 'Transform & Elevate Text'}</span>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* 4. Floating Action Dock */}
      <FloatingDock
        inputLength={inputLength}
        inputWords={inputWords}
        readingTime={readingTime}
        activeTone={activeCustomPersona ? activeCustomPersona.title : activeTone}
        hasOutput={Boolean(outputText)}
        onCopyOutput={onCopyOutput}
        onClear={onClear}
        onLoadSample={onLoadSample}
        onToggleDiff={onToggleDiff}
        onToggleMetrics={onToggleMetrics}
        onToggleExport={onToggleExport}
        isCopied={isCopied}
      />
    </div>
  );
}
