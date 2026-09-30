import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ToolsNav from './components/ToolsNav';
import ParaphraseView from './components/ParaphraseView';
import JoinBanner from './components/JoinBanner';
import WhyUseSection from './components/WhyUseSection';
import GoBeyondSection from './components/GoBeyondSection';
import TestimonialsSection from './components/TestimonialsSection';
import LearnToParaphraseSection from './components/LearnToParaphraseSection';
import MoreToolsSection from './components/MoreToolsSection';
import WritingSupportSection from './components/WritingSupportSection';
import FaqSection from './components/FaqSection';
import DarkCtaSection from './components/DarkCtaSection';
import Footer from './components/Footer';

// Aux Modals & Views
import PricingView from './components/PricingView';
import SolutionsModal from './components/SolutionsModal';
import ResourceGuideModal from './components/ResourceGuideModal';
import IntegrationsModal from './components/IntegrationsModal';
import SupportModal from './components/SupportModal';
import HistoryView from './components/HistoryView';
import AdminView from './components/AdminView';
import AboutView from './components/AboutView';
import GrammarCheckerTool from './components/tools/GrammarCheckerTool';
import PlagiarismCheckerTool from './components/tools/PlagiarismCheckerTool';
import AiDetectorTool from './components/tools/AiDetectorTool';
import AiHumanizerTool from './components/tools/AiHumanizerTool';
import AiChatTool from './components/tools/AiChatTool';
import TranslatorTool from './components/tools/TranslatorTool';
import FloatingDiffModal from './components/FloatingDiffModal';
import FloatingMetricsModal from './components/FloatingMetricsModal';
import FloatingExportModal from './components/FloatingExportModal';
import BatchProcessingModal from './components/BatchProcessingModal';
import CustomPersonaModal from './components/CustomPersonaModal';
import InteractiveSentenceModal from './components/InteractiveSentenceModal';
import OcrModal from './components/OcrModal';
import OriginalityModal from './components/OriginalityModal';
import SavedSnippetsModal from './components/SavedSnippetsModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { sfx } from './utils/audioUtils';
import { 
  transformText, 
  humanizeText, 
  fetchLanguages, 
  fetchCustomPersonas,
  googleLogin
} from './services/api';

