import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Wand2, 
  BookOpen, 
  ArrowRight,
  Bot,
  User
} from 'lucide-react';
import { sendChatMessage } from '../../services/api';

export default function AiChatTool({ user, showToast }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your Metaphrase AI Writing Co-Pilot. How can I assist you with your draft today? You can ask me to rephrase sentences, critique tone, suggest vibrant synonyms, or structure arguments."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await sendChatMessage(newMessages, '', user?.email);
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      showToast?.(err.message || 'Chat assistant error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    showToast?.('Copied message to clipboard!', 'info');
  };

  const quickPrompts = [
    "Make my paragraph sound more persuasive and executive.",
    "Give me 5 punchy opening hooks for a research paper on AI ethics.",
    "Rewrite this email to sound polite but firm about deadline delivery.",
    "Critique my text for passive voice and wordiness."
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 mb-3 shadow-2xs">
          <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">+</div>
          <span>Interactive AI Writing Co-Pilot</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Chat & Collaborate with AI
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Brainstorm headlines, rewrite awkward sentences, and receive real-time color-guided editorial recommendations.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden flex flex-col h-[600px] max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-teal-100 bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-teal-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#1C1C1C] flex items-center gap-2">
                <span>Metaphrase AI Co-Pilot</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Ready to assist & rephrase drafts</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMessages([
              {
                role: 'assistant',
                content: "How can I assist your writing today? Feel free to paste a passage or request a specific tone shift."
              }
            ])}
            className="p-2 text-gray-500 hover:text-teal-700 rounded-full hover:bg-teal-100/60 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/30 to-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-gray-800 text-white'
                  : 'bg-teal-100 text-teal-800 border border-teal-300'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-tr-xs shadow-md font-medium'
                  : 'bg-white text-[#1C1C1C] border border-teal-100/80 rounded-tl-xs shadow-sm ring-1 ring-black/5'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-100">
                    <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Metaphrase Editorial Intelligence</span>
                    </span>
                    <button
                      onClick={() => handleCopyMessage(idx, msg.content)}
                      className="text-[11px] text-gray-500 hover:text-teal-700 flex items-center gap-1 cursor-pointer font-semibold px-2 py-0.5 rounded hover:bg-teal-50 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 border border-teal-300 flex items-center justify-center text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-teal-50/80 border border-teal-200 p-3.5 rounded-2xl text-xs text-teal-900 flex items-center gap-2 shadow-2xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                <span>Metaphrase AI is analyzing & crafting suggestions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Row */}
        {messages.length <= 2 && (
          <div className="px-6 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(p)}
                className="text-xs bg-white text-gray-700 hover:text-teal-800 hover:border-teal-400 hover:bg-teal-50/50 border border-gray-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer shadow-2xs font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E6E6E9] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Metaphrase AI to rewrite, refine, or critique your text..."
              className="flex-1 bg-[#F9F9FB] border border-gray-300 rounded-full px-5 py-3 text-sm text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-teal-600 hover:bg-teal-700 text-white w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm disabled:opacity-40 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
