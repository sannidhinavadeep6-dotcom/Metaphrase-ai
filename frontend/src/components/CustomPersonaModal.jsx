import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Trash2, 
  Plus, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  FileCode, 
  PenTool, 
  Zap,
  Check
} from 'lucide-react';
import { createCustomPersona, deleteCustomPersona } from '../services/api';

const ICON_OPTIONS = [
  { key: 'sparkles', label: 'Sparkle', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { key: 'briefcase', label: 'Business', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { key: 'graduation-cap', label: 'Academic', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { key: 'shield', label: 'Legal/Security', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { key: 'pen', label: 'Creative', icon: <PenTool className="w-3.5 h-3.5" /> },
  { key: 'zap', label: 'Punchy', icon: <Zap className="w-3.5 h-3.5" /> },
  { key: 'code', label: 'Technical', icon: <FileCode className="w-3.5 h-3.5" /> },
  { key: 'book', label: 'Editorial', icon: <BookOpen className="w-3.5 h-3.5" /> }
];

export default function CustomPersonaModal({
  user,
  personas = [],
  onRefreshPersonas,
  onSelectPersona,
  onClose,
  onNotify
}) {
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('sparkles');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !instruction.trim()) {
      onNotify('Please provide both persona title and prompt instructions.', 'error');
      return;
    }
    if (!user?.email) {
      onNotify('Please sign in to save custom personas.', 'error');
      return;
    }

    setLoading(true);
    try {
      await createCustomPersona(user.email, title, instruction, selectedIcon);
      onNotify(`Custom persona "${title}" created!`, 'success');
      setTitle('');
      setInstruction('');
      onRefreshPersonas();
    } catch (err) {
      onNotify(err.message || 'Failed to save custom persona.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, personaTitle) => {
    if (!window.confirm(`Delete persona "${personaTitle}"?`)) return;
    try {
      await deleteCustomPersona(id, user.email);
      onNotify('Persona deleted.', 'info');
      onRefreshPersonas();
    } catch (err) {
      onNotify(err.message || 'Failed to delete persona.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111625]/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6E6E9] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-gray-100 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[#1C1C1C]">Custom Writing Personas</h3>
            <p className="text-xs sm:text-sm text-[#646B81]">Define specialized rewrite rules (e.g. Legal Disclaimer, Marketing Pitch, Executive Brief)</p>
          </div>
        </div>

        {/* Create Persona Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-8 bg-[#F9F9FB] p-5 sm:p-6 rounded-2xl border border-gray-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#027E6F]" />
            <span>Create New Persona</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] mb-1.5">
              Persona Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Corporate Marketing Copy, Legal Disclaimer, Technical Memo"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] mb-1.5">
              Custom AI Instructions & Style Rules
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Describe how the AI should rewrite the text (e.g. 'Use persuasive, energetic corporate marketing terminology with crisp takeaways...')"
              className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#027E6F] focus:ring-2 focus:ring-[#027E6F]/20 resize-none transition-all shadow-2xs"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] mb-2">
              Select Badge Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setSelectedIcon(opt.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedIcon === opt.key
                      ? 'bg-[#027E6F] text-white border-[#027E6F] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="grammarly-green-btn flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Custom Persona'}</span>
            </button>
          </div>
        </form>

        {/* Existing Personas List */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3.5">
            Your Saved Personas ({personas.length})
          </div>

          {personas.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl bg-[#F9F9FB] border border-dashed border-gray-200 text-gray-500 text-xs sm:text-sm">
              No custom personas defined yet. Create your first tailored writing style above!
            </div>
          ) : (
            <div className="space-y-3">
              {personas.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E6F5F2] text-[#027E6F] border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1C1C]">{p.title}</h4>
                      <p className="text-xs text-[#646B81] mt-1 leading-relaxed line-clamp-2">{p.instruction}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectPersona(p);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#E6F5F2] hover:bg-[#027E6F] text-[#027E6F] hover:text-white font-bold text-xs border border-emerald-200 transition-all cursor-pointer"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete persona"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
