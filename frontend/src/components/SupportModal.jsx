import React, { useState } from 'react';
import { 
  X, HelpCircle, MessageSquare, Users, Send, CheckCircle2, 
  Search, ExternalLink, Sparkles, PhoneCall, Mail, LifeBuoy,
  MessageCircle, ThumbsUp, Globe, Video, Share2
} from 'lucide-react';

const FAQS = [
  {
    q: "How does the Paraphrasing Engine maintain context?",
    a: "Metaphrase AI utilizes proprietary semantic neural embeddings combined with state-of-the-art transformer architecture to analyze full sentential syntax before reconstructing phrases.",
    tag: "Core AI"
  },
  {
    q: "Are my documents, inputs, and custom personas kept private?",
    a: "Yes, 100%. We operate on strict zero-retention principles. Your inputs are never stored in plain text, never sold to third parties, and never used to train public foundation models.",
    tag: "Security"
  },
  {
    q: "How does the AI Humanizer bypass detection filters?",
    a: "The Humanizer adjusts lexical entropy, perplexity variance, and syntactic burstiness to replicate authentic organic human writing rhythms.",
    tag: "Humanizer"
  },
  {
    q: "Can I use Metaphrase AI across multiple devices?",
    a: "Yes. Your Metaphrase AI subscription syncs seamlessly across the Web App, Windows Client, macOS App, Chrome Extension, Edge Add-on, and Microsoft Word.",
    tag: "Apps"
  },
  {
    q: "How do I upgrade or manage my team billing?",
    a: "Navigate to the Pricing tab or click on your account settings in the top right corner to upgrade your tier, add team seats, or download VAT invoices.",
    tag: "Billing"
  }
];

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: "Elena Rostova",
    role: "Ph.D. Candidate",
    avatar: "ER",
    title: "How I used Metaphrase AI Academic Mode to polish my 120-page thesis",
    likes: 142,
    replies: 28,
    category: "Academic Use Cases"
  },
  {
    id: 2,
    author: "Marcus Vance",
    role: "Content Director",
    avatar: "MV",
    title: "Best prompt engineering tips for the new AI Chat Writing Co-pilot",
    likes: 98,
    replies: 19,
    category: "Tips & Tricks"
  },
  {
    id: 3,
    author: "Dev Team",
    role: "Staff Engineer",
    avatar: "MP",
    title: "Feature Voting: Support for LaTeX and Markdown tables in paraphraser",
    likes: 312,
    replies: 84,
    category: "Feature Requests"
  }
];

