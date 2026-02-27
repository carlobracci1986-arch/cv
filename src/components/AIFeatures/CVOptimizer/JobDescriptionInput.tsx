import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

interface Props {
  jobDescription: string;
  onChange: (jd: string) => void;
  onOptimize: () => void;
  isLoading: boolean;
}

export const JobDescriptionInput: React.FC<Props> = ({
  jobDescription,
  onChange,
  onOptimize,
  isLoading,
}) => {
  const maxChars = 5000;
  const charCount = jobDescription.length;
  const charPercentage = Math.min((charCount / maxChars) * 100, 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Descrizione del lavoro
          </h3>
          <p className="text-sm text-gray-500">
            Incolla l'offerta di lavoro per ottimizzare il CV
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          maxLength={maxChars}
          disabled={isLoading}
          placeholder="Incolla qui la descrizione del lavoro o l'offerta di impiego. L'AI analizzerà le parole chiave e ottimizzerà il tuo CV per massimizzare le possibilità di successo..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={`text-xs font-medium tabular-nums ${
              charCount > maxChars * 0.9
                ? 'text-orange-500'
                : 'text-gray-400'
            }`}
          >
            {charCount.toLocaleString('it-IT')} / {maxChars.toLocaleString('it-IT')}
          </span>
        </div>
      </div>

      {charCount > 0 && (
        <div className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              charPercentage > 90
                ? 'bg-orange-400'
                : charPercentage > 60
                ? 'bg-blue-400'
                : 'bg-blue-300'
            }`}
            style={{ width: `${charPercentage}%` }}
          />
        </div>
      )}

      {isLoading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              Analisi in corso...
            </span>
            <span className="text-xs text-gray-400">Attendere prego</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-progress-bar" />
          </div>
          <style>{`
            @keyframes progressBar {
              0% { width: 10%; margin-left: 0%; }
              50% { width: 60%; margin-left: 20%; }
              100% { width: 10%; margin-left: 90%; }
            }
            .animate-progress-bar {
              animation: progressBar 1.6s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          L'analisi considera parole chiave, competenze richieste e struttura del CV.
        </p>
        <button
          onClick={onOptimize}
          disabled={isLoading || jobDescription.trim().length < 20}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-sm hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? 'Ottimizzazione...' : 'Ottimizza CV con AI'}
        </button>
      </div>
    </div>
  );
};
