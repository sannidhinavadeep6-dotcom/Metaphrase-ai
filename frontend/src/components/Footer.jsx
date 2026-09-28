import React from 'react';

export default function Footer({ 
  setActiveTab, 
  onOpenAuth, 
  onOpenSolutionsModal, 
  onOpenGuideModal,
  onOpenIntegrationsModal,
  onOpenSupportModal
}) {
  return (
    <footer className="bg-[#111625] text-gray-400 border-t border-gray-800 pt-16 pb-12 text-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Column 1: Get Metaphrase AI */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Get Metaphrase AI</h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => { setActiveTab('paraphrase'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Web Paraphraser
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('desktop')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Desktop App
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('windows')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Windows Client
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('mac')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Mac Client
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('chrome')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Chrome Extension
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('edge')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Edge Extension
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('word')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  MS Word Add-in
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenIntegrationsModal?.('docs')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Google Docs Add-on
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Learn more */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Learn more</h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => { window.location.hash = '#pricing'; setActiveTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Plans & Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.location.hash = '#pricing'; setActiveTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Metaphrase AI Pro
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSolutionsModal?.('teams')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Teams & Businesses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSolutionsModal?.('enterprise')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Enterprise Solution
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSolutionsModal?.('institutions')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Education Licensing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('aichat'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  AI Writing Assistant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('blog')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Linguistic Tech Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('grammar_rules')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Common Grammar Rules
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Features</h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => { setActiveTab('grammar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Grammar Checker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('plagiarism'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Plagiarism Checker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('paraphrase'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Paraphrasing Tool
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('detector'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  AI Detector
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('humanizer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  AI Humanizer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('translator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Neural Translator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('aichat'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  AI Chat Assistant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('citations')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Citation Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('responsible_ai')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Responsible AI Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('careers')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Careers & Culture
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('press')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Press & News
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('affiliate')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Affiliate Program
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('security')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Trust Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('security')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Security & Compliance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenGuideModal?.('privacy')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h4 className="font-bold text-white text-base mb-4">Connect</h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => onOpenSupportModal?.('help')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSupportModal?.('contact')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSupportModal?.('community')} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Community Forum
                </button>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors block cursor-pointer"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors block cursor-pointer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors block cursor-pointer"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#027E6F] text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span>2026 Metaphrase AI</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => onOpenGuideModal?.('privacy')} 
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button 
              onClick={() => onOpenGuideModal?.('terms')} 
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button 
              onClick={() => onOpenGuideModal?.('ca_notice')} 
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              CA Notice
            </button>
            <span>·</span>
            <button 
              onClick={() => onOpenGuideModal?.('security')} 
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
