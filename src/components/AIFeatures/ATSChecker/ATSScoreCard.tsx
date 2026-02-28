import React from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
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
      {(passedCount > 0 || totalIssues > 0) && (
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          <div className="flex flex-col items-center py-4 px-3">
            <span className="text-2xl font-bold text-green-600">{passedCount}</span>
            <span className="text-xs text-gray-500 mt-0.5 text-center">Elementi OK</span>
          </div>
          <div className="flex flex-col items-center py-4 px-3">
            <span className="text-2xl font-bold text-orange-600">{totalIssues}</span>
            <span className="text-xs text-gray-500 mt-0.5 text-center">Da Migliorare</span>
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
      )}

      {/* Improvements section */}
      <div className="px-5 py-4">
        {totalIssues > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Miglioramenti consigliati
            </h4>
            <div className="space-y-2">
              {result.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3 rounded-lg border text-xs ${
                    issue.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : issue.severity === 'warning'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {issue.severity === 'critical' && (
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    {issue.severity === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    )}
                    {issue.severity === 'info' && (
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          issue.severity === 'critical'
                            ? 'text-red-900'
                            : issue.severity === 'warning'
                            ? 'text-orange-900'
                            : 'text-blue-900'
                        }`}
                      >
                        {issue.message}
                      </p>
                      {issue.suggestion && (
                        <p
                          className={`mt-1 ${
                            issue.severity === 'critical'
                              ? 'text-red-700'
                              : issue.severity === 'warning'
                              ? 'text-orange-700'
                              : 'text-blue-700'
                          }`}
                        >
                          💡 {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-100">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-green-900">CV eccellente!</p>
              <p className="text-xs text-green-700 mt-0.5">
                Il tuo CV è perfettamente ottimizzato per i sistemi ATS.
              </p>
            </div>
          </div>
        )}

        {/* Keywords section */}
        {(result.keywordsPresent?.length > 0 || result.keywordsMissing?.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {result.keywordsMissing && result.keywordsMissing.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Keywords mancanti dalla job description:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsMissing.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.keywordsPresent && result.keywordsPresent.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Keywords presenti:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsPresent.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
