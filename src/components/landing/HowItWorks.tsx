import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Sparkles, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: PenLine,
    number: '01',
    title: 'Compila il CV',
    description: 'Inserisci i tuoi dati o importa da un PDF esistente. Semplice e guidato.',
    color: 'from-brand-blue to-blue-400',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Ottimizza con IA',
    description: "Incolla l'annuncio di lavoro e lascia che l'intelligenza artificiale ottimizzi il tuo CV per il ruolo.",
    color: 'from-brand-green to-emerald-400',
  },
  {
    icon: Download,
    number: '03',
    title: 'Scarica e Vinci',
    description: 'Esporta il PDF professionale ottimizzato per i filtri automatici e candidati con fiducia.',
    color: 'from-brand-orange to-amber-400',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Come funziona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            3 semplici passaggi per il CV perfetto
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px">
            <div className="w-full h-px bg-gradient-to-r from-brand-blue via-brand-green to-brand-orange" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Icon */}
              <div className="relative inline-flex mb-6">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                  {step.number}
                </span>
              </div>

              {/* Arrow on mobile */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
                </div>
              )}

              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
