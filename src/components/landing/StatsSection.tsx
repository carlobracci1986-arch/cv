import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, TrendingUp, Clock } from 'lucide-react';

const STATS = [
  { icon: FileText, target: 2547, suffix: '+', label: 'CV Creati', sub: 'e il numero cresce ogni giorno', color: 'text-purple-600' },
  { icon: Users, target: 1823, suffix: '+', label: 'Utenti Attivi', sub: 'utilizzano CVVincente mensilmente', color: 'text-brand-blue' },
  { icon: TrendingUp, target: 89, suffix: '%', label: 'Punteggio Medio', sub: 'compatibilità dopo ottimizzazione', color: 'text-brand-green' },
  { icon: Clock, target: 45, suffix: 'min', label: 'Tempo Risparmiato', sub: 'rispetto alla creazione manuale', color: 'text-brand-orange' },
];

function useCountUp(target: number, duration = 2000, enabled = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start++;
      setValue(Math.min(Math.floor(increment * start), target));
      if (start >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration, enabled]);
  return value;
}

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Simulated live counter
  const [liveCount, setLiveCount] = useState(12);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveCount(prev => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(8, Math.min(19, next));
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            I Numeri Parlano Chiaro
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Migliaia di persone si fidano già di CVVincente
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {STATS.map((stat, i) => {
            const count = useCountUp(stat.target, 2000, isVisible);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-white shadow-sm flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <p className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1`}>
                  {count.toLocaleString()}{stat.suffix}
                </p>
                <p className="font-semibold text-gray-800 text-sm mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-full px-5 py-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm text-green-800">
              <strong>{liveCount} persone</strong> stanno creando il loro CV adesso
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
