import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, GitBranch } from 'lucide-react';
import { BUILD_VERSION, BUILD_COMMIT } from '../../version';

const LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Termini di Servizio', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand + GDPR badge */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>© 2024 CV Builder AI - GDPR Compliant</span>
            <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
              <span>({BUILD_VERSION})</span>
              {BUILD_COMMIT && BUILD_COMMIT.length > 6 && (
                <>
                  <span>·</span>
                  <GitBranch className="w-3 h-3" />
                  <span>{BUILD_COMMIT}</span>
                </>
              )}
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Email */}
          <div className="text-sm text-gray-500">
            <a
              href="mailto:privacy@cvbuilder.it"
              className="hover:text-blue-600 transition-colors"
            >
              privacy@cvbuilder.it
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
