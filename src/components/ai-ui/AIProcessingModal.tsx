import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb } from 'lucide-react';

const STATUS_MESSAGES = [
  "Analizzando la descrizione dell'offerta di lavoro...",
  'Identificando le parole chiave importanti...',
  'Riformulando le tue esperienze...',
  'Calcolando il punteggio di compatibilità...',
  'Ottimizzando il contenuto...',
  'Ultimi ritocchi...',
];

const FUN_FACTS = [
  "L'85% dei CV viene scartato automaticamente dai filtri aziendali.",
  'I selezionatori impiegano in media 6 secondi a leggere un CV.',
  'Le parole chiave giuste possono aumentare le possibilità del 300%.',
  'Un CV ottimizzato aumenta le chiamate per colloqui del 40%.',
  'Il formato del CV conta quanto il contenuto per i filtri automatici.',
];

interface Props {
  isOpen: boolean;
}

export const AIProcessingModal: React.FC<Props> = ({ isOpen }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [factIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length));

  useEffect(() => {
    if (!isOpen) {
      setMessageIndex(0);
      setProgress(0);
      return;
    }

    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % STATUS_MESSAGES.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(90, p + Math.random() * 8));
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        {/* Animazione IA */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-3 border-4 border-blue-200 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-6 border-4 border-purple-200 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.6s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          L'IA sta lavorando per te...
        </h3>

        {/* Messaggio status rotante */}
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-gray-500 mb-6 h-5"
          >
            {STATUS_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Barra progresso */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-400 mb-6">{Math.round(progress)}% completato</p>

        {/* Curiosità */}
        <div className="bg-blue-50 rounded-xl p-4 text-left">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">Lo sapevi?</p>
              <p className="text-xs text-blue-700">{FUN_FACTS[factIndex]}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
