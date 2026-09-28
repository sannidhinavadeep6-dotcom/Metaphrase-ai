import React from 'react';
import { 
  Mail, 
  GraduationCap, 
  Share2, 
  Smile, 
  ListChecks, 
  ShieldCheck, 
  Megaphone,
  Sparkles
} from 'lucide-react';
import { sfx } from '../utils/audioUtils';

export const PRESETS = [
  {
    id: 'email',
    label: 'Email Polish',
    icon: Mail,
    instruction: 'Rewrite this into a courteous, polished, and actionable professional email with clear call-to-actions and warm sign-off.'
  },
  {
    id: 'academic',
    label: 'Academic Paper',
    icon: GraduationCap,
    instruction: 'Rewrite with scholarly rigor, advanced terminology, passive/formal constructions, and objective research prose suitable for peer-reviewed journals.'
  },
  {
    id: 'social',
    label: 'Viral Social / Thread',
    icon: Share2,
    instruction: 'Transform into a viral, high-engagement social media post or thread. Use compelling hooks, punchy short sentences, and engaging rhythm.'
  },
  {
    id: 'eli5',
    label: 'ELI5 (Simple)',
    icon: Smile,
    instruction: 'Explain this like I am 5 years old. Use intuitive analogies, simple everyday words, and clear illustrative explanations.'
  },
  {
    id: 'summary',
    label: 'Executive Summary',
    icon: ListChecks,
    instruction: 'Distill this into a high-impact executive summary with structured key takeaways and bullet points.'
  },
  {
    id: 'grammar',
    label: 'Fix Grammar Only',
    icon: ShieldCheck,
    instruction: 'Fix all grammar, spelling, punctuation, and typographical mistakes while strictly preserving the author\'s original vocabulary and voice.'
  },
  {
    id: 'persuasive',
    label: 'Persuasive Pitch',
    icon: Megaphone,
    instruction: 'Rewrite with high-converting persuasive rhetoric, powerful power verbs, urgency, and compelling psychological impact.'
  }
];

export default function PresetSelector({ activePreset, onSelectPreset }) {
  const handleClick = (preset) => {
    sfx.playClick();
    if (activePreset?.id === preset.id) {
      onSelectPreset(null);
    } else {
      onSelectPreset(preset);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Smart Goal Presets:
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = activePreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleClick(preset)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm font-bold scale-[1.02]'
                  : 'dual-tone-pill'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
