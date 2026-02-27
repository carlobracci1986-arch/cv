import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  MessageSquare,
  Brain,
  HelpCircle,
  TrendingUp,
  Filter,
} from 'lucide-react';
import {
  InterviewQuestion,
  InterviewQuestionType,
  InterviewDifficulty,
  InterviewProbability,
} from '../../../types/ai.types';

interface Props {
  questions: InterviewQuestion[];
}

// ---- Label helpers ----

const typeLabels: Record<InterviewQuestionType, string> = {
  behavioral: 'Comportamentale',
  technical: 'Tecnica',
  motivational: 'Motivazionale',
  situational: 'Situazionale',
  weakness: 'Punti Deboli',
};

const typeIcons: Record<InterviewQuestionType, React.ReactNode> = {
  behavioral: <MessageSquare className="w-3.5 h-3.5" />,
  technical: <Brain className="w-3.5 h-3.5" />,
  motivational: <TrendingUp className="w-3.5 h-3.5" />,
  situational: <Target className="w-3.5 h-3.5" />,
  weakness: <HelpCircle className="w-3.5 h-3.5" />,
};

const typeColors: Record<InterviewQuestionType, string> = {
  behavioral: 'bg-blue-100 text-blue-700 border-blue-200',
  technical: 'bg-purple-100 text-purple-700 border-purple-200',
  motivational: 'bg-green-100 text-green-700 border-green-200',
  situational: 'bg-orange-100 text-orange-700 border-orange-200',
  weakness: 'bg-gray-100 text-gray-700 border-gray-200',
};

const difficultyLabels: Record<InterviewDifficulty, string> = {
  low: 'Facile',
  medium: 'Media',
  high: 'Difficile',
};

const difficultyColors: Record<InterviewDifficulty, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const probabilityLabels: Record<InterviewProbability, string> = {
  low: 'Bassa',
  medium: 'Media',
  high: 'Alta',
};

const probabilityColors: Record<InterviewProbability, { badge: string; dot: string }> = {
  high: { badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  medium: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  low: { badge: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
};

// ---- Question card ----

interface QuestionCardProps {
  question: InterviewQuestion;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [expanded, setExpanded] = useState(false);
  const probColors = probabilityColors[question.probability];

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Card header — always visible */}
      <button
        className="w-full flex items-start gap-3 px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* Probability dot */}
        <span
          className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${probColors.dot}`}
          title={`Probabilità: ${probabilityLabels[question.probability]}`}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {question.question}
          </p>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {/* Type */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[question.type]}`}
            >
              {typeIcons[question.type]}
              {typeLabels[question.type]}
            </span>
            {/* Difficulty */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[question.difficulty]}`}
            >
              {difficultyLabels[question.difficulty]}
            </span>
            {/* Probability */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${probColors.badge}`}
            >
              <TrendingUp className="w-3 h-3" />
              Prob. {probabilityLabels[question.probability]}
            </span>
          </div>
        </div>

        <span className="flex-shrink-0 text-gray-400 mt-0.5">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-4">
          {/* Suggested answer */}
          {question.suggestedAnswer && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Risposta suggerita
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg px-4 py-3 border border-gray-200">
                {question.suggestedAnswer}
              </p>
            </div>
          )}

          {/* Key points */}
          {question.keyPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Punti chiave
              </h4>
              <ul className="space-y-1">
                {question.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {kp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {question.tips.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Consigli
              </h4>
              <ul className="space-y-1.5">
                {question.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---- Main component ----

const ALL = 'all' as const;
type TypeFilter = InterviewQuestionType | typeof ALL;
type DifficultyFilter = InterviewDifficulty | typeof ALL;

export const QuestionsList: React.FC<Props> = ({ questions }) => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(ALL);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(ALL);

  const allTypes = useMemo(
    () => Array.from(new Set(questions.map((q) => q.type))),
    [questions]
  );

  const allDifficulties = useMemo(
    () => Array.from(new Set(questions.map((q) => q.difficulty))),
    [questions]
  );

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (typeFilter === ALL || q.type === typeFilter) &&
          (difficultyFilter === ALL || q.difficulty === difficultyFilter)
      ),
    [questions, typeFilter, difficultyFilter]
  );

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <HelpCircle className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Nessuna domanda disponibile</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />

        {/* Type filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 mr-1">Tipo:</span>
          <button
            onClick={() => setTypeFilter(ALL)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
              typeFilter === ALL
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Tutti
          </button>
          {allTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                typeFilter === t
                  ? typeColors[t]
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-gray-300" />

        {/* Difficulty filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 mr-1">Difficoltà:</span>
          <button
            onClick={() => setDifficultyFilter(ALL)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
              difficultyFilter === ALL
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Tutte
          </button>
          {allDifficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                difficultyFilter === d
                  ? difficultyColors[d]
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {difficultyLabels[d]}
            </button>
          ))}
        </div>

        {/* Count */}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} di {questions.length} domande
        </span>
      </div>

      {/* Questions */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Nessuna domanda corrisponde ai filtri selezionati</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
};
