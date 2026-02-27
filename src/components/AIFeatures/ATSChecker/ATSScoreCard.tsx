import React from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { ATSScoreResult } from '../../../types/ai.types';

interface Props {
  result: ATSScoreResult;
  onRefresh?: () => void;
}

interface LevelConfig {
  label: string;
  color: string;
  textColor: string;
  arcColor: string;
  bgColor: string;
  borderColor: string;
}

function getLevelConfig(level: ATSScoreResult['level']): LevelConfig {
  switch (level) {
    case 'excellent':
      return {
        label: 'Eccellente',
        color: '#22c55e',
        textColor: 'text-green-600',
        arcColor: '#22c55e',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    case 'good':
      return {
        label: 'Buono',
        color: '#eab308',
        textColor: 'text-yellow-600',
        arcColor: '#eab308',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    case 'needs_improvement':
      return {
        label: 'Da Migliorare',
        color: '#f97316',
        textColor: 'text-orange-600',
        arcColor: '#f97316',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      };
    case 'poor':
    default:
      return {
        label: 'Scarso',
        color: '#ef4444',
        textColor: 'text-red-600',
        arcColor: '#ef4444',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
  }
}

/**
 * Semicircular gauge using an SVG arc.
 * The gauge spans from 180deg (left) to 0deg (right), i.e. the top half of a circle.
 */
function SemiGauge({ score, color }: { score: number; color: string }) {
  const cx = 80;
  const cy = 80;
  const r = 62;

  // Helper: point on circle at angle (radians, measured from right = 0)
  const polarToCartesian = (angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  // Semicircle goes from 180° (left) counter-clockwise to 0° (right) = the upper half
  // In SVG coords: 180° = π (left), 0° = 0 (right)
  // We want to fill from left (π) rightward by (score/100)*π
  const startAngle = Math.PI; // left
  const endAngle = 0; // right
  const fillEndAngle = Math.PI - (score / 100) * Math.PI;

  const trackStart = polarToCartesian(startAngle);
  const trackEnd = polarToCartesian(endAngle);
  const fillEnd = polarToCartesian(fillEndAngle);

  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`;
  const fillPath =
    score === 0
      ? ''
      : `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${fillEnd.x} ${fillEnd.y}`;

  return (
    <svg width="160" height="90" viewBox="0 0 160 90" aria-hidden="true">
      {/* Track */}
      <path
        d={trackPath}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Fill */}
      {score > 0 && (
        <path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      )}
    </svg>
  );
}

export const ATSScoreCard: React.FC<Props> = ({ result, onRefresh }) => {
  const config = getLevelConfig(result.level);
  const totalIssues = result.issues.length;
  const passedCount = result.passedChecks.length;
  const criticalCount = result.issues.filter((i) => i.severity === 'critical').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Top section with gauge */}
      <div className={`px-6 pt-6 pb-4 ${config.bgColor} border-b ${config.borderColor}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-gray-900">Punteggio ATS</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Compatibilità con i sistemi di selezione automatica
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Aggiorna Analisi
            </button>
          )}
        </div>

        {/* Gauge + score */}
        <div className="flex flex-col items-center -mt-1">
          <div className="relative">
            <SemiGauge score={result.score} color={config.arcColor} />
            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
              <span className={`text-4xl font-extrabold leading-none ${config.textColor}`}>
                {result.score}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
            </div>
          </div>
          <span
            className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="flex flex-col items-center py-4 px-3">
          <span className="text-2xl font-bold text-green-600">{passedCount}</span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Controlli superati</span>
        </div>
        <div className="flex flex-col items-center py-4 px-3">
          <span className="text-2xl font-bold text-gray-700">{totalIssues}</span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Problemi trovati</span>
        </div>
        <div className="flex flex-col items-center py-4 px-3">
          <span
            className={`text-2xl font-bold ${
              criticalCount > 0 ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            {criticalCount}
          </span>
          <span className="text-xs text-gray-500 mt-0.5 text-center">Critici</span>
        </div>
      </div>

      {/* Quick summary */}
      <div className="px-5 py-4">
        {criticalCount > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              {criticalCount} problema{criticalCount > 1 ? 'i critici' : ' critico'} rilevat
              {criticalCount > 1 ? 'i' : 'o'}. Correggili per migliorare significativamente il punteggio.
            </p>
          </div>
        )}
        {passedCount > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-100">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">
              {passedCount} element{passedCount > 1 ? 'i' : 'o'} del CV{' '}
              {passedCount > 1 ? 'soddisfano' : 'soddisfa'} i criteri ATS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
