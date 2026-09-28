import React, { useState } from 'react';
import { 
  X, Monitor, Laptop, Globe, FileText, CheckCircle2, 
  Download, ExternalLink, Sparkles, Shield, ArrowRight, 
  Layers, Check, Compass 
} from 'lucide-react';

const INTEGRATIONS = {
  desktop: {
    id: 'desktop',
    title: 'Metaphrase AI Desktop',
    subtitle: 'Native desktop application for Windows and macOS',
    icon: <Monitor className="w-6 h-6 text-[#027E6F]" />,
    tag: 'Native App',
    version: 'v2.6.4 (Latest)',
    size: '84.2 MB',
    desc: 'Access ultra-fast paraphrasing, grammar checking, and AI humanizing globally across any desktop software via global hotkey (Ctrl + Space / Cmd + Space).',
    features: [
      'Universal system-wide shortcut across all apps & text inputs',
      'Offline caching for instant phrase and synonym lookups',
      'Auto-updates with zero background resource drain',
      'Dark mode and multi-monitor display support'
    ],
    downloads: [
      { label: 'Download for Windows (x64 .exe)', os: 'windows', filename: 'MetaphraseAI-Setup-v2.6.4.exe' },
      { label: 'Download for macOS (Apple Silicon .dmg)', os: 'mac', filename: 'MetaphraseAI-AppleSilicon-v2.6.4.dmg' },
      { label: 'Download for macOS (Intel .dmg)', os: 'mac', filename: 'MetaphraseAI-Intel-v2.6.4.dmg' }
    ]
  },
  windows: {
    id: 'windows',
    title: 'Metaphrase AI for Windows',
    subtitle: 'Optimized for Windows 10 & Windows 11 (64-bit)',
    icon: <Laptop className="w-6 h-6 text-blue-600" />,
    tag: 'Windows 10 / 11',
    version: 'v2.6.4 (x64 / ARM64)',
    size: '82.5 MB',
    desc: 'Seamlessly enhances your writing in Microsoft Outlook, Notion, Slack, Discord, and Windows Notepad with real-time neural suggestions.',
    features: [
      'Instant floating widget with Alt + M hotkey trigger',
      'Integrated with Windows Clipboard history',
      'Hardware-accelerated neural inference',
      'Supports enterprise group policy deployment (MSI installer)'
    ],
    downloads: [
      { label: 'Download Windows Installer (.exe)', os: 'windows', filename: 'MetaphraseAI-Setup-Windows-x64.exe' },
      { label: 'Download Enterprise Package (.msi)', os: 'windows', filename: 'MetaphraseAI-Enterprise-x64.msi' }
    ]
  },
  mac: {
    id: 'mac',
    title: 'Metaphrase AI for Mac',
    subtitle: 'Tailored for macOS Sonoma & Ventura',
    icon: <Monitor className="w-6 h-6 text-purple-600" />,
    tag: 'macOS Silicon & Intel',
    version: 'v2.6.4 (Universal)',
    size: '88.1 MB',
    desc: 'Designed with macOS aesthetic elegance. Works inside Apple Mail, Pages, Keynote, Safari, and Slack with native menu bar access.',
    features: [
      'Native Menu Bar utility with quick-hover rewrite widget',
      'Optimized for Apple Silicon M1, M2, M3 & M4 chips',
      'Spotlight-like quick-trigger bar (Cmd + Shift + P)',
      'Respects macOS System Accent Colors and Dark Mode'
    ],
    downloads: [
      { label: 'Download for Apple Silicon (M1/M2/M3/M4)', os: 'mac', filename: 'MetaphraseAI-Mac-AppleSilicon.dmg' },
      { label: 'Download for Intel Mac', os: 'mac', filename: 'MetaphraseAI-Mac-Intel.dmg' }
    ]
  },
  chrome: {
    id: 'chrome',
    title: 'Metaphrase AI Chrome Extension',
    subtitle: 'Real-time writing assistance directly inside Google Chrome',
    icon: <Compass className="w-6 h-6 text-emerald-600" />,
    tag: 'Chrome Web Store',
    version: 'v3.1.0',
    size: '3.4 MB',
    desc: 'Paraphrase, correct grammar, and humanize sentences anywhere you type on the web: Gmail, Google Docs, LinkedIn, Reddit, ChatGPT, and WordPress.',
    features: [
      'Inline rewrite suggestions on any text selection',
      'Floating bubble widget with 1-click tone calibration',
      'Zero latency local cache for smooth typing flow',
      'Works in 14+ languages automatically'
    ],
    downloads: [
      { label: 'Add to Google Chrome (Free)', os: 'chrome', filename: 'chrome-store-link' }
    ]
  },
  edge: {
    id: 'edge',
    title: 'Metaphrase AI Microsoft Edge Add-on',
    subtitle: 'Native sidebar & web extension for Microsoft Edge',
    icon: <Globe className="w-6 h-6 text-cyan-600" />,
    tag: 'Edge Add-ons Store',
    version: 'v3.1.0',
    size: '3.4 MB',
    desc: 'Enhance your Edge browsing with full Metaphrase AI integration in both web pages and the Edge Sidebar co-pilot view.',
    features: [
      'Compatible with Microsoft Edge Sidebar co-pilot',
      'Deep integration with Microsoft 365 Web Apps',
      'Smart grammar checking with zero tracking telemetry',
      'Quick right-click context menu paraphrasing'
    ],
    downloads: [
      { label: 'Get for Microsoft Edge (Free)', os: 'edge', filename: 'edge-store-link' }
    ]
  },
  word: {
    id: 'word',
    title: 'Metaphrase AI for Microsoft Word',
    subtitle: 'Office 365 & Word Desktop Add-in',
    icon: <FileText className="w-6 h-6 text-blue-700" />,
    tag: 'Microsoft AppSource',
    version: 'v2.2.0',
    size: '1.2 MB',
    desc: 'Rewrite long documents, generate APA/MLA citations, and eliminate passive voice directly inside Microsoft Word desktop and Word Online.',
    features: [
      'Full sidebar pane with paragraph-by-paragraph paraphrasing',
      'Live readability grade-level scoring inside your document',
      '1-click replacement of highlighted sections',
      'Integrated with Microsoft 365 enterprise tenant licenses'
    ],
    downloads: [
      { label: 'Install from Microsoft AppSource', os: 'word', filename: 'word-appsource-link' }
    ]
  },
  docs: {
    id: 'docs',
    title: 'Metaphrase AI for Google Docs',
    subtitle: 'Google Workspace Marketplace Add-on',
    icon: <FileText className="w-6 h-6 text-amber-600" />,
    tag: 'Workspace Marketplace',
    version: 'v2.2.0',
    size: 'Cloud Add-on',
    desc: 'Collaborate with your team in Google Docs while maintaining flawless style, high originality scores, and polished grammar.',
    features: [
      'Docked right sidebar with live tone and persona switcher',
      'Plagiarism and AI detection check before submitting drafts',
      'Direct insertion of rewritten paragraphs into active cursor',
      'Works across personal Gmail and Google Workspace accounts'
    ],
    downloads: [
      { label: 'Install from Google Workspace Marketplace', os: 'docs', filename: 'gdocs-marketplace-link' }
    ]
  }
};

