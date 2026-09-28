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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F5F2] text-[#027E6F] mb-3">
          <div className="w-4 h-4 rounded bg-[#027E6F] text-white flex items-center justify-center text-[10px] font-bold">+</div>
          <span>Interactive AI Writing Co-Pilot</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight mb-2">
          Chat & Collaborate with AI
        </h1>
        <p className="text-sm sm:text-base text-[#646B81]">
          Brainstorm headlines, rewrite awkward sentences, and receive real-time editorial guidance for any document.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-[#E6E6E9] shadow-xl overflow-hidden flex flex-col h-[600px] max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#E6E6E9] bg-[#F9F9FB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#027E6F] text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <div>
              <div className="font-bold text-sm text-[#1C1C1C]">Metaphrase Writing Assistant</div>
              <div className="text-[11px] text-[#027E6F] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#027E6F] animate-pulse"></span>
                <span>Active & Ready</span>
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
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-gray-800 text-white'
                  : 'bg-[#E6F5F2] text-[#027E6F] border border-emerald-200'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#027E6F] text-white rounded-tr-xs'
                  : 'bg-[#F9F9FB] text-[#1C1C1C] border border-gray-200 rounded-tl-xs shadow-2xs'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-200/60">
                    <button
                      onClick={() => handleCopyMessage(idx, msg.content)}
                      className="text-[11px] text-gray-500 hover:text-[#027E6F] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-[#027E6F]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E6F5F2] text-[#027E6F] border border-emerald-200 flex items-center justify-center text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#F9F9FB] border border-gray-200 p-3.5 rounded-2xl text-xs text-[#646B81] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#027E6F] animate-spin" />
                <span>Metaphrase AI is typing suggestions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Row */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 bg-[#F9F9FB] border-t border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(p)}
                className="text-xs bg-white text-gray-700 hover:text-[#027E6F] hover:border-emerald-300 border border-gray-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
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
              className="flex-1 bg-[#F9F9FB] border border-gray-300 rounded-full px-5 py-3 text-sm text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="grammarly-green-btn w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
