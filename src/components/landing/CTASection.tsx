import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { ANALYTICS_EVENTS } from '../../constants/analyticsEvents';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-blue-600 to-blue-700" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90 mb-6">
            <Sparkles className="w-4 h-4" />
            Gratuito, per sempre
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            La prossima opportunit&agrave; non aspetta
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Ogni giorno che passa con un CV mediocre &egrave; un colloquio perso.
            Unisciti a chi ha gi&agrave; fatto la differenza con un CV professionale.
          </p>

          <Link
            to="/editor"
            onClick={() => analytics.trackEvent(ANALYTICS_EVENTS.LANDING_CTA_CLICK, { button: 'cta_bottom' })}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-blue text-lg font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Inizia ora e distinguiti
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="mt-5 text-sm text-blue-200">
            Gratis. 10 minuti. Nessuna carta richiesta.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
