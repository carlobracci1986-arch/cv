import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ShieldCheck, Heart, Headphones } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, title: 'Conforme GDPR', desc: '100% rispetto privacy europea', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Lock, title: 'Privacy First', desc: 'Dati solo sul tuo dispositivo', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Shield, title: 'Connessione Sicura', desc: 'Crittografia SSL/TLS', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Heart, title: 'Made in Italy', desc: 'Sviluppato in Italia', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Headphones, title: 'Supporto Italiano', desc: 'Assistenza in italiano', color: 'text-brand-orange', bg: 'bg-amber-50' },
];

interface Props {
  variant?: 'full' | 'compact';
}

export const TrustBadges: React.FC<Props> = ({ variant = 'full' }) => {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {badges.map((b, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
            <b.icon className={`w-3.5 h-3.5 ${b.color}`} />
            <span className="font-medium">{b.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center text-center bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 ${b.bg} rounded-lg flex items-center justify-center mb-3`}>
                <b.icon className={`w-5 h-5 ${b.color}`} />
              </div>
              <p className="font-semibold text-sm text-gray-900 mb-0.5">{b.title}</p>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
