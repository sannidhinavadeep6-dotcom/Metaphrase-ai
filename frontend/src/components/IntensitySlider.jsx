import React from 'react';
import { Sliders } from 'lucide-react';
import { sfx } from '../utils/audioUtils';

const LEVELS = [
  { value: 1, label: 'Conservative', desc: 'Minimal edits, keeps exact structure' },
  { value: 2, label: 'Balanced', desc: 'Optimal fluency & clarity (Recommended)' },
  { value: 3, label: 'Creative', desc: 'Enriched vocabulary & varied syntax' },
  { value: 4, label: 'Radical', desc: 'Complete sentence restructuring' },
];

export default function IntensitySlider({ intensity, setIntensity }) {
  const current = LEVELS.find((l) => l.value === intensity) || LEVELS[1];

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    sfx.playClick();
    setIntensity(val);
  };

  return (
    <div className="dual-tone-card rounded-xl p-3.5 flex flex-col gap-2 shadow-xs">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
          <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Rewrite Intensity:</span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          {current.label}
        </span>
      </div>

      <div className="relative pt-1">
        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={intensity}
          onChange={handleChange}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Creative</span>
          <span>Radical</span>
        </div>
      </div>
    </div>
  );
}
