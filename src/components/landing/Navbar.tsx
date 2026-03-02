import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-gray-900">
              CV<span className="text-brand-blue">Vincente</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('features')}
              className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors"
            >
              Funzionalit&agrave;
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors"
            >
              Come funziona
            </button>
            <button
              onClick={() => scrollTo('testimonials')}
              className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors"
            >
              Testimonianze
            </button>
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Inizia gratis
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollTo('features')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Funzionalit&agrave;
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Come funziona
            </button>
            <button
              onClick={() => scrollTo('testimonials')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Testimonianze
            </button>
            <Link
              to="/editor"
              className="block w-full text-center px-5 py-3 bg-brand-blue text-white font-semibold rounded-xl"
            >
              Inizia gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