export default function SupportModal({ initialTab = 'help', onClose, showToast }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'help');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Technical Support',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState(null);

  // Upvote Tracker for Community
  const [upvotes, setUpvotes] = useState({});

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast?.('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketNum = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicketId(ticketNum);
      showToast?.(`Support ticket ${ticketNum} opened successfully!`, 'success');
    }, 1000);
  };

  const handleUpvote = (postId) => {
    setUpvotes(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    showToast?.('Upvoted community topic!', 'info');
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

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 border-b border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'bg-[#027E6F] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Center & FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#027E6F] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'community'
                ? 'bg-[#027E6F] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Forum</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#027E6F] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect & Social</span>
          </button>
        </div>

        {/* Tab 1: Help Center & FAQs */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#1C1C1C]">
                  Metaphrase AI Knowledge Base
                </h3>
                <p className="text-xs text-gray-500">
                  Instant solutions, technical specifications, and user guides.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles & questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#027E6F] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-[#F9F9FB] hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-sm text-[#1C1C1C]">
                        {faq.q}
                      </h4>
                      <span className="text-[10px] uppercase font-bold bg-emerald-100 text-[#027E6F] px-2 py-0.5 rounded-full shrink-0">
                        {faq.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-gray-400">
                  No matching help articles found for "{searchQuery}". Try a different keyword or contact support.
                </div>
              )}
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Can't find what you're looking for?
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Our customer engineers respond in an average of 14 minutes.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('contact')}
                className="grammarly-green-btn px-4 py-2 text-xs font-bold cursor-pointer shrink-0"
              >
                Open Ticket
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Contact Support Form */}
        {activeTab === 'contact' && (
          <div>
            {submittedTicketId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#027E6F]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1C1C]">
                  Support Ticket Created!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Your ticket reference is <strong className="text-[#027E6F] font-mono">{submittedTicketId}</strong>. A confirmation email has been dispatched to <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmittedTicketId(null);
                    setFormData({ name: '', email: '', category: 'Technical Support', subject: '', message: '' });
                  }}
                  className="grammarly-green-btn px-6 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1C1C1C]">
                    Contact Metaphrase AI Support
                  </h3>
                  <p className="text-xs text-gray-500">
                    Submit your query, bug report, or enterprise RFP directly to our tier-3 engineering team.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#027E6F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#027E6F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Inquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#027E6F] bg-white cursor-pointer"
                    >
                      <option value="Technical Support">Technical Support & Bug Report</option>
                      <option value="Billing & Plans">Billing, Invoices & Pro Tier</option>
                      <option value="Enterprise RFP">Enterprise Security & Team Licensing</option>
                      <option value="Feature Request">New Feature or Linguistic Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief summary of your query"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#027E6F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue, expected behavior, or workflow requirement in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#027E6F]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="grammarly-green-btn px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Community Forum */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1C1C1C]">
                  Metaphrase AI Community
                </h3>
                <p className="text-xs text-gray-500">
                  Join 45,000+ writers, researchers, and engineers exchanging workflows.
                </p>
              </div>
              <button
                onClick={() => showToast?.('Community topic creation is open to verified accounts.', 'info')}
                className="grammarly-green-btn px-4 py-2 text-xs font-bold cursor-pointer"
              >
                + New Discussion
              </button>
            </div>

            {/* Discussions Feed */}
            <div className="space-y-3">
              {COMMUNITY_POSTS.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl border border-gray-200 bg-[#F9F9FB] hover:border-emerald-500/40 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {post.avatar}
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{post.author}</span>
                      <span className="text-[10px] text-gray-400">· {post.role}</span>
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{post.category}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1C1C1C] hover:text-[#027E6F] cursor-pointer">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <span>{post.replies} responses</span>
                      <span>·</span>
                      <span>Active 2h ago</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-[#027E6F] cursor-pointer shrink-0 min-w-[48px]"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold mt-0.5">
                      {post.likes + (upvotes[post.id] || 0)}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Connect & Social Channels */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#1C1C1C]">
                Official Channels & Social Ecosystem
              </h3>
              <p className="text-xs text-gray-500">
                Stay updated with weekly releases, research breakthroughs, and linguistic tutorials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-gray-200 bg-[#F9F9FB] hover:border-gray-900 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-3 font-bold text-base">
                    𝕏
                  </div>
                  <h4 className="font-bold text-sm text-[#1C1C1C] group-hover:text-black mb-1 flex items-center gap-1.5">
                    <span>Twitter / X</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </h4>
                  <p className="text-xs text-gray-500">
                    Product release announcements, engine updates, and real-time support.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#027E6F]">@MetaphraseAI</div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-gray-200 bg-[#F9F9FB] hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 font-bold text-base">
                    in
                  </div>
                  <h4 className="font-bold text-sm text-[#1C1C1C] group-hover:text-blue-600 mb-1 flex items-center gap-1.5">
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </h4>
                  <p className="text-xs text-gray-500">
                    Enterprise research papers, talent culture, and company milestone news.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-blue-600">Metaphrase AI Inc.</div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-gray-200 bg-[#F9F9FB] hover:border-red-600 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-3">
                    <Video className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1C1C1C] group-hover:text-red-600 mb-1 flex items-center gap-1.5">
                    <span>YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </h4>
                  <p className="text-xs text-gray-500">
                    Video masterclasses, academic paraphrasing breakdowns, and feature deep dives.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-red-600">Metaphrase Academy</div>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
