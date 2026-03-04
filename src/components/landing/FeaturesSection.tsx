import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, FileText, Globe, MessageSquare, Lock } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Fai brillare il tuo CV',
    description: "Incolla l'offerta di lavoro e l'IA riformula le tue esperienze usando le parole chiave che i selezionatori cercano. Risultato? Più colloqui.",
    stat: '85% compatibilità media',
    color: 'text-brand-blue',
    bg: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Supera i filtri automatici',
    description: 'L\'85% dei CV viene scartato senza essere letto. Scopri il tuo punteggio e correggi i problemi prima di candidarti.',
    stat: '92% punteggio medio',
    color: 'text-brand-green',
    bg: 'bg-emerald-50',
  },
  {
    icon: FileText,
    title: 'Lettera che conquista',
    description: 'Genera una lettera di presentazione su misura per ogni candidatura. Professionale, personale, convincente.',
    stat: '3 stili disponibili',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Globe,
    title: 'Candidati all\'estero',
    description: 'Traduci CV e lettera di presentazione in inglese, francese o tedesco. L\'IA adatta terminologia, titoli delle sezioni e convenzioni professionali del paese.',
    stat: 'EN, FR, DE + lettera',
    color: 'text-brand-orange',
    bg: 'bg-amber-50',
  },
  {
    icon: MessageSquare,
    title: 'Arriva preparato al colloquio',
    description: 'Scopri le domande che ti faranno e allenati con il simulatore. Niente più ansia da colloquio.',
    stat: '20+ domande generate',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    icon: Lock,
    title: 'I tuoi dati, solo tuoi',
    description: 'Tutto resta sul tuo dispositivo. Nessun server, nessun tracciamento. La tua privacy viene prima di tutto.',
    stat: '100% conforme al GDPR',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-brand-blue mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Funzionalit&agrave;
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Tutto quello che ti serve per conquistare il lavoro
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            6 strumenti potenti che lavorano insieme per darti un vantaggio reale
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 ${feature.bg} rounded-full text-xs font-medium ${feature.color}`}
              >
                {feature.stat}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
