import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  User, 
  LogOut, 
  Settings, 
  FileText, 
  Compass,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  Headphones,
  Megaphone,
  Code,
  FileCheck,
  Search,
  ScanText
} from 'lucide-react';

export default function Navbar({ 
  user, 
  onOpenAuth, 
  onLogout, 
  activeTab, 
  setActiveTab,
  onOpenAdmin,
  onOpenCustomPersonas,
  onOpenSavedSnippets,
  onOpenBatchModal,
  onOpenOcrModal,
  onOpenMetricsModal,
  onOpenOriginalityModal,
  onOpenSolutionsModal,
  onOpenGuideModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E6E9] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        
        {/* Left: Metaphrase AI Logo & Main Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('paraphrase'); closeDropdowns(); }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#027E6F] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#006356] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18V6l8 8 8-8v12" />
              </svg>
            </div>
            <span className="font-bold text-[22px] tracking-tight text-[#1C1C1C] flex items-center">
              metaphrase <span className="text-[#027E6F] ml-1.5 font-extrabold text-sm tracking-widest uppercase bg-[#E6F5F2] px-1.5 py-0.5 rounded">ai</span>
            </span>
          </a>

          {/* Desktop Nav Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 text-[15px] font-medium text-[#1C1C1C]">
            
            {/* 1. Product Flyout */}
            <div className="relative">
              <button 
                id="nav-product-btn"
                onClick={() => toggleDropdown('product')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-md hover:text-[#027E6F] hover:bg-gray-50 transition-colors cursor-pointer ${activeDropdown === 'product' ? 'text-[#027E6F] bg-gray-50' : ''}`}
              >
                <span>Product</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-2 gap-6 animate-fadeIn z-50">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Core AI Tools</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <button 
                          onClick={() => { setActiveTab('paraphrase'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🎭</span>
                          <div>
                            <div className="font-semibold text-gray-900">AI Paraphraser</div>
                            <div className="text-[11px] text-gray-500 font-normal">Rewrite with custom tone and intensity</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { setActiveTab('grammar'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Grammar Checker</div>
                            <div className="text-[11px] text-gray-500 font-normal">Fix spelling, punctuation & syntax</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { setActiveTab('plagiarism'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Plagiarism Checker</div>
                            <div className="text-[11px] text-gray-500 font-normal">Originality & citation verification</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { setActiveTab('detector'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-semibold text-gray-900">AI Detector</div>
                            <div className="text-[11px] text-gray-500 font-normal">Multi-layer synthetic prose scanner</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { setActiveTab('humanizer'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-rose-500" />
                          <div>
                            <div className="font-semibold text-gray-900">AI Humanizer</div>
                            <div className="text-[11px] text-gray-500 font-normal">Bypass detection with organic flow</div>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced Features</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <button 
                          onClick={() => { setActiveTab('translator'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🌐</span>
                          <div>
                            <div className="font-semibold text-gray-900">Neural Translator</div>
                            <div className="text-[11px] text-gray-500 font-normal">14+ languages with dialect accuracy</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { setActiveTab('aichat'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">💬</span>
                          <div>
                            <div className="font-semibold text-gray-900">AI Chat Assistant</div>
                            <div className="text-[11px] text-gray-500 font-normal">Interactive rewriting co-pilot</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenCustomPersonas(); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Custom Voice Personas</div>
                            <div className="text-[11px] text-gray-500 font-normal">Define unique corporate/personal styles</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenBatchModal(); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Batch Document Processor</div>
                            <div className="text-[11px] text-gray-500 font-normal">Transform .docx and .txt files</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenOcrModal(); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <ScanText className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="font-semibold text-gray-900">OCR Image Scanner</div>
                            <div className="text-[11px] text-gray-500 font-normal">Extract & rewrite text from images</div>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Work Flyout */}
            <div className="relative">
              <button 
                id="nav-work-btn"
                onClick={() => toggleDropdown('work')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-md hover:text-[#027E6F] hover:bg-gray-50 transition-colors cursor-pointer ${activeDropdown === 'work' ? 'text-[#027E6F] bg-gray-50' : ''}`}
              >
                <span>Work</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'work' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'work' && (
                <div className="absolute top-full left-0 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-2 gap-6 animate-fadeIn z-50">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">By Team Size</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <button 
                          onClick={() => { onOpenSolutionsModal('enterprise'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-[#027E6F]" />
                          <div>
                            <div className="font-semibold text-gray-900">Enterprise</div>
                            <div className="text-[11px] text-gray-500 font-normal">SSO, SOC-2 & zero data retention</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenSolutionsModal('teams'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Teams & Businesses</div>
                            <div className="text-[11px] text-gray-500 font-normal">Shared brand voice & style sheets</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenSolutionsModal('professionals'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Professionals</div>
                            <div className="text-[11px] text-gray-500 font-normal">High-stakes proposals & emails</div>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">By Function</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <button 
                          onClick={() => { onOpenSolutionsModal('marketing'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Megaphone className="w-4 h-4 text-rose-500" />
                          <div>
                            <div className="font-semibold text-gray-900">Marketing & Content</div>
                            <div className="text-[11px] text-gray-500 font-normal">Campaign copy & multi-channel variants</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenSolutionsModal('support'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Headphones className="w-4 h-4 text-amber-500" />
                          <div>
                            <div className="font-semibold text-gray-900">Customer Support</div>
                            <div className="text-[11px] text-gray-500 font-normal">Empathetic & multilingual resolutions</div>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenSolutionsModal('engineering'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Code className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Engineering & IT</div>
                            <div className="text-[11px] text-gray-500 font-normal">Release notes & architecture specs</div>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Education Flyout */}
            <div className="relative">
              <button 
                id="nav-education-btn"
                onClick={() => toggleDropdown('education')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-md hover:text-[#027E6F] hover:bg-gray-50 transition-colors cursor-pointer ${activeDropdown === 'education' ? 'text-[#027E6F] bg-gray-50' : ''}`}
              >
                <span>Education</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'education' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'education' && (
                <div className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 space-y-2 animate-fadeIn z-50">
                  <button 
                    onClick={() => { onOpenSolutionsModal('students'); closeDropdowns(); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5 text-[#027E6F] mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1C1C1C] text-sm">For Students</div>
                      <div className="text-xs text-gray-500">Responsible paraphrasing, essay refinement & thesis rewriters</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { onOpenSolutionsModal('institutions'); closeDropdowns(); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1C1C1C] text-sm">For Institutions & Faculty</div>
                      <div className="text-xs text-gray-500">Campus-wide licensing, LMS integration & academic integrity</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { onOpenGuideModal('citations'); closeDropdowns(); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <FileCheck className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1C1C1C] text-sm">Citation Handbook</div>
                      <div className="text-xs text-gray-500">APA 7th, MLA 9th, and Chicago style referencing protocols</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { onOpenGuideModal('plagiarism'); closeDropdowns(); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-start gap-3 cursor-pointer"
                  >
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1C1C1C] text-sm">Plagiarism Prevention Guide</div>
                      <div className="text-xs text-gray-500">5 ethical rules for authentic writing and originality scans</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Pricing (Interactive Pricing View) */}
            <a 
              href="#pricing"
              id="nav-pricing-btn"
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.hash = '#pricing';
                setActiveTab('pricing'); 
                closeDropdowns(); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-md hover:text-[#027E6F] hover:bg-gray-50 transition-colors cursor-pointer ${
                activeTab === 'pricing' ? 'text-[#027E6F] font-bold bg-emerald-50' : ''
              }`}
            >
              Pricing
            </a>

            {/* 5. Resources Flyout */}
            <div className="relative">
              <button 
                id="nav-resources-btn"
                onClick={() => toggleDropdown('resources')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-md hover:text-[#027E6F] hover:bg-gray-50 transition-colors cursor-pointer ${activeDropdown === 'resources' ? 'text-[#027E6F] bg-gray-50' : ''}`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-2 gap-6 animate-fadeIn z-50">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Writing Guides</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <button 
                          onClick={() => { onOpenGuideModal('paraphrase'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">How to Paraphrase</span>
                          <span className="text-[11px] text-gray-500 font-normal">Techniques for authentic rewriting</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenGuideModal('citations'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">Citing Sources Correctly</span>
                          <span className="text-[11px] text-gray-500 font-normal">APA, MLA, Chicago guidelines</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenGuideModal('plagiarism'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">Avoiding Plagiarism</span>
                          <span className="text-[11px] text-gray-500 font-normal">Originality & citation rules</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenGuideModal('security'); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">Trust & Security Whitepaper</span>
                          <span className="text-[11px] text-gray-500 font-normal">Data protection & zero retention</span>
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Help & Company</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <a 
                          href="#faq" 
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('paraphrase');
                            closeDropdowns();
                            setTimeout(() => {
                              document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">Frequently Asked Questions</span>
                          <span className="text-[11px] text-gray-500 font-normal">Common questions answered</span>
                        </a>
                      </li>
                      <li>
                        <button 
                          onClick={() => { setActiveTab('about'); closeDropdowns(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">About Metaphrase AI</span>
                          <span className="text-[11px] text-gray-500 font-normal">Mission, technology & team</span>
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { onOpenMetricsModal(); closeDropdowns(); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-[#027E6F] font-medium block transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 block">Readability Analytics</span>
                          <span className="text-[11px] text-gray-500 font-normal">Flesch-Kincaid clarity metrics</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Right: Actions / Auth / CTA */}
        <div className="flex items-center gap-3">
          
          {/* Request a Demo link */}
          <button 
            onClick={() => onOpenSolutionsModal('enterprise')}
            className="hidden sm:inline-block text-[15px] font-semibold text-[#1C1C1C] hover:text-[#027E6F] px-3 py-2 transition-colors cursor-pointer"
          >
            Request a demo
          </button>

          {/* User Logged In State vs Guest */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-600 bg-gray-50 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#027E6F] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate hidden md:inline">
                  {user.name || user.email}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Admin Access
                      </span>
                    )}
                  </div>
                  
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => { onOpenAdmin(); setUserDropdownOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#027E6F] flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <button 
                    onClick={() => { setActiveTab('history'); setUserDropdownOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#027E6F] flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Transformation History</span>
                  </button>

                  <button 
                    onClick={() => { onOpenSavedSnippets(); setUserDropdownOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#027E6F] flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span>Saved Snippets</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button 
                    onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Log In Link */}
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-[15px] font-semibold text-[#1C1C1C] hover:text-[#027E6F] px-3 py-2 transition-colors cursor-pointer"
              >
                Log in
              </button>

              {/* Grammarly Exact Green CTA Button: Sign Up It's free */}
              <button 
                onClick={() => onOpenAuth('register')}
                className="grammarly-green-btn px-5 py-2.5 text-[15px] shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <strong>Sign Up</strong> It's free
              </button>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-[#027E6F] hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            <button 
              onClick={() => { setActiveTab('paraphrase'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 font-medium text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              Paraphrasing Tool
            </button>
            <button 
              onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 font-medium text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              Pricing & Plans
            </button>
            <button 
              onClick={() => { onOpenSolutionsModal('enterprise'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 font-medium text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              Enterprise & Work
            </button>
            <button 
              onClick={() => { onOpenSolutionsModal('students'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 font-medium text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              Education & Students
            </button>
            <button 
              onClick={() => { onOpenGuideModal('paraphrase'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 font-medium text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              Resources & Guides
            </button>
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {!user ? (
              <>
                <button 
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center font-semibold text-gray-800 border border-gray-300 rounded-full"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center font-semibold text-white bg-[#027E6F] rounded-full"
                >
                  <strong>Sign Up</strong> It's free
                </button>
              </>
            ) : (
              <button 
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center font-semibold text-red-600 border border-red-200 rounded-full"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
