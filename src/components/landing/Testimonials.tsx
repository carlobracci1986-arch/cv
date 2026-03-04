import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  verified: boolean;
  result?: { label: string; before: string; after: string } | { label: string; value: string }[];
}

const testimonials: Testimonial[] = [
  {
    text: "Ho trovato lavoro in 2 settimane grazie a CVVincente. L'ottimizzazione con intelligenza artificiale ha fatto davvero la differenza. Il mio punteggio di compatibilità è passato dal 45% al 94%!",
    name: 'Marco R.',
    role: 'Sviluppatore Software, Milano',
    initials: 'MR',
    gradient: 'from-brand-blue to-blue-400',
    verified: true,
    result: { label: 'Compatibilità ATS', before: '45%', after: '94%' },
  },
  {
    text: "Finalmente un creatore di CV che non ti chiede di barare. Etico, potente e semplice da usare. Ho creato 3 versioni diverse del mio CV per candidature diverse in meno di un'ora.",
    name: 'Sara L.',
    role: 'Responsabile Prodotto, Roma',
    initials: 'SL',
    gradient: 'from-brand-green to-emerald-400',
    verified: true,
    result: [
      { label: 'Tempo per CV', value: '10 min' },
      { label: 'Versioni create', value: '3' },
    ],
  },
  {
    text: "Il controllo compatibilità è fantastico. Mi ha fatto capire esattamente cosa mancava nel mio CV. L'intelligenza artificiale ha riformulato le mie esperienze in modo molto più professionale.",
    name: 'Luca T.',
    role: 'Analista Dati, Torino',
    initials: 'LT',
    gradient: 'from-brand-orange to-amber-400',
    verified: true,
    result: { label: 'Colloqui al mese', before: '2', after: '8' },
  },
  {
    text: "Come neolaureata non avevo idea di come scrivere un CV efficace. CVVincente mi ha guidato passo-passo e il risultato è stato un CV che mi ha fatto ottenere 3 colloqui nella prima settimana!",
    name: 'Chiara B.',
    role: 'Laureanda in Economia, Bologna',
    initials: 'CB',
    gradient: 'from-purple-500 to-purple-400',
    verified: true,
    result: [
      { label: 'Esperienza', value: 'Neolaureata' },
      { label: 'Colloqui', value: '3 in 1 settimana' },
    ],
  },
  {
    text: "La funzione di traduzione automatica è incredibile. Ho inviato il mio CV in inglese, tedesco e francese senza doverlo far tradurre a nessuno. Risparmio di tempo enorme!",
    name: 'Andrea P.',
    role: 'Project Manager, Bolzano',
    initials: 'AP',
    gradient: 'from-cyan-500 to-cyan-400',
    verified: true,
    result: [
      { label: 'Lingue', value: '4' },
      { label: 'Ore risparmiate', value: '6' },
    ],
  },
  {
    text: "I template sono bellissimi e professionali. Ho provato altri strumenti ma CVVincente è l'unico che mi ha convinto per la qualità e la semplicità. Risultato impeccabile.",
    name: 'Giulia M.',
    role: 'Designer UX/UI, Firenze',
    initials: 'GM',
    gradient: 'from-pink-500 to-pink-400',
    verified: true,
    result: [
      { label: 'Template provati', value: '4' },
      { label: 'Soddisfazione', value: '100%' },
    ],
  },
];

// Show 3 at a time on desktop, 1 on mobile
export const Testimonials: React.FC = () => {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
          >
            <Star className="w-4 h-4 fill-purple-500 text-purple-500" />
            Storie di Successo
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Cosa dicono di noi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Scopri come CVVincente ha aiutato chi cerca lavoro
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {visible.map((t, i) => (
            <motion.div
              key={`${page}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 relative flex flex-col"
            >
              <Quote className="w-8 h-8 text-gray-100 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed mb-5 relative z-10 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Result badge */}
              {t.result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5">
                  {'before' in t.result ? (
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0.5">Prima</p>
                        <p className="text-sm font-bold text-orange-600">{t.result.before}</p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500 mx-2 flex-shrink-0" />
                      <div className="text-center flex-1">
                        <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0.5">Dopo</p>
                        <p className="text-sm font-bold text-green-600">{t.result.after}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-around">
                      {t.result.map((r, ri) => (
                        <div key={ri} className="text-center">
                          <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0.5">{r.label}</p>
                          <p className="text-sm font-bold text-green-700">{r.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                    {t.name}
                    {t.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === page ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Average rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-1">4.9</p>
              <div className="flex gap-0.5 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <p className="text-xs text-gray-500">valutazione media</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