export default function App() {
  // Navigation: 'paraphrase' | 'grammar' | 'plagiarism' | 'detector' | 'humanizer' | 'translator' | 'aichat' | 'pricing' | 'history' | 'admin' | 'about'
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

  // Saved Snippets / Bookmarks State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('metaphrase_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // Multilingual & Persona State
  const [languages, setLanguages] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [userPersonas, setUserPersonas] = useState([]);
  const [activeCustomPersona, setActiveCustomPersona] = useState(null);
  const [intensity, setIntensity] = useState(2);

  // Paraphrasing State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTone, setActiveTone] = useState('Simple');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [aiDetectData, setAiDetectData] = useState(null);
  const [originalityData, setOriginalityData] = useState(null);

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
  
  // Solutions, Guide, Integrations & Support Modals
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);
  const [solutionsModalKey, setSolutionsModalKey] = useState('enterprise');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideModalKey, setGuideModalKey] = useState('paraphrase');
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [integrationsModalKey, setIntegrationsModalKey] = useState('desktop');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalTab, setSupportModalTab] = useState('help');

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Global Escape key handler to close all modals and return to Metaphrase interface
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        setShowAuthModal(false);
        setShowFavoritesModal(false);
        setShowDiffModal(false);
        setShowMetricsModal(false);
        setShowExportModal(false);
        setShowBatchModal(false);
        setShowCustomPersonaModal(false);
        setShowOcrModal(false);
        setShowOriginalityModal(false);
        setShowSolutionsModal(false);
        setShowGuideModal(false);
        setShowIntegrationsModal(false);
        setShowSupportModal(false);
        setSelectedSentence(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sync Favorites to LocalStorage
  useEffect(() => {
    localStorage.setItem('metaphrase_favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  // URL Hash Listener & Deep Linking (#pricing, #grammar, #solutions, #faq, etc.)
  useEffect(() => {
    const handleHashNavigation = () => {
      const rawHash = window.location.hash;
      if (!rawHash) return;

      // Handle Google OAuth Redirect Access Token (#access_token=ya29...)
      if (rawHash.includes('access_token=')) {
        try {
          const hashParams = new URLSearchParams(rawHash.substring(1));
          const accessToken = hashParams.get('access_token');
          if (accessToken) {
            // Remove token from browser URL address bar
            window.history.replaceState(null, '', window.location.pathname);
            showToast('Signing in with your Google account...', 'info');

            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
              .then((res) => res.json())
              .then(async (profile) => {
                if (profile && profile.email) {
                  const data = await googleLogin({
                    email: profile.email,
                    name: profile.name,
                    picture: profile.picture
                  });
                  if (data.success && data.user) {
                    handleLoginSuccess(data.user);
                    showToast(`Welcome, ${data.user.name || profile.name}! Signed in via Google.`, 'success');
                  }
                }
              })
              .catch((err) => {
                console.error('Google OAuth userinfo error:', err);
                showToast('Failed to complete Google Sign-in.', 'error');
              });
            return;
          }
        } catch (e) {
          console.error('Error parsing OAuth token hash:', e);
        }
      }

      const hash = rawHash.toLowerCase();

      if (hash === '#pricing') {
        setActiveTab('pricing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['#grammar', '#plagiarism', '#detector', '#humanizer', '#translator', '#aichat', '#about', '#history', '#admin'].includes(hash)) {
        const tab = hash.replace('#', '');
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['#enterprise', '#teams', '#professionals', '#marketing', '#support', '#engineering', '#students', '#institutions', '#work', '#education'].includes(hash)) {
        let key = hash.replace('#', '');
        if (key === 'work') key = 'enterprise';
        if (key === 'education') key = 'students';
        setSolutionsModalKey(key);
        setShowSolutionsModal(true);
      } else if (['#citations', '#plagiarism-guide', '#security', '#paraphrase-guide', '#resources'].includes(hash)) {
        let key = 'paraphrase';
        if (hash.includes('citation')) key = 'citations';
        if (hash.includes('plagiarism')) key = 'plagiarism';
        if (hash.includes('security')) key = 'security';
        setGuideModalKey(key);
        setShowGuideModal(true);
      } else if (hash === '#faq') {
        setActiveTab('paraphrase');
        setTimeout(() => {
          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  useEffect(() => {
    loadPersonas();
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('metaphrase_user', JSON.stringify(userData));
    sfx.playSuccess();
    if (userData.role === 'admin') {
      setActiveTab('admin');
    }
    showToast(`Welcome back, ${userData.name || 'User'}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('metaphrase_user');
    setActiveCustomPersona(null);
    setActiveTab('paraphrase');
    sfx.playWhoosh();
    showToast('Logged out successfully.', 'info');
  };

  const handleOpenAuthModal = (initialTab = 'login') => {
    sfx.playPop();
    setAuthModalInitialTab(initialTab);
    setShowAuthModal(true);
  };

  const handleOpenSolutions = (key = 'enterprise') => {
    setSolutionsModalKey(key);
    setShowSolutionsModal(true);
  };

  const handleOpenGuide = (key = 'paraphrase') => {
    setGuideModalKey(key);
    setShowGuideModal(true);
  };

  const handleOpenIntegrations = (key = 'desktop') => {
    setIntegrationsModalKey(key);
    setShowIntegrationsModal(true);
  };

  const handleOpenSupport = (tab = 'help') => {
    setSupportModalTab(tab);
    setShowSupportModal(true);
  };

  // Paraphrase Execution
  const handleTransform = async () => {
    if (!inputText.trim()) {
      showToast('Please enter text to transform.', 'error');
      return;
    }

    setLoading(true);
    sfx.playWhoosh();

    try {
      let combinedInstruction = '';
      if (activeCustomPersona) {
        combinedInstruction += `Persona Rule: ${activeCustomPersona.instruction}\n`;
      }
      if (intensity === 1) {
        combinedInstruction += `Intensity: Conservative. Keep 85%+ original phrasing.\n`;
      } else if (intensity === 3) {
        combinedInstruction += `Intensity: Creative. Elevate prose with dynamic phrasing.\n`;
      } else if (intensity === 4) {
        combinedInstruction += `Intensity: Radical. Completely reframe and restructure sentences.\n`;
      }

      const customPrompt = combinedInstruction.trim() || null;

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
      sfx.playSuccess();
      showToast('Paraphrased successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Paraphrase service error.', 'error');
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
    sfx.playWhoosh();

    try {
      const data = await humanizeText(outputText, targetLanguage, user?.email);
      setOutputText(data.humanized_text);
      setAiDetectData(data.ai_detection);
      setMetrics(data.metrics);
      sfx.playSuccess();
      showToast('Prose humanized! AI probability reduced.', 'success');
    } catch (err) {
      showToast(err.message || 'Humanization failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSentenceClick = (sentence) => {
    setSelectedSentence(sentence);
  };

  const handleReplaceSentence = (oldSentence, newSentence) => {
    if (!outputText) return;
    const updated = outputText.replace(oldSentence, newSentence);
    setOutputText(updated);
    sfx.playSuccess();
    showToast('Sentence updated in place.', 'success');
  };

  const handleRestoreFromHistory = (orig, para, tone) => {
    setInputText(orig);
    setOutputText(para);
    if (tone) setActiveTone(tone.split(' ')[0]);
    setActiveTab('paraphrase');
    sfx.playWhoosh();
    showToast('Restored transformation into workspace.', 'success');
  };

  // Bookmark / Favorites
  const isCurrentOutputFavorite = favorites.some((f) => f.outputText === outputText && outputText !== '');

  const toggleFavorite = () => {
    if (!outputText) {
      showToast('No output text to bookmark.', 'error');
      return;
    }

    if (isCurrentOutputFavorite) {
      setFavorites((prev) => prev.filter((f) => f.outputText !== outputText));
      sfx.playPop();
      showToast('Removed from saved bookmarks.', 'info');
    } else {
      const newFav = {
        id: Date.now().toString(),
        inputText,
        outputText,
        tone: activeTone,
        date: new Date().toLocaleDateString()
      };
      setFavorites((prev) => [newFav, ...prev]);
      sfx.playSuccess();
      showToast('Saved to your bookmarks!', 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1C1C1C] selection:bg-[#027E6F] selection:text-white">
      
      {/* 1. Global Navigation Header (All Dropdowns Working) */}
      <Navbar 
        user={user}
        onOpenAuth={handleOpenAuthModal}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setActiveTab('admin')}
        onOpenCustomPersonas={() => setShowCustomPersonaModal(true)}
        onOpenSavedSnippets={() => setShowFavoritesModal(true)}
        onOpenBatchModal={() => setShowBatchModal(true)}
        onOpenOcrModal={() => setShowOcrModal(true)}
        onOpenMetricsModal={() => setShowMetricsModal(true)}
        onOpenOriginalityModal={() => setShowOriginalityModal(true)}
        onOpenSolutionsModal={handleOpenSolutions}
        onOpenGuideModal={handleOpenGuide}
      />

      {/* 2. Secondary Tool Selector Bar */}
      <ToolsNav 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'admin' && tab !== 'history' && tab !== 'about' && tab !== 'pricing') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* 3. Main Views */}
      <main className="flex-1">
        {activeTab === 'admin' ? (
          <AdminView 
            user={user} 
            onBack={() => setActiveTab('paraphrase')} 
            showToast={showToast} 
          />
        ) : activeTab === 'history' ? (
          <HistoryView 
            user={user} 
            onRestore={handleRestoreFromHistory} 
            onRequireAuth={() => handleOpenAuthModal('login')}
            showToast={showToast} 
          />
        ) : activeTab === 'about' ? (
          <AboutView onBack={() => setActiveTab('paraphrase')} />
        ) : activeTab === 'pricing' ? (
          <PricingView 
            onBack={() => {
              window.location.hash = '';
              setActiveTab('paraphrase');
            }}
            onOpenAuth={handleOpenAuthModal}
            onOpenSolutionsModal={handleOpenSolutions}
            user={user}
            showToast={showToast}
          />
        ) : activeTab === 'grammar' ? (
          <GrammarCheckerTool user={user} showToast={showToast} />
        ) : activeTab === 'plagiarism' ? (
          <PlagiarismCheckerTool user={user} showToast={showToast} />
        ) : activeTab === 'detector' ? (
          <AiDetectorTool 
            user={user} 
            showToast={showToast} 
            onSwitchToHumanizer={(txt) => {
              setInputText(txt);
              setActiveTab('humanizer');
            }} 
          />
        ) : activeTab === 'humanizer' ? (
          <AiHumanizerTool user={user} showToast={showToast} initialText={inputText} />
        ) : activeTab === 'aichat' ? (
          <AiChatTool user={user} showToast={showToast} />
        ) : activeTab === 'translator' ? (
          <TranslatorTool user={user} showToast={showToast} />
        ) : (
          /* Main Grammarly Replica Scrolling Landing Page */
          <>
            {/* Hero Interactive Paraphraser Tool */}
            <ParaphraseView 
              inputText={inputText}
              setInputText={setInputText}
              outputText={outputText}
              setOutputText={setOutputText}
              loading={loading}
              onParaphrase={handleTransform}
              activeTone={activeTone}
              setActiveTone={setActiveTone}
              metrics={metrics}
              onOpenDiffModal={() => setShowDiffModal(true)}
              onOpenMetricsModal={() => setShowMetricsModal(true)}
              onOpenExportModal={() => setShowExportModal(true)}
              onOpenBatchModal={() => setShowBatchModal(true)}
              onOpenCustomPersonaModal={() => setShowCustomPersonaModal(true)}
              onOpenOcrModal={() => setShowOcrModal(true)}
              onOpenOriginalityModal={() => setShowOriginalityModal(true)}
              onOpenSavedSnippets={() => setShowFavoritesModal(true)}
              activeCustomPersona={activeCustomPersona}
              languages={languages}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              intensity={intensity}
              setIntensity={setIntensity}
              user={user}
              onSaveSnippet={toggleFavorite}
              isSnippetSaved={isCurrentOutputFavorite}
              onSentenceClick={handleSentenceClick}
            />

            {/* Banner below tool */}
            <JoinBanner onOpenAuth={handleOpenAuthModal} />

            {/* Why use Metaphrase AI section */}
            <WhyUseSection />

            {/* Go beyond paraphrasing section */}
            <GoBeyondSection onOpenAuth={handleOpenAuthModal} />

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Learn how to paraphrase guides */}
            <LearnToParaphraseSection />

            {/* More AI writing tools tabbed directory */}
            <MoreToolsSection setActiveTab={setActiveTab} />

            {/* Writing support for every idea */}
            <WritingSupportSection onOpenAuth={handleOpenAuthModal} />

            {/* Comprehensive FAQ Accordion */}
            <FaqSection />

            {/* Dark CTA Section */}
            <DarkCtaSection onOpenAuth={handleOpenAuthModal} />
          </>
        )}
      </main>

      {/* 4. Enterprise Footer */}
      <Footer 
        setActiveTab={setActiveTab} 
        onOpenAuth={handleOpenAuthModal} 
        onOpenSolutionsModal={handleOpenSolutions}
        onOpenGuideModal={handleOpenGuide}
        onOpenIntegrationsModal={handleOpenIntegrations}
        onOpenSupportModal={handleOpenSupport}
      />

      {/* 5. Modals */}
      {showAuthModal && (
        <AuthModal 
          initialTab={authModalInitialTab}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLoginSuccess}
          showToast={showToast}
        />
      )}

      {showSolutionsModal && (
        <SolutionsModal 
          initialKey={solutionsModalKey}
          onClose={() => setShowSolutionsModal(false)}
          onOpenAuth={handleOpenAuthModal}
          onSelectTone={(tone) => {
            setActiveTone(tone);
            setActiveTab('paraphrase');
            showToast(`Tone updated to ${tone}!`, 'info');
          }}
        />
      )}

      {showGuideModal && (
        <ResourceGuideModal 
          initialKey={guideModalKey}
          onClose={() => setShowGuideModal(false)}
          onTryParaphrase={() => {
            setActiveTab('paraphrase');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {showIntegrationsModal && (
        <IntegrationsModal 
          initialKey={integrationsModalKey}
          onClose={() => setShowIntegrationsModal(false)}
          showToast={showToast}
        />
      )}

      {showSupportModal && (
        <SupportModal 
          initialTab={supportModalTab}
          onClose={() => setShowSupportModal(false)}
          showToast={showToast}
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
          originalText={inputText}
          paraphrasedText={outputText}
          onClose={() => setShowMetricsModal(false)}
        />
      )}

      {showExportModal && (
        <FloatingExportModal 
          originalText={inputText}
          paraphrasedText={outputText}
          tone={activeTone}
          onClose={() => setShowExportModal(false)}
          showToast={showToast}
        />
      )}

      {showBatchModal && (
        <BatchProcessingModal 
          user={user}
          activeTone={activeTone}
          targetLanguage={targetLanguage}
          onClose={() => setShowBatchModal(false)}
          showToast={showToast}
          onOutputCompiled={(compiled) => {
            setOutputText(compiled);
            setShowBatchModal(false);
          }}
        />
      )}

      {showCustomPersonaModal && (
        <CustomPersonaModal 
          user={user}
          personas={userPersonas}
          activePersona={activeCustomPersona}
          onSelectPersona={(persona) => {
            setActiveCustomPersona(persona);
            setShowCustomPersonaModal(false);
            showToast(`Voice persona set to "${persona ? persona.title : 'Default'}".`, 'info');
          }}
          onRefresh={loadPersonas}
          onRequireAuth={() => handleOpenAuthModal('login')}
          onClose={() => setShowCustomPersonaModal(false)}
          showToast={showToast}
        />
      )}

      {selectedSentence && (
        <InteractiveSentenceModal 
          sentence={selectedSentence}
          targetLanguage={targetLanguage}
          tone={activeTone}
          onClose={() => setSelectedSentence(null)}
          onSelectAlternative={(alt) => {
            handleReplaceSentence(selectedSentence, alt);
            setSelectedSentence(null);
          }}
          showToast={showToast}
        />
      )}

      {showOcrModal && (
        <OcrModal 
          onTextExtracted={(extracted) => {
            setInputText(extracted);
            setShowOcrModal(false);
            showToast('OCR extracted text loaded!', 'success');
          }}
          onClose={() => setShowOcrModal(false)}
          showToast={showToast}
        />
      )}

      {showOriginalityModal && (
        <OriginalityModal 
          originalText={inputText}
          paraphrasedText={outputText}
          onClose={() => setShowOriginalityModal(false)}
        />
      )}

      {showFavoritesModal && (
        <SavedSnippetsModal 
          favorites={favorites}
          onSelectSnippet={(fav) => {
            setInputText(fav.inputText);
            setOutputText(fav.outputText);
            setActiveTone(fav.tone);
            setShowFavoritesModal(false);
            showToast('Loaded bookmark into workspace.', 'info');
          }}
          onDeleteSnippet={(id) => {
            setFavorites((prev) => prev.filter((f) => f.id !== id));
            showToast('Removed bookmark.', 'info');
          }}
          onClose={() => setShowFavoritesModal(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
}
