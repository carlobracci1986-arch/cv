import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe, Palette, Cpu } from 'lucide-react';

const FEATURES = [
  { icon: FileText, label: 'Export PDF', sub: 'Scarica il tuo CV in formato professionale', color: 'text-purple-600' },
  { icon: Globe, label: '5 Lingue', sub: 'Traduci il CV in italiano, inglese, francese, tedesco, spagnolo', color: 'text-brand-blue' },
  { icon: Palette, label: '3 Template', sub: 'Modern, Classic e Minimalist tra cui scegliere', color: 'text-brand-green' },
  { icon: Cpu, label: 'IA Integrata', sub: 'Ottimizza, analizza ATS e genera lettere di presentazione', color: 'text-brand-orange' },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Tutto ciò che ti serve per un CV vincente
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Strumenti professionali, gratuiti e senza registrazione
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <p className={`text-xl font-bold ${feat.color} mb-1`}>{feat.label}</p>
              <p className="text-xs text-gray-500">{feat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
