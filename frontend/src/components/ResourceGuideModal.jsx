import React, { useState } from 'react';
import { 
  X, BookOpen, FileCheck, ShieldAlert, Sparkles, ArrowRight, 
  Lightbulb, Check, ShieldCheck, Scale, Award, HeartHandshake,
  Cpu, FileText, CheckCircle2
} from 'lucide-react';

const GUIDES = {
  paraphrase: {
    title: "How to Paraphrase Effectively & Authentically",
    tag: "Core Linguistic Skill",
    icon: <BookOpen className="w-6 h-6 text-[#027E6F]" />,
    summary: "Paraphrasing is the process of restating someone else's concepts in your own words while retaining original factual fidelity.",
    steps: [
      {
        title: "1. Read for Full Conceptual Comprehension",
        desc: "Read the source paragraph two or three times until you can explain the core thesis aloud without looking at the text."
      },
      {
        title: "2. Change the Sentence Structure, Not Just Synonyms",
        desc: "Rotate passive and active clauses, convert subordinate phrases, and vary sentence lengths to break structural mimicry."
      },
      {
        title: "3. Preserve Technical Jargon When Necessary",
        desc: "Do not replace established scientific terms (e.g. 'quantum superposition' or 'gross domestic product') with awkward synonyms."
      },
      {
        title: "4. Always Include In-Text Citations",
        desc: "Even when a passage is 100% in your own words, citing the originator is essential for academic and professional credibility."
      }
    ]
  },
  grammar_rules: {
    title: "Mastering Common English Grammar & Punctuation Rules",
    tag: "Grammar Masterclass",
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    summary: "A practical guide to eliminating the most prevalent writing mistakes across academic and professional publications.",
    steps: [
      {
        title: "1. Subject-Verb Agreement & Collective Nouns",
        desc: "Ensure singular subjects take singular verbs, especially with indefinite pronouns (e.g., 'Everyone is ready', not 'are ready')."
      },
      {
        title: "2. Active Voice vs. Passive Voice Calibration",
        desc: "Favor active voice ('The team deployed the model') over passive voice ('The model was deployed by the team') for executive directness."
      },
      {
        title: "3. Avoiding Misplaced & Dangling Modifiers",
        desc: "Place qualifying adjectives and adverbs immediately adjacent to the noun they modify to prevent ambiguous claims."
      },
      {
        title: "4. Semicolon & Oxford Comma Mastery",
        desc: "Use semicolons to connect independent clauses without a conjunction; maintain serial commas for list clarity."
      }
    ]
  },
  citations: {
    title: "Academic Citation Handbook: APA, MLA & Chicago",
    tag: "Integrity & Formatting",
    icon: <FileCheck className="w-6 h-6 text-blue-600" />,
    summary: "Proper referencing guidelines when incorporating paraphrased evidence into scholarly papers, journals, and essays.",
    steps: [
      {
        title: "APA 7th Edition (Author-Date)",
        desc: "Format: (Author, Year). Example: 'Neural models accelerate syntactic transformation (Sannidhi, 2026).'"
      },
      {
        title: "MLA 9th Edition (Author-Page)",
        desc: "Format: (Author Page#). Example: 'Linguistic clarity improves reading retention (Navadeep 142).'"
      },
      {
        title: "Chicago 17th Notes & Bibliography",
        desc: "Format: Footnote superscript with corresponding bibliography entry at the document footer."
      },
      {
        title: "Automatic Citation Finder",
        desc: "Use Metaphrase AI's built-in Citation Finder to generate complete bibliography entries automatically."
      }
    ]
  },
  plagiarism: {
    title: "5 Proven Rules for Plagiarism Prevention",
    tag: "Ethical AI Writing",
    icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
    summary: "A practical protocol for students, journalists, and content creators to ensure all submitted work is 100% original.",
    steps: [
      {
        title: "Rule 1: Synthesize Across Multiple Sources",
        desc: "Never rely on a single article. Cross-reference 3 or more studies to formulate your unique synthesis."
      },
      {
        title: "Rule 2: Differentiate Quoting vs. Paraphrasing",
        desc: "Use quotation marks only for word-for-word memorable phrases. Paraphrase all background context and data."
      },
      {
        title: "Rule 3: Run AI Detection & Originality Scans",
        desc: "Scan your final draft using Metaphrase AI's originality calculator to ensure human-like perplexity and burstiness."
      },
      {
        title: "Rule 4: Keep an Audit Trail",
        desc: "Maintain bookmarks of all referenced URLs and DOI numbers in your saved snippets workspace."
      }
    ]
  },
  responsible_ai: {
    title: "Responsible AI Policy & Model Governance",
    tag: "Ethics & Safety",
    icon: <Scale className="w-6 h-6 text-indigo-600" />,
    summary: "Our commitment to building ethical, transparent, and human-centric natural language processing systems.",
    steps: [
      {
        title: "Human Agency & Augmentation",
        desc: "Metaphrase AI is engineered to amplify human intellect, creativity, and expression, never to impersonate or deceptively replace human authors."
      },
      {
        title: "Bias Mitigation & Linguistic Inclusivity",
        desc: "Continuous algorithmic auditing across gender, dialect, and cultural markers to prevent systematic representational bias."
      },
      {
        title: "Academic Honor Code Alignment",
        desc: "We partner proactively with university faculties to ensure our rewriting aids function as pedagogical tools rather than ghostwriting cheats."
      },
      {
        title: "Full Algorithmic Transparency",
        desc: "Real-time visibility into perplexity metrics, sentence-level changes, and originality differentials."
      }
    ]
  },
  security: {
    title: "Trust Center, Security & Compliance Standards",
    tag: "Enterprise Compliance",
    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
    summary: "How Metaphrase AI secures confidential enterprise documents and maintains zero data retention.",
    steps: [
      {
        title: "Zero Model Retraining",
        desc: "Your text, documents, and custom personas are never used to train or fine-tune public foundation AI models."
      },
      {
        title: "Bcrypt Hashing (12 Rounds)",
        desc: "Enterprise user credentials and passwords are encrypted using salted bcrypt hashes with zero plaintext storage."
      },
      {
        title: "In-Transit & At-Rest Encryption",
        desc: "All REST traffic is protected via TLS 1.3 encryption; database volumes utilize encrypted SQLite WAL stores."
      },
      {
        title: "Granular Role-Based Access Control (RBAC)",
        desc: "Admin, supervisor, and user tiers with audit log tracking across all transformation activities."
      }
    ]
  },
  privacy: {
    title: "Metaphrase AI Global Privacy Policy",
    tag: "Data Protection",
    icon: <FileText className="w-6 h-6 text-teal-600" />,
    summary: "Transparent guidelines detailing how your personal data is collected, handled, and safeguarded.",
    steps: [
      {
        title: "1. No Sale of Personal Information",
        desc: "We do not sell, rent, or monetize your personal information or document submissions under any circumstances."
      },
      {
        title: "2. Ephemeral Document Processing",
        desc: "Texts submitted for paraphrasing, grammar, or detection are processed entirely in-memory and discarded post-inference."
      },
      {
        title: "3. User Data Rights (GDPR & CCPA)",
        desc: "You retain full rights to export your account data or request permanent deletion of your profile with 1 click."
      },
      {
        title: "4. Cookie Transparency",
        desc: "We use strictly necessary session cookies only for user authentication and session persistence."
      }
    ]
  },
  terms: {
    title: "Terms of Service & Usage Agreement",
    tag: "Legal Agreement",
    icon: <FileText className="w-6 h-6 text-gray-700" />,
    summary: "The official terms governing the use of Metaphrase AI web application, native clients, and API services.",
    steps: [
      {
        title: "1. License & Permitted Use",
        desc: "You are granted a non-exclusive, non-transferable license to access Metaphrase AI services for personal and commercial writing enhancement."
      },
      {
        title: "2. Prohibited Conduct",
        desc: "You agree not to reverse-engineer the API, launch automated scraping bots, or process malicious or abusive content."
      },
      {
        title: "3. Intellectual Property Ownership",
        desc: "All transformed, paraphrased, translated, or humanized output generated by the platform belongs 100% to you."
      },
      {
        title: "4. Service Level & Disclaimers",
        desc: "Metaphrase AI provides high-availability services with 99.9% target uptime for Pro and Enterprise subscribers."
      }
    ]
  },
  ca_notice: {
    title: "California Consumer Privacy Act (CCPA) Notice",
    tag: "California Privacy",
    icon: <Award className="w-6 h-6 text-amber-700" />,
    summary: "Specific disclosures and statutory rights for residents of California under the CCPA/CPRA.",
    steps: [
      {
        title: "Right to Know & Access",
        desc: "California residents may request details regarding the categories of personal info collected in the preceding 12 months."
      },
      {
        title: "Right to Opt-Out of Data Sharing",
        desc: "We do not share personal data for cross-context behavioral advertising. You may opt out anytime."
      },
      {
        title: "Right to Non-Discrimination",
        desc: "We will not discriminate against any user who exercises their statutory privacy rights under California law."
      },
      {
        title: "Designated Privacy Contact",
        desc: "Requests can be submitted through our Contact Support form or emailed directly to privacy@metaphrase.ai."
      }
    ]
  },
  blog: {
    title: "Linguistic Tech Blog: Frontiers of Neural Language",
    tag: "Research & Insights",
    icon: <Cpu className="w-6 h-6 text-blue-500" />,
    summary: "Read our engineering and linguistics team's latest articles on deep semantic embeddings and burstiness optimization.",
    steps: [
      {
        title: "Paper: Beyond Synonyms - Structural Syntax Transformation",
        desc: "An exploration into why dependency parse tree manipulation yields 3.4x higher comprehension than word substitution."
      },
      {
        title: "Paper: Statistical Perplexity Calibration in AI Humanizers",
        desc: "How token probability redistribution masks synthetic model artifacts without introducing grammatical corruption."
      },
      {
        title: "Guide: Building High-Output Writing Routines in 2026",
        desc: "A step-by-step masterclass on pairing AI co-pilots with human editorial rigor for 10x publishing velocity."
      }
    ]
  },
  press: {
    title: "Press & Media Kit",
    tag: "Company Announcements",
    icon: <Award className="w-6 h-6 text-rose-600" />,
    summary: "Download official Metaphrase AI vector logos, brand guidelines, and review our latest funding and milestone press releases.",
    steps: [
      {
        title: "Metaphrase AI Reaches 1.2M Active Monthly Writers",
        desc: "Announcing rapid growth across university campuses, Fortune 500 communications teams, and freelance publishers."
      },
      {
        title: "Official Brand Assets & Color Palettes",
        desc: "Primary color #027E6F (Grammarly Emerald), typography specs (Inter / Plus Jakarta Sans), and scalable SVG logomarks."
      },
      {
        title: "Media Inquiries & Executive Interviews",
        desc: "Journalists and press representatives may contact press@metaphrase.ai for spokesperson commentary and briefings."
      }
    ]
  },
  affiliate: {
    title: "Metaphrase AI Affiliate & Partner Program",
    tag: "Earn 25% Recurring",
    icon: <HeartHandshake className="w-6 h-6 text-emerald-700" />,
    summary: "Monetize your audience by recommending the premier AI paraphraser and writing co-pilot.",
    steps: [
      {
        title: "25% Lifetime Recurring Commission",
        desc: "Earn generous monthly revenue for every Pro and Team subscriber who signs up via your affiliate tracking link."
      },
      {
        title: "60-Day Cookie Window",
        desc: "Our robust tracking cookies guarantee you receive full credit even if your referrals convert weeks later."
      },
      {
        title: "Dedicated Partner Dashboard & Creatives",
        desc: "Access real-time conversion stats, promotional banners, landing page copy, and direct monthly PayPal/Stripe payouts."
      }
    ]
  },
  careers: {
    title: "Careers & Culture at Metaphrase AI",
    tag: "Join Our Team",
    icon: <Sparkles className="w-6 h-6 text-purple-600" />,
    summary: "We are on a mission to empower everyone to communicate with total clarity, nuance, and confidence.",
    steps: [
      {
        title: "Open Role: Staff NLP / Transformer Research Engineer",
        desc: "Remote / Hybrid (San Francisco / Bengaluru) — Researching next-generation lightweight sequence-to-sequence models."
      },
      {
        title: "Open Role: Senior Full-Stack React & FastAPI Engineer",
        desc: "Remote — Scaling real-time collaborative text editing and low-latency websocket streaming inference."
      },
      {
        title: "Open Role: Product Designer (Linguistic Systems)",
        desc: "Remote — Designing intuitive micro-interactions and sentence rewording interfaces for millions of users."
      },
      {
        title: "Benefits & Culture",
        desc: "Competitive equity, comprehensive health benefits, unlimited PTO, and continuous learning stipends."
      }
    ]
  }
};

export default function ResourceGuideModal({ initialKey = 'paraphrase', onClose, onTryParaphrase }) {
  const [selectedKey, setSelectedKey] = useState(initialKey || 'paraphrase');
  const guide = GUIDES[selectedKey] || GUIDES.paraphrase;

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

        {/* Guides Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 border-b border-gray-100 mb-6">
          {Object.entries(GUIDES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedKey === key
                  ? 'bg-[#027E6F] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            {guide.icon}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#027E6F]">
              {guide.tag}
            </span>
            <h3 className="text-2xl font-bold text-[#1C1C1C]">
              {guide.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-[#3E4049] leading-relaxed bg-[#F9F9FB] p-4 rounded-xl border border-gray-200 mb-6 font-medium">
          {guide.summary}
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {guide.steps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-all">
              <h4 className="font-bold text-sm text-[#1C1C1C] mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#027E6F] text-xs flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{step.title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#646B81] leading-relaxed pl-7">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            Close Guide
          </button>

          <button
            onClick={() => {
              onClose();
              if (onTryParaphrase) onTryParaphrase();
            }}
            className="grammarly-green-btn px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Practice in Paraphraser</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
