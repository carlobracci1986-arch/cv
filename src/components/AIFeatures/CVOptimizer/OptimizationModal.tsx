import React, { useState, useEffect } from 'react';
import { X, Lightbulb, GitCompare, Tag, Check } from 'lucide-react';
import { OptimizationChange, OptimizationResult } from '../../../types/ai.types';
import { DiffViewer } from './DiffViewer';
import { MatchScore } from './MatchScore';

interface Props {
  result: OptimizationResult;
  onApply: (changes: OptimizationChange[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

type Tab = 'changes' | 'suggestions' | 'keywords';

export const OptimizationModal: React.FC<Props> = ({
  result,
  onApply,
  onClose,
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('changes');
  const [changes, setChanges] = useState<OptimizationChange[]>(result.changes);

  // Sync changes when result updates
  useEffect(() => {
    setChanges(result.changes);
  }, [result.changes]);

  const handleToggleChange = (index: number) => {
    setChanges((prev) =>
      prev.map((c, i) => (i === index ? { ...c, accepted: !c.accepted } : c))
    );
  };

  const handleApply = () => {
    onApply(changes);
  };

  const acceptedCount = changes.filter((c) => c.accepted).length;

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'changes',
      label: 'Modifiche',
      icon: <GitCompare className="w-4 h-4" />,
      count: changes.length,
    },
    {
      id: 'suggestions',
      label: 'Suggerimenti',
      icon: <Lightbulb className="w-4 h-4" />,
      count: result.suggestions.length,
    },
    {
      id: 'keywords',
      label: 'Keywords',
      icon: <Tag className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-900">CV Ottimizzato</h2>
              <p className="text-xs text-gray-500">
                Rivedi le modifiche suggerite dall'AI e applicale al tuo CV
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Inline match score badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                result.matchScore >= 80
                  ? 'bg-green-100 text-green-700'
                  : result.matchScore >= 60
                  ? 'bg-yellow-100 text-yellow-700'
                  : result.matchScore >= 40
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              <span>{result.matchScore}%</span>
              <span className="text-xs font-normal opacity-70">match</span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'changes' && (
            <DiffViewer changes={changes} onToggleChange={handleToggleChange} />
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              {result.suggestions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">
                  Nessun suggerimento disponibile
                </p>
              ) : (
                result.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'keywords' && (
            <MatchScore
              score={result.matchScore}
              keywordsFound={result.keywordsFound}
              keywordsMissing={result.keywordsMissing}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleApply}
            disabled={acceptedCount === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Check className="w-4 h-4" />
            Applica Modifiche Selezionate
            {acceptedCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/25 text-xs font-bold">
                {acceptedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
