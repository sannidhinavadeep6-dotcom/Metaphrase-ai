import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ParaphraseView from './components/ParaphraseView';
import HistoryView from './components/HistoryView';
import AdminView from './components/AdminView';
import AboutView from './components/AboutView';
import FloatingDiffModal from './components/FloatingDiffModal';
import FloatingMetricsModal from './components/FloatingMetricsModal';
import FloatingExportModal from './components/FloatingExportModal';
import BatchProcessingModal from './components/BatchProcessingModal';
import CustomPersonaModal from './components/CustomPersonaModal';
import InteractiveSentenceModal from './components/InteractiveSentenceModal';
import OcrModal from './components/OcrModal';
import OriginalityModal from './components/OriginalityModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { 
  transformText, 
  humanizeText,
  detectAiContent,
  checkOriginality,
  fetchLanguages, 
  fetchCustomPersonas 
} from './services/api';

const SAMPLES = {
  tech: "The microservices architecture employs asynchronous event-driven message queuing to decouple monolithic dependencies and minimize end-to-end request latency across distributed nodes.",
  biz: "We must optimize our cross-functional operational synergies and leverage agile methodologies to ensure maximum quarterly profitability, market penetration, and shareholder satisfaction.",
  acad: "Quantum computing harnesses the physical phenomena of superposition and quantum entanglement to execute computational algorithms far exceeding classical Von Neumann architectures."
};

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState('paraphrase');

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('metaphrase_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Multilingual & Persona State
  const [languages, setLanguages] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [userPersonas, setUserPersonas] = useState([]);
  const [activeCustomPersona, setActiveCustomPersona] = useState(null);

  // Paraphrasing State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTone, setActiveTone] = useState('Simple');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [aiDetectData, setAiDetectData] = useState(null);
  const [originalityData, setOriginalityData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sentence Editor State
  const [selectedSentence, setSelectedSentence] = useState(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('login');
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showCustomPersonaModal, setShowCustomPersonaModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showOriginalityModal, setShowOriginalityModal] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchLanguages()
      .then((data) => setLanguages(data.languages || []))
      .catch(() => {});
  }, []);

  const loadPersonas = () => {
    if (user?.email) {
      fetchCustomPersonas(user.email)
        .then((data) => setUserPersonas(data.personas || []))
        .catch(() => {});
    } else {
      setUserPersonas([]);
    }
  };

  useEffect(() => {
    loadPersonas();
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('metaphrase_user', JSON.stringify(userData));
    if (userData.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('metaphrase_user');
    setActiveCustomPersona(null);
    setActiveTab('paraphrase');
    showToast('Logged out successfully.', 'info');
  };

  const handleOpenAuthModal = (initialTab = 'login') => {
    setAuthModalInitialTab(initialTab);
    setShowAuthModal(true);
  };

  const handleTransform = async () => {
    if (!inputText.trim()) {
      showToast('Please enter text to transform.', 'error');
      return;
    }

    setLoading(true);
    try {
      const customPrompt = activeCustomPersona ? activeCustomPersona.instruction : null;
      const data = await transformText(
        inputText, 
        activeTone, 
        customPrompt, 
        targetLanguage, 
        user?.email
      );
      setOutputText(data.paraphrased_text);
      setMetrics(data.metrics);
      setAiDetectData(data.ai_detection);
      setOriginalityData(data.originality);
      showToast('Transformation complete!', 'success');
    } catch (err) {
      showToast(err.message || 'Transformation service error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHumanize = async () => {
    if (!outputText.trim()) {
      showToast('No text available to humanize.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await humanizeText(outputText, targetLanguage, user?.email);
      setOutputText(data.humanized_text);
      setAiDetectData(data.ai_detection);
      setMetrics(data.metrics);
      showToast('Prose humanized! AI detection risk reduced.', 'success');
    } catch (err) {
      showToast(err.message || 'Humanization failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceSentence = (oldSentence, newSentence) => {
    if (!outputText) return;
    const updated = outputText.replace(oldSentence, newSentence);
    setOutputText(updated);
    showToast('Sentence updated in place.', 'success');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setMetrics(null);
    setAiDetectData(null);
    setOriginalityData(null);
  };

  const handleLoadSample = (key) => {
    if (SAMPLES[key]) {
      setInputText(SAMPLES[key]);
      showToast(`Loaded ${key.toUpperCase()} sample text.`, 'info');
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    showToast('Copied transformed text to clipboard.', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRestoreFromHistory = (orig, para, tone) => {
    setInputText(orig);
    setOutputText(para);
    if (tone) setActiveTone(tone.split(' ')[0]);
    setActiveTab('paraphrase');
    showToast('Restored record into workspace.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating Glass Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6">
        {activeTab === 'paraphrase' && (
          <ParaphraseView
            inputText={inputText}
            setInputText={setInputText}
            outputText={outputText}
            setOutputText={setOutputText}
            activeTone={activeTone}
            setActiveTone={setActiveTone}
            activeCustomPersona={activeCustomPersona}
            setActiveCustomPersona={setActiveCustomPersona}
            userPersonas={userPersonas}
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            languages={languages}
            loading={loading}
            aiDetectData={aiDetectData}
            onTransform={handleTransform}
            onHumanize={handleHumanize}
            onClear={handleClear}
            onLoadSample={handleLoadSample}
            onToggleDiff={() => setShowDiffModal(true)}
            onToggleMetrics={() => setShowMetricsModal(true)}
            onToggleExport={() => setShowExportModal(true)}
            onToggleBatch={() => setShowBatchModal(true)}
            onToggleOcr={() => setShowOcrModal(true)}
            onToggleOriginality={() => setShowOriginalityModal(true)}
            onToggleCustomPersonaModal={() => setShowCustomPersonaModal(true)}
            onSelectSentenceToEdit={(sent) => setSelectedSentence(sent)}
            onCopyOutput={handleCopyOutput}
            isCopied={isCopied}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            user={user}
            onRestoreToEditor={handleRestoreFromHistory}
            onNotify={showToast}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView onNotify={showToast} />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Floating Modals */}
      {showAuthModal && (
        <AuthModal
          initialTab={authModalInitialTab}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onNotify={showToast}
        />
      )}

      {showDiffModal && (
        <FloatingDiffModal
          originalText={inputText}
          paraphrasedText={outputText}
          onClose={() => setShowDiffModal(false)}
        />
      )}

      {showMetricsModal && (
        <FloatingMetricsModal
          metrics={metrics}
          onClose={() => setShowMetricsModal(false)}
        />
      )}

      {showExportModal && (
        <FloatingExportModal
          user={user}
          originalText={inputText}
          paraphrasedText={outputText}
          tone={activeCustomPersona ? activeCustomPersona.title : activeTone}
          onClose={() => setShowExportModal(false)}
          onNotify={showToast}
        />
      )}

      {showBatchModal && (
        <BatchProcessingModal
          onClose={() => setShowBatchModal(false)}
          user={user}
          languages={languages}
          onNotify={showToast}
        />
      )}

      {showCustomPersonaModal && (
        <CustomPersonaModal
          user={user}
          personas={userPersonas}
          onRefreshPersonas={loadPersonas}
          onSelectPersona={(persona) => {
            setActiveCustomPersona(persona);
            showToast(`Selected persona "${persona.title}"`, 'info');
          }}
          onClose={() => setShowCustomPersonaModal(false)}
          onNotify={showToast}
        />
      )}

      {selectedSentence && (
        <InteractiveSentenceModal
          user={user}
          sentence={selectedSentence}
          fullContext={outputText}
          tone={activeTone}
          onReplaceSentence={handleReplaceSentence}
          onClose={() => setSelectedSentence(null)}
          onNotify={showToast}
        />
      )}

      {showOcrModal && (
        <OcrModal
          user={user}
          onInsertText={(txt) => setInputText(txt)}
          onClose={() => setShowOcrModal(false)}
          onNotify={showToast}
        />
      )}

      {showOriginalityModal && (
        <OriginalityModal
          user={user}
          originalText={inputText}
          paraphrasedText={outputText}
          originalityData={originalityData}
          aiDetectData={aiDetectData}
          onClose={() => setShowOriginalityModal(false)}
          onNotify={showToast}
        />
      )}
    </div>
  );
}
