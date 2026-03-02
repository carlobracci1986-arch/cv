import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Settings2, Rocket, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    number: '1',
    title: 'Analizza',
    description: "L'IA legge la descrizione dell'offerta di lavoro ed estrae le competenze chiave richieste dall'azienda.",
    color: 'text-brand-blue',
    bg: 'bg-blue-100',
    gradient: 'from-brand-blue to-blue-400',
  },
  {
    icon: Settings2,
    number: '2',
    title: 'Ottimizza',
    description: 'Riformula le tue esperienze enfatizzando le competenze pi\u00f9 rilevanti con linguaggio professionale.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    gradient: 'from-purple-600 to-purple-400',
  },
  {
    icon: Rocket,
    number: '3',
    title: 'Migliora',
    description: 'Aumenta il punteggio di compatibilit\u00e0 e le possibilit\u00e0 di essere selezionato per il colloquio.',
    color: 'text-brand-green',
    bg: 'bg-green-100',
    gradient: 'from-brand-green to-emerald-400',
  },
];

const stats = [
  { value: '85%', label: 'Punteggio medio dopo ottimizzazione', color: 'text-purple-600' },
  { value: '30s', label: 'Tempo medio di elaborazione', color: 'text-brand-blue' },
  { value: '+40%', label: 'Pi\u00f9 chiamate per colloqui', color: 'text-brand-green' },
  { value: '100%', label: 'Onesto e trasparente', color: 'text-brand-orange' },
];

export const AIExplainerSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorazioni sfondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intestazione */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Come Funziona l'IA
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Intelligenza Artificiale al Tuo Servizio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            L'IA analizza l'offerta di lavoro e ottimizza il tuo CV per massimizzare le possibilit&agrave; di successo
          </motion.p>
        </div>

        {/* 3 passaggi */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className={`w-20 h-20 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 relative`}>
                <step.icon className={`w-10 h-10 ${step.color}`} />
                <span className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${step.gradient} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}>
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Statistiche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
