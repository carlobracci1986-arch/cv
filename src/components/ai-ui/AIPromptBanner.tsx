import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  onOptimize: () => void;
  hasJobDescription: boolean;
  visible: boolean;
}

export const AIPromptBanner: React.FC<Props> = ({ onOptimize, hasJobDescription, visible }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white"
      >
        {/* Effetto shimmer */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>

        <div className="relative flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {hasJobDescription
                  ? 'Pronto per ottimizzare! L\'IA migliorerà il tuo CV.'
                  : 'Incolla un\'offerta di lavoro e lascia che l\'IA ottimizzi il tuo CV!'
                }
              </p>
              <p className="text-xs text-white/70 hidden sm:block">
                L'85% dei CV viene scartato dai filtri automatici. L'IA ti aiuta a superarli.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onOptimize}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-purple-700 text-sm font-bold rounded-lg hover:bg-purple-50 transition-colors"
            >
              <span className="hidden sm:inline">Ottimizza ora</span>
              <span className="sm:hidden">IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
