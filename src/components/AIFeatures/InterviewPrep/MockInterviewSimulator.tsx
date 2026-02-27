import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronRight,
  SkipForward,
  CheckCircle,
  Clock,
  MessageSquare,
  Lightbulb,
  Target,
  BarChart3,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { InterviewQuestion } from '../../../types/ai.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  questions: InterviewQuestion[];
  jobDescription: string;
  onComplete: (answers: { questionId: string; answer: string }[]) => void;
  onClose: () => void;
}

interface AnswerRecord {
  questionId: string;
  answer: string;
}

type Screen = 'question' | 'results';

const SECONDS_PER_QUESTION = 30;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomScore(): number {
  return Math.floor(Math.random() * 31) + 60; // 60–90
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 70) return 'text-amber-600';
  return 'text-red-500';
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Eccellente';
  if (score >= 75) return 'Buono';
  if (score >= 65) return 'Nella media';
  return 'Da migliorare';
}

function scoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200';
  if (score >= 70) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

// ---------------------------------------------------------------------------
// Countdown ring (SVG)
// ---------------------------------------------------------------------------

interface CountdownRingProps {
  seconds: number;
  total: number;
}

const CountdownRing: React.FC<CountdownRingProps> = ({ seconds, total }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const fraction = seconds / total;
  const dashOffset = circumference * (1 - fraction);

  let strokeColor = '#2563eb';
  if (fraction <= 0.33) strokeColor = '#dc2626';
  else if (fraction <= 0.6) strokeColor = '#d97706';

  return (
    <div className="relative inline-flex items-center justify-center w-14 h-14 flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span className={`text-sm font-bold tabular-nums ${seconds <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
        {seconds}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
  accentColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const pct = Math.round(((current - 1) / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 font-medium">
          Domanda {current} di {total}
        </span>
        <span className="text-xs text-gray-400">{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Difficulty / type badges (reuse palette from QuestionsList)
// ---------------------------------------------------------------------------

const difficultyBadge: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};
const difficultyLabel: Record<string, string> = {
  low: 'Facile',
  medium: 'Media',
  high: 'Difficile',
};
const typeBadge: Record<string, string> = {
  behavioral: 'bg-blue-100 text-blue-700 border-blue-200',
  technical: 'bg-purple-100 text-purple-700 border-purple-200',
  motivational: 'bg-green-100 text-green-700 border-green-200',
  situational: 'bg-orange-100 text-orange-700 border-orange-200',
  weakness: 'bg-gray-100 text-gray-700 border-gray-200',
};
const typeLabel: Record<string, string> = {
  behavioral: 'Comportamentale',
  technical: 'Tecnica',
  motivational: 'Motivazionale',
  situational: 'Situazionale',
  weakness: 'Punti Deboli',
};

// ---------------------------------------------------------------------------
// Results screen
// ---------------------------------------------------------------------------

interface ResultsScreenProps {
  answers: AnswerRecord[];
  questions: InterviewQuestion[];
  score: number;
  onRestart: () => void;
  onClose: () => void;
  onComplete: (answers: AnswerRecord[]) => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  answers,
  questions,
  score,
  onRestart,
  onClose,
  onComplete,
}) => {
  const answered = answers.filter((a) => a.answer.trim().length > 0).length;
  const skipped = answers.length - answered;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-800">Risultati Simulazione</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Chiudi"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Score card */}
        <div className={`rounded-2xl border-2 p-6 text-center ${scoreBg(score)}`}>
          <p className="text-sm font-medium text-gray-500 mb-1">Punteggio complessivo</p>
          <p className={`text-6xl font-extrabold tabular-nums ${scoreColor(score)}`}>{score}%</p>
          <p className={`text-lg font-semibold mt-1 ${scoreColor(score)}`}>{scoreLabel(score)}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Domande totali</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{answered}</p>
            <p className="text-xs text-gray-500 mt-0.5">Risposte date</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-400">{skipped}</p>
            <p className="text-xs text-gray-500 mt-0.5">Saltate</p>
          </div>
        </div>

        {/* Summary list */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Riepilogo risposte</h3>
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const record = answers.find((a) => a.questionId === q.id);
              const hasAnswer = record && record.answer.trim().length > 0;
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                        hasAnswer ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{q.question}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeBadge[q.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {typeLabel[q.type] ?? q.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyBadge[q.difficulty] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {difficultyLabel[q.difficulty] ?? q.difficulty}
                        </span>
                      </div>
                      {hasAnswer ? (
                        <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 border border-gray-100 line-clamp-3">
                          {record!.answer}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 italic flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Domanda saltata
                        </p>
                      )}

                      {/* Suggested answer */}
                      {q.suggestedAnswer && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-medium select-none">
                            Vedi risposta suggerita
                          </summary>
                          <p className="text-xs text-gray-600 mt-1.5 bg-blue-50 rounded-lg p-2.5 border border-blue-100 leading-relaxed">
                            {q.suggestedAnswer}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Ricomincia
        </button>
        <button
          onClick={() => onComplete(answers)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <CheckCircle className="w-4 h-4" />
          Completa e salva
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const MockInterviewSimulator: React.FC<Props> = ({
  questions,
  jobDescription: _jobDescription,
  onComplete,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [screen, setScreen] = useState<Screen>('question');
  const [score] = useState<number>(randomScore);
  const [animating, setAnimating] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;

  // Timer effect
  useEffect(() => {
    if (screen !== 'question' || animating) return;

    setTimeLeft(SECONDS_PER_QUESTION);
    setShowTips(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAdvance('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, screen, animating]);

  // Focus textarea when question changes
  useEffect(() => {
    if (!animating && screen === 'question') {
      textareaRef.current?.focus();
    }
  }, [currentIndex, animating, screen]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleAdvance = useCallback(
    (source: 'next' | 'skip' | 'timeout') => {
      stopTimer();
      if (!currentQuestion) return;

      const answer = source === 'skip' ? '' : currentAnswer.trim();
      const newAnswers = [...answers, { questionId: currentQuestion.id, answer }];
      setAnswers(newAnswers);

      if (currentIndex + 1 >= totalQuestions) {
        setCurrentAnswer('');
        setScreen('results');
        return;
      }

      // Transition animation
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setCurrentAnswer('');
        setAnimating(false);
      }, 250);
    },
    [answers, currentAnswer, currentIndex, currentQuestion, stopTimer, totalQuestions]
  );

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setScreen('question');
    setAnimating(false);
    setShowTips(false);
  };

  // Empty state
  if (totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 text-sm">Nessuna domanda disponibile per la simulazione.</p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Chiudi
        </button>
      </div>
    );
  }

  // Results screen
  if (screen === 'results') {
    return (
      <ResultsScreen
        answers={answers}
        questions={questions}
        score={score}
        onRestart={handleRestart}
        onClose={onClose}
        onComplete={onComplete}
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-800">Simulazione Colloquio</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Chiudi simulazione"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Progress                                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Question area                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`flex-1 overflow-y-auto px-5 py-5 space-y-5 transition-opacity duration-250 ${
          animating ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Timer + question */}
        <div className="flex items-start gap-4">
          <CountdownRing seconds={timeLeft} total={SECONDS_PER_QUESTION} />
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  typeBadge[currentQuestion.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {typeLabel[currentQuestion.type] ?? currentQuestion.type}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  difficultyBadge[currentQuestion.difficulty] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {difficultyLabel[currentQuestion.difficulty] ?? currentQuestion.difficulty}
              </span>
              {timeLeft <= 10 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-red-100 text-red-600 border-red-200 animate-pulse">
                  <Clock className="w-3 h-3" />
                  Tempo quasi scaduto!
                </span>
              )}
            </div>

            {/* Question text */}
            <p className="text-base font-semibold text-gray-800 leading-snug">
              {currentQuestion.question}
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label htmlFor="answer-input" className="block text-xs font-medium text-gray-500 mb-1.5">
            La tua risposta
          </label>
          <textarea
            id="answer-input"
            ref={textareaRef}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Scrivi qui la tua risposta..."
            rows={6}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow shadow-sm"
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {currentAnswer.length} caratteri
          </p>
        </div>

        {/* Tips section */}
        {currentQuestion.tips.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowTips((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors mb-2"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showTips ? 'Nascondi consigli' : 'Mostra consigli'}
            </button>
            {showTips && (
              <div className="space-y-1.5">
                {currentQuestion.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Key points section */}
        {currentQuestion.keyPoints.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
            <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mb-2">
              <Target className="w-3.5 h-3.5" />
              Punti chiave da includere
            </p>
            <ul className="space-y-1">
              {currentQuestion.keyPoints.map((kp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-blue-800">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {kp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer actions                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-200 bg-white flex-shrink-0">
        <button
          type="button"
          onClick={() => handleAdvance('skip')}
          disabled={animating}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
          Salta
        </button>
        <button
          type="button"
          onClick={() => handleAdvance('next')}
          disabled={animating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {currentIndex + 1 >= totalQuestions ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Termina
            </>
          ) : (
            <>
              Avanti
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MockInterviewSimulator;
