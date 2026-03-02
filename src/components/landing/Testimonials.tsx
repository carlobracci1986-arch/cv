import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    text: "Ho trovato lavoro in 2 settimane grazie a CVVincente. L'ottimizzazione con l'intelligenza artificiale ha fatto la differenza.",
    name: 'Marco R.',
    role: 'Ingegnere Informatico @ Google',
    initials: 'MR',
    gradient: 'from-brand-blue to-blue-400',
  },
  {
    text: 'Finalmente uno strumento per il CV che non ti chiede di barare. Etico e potente.',
    name: 'Sara L.',
    role: 'Responsabile Prodotto @ Amazon',
    initials: 'SL',
    gradient: 'from-brand-green to-emerald-400',
  },
  {
    text: 'Punteggio ATS passato da 45% a 94%. Incredibile.',
    name: 'Luca T.',
    role: 'Analista Dati @ Microsoft',
    initials: 'LT',
    gradient: 'from-brand-orange to-amber-400',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gray-50/50">
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
            Cosa dicono di noi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Storie di chi ha gi&agrave; vinto con CVVincente
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-gray-100 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-brand-orange text-brand-orange"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
