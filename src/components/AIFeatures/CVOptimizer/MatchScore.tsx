import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  score: number;
  keywordsFound: string[];
  keywordsMissing: string[];
}

function getScoreColor(score: number): {
  stroke: string;
  text: string;
  bg: string;
  label: string;
} {
  if (score >= 80) {
    return {
      stroke: '#22c55e',
      text: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Ottimo',
    };
  }
  if (score >= 60) {
    return {
      stroke: '#eab308',
      text: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: 'Buono',
    };
  }
  if (score >= 40) {
    return {
      stroke: '#f97316',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      label: 'Discreto',
    };
  }
  return {
    stroke: '#ef4444',
    text: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Da Migliorare',
  };
}

export const MatchScore: React.FC<Props> = ({
  score,
  keywordsFound,
  keywordsMissing,
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const colors = getScoreColor(clampedScore);

  // SVG ring parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Circular progress */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36">
          <svg
            className="w-36 h-36 -rotate-90"
            viewBox="0 0 128 128"
            aria-label={`Match score: ${clampedScore}%`}
          >
            {/* Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${colors.text}`}>
              {clampedScore}%
            </span>
            <span className={`text-xs font-semibold mt-0.5 ${colors.text}`}>
              {colors.label}
            </span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-gray-700">Match Score</p>
          <p className="text-xs text-gray-400">corrispondenza con l'offerta</p>
        </div>
      </div>

      {/* Keywords found */}
      {keywordsFound.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700">
              Keywords trovate{' '}
              <span className="text-green-600">({keywordsFound.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordsFound.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords missing */}
      {keywordsMissing.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700">
              Keywords mancanti{' '}
              <span className="text-red-500">({keywordsMissing.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywordsMissing.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {keywordsFound.length === 0 && keywordsMissing.length === 0 && (
        <p className="text-sm text-gray-400 text-center">
          Nessuna keyword analizzata
        </p>
      )}
    </div>
  );
};
