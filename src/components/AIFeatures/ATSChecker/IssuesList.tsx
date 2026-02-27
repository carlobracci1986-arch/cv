import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import { ATSIssue } from '../../../types/ai.types';

interface Props {
  issues: ATSIssue[];
  passedChecks: string[];
  onAutoFix?: (issueId: string) => void;
}

interface SeverityConfig {
  label: string;
  icon: React.ReactNode;
  badgeClass: string;
  cardClass: string;
  borderClass: string;
  dotClass: string;
}

function getSeverityConfig(severity: ATSIssue['severity']): SeverityConfig {
  switch (severity) {
    case 'critical':
      return {
        label: 'Critico',
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        badgeClass: 'bg-red-100 text-red-700 border-red-200',
        cardClass: 'bg-red-50/50 border-red-200',
        borderClass: 'border-red-200',
        dotClass: 'bg-red-500',
      };
    case 'warning':
      return {
        label: 'Avviso',
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        cardClass: 'bg-yellow-50/50 border-yellow-200',
        borderClass: 'border-yellow-200',
        dotClass: 'bg-yellow-400',
      };
    case 'info':
    default:
      return {
        label: 'Info',
        icon: <Info className="w-4 h-4 text-blue-400" />,
        badgeClass: 'bg-blue-50 text-blue-600 border-blue-200',
        cardClass: 'bg-blue-50/30 border-blue-100',
        borderClass: 'border-blue-100',
        dotClass: 'bg-blue-400',
      };
  }
}

interface IssueGroupProps {
  severity: ATSIssue['severity'];
  issues: ATSIssue[];
  onAutoFix?: (issueId: string) => void;
}

const IssueGroup: React.FC<IssueGroupProps> = ({ severity, issues, onAutoFix }) => {
  const config = getSeverityConfig(severity);

  return (
    <div className="mb-5">
      {/* Group header */}
      <div className="flex items-center gap-2 mb-2">
        {config.icon}
        <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${config.badgeClass}`}>
          {config.label}
        </span>
        <span className="text-xs text-gray-400">({issues.length})</span>
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`rounded-xl border p-4 ${config.cardClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${config.dotClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {issue.message}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      {issue.category}
                    </span>
                  </div>
                </div>
              </div>
              {issue.autoFixable && onAutoFix && (
                <button
                  onClick={() => onAutoFix(issue.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors flex-shrink-0"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Correggi Auto
                </button>
              )}
            </div>

            {/* Suggestion */}
            <div className="mt-2.5 ml-4 pl-2 border-l-2 border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">{issue.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IssuesList: React.FC<Props> = ({ issues, passedChecks, onAutoFix }) => {
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const warningIssues = issues.filter((i) => i.severity === 'warning');
  const infoIssues = issues.filter((i) => i.severity === 'info');

  const hasIssues = issues.length > 0;
  const hasPassedChecks = passedChecks.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Analisi Dettagliata</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {issues.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-medium">
              {issues.length} problemi
            </span>
          )}
          {passedChecks.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium">
              {passedChecks.length} superati
            </span>
          )}
        </div>
      </div>

      {!hasIssues && !hasPassedChecks && (
        <p className="text-sm text-gray-400 text-center py-8">
          Nessun risultato disponibile
        </p>
      )}

      {/* Issues grouped by severity */}
      {criticalIssues.length > 0 && (
        <IssueGroup severity="critical" issues={criticalIssues} onAutoFix={onAutoFix} />
      )}
      {warningIssues.length > 0 && (
        <IssueGroup severity="warning" issues={warningIssues} onAutoFix={onAutoFix} />
      )}
      {infoIssues.length > 0 && (
        <IssueGroup severity="info" issues={infoIssues} onAutoFix={onAutoFix} />
      )}

      {/* Passed checks */}
      {hasPassedChecks && (
        <div>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-200">
              Superati
            </span>
            <span className="text-xs text-gray-400">({passedChecks.length})</span>
          </div>
          <ul className="space-y-1.5">
            {passedChecks.map((check, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-green-50/60 border border-green-100"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-800">{check}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
