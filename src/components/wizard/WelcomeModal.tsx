import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PenLine, Download, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onStart: () => void;
  onSkip: () => void;
}

export const WelcomeModal: React.FC<Props> = ({ isOpen, onStart, onSkip }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-10 relative"
        >
          {/* Chiudi */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            {/* Icona */}
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-brand-blue" />
            </div>

            {/* Titolo */}
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Il tuo prossimo lavoro inizia qui
            </h2>

            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Ti guidiamo passo-passo nella creazione di un CV che fa colpo.
              Bastano <strong>5-10 minuti</strong> per fare la differenza.
            </p>

            {/* 3 passaggi */}
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 text-left">
              <div className="bg-blue-50 rounded-xl p-4">
                <PenLine className="w-7 h-7 text-brand-blue mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">1. Racconta chi sei</h4>
                <p className="text-sm text-gray-600">
                  5 sezioni semplici, noi ti guidiamo
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Sparkles className="w-7 h-7 text-purple-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">2. Fallo brillare</h4>
                <p className="text-sm text-gray-600">
                  L'IA riscrive il CV per ogni offerta
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <Download className="w-7 h-7 text-green-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">3. Conquista</h4>
                <p className="text-sm text-gray-600">
                  Scarica il PDF e candidati con fiducia
                </p>
              </div>
            </div>

            {/* Azioni */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
              >
                Costruiamo il tuo CV!
              </button>
              <button
                onClick={onSkip}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-600 text-lg font-semibold rounded-xl hover:border-gray-300 transition-all"
              >
                Sono un esperto, vai all'editor
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-5">
              Il tuo lavoro viene salvato automaticamente. Puoi tornare quando vuoi.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
