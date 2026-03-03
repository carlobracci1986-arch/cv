import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Eye, Download, Sparkles, ChevronRight, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onViewPreview: () => void;
  onDownloadPDF: () => void;
  onClose: () => void;
}

export const CompletionModal: React.FC<Props> = ({ isOpen, onViewPreview, onDownloadPDF, onClose }) => {
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-10 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            {/* Icona celebrazione */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-14 h-14 text-green-500" />
            </motion.div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Ce l'hai fatta! Il tuo CV &egrave; pronto
            </h2>

            <p className="text-base text-gray-600 mb-8">
              Fantastico lavoro! Ora hai un CV professionale. Vuoi farlo brillare ancora di pi&ugrave; con l'IA?
            </p>

            {/* Azioni principali */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <button
                onClick={onViewPreview}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
              >
                <Eye className="w-5 h-5" />
                Guarda com'&egrave; venuto
              </button>
              <button
                onClick={onDownloadPDF}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 transition-all"
              >
                <Download className="w-5 h-5" />
                Scarica subito il PDF
              </button>
            </div>

            {/* Prossimi passi */}
            <div className="bg-blue-50 rounded-xl p-5 text-left">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-blue" />
                Per massimizzare le tue possibilit&agrave;:
              </h4>
              <ul className="space-y-2.5">
                {[
                  'Fai brillare il CV con l\'IA per un\'offerta specifica',
                  'Verifica se superi i filtri automatici (punta al 80%+)',
                  'Genera una lettera di presentazione che conquista',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-brand-blue flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
