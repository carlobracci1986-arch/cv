import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  onClick: () => void;
  hasUsedAI?: boolean;
}

export const AIFloatingButton: React.FC<Props> = ({ onClick, hasUsedAI = false }) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', bounce: 0.4 }}
      onClick={onClick}
      className="fixed bottom-28 right-4 z-40 md:hidden group"
    >
      {/* Cerchi pulsanti */}
      <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20" />
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 opacity-30 animate-pulse" />

      {/* Pulsante principale */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-white" />
      </div>

      {/* Badge "Nuovo" */}
      {!hasUsedAI && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
          Nuovo
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">
        Ottimizza con IA
      </div>
    </motion.button>
  );
};