export default function IntegrationsModal({ initialKey = 'desktop', onClose, showToast }) {
  const [selectedKey, setSelectedKey] = useState(initialKey || 'desktop');
  const [downloading, setDownloading] = useState(null);
  const item = INTEGRATIONS[selectedKey] || INTEGRATIONS.desktop;

  const handleDownload = (dl) => {
    setDownloading(dl.filename);
    setTimeout(() => {
      setDownloading(null);
      if (dl.filename.includes('store') || dl.filename.includes('appsource') || dl.filename.includes('marketplace')) {
        showToast?.(`Connecting to ${item.title} repository...`, 'success');
      } else {
        // Mock file trigger
        showToast?.(`Started downloading ${dl.filename}!`, 'success');
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-3xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Integration Categories Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 border-b border-gray-100 mb-6">
          {Object.entries(INTEGRATIONS).map(([key, app]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedKey === key
                  ? 'bg-[#027E6F] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {app.title.replace('Metaphrase AI ', '')}
            </button>
          ))}
        </div>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#027E6F]">
                    {item.tag}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.version}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1C1C1C]">
                  {item.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#3E4049] leading-relaxed font-medium">
              {item.desc}
            </p>

            {/* Feature Points */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Key Capabilities
              </h4>
              {item.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#027E6F] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 p-3 bg-[#F9F9FB] rounded-xl border border-gray-200 text-xs text-gray-600">
              <Shield className="w-4 h-4 text-[#027E6F]" />
              <span>Digitally signed package with SHA-256 integrity verification. Zero telemetry tracking.</span>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="bg-[#F9F9FB] rounded-2xl p-5 border border-gray-200 space-y-4 flex flex-col justify-between h-full">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Download & Install
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Package size: <strong className="text-gray-800">{item.size}</strong>
              </div>

              <div className="space-y-2.5">
                {item.downloads.map((dl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDownload(dl)}
                    disabled={downloading === dl.filename}
                    className="grammarly-green-btn w-full py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {downloading === dl.filename ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{dl.label}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 text-center">
              <span className="text-[11px] text-gray-400">
                Requires Metaphrase AI Account · Free tier included
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
