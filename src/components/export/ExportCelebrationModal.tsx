import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, CheckCircle, Sparkles, Brain, Share2,
  FileText, Briefcase, GraduationCap, Star, Globe,
  Trophy, ArrowRight, Copy, X, Rocket
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { CVData } from '../../types/cv.types';

type Phase = 'generating' | 'celebration';

interface Props {
  isOpen: boolean;
  phase: Phase;
  cvData: CVData;
  onClose: () => void;
  onOptimizeWithAI: () => void;
}

const GENERATION_STEPS = [
  { label: 'Preparazione layout...', icon: FileText },
  { label: 'Rendering delle sezioni...', icon: Star },
  { label: 'Ottimizzazione qualità...', icon: Sparkles },
  { label: 'Generazione PDF finale...', icon: Download },
];

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const left = Math.random() * 100;
  const duration = 2 + Math.random() * 2;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, 300 + Math.random() * 200],
        x: [0, (Math.random() - 0.5) * 150],
        rotate: [0, rotation + 360],
      }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: -10,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  );
};

export const ExportCelebrationModal: React.FC<Props> = ({
  isOpen,
  phase,
  cvData,
  onClose,
  onOptimizeWithAI,
}) => {
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Calculate CV stats
  const stats = useMemo(() => {
    const sections: { icon: React.ElementType; label: string; value: string; color: string }[] = [];
    const exp = cvData.experiences?.length || 0;
    if (exp > 0) sections.push({ icon: Briefcase, label: 'Esperienze', value: `${exp}`, color: 'text-blue-600' });
    const edu = cvData.education?.length || 0;
    if (edu > 0) sections.push({ icon: GraduationCap, label: 'Formazione', value: `${edu}`, color: 'text-purple-600' });
    const skills = cvData.skills?.length || 0;
    if (skills > 0) sections.push({ icon: Star, label: 'Competenze', value: `${skills}`, color: 'text-amber-600' });
    const langs = cvData.languages?.length || 0;
    if (langs > 0) sections.push({ icon: Globe, label: 'Lingue', value: `${langs}`, color: 'text-green-600' });
    return sections;
  }, [cvData]);

  const fullName = `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`.trim();

  // Generation progress animation
  useEffect(() => {
    if (phase !== 'generating') {
      setGenerationStep(0);
      setGenerationProgress(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setGenerationStep(s => Math.min(s + 1, GENERATION_STEPS.length - 1));
    }, 800);

    const progressInterval = setInterval(() => {
      setGenerationProgress(p => Math.min(p + Math.random() * 12, 90));
    }, 300);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [phase]);

  // Bump progress to 100 when switching to celebration
  useEffect(() => {
    if (phase === 'celebration') {
      setGenerationProgress(100);
    }
  }, [phase]);

  const confettiColors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
      >
        {/* Confetti on celebration */}
        {phase === 'celebration' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {Array.from({ length: 40 }).map((_, i) => (
              <ConfettiParticle
                key={i}
                delay={i * 0.05}
                color={confettiColors[i % confettiColors.length]}
              />
            ))}
          </div>
        )}

        {/* Close button */}
        {phase === 'celebration' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {phase === 'generating' ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 text-center"
            >
              {/* Animated icon */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 border-4 border-blue-200 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-blue-400 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Creazione PDF in corso...
              </h3>

              {/* Steps */}
              <div className="space-y-2 mb-6 max-w-xs mx-auto">
                {GENERATION_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === generationStep;
                  const isDone = i < generationStep;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
                      className={`flex items-center gap-2 text-sm ${
                        isActive ? 'text-brand-blue font-medium' : isDone ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                      {step.label}
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-brand-blue to-blue-400"
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{Math.round(generationProgress)}%</p>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-0"
            >
              {/* Success header */}
              <div className="bg-gradient-to-br from-brand-blue via-blue-600 to-purple-600 px-8 pt-8 pb-6 text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold mb-1"
                >
                  CV Scaricato con Successo!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-100 text-sm"
                >
                  {fullName ? `Ottimo lavoro, ${fullName}!` : 'Ottimo lavoro!'}
                </motion.p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-5">
                {/* CV Stats */}
                {stats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Il tuo CV in numeri</p>
                    <div className="grid grid-cols-2 gap-2">
                      {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <div key={i} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                            <Icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                            <div>
                              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                              <span className="text-xs text-gray-500 ml-1.5">{stat.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Next steps */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Prossimi passi</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOptimizeWithAI();
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-colors group"
                    >
                      <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Ottimizza con l'IA</p>
                        <p className="text-xs text-gray-500">Aumenta le possibilità di essere selezionato</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </button>

                    <button
                      onClick={() => {
                        const text = `Ho appena creato il mio CV con CVVincente! 🏆`;
                        navigator.clipboard.writeText(text).then(() => {
                          toast.success('Testo copiato negli appunti!');
                        }).catch(() => {
                          toast.error('Impossibile copiare');
                        });
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-colors group"
                    >
                      <div className="w-9 h-9 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Condividi il tuo successo</p>
                        <p className="text-xs text-gray-500">Copia il messaggio e condividi con gli amici</p>
                      </div>
                      <Copy className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    </button>
                  </div>
                </motion.div>

                {/* Motivational tip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 flex items-start gap-2.5"
                >
                  <Rocket className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-800 leading-relaxed">
                    <strong>Consiglio:</strong> Personalizza il CV per ogni candidatura. Un CV su misura aumenta le possibilità del <strong>40%</strong>!
                  </p>
                </motion.div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
