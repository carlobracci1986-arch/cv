import React from 'react';
import { CheckCheck, X, Info } from 'lucide-react';
import { OptimizationChange } from '../../../types/ai.types';

interface Props {
  changes: OptimizationChange[];
  onToggleChange: (index: number) => void;
}

export const DiffViewer: React.FC<Props> = ({ changes, onToggleChange }) => {
  const acceptedCount = changes.filter((c) => c.accepted).length;

  const handleAcceptAll = () => {
    changes.forEach((_, i) => {
      if (!changes[i].accepted) onToggleChange(i);
    });
  };

  const handleRejectAll = () => {
    changes.forEach((_, i) => {
      if (changes[i].accepted) onToggleChange(i);
    });
  };

  if (changes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Info className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Nessuna modifica suggerita</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{acceptedCount}</span> di{' '}
          <span className="font-semibold text-gray-700">{changes.length}</span> modifiche accettate
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleAcceptAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Accetta Tutte
          </button>
          <button
            onClick={handleRejectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Rifiuta Tutte
          </button>
        </div>
      </div>

      {/* Changes list */}
      <div className="space-y-3">
        {changes.map((change, index) => (
          <div
            key={index}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              change.accepted
                ? 'border-green-200 bg-green-50/30'
                : 'border-gray-200 bg-white opacity-70'
            }`}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white/60">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex-shrink-0">
                  {change.section}
                </span>
                <span className="text-xs text-gray-400 truncate">{change.field}</span>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => onToggleChange(index)}
                aria-label={change.accepted ? 'Rifiuta modifica' : 'Accetta modifica'}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  change.accepted
                    ? 'bg-green-500 focus:ring-green-400'
                    : 'bg-gray-300 focus:ring-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    change.accepted ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Diff content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Before */}
              <div className="p-3">
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wide block mb-1.5">
                  Prima
                </span>
                <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 line-through decoration-red-300 leading-relaxed">
                  {change.before || <span className="italic text-red-400 no-underline">Vuoto</span>}
                </p>
              </div>
              {/* After */}
              <div className="p-3">
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wide block mb-1.5">
                  Dopo
                </span>
                <p className="text-sm text-green-800 bg-green-50 rounded-lg px-3 py-2 leading-relaxed">
                  {change.after}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="flex items-start gap-2 px-4 py-2.5 bg-amber-50/60 border-t border-amber-100">
              <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">{change.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
