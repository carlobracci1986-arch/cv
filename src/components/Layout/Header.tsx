import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Menu, X, Clock, Check } from 'lucide-react';

interface Props {
  currentSection: string;
  onSectionChange: (section: string) => void;
  lastSaved?: Date | null;
  isDirty?: boolean;
  onDownloadPDF?: () => void;
}

const NAV_TABS = [
  { id: 'editor', label: 'CV Editor' },
  { id: 'ai-tools', label: 'AI Tools' },
  { id: 'versions', label: 'Versioni' },
  { id: 'settings', label: 'Impostazioni' },
];

function formatLastSaved(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'adesso';
  if (diffMin === 1) return '1 min fa';
  if (diffMin < 60) return `${diffMin} min fa`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return '1 ora fa';
  return `${diffHours} ore fa`;
}

export const Header: React.FC<Props> = ({
  currentSection,
  onSectionChange,
  lastSaved,
  isDirty,
  onDownloadPDF,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  // Re-render every minute to keep relative time fresh
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (id: string) => {
    onSectionChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">CV Builder AI</span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">CV AI</span>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentSection === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Last saved indicator */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              {lastSaved ? (
                <>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDirty ? 'bg-yellow-400' : 'bg-green-500'
                    }`}
                    title={isDirty ? 'Modifiche non salvate' : 'Salvato'}
                  />
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Ultima modifica: {formatLastSaved(lastSaved)}</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-300" />
                  <span>Non salvato</span>
                </>
              )}
              {!isDirty && lastSaved && (
                <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              )}
            </div>

            {/* Download PDF button */}
            <button
              onClick={onDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Scarica PDF</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Apri menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile last saved (below main row) */}
        {lastSaved && (
          <div className="sm:hidden flex items-center gap-2 pb-2 text-xs text-gray-500">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isDirty ? 'bg-yellow-400' : 'bg-green-500'
              }`}
            />
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>Ultima modifica: {formatLastSaved(lastSaved)}</span>
          </div>
        )}
      </div>

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="px-4 py-2 flex flex-col gap-1">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  currentSection === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
