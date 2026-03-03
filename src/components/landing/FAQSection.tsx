import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, CheckCircle, Users, ChevronDown } from 'lucide-react';

const faqs = [
  {
    icon: Lock,
    iconColor: 'text-green-600',
    q: 'I miei dati personali sono al sicuro?',
    a: 'Assolutamente sì. Tutti i tuoi dati vengono salvati esclusivamente sul tuo dispositivo, nel tuo browser. Non abbiamo server dove conserviamo i tuoi CV o informazioni personali. Siamo conformi al 100% con il GDPR e le normative italiane sulla privacy.',
  },
  {
    icon: Shield,
    iconColor: 'text-blue-600',
    q: "L'intelligenza artificiale legge i miei dati?",
    a: "L'IA viene utilizzata solo quando tu lo richiedi esplicitamente (es. ottimizzazione CV). I dati vengono inviati in modo sicuro e non vengono mai memorizzati. Chiediamo sempre il tuo consenso prima di ogni operazione IA.",
  },
  {
    icon: CheckCircle,
    iconColor: 'text-purple-600',
    q: 'CVVincente è davvero gratuito?',
    a: "Sì! Tutte le funzionalità principali (creazione CV, template, export PDF) sono completamente gratuite. Le funzionalità avanzate di intelligenza artificiale richiedono una chiave API che puoi configurare autonomamente.",
  },
  {
    icon: Users,
    iconColor: 'text-brand-orange',
    q: 'Quante persone usano CVVincente?',
    a: "Oltre 2.500 professionisti hanno già creato il loro CV con CVVincente. Abbiamo utenti in settori come tecnologia, finanza, consulenza, sanità, marketing e molti altri. Puoi leggere le loro testimonianze sulla nostra pagina.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Domande Frequenti
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Vogliamo che ti senta completamente sicuro
          </motion.p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const Icon = faq.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border-2 transition-colors ${isOpen ? 'border-purple-200 bg-purple-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-5 text-left"
                >
                  <div className={`w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${faq.iconColor}`} />
                  </div>
                  <span className="flex-1 font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pl-[4.25rem] text-gray-600 leading-relaxed text-sm">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center mt-10 text-sm text-gray-500">
          Hai altre domande? Scrivici a{' '}
          <a href="mailto:info@cvvincente.it" className="text-purple-600 font-medium hover:underline">
            info@cvvincente.it
          </a>
        </p>
      </div>
    </section>
  );
};
