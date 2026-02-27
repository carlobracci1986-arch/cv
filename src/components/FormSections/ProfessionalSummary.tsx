import React from 'react';
import { Lightbulb } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const MAX_CHARS = 600;

export const ProfessionalSummary: React.FC<Props> = ({ value, onChange }) => {
  const count = value.length;

  const counterColorClass =
    count >= 500
      ? 'text-red-500'
      : count >= 400
      ? 'text-yellow-500'
      : 'text-green-600';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <textarea
          id="professional-summary"
          value={value}
          onChange={handleChange}
          rows={5}
          maxLength={MAX_CHARS}
          placeholder="Scrivi un breve profilo professionale che descriva le tue competenze chiave, anni di esperienza e obiettivi professionali..."
          aria-label="Profilo professionale"
          aria-describedby="summary-counter summary-tip"
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[5rem]"
        />

        {/* Character counter */}
        <div
          id="summary-counter"
          className="absolute bottom-2 right-3 flex items-center gap-1 pointer-events-none select-none"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={`text-xs font-medium tabular-nums ${counterColorClass}`}>
            {count}
          </span>
          <span className="text-xs text-gray-400">/ {MAX_CHARS}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={MAX_CHARS}
          aria-label={`${count} di ${MAX_CHARS} caratteri`}
          style={{ width: `${Math.min((count / MAX_CHARS) * 100, 100)}%` }}
          className={[
            'h-full rounded-full transition-all duration-300',
            count >= 500
              ? 'bg-red-500'
              : count >= 400
              ? 'bg-yellow-400'
              : 'bg-green-500',
          ].join(' ')}
        />
      </div>

      {/* Tip box */}
      <div
        id="summary-tip"
        className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm text-blue-700"
        role="note"
      >
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-blue-500" />
        <span>
          <strong className="font-semibold">Consiglio:</strong> mantieni il profilo tra{' '}
          <span className="font-medium">100&ndash;200 parole</span> per ottimale visibilit&agrave; ATS
        </span>
      </div>
    </div>
  );
};
