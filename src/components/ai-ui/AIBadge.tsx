import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  variant?: 'header' | 'section' | 'inline';
  label?: string;
}

export const AIBadge: React.FC<Props> = ({ variant = 'header', label }) => {
  if (variant === 'section') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
        <Sparkles className="w-3 h-3" />
        {label || 'Ottimizzabile con IA'}
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600">
        <Sparkles className="w-3 h-3" />
        {label || 'IA'}
      </span>
    );
  }

  // variant === 'header'
  return (
    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200">
      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
      <span className="text-xs font-semibold text-purple-700">Potenziato da IA</span>
    </div>
  );
};
