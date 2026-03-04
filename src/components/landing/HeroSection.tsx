import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowDown, Shield, Lock, Heart, Sparkles } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { ANALYTICS_EVENTS } from '../../constants/analyticsEvents';

const usps = [
  'Supera i filtri automatici che scartano l\'85% dei CV',
  'Fai brillare le tue competenze con l\'aiuto dell\'intelligenza artificiale',
  'I tuoi dati restano solo sul tuo dispositivo, sempre',
  'Nessun trucco: il tuo talento reale, presentato al meglio',
];

const trustBadges = [
  { icon: Lock, label: 'Conforme al GDPR' },
  { icon: Shield, label: 'Riservatezza garantita' },
  { icon: Sparkles, label: '100% Etico' },
  { icon: Heart, label: 'Fatto in Italia' },
];

const highlights = [
  { value: '3', label: 'Template professionali' },
  { value: '5', label: 'Lingue supportate' },
  { value: '100%', label: 'Gratuito' },
];

export const HeroSection: React.FC = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left side - 60% */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-brand-blue mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Potenziato con IA
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Il CV che ti fa{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-500">
                vincere il lavoro
              </span>
              {' '}dei tuoi sogni
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed"
            >
              Smetti di inviare CV che finiscono nel dimenticatoio.
              Crea un curriculum che <strong>cattura l'attenzione</strong>, supera i filtri
              e ti porta al colloquio.
            </motion.p>

            {/* USP Bullets */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3 mb-8"
            >
              {usps.map((usp, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
                  <span className="text-gray-700">{usp}</span>
                </li>
              ))}
            </motion.ul>

            {/* Social proof - honest version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-gray-600">
                Gratuito, open source e senza registrazione
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link
                to="/editor"
                onClick={() => analytics.trackEvent(ANALYTICS_EVENTS.LANDING_CTA_CLICK, { button: 'hero_primary' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white text-lg font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Crea il tuo CV vincente ora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-2xl hover:border-brand-blue hover:text-brand-blue transition-all"
              >
                Scopri come funziona
                <ArrowDown className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-gray-500"
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - 40% */}
          <div className="lg:col-span-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* CV Preview Mock */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                {/* Mini CV Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-blue-400" />
                    <div>
                      <div className="h-3 w-28 bg-gray-800 rounded-full" />
                      <div className="h-2 w-20 bg-gray-300 rounded-full mt-1.5" />
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-5/6 bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-4/6 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-16 bg-brand-blue/20 rounded-full" />
                    <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-5/6 bg-gray-100 rounded-full" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-12 bg-brand-blue/20 rounded-full" />
                    <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-3/6 bg-gray-100 rounded-full" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="h-5 w-16 bg-brand-blue/10 rounded-full" />
                    <div className="h-5 w-14 bg-brand-green/10 rounded-full" />
                    <div className="h-5 w-18 bg-brand-orange/10 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating highlights - real data only */}
              {highlights.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                  className={`absolute bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 hidden sm:block ${
                    i === 0
                      ? '-top-4 -left-4 sm:-left-8'
                      : i === 1
                      ? 'top-1/3 -right-4 sm:-right-8'
                      : '-bottom-4 -left-2 sm:-left-6'
                  }`}
                >
                  <p className="text-xl font-bold text-brand-blue">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
