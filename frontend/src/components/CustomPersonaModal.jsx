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
  Zap 
} from 'lucide-react';
import { createCustomPersona, deleteCustomPersona } from '../services/api';

const ICON_OPTIONS = [
  { key: 'sparkles', label: 'Sparkle', icon: <Sparkles className="w-4 h-4" /> },
  { key: 'briefcase', label: 'Business', icon: <Briefcase className="w-4 h-4" /> },
  { key: 'graduation-cap', label: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
  { key: 'shield', label: 'Legal/Security', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'pen', label: 'Creative', icon: <PenTool className="w-4 h-4" /> },
  { key: 'zap', label: 'Punchy', icon: <Zap className="w-4 h-4" /> },
  { key: 'code', label: 'Technical', icon: <FileCode className="w-4 h-4" /> },
  { key: 'book', label: 'Editorial', icon: <BookOpen className="w-4 h-4" /> }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Custom Writing Personas</h3>
              <p className="text-xs text-slate-500">Define specialized rules (e.g. Legal Disclaimer, Marketing Pitch)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Persona Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-8 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-600" />
            Create New Persona
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Persona Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Corporate Marketing Copy, Legal Disclaimer, Technical Memo"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom AI Instructions & Style Rules
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Describe how the AI should rewrite the text (e.g. 'Use persuasive, energetic corporate marketing terminology with bulleted value propositions...')"
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium resize-none"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Badge Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setSelectedIcon(opt.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedIcon === opt.key
                      ? 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Custom Persona'}</span>
            </button>
          </div>
        </form>

        {/* Existing Personas List */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Your Saved Personas ({personas.length})
          </div>

          {personas.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No custom personas defined yet. Create your first tailored writing style above!
            </div>
          ) : (
            <div className="space-y-3">
              {personas.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{p.instruction}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectPersona(p);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-all cursor-pointer"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
