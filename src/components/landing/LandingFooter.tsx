import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, Lock, Shield, Heart } from 'lucide-react';

const links = [
  { label: 'Politica sulla Riservatezza', to: '/privacy-policy' },
  { label: 'Termini di Servizio', to: '/terms' },
  { label: 'Politica sui Cookie', to: '/cookie-policy' },
];

const trustItems = [
  { icon: ShieldCheck, label: 'Conforme GDPR', color: 'text-green-400' },
  { icon: Lock, label: 'Privacy First', color: 'text-blue-400' },
  { icon: Shield, label: 'SSL/TLS', color: 'text-purple-400' },
  { icon: Heart, label: 'Made in Italy', color: 'text-red-400' },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Trust badges row */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-gray-400 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-white">
                CV<span className="text-blue-400">Vincente</span>
              </span>
            </div>
            <p className="text-sm text-gray-500">Il CV che ti fa vincere onestamente</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; 2025 CVVincente. Fatto con &hearts; in Italia
          </p>
        </div>
      </div>
    </footer>
  );
};
