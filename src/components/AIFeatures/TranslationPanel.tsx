import React, { useState, useRef } from 'react';
import { Globe, Loader2, Download, RotateCcw } from 'lucide-react';
import { CVData } from '../../types/cv.types';
import * as aiProvider from '../../services/aiProvider';
import { analytics } from '../../utils/analytics';
import { ANALYTICS_EVENTS } from '../../constants/analyticsEvents';

interface Props {
  cvData: CVData;
  onTranslated: (lang: string, translatedCV: CVData) => void;
  onReset: () => void;
  onDownloadPDF: () => void;
  activeLang: string | null;
  isTranslating: boolean;
  setIsTranslating: (v: boolean) => void;
}

const LANGUAGES = [
  { code: 'it', flag: '🇮🇹', label: 'Italiano', description: 'Originale' },
  { code: 'en', flag: '🇬🇧', label: 'English', description: 'Inglese' },
  { code: 'fr', flag: '🇫🇷', label: 'Français', description: 'Francese' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch', description: 'Tedesco' },
];

export const TranslationPanel: React.FC<Props> = ({
  cvData,
  onTranslated,
  onReset,
  onDownloadPDF,
  activeLang,
  isTranslating,
  setIsTranslating,
}) => {
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, CVData>>(new Map());

  const handleTranslate = async (langCode: string) => {
    if (langCode === 'it') {
      onReset();
      return;
    }

    // Check cache
    const cached = cacheRef.current.get(langCode);
    if (cached) {
      onTranslated(langCode, cached);
      return;
    }

    setIsTranslating(true);
    setError(null);
    analytics.trackEvent(ANALYTICS_EVENTS.CV_TRANSLATION_STARTED, { target_language: langCode });

    try {
      const translated = await aiProvider.translateCV(cvData, langCode);
      cacheRef.current.set(langCode, translated);
      onTranslated(langCode, translated);
      analytics.trackEvent(ANALYTICS_EVENTS.CV_TRANSLATION_COMPLETED, { target_language: langCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante la traduzione');
      analytics.trackEvent(ANALYTICS_EVENTS.CV_TRANSLATION_ERROR, { target_language: langCode });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Traduci il tuo CV</h3>
        <p className="text-xs text-gray-500 mb-3">
          L'IA traduce il tuo CV adattando terminologia professionale e convenzioni del paese
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Seleziona lingua</h4>
            <p className="text-xs text-gray-500">
              {activeLang && activeLang !== 'it'
                ? `Stai visualizzando il CV in ${LANGUAGES.find(l => l.code === activeLang)?.label}`
                : 'Il CV è in italiano (originale)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === 'it' ? !activeLang || activeLang === 'it' : activeLang === lang.code;
            const isCached = lang.code !== 'it' && cacheRef.current.has(lang.code);

            return (
              <button
                key={lang.code}
                onClick={() => handleTranslate(lang.code)}
                disabled={isTranslating}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 text-left transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl leading-none">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                    {lang.label}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {lang.code === 'it' ? 'Originale' : isCached ? 'Tradotto (in cache)' : lang.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {isTranslating && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Traduzione in corso...</p>
              <p className="text-xs text-blue-600">L'IA sta adattando il tuo CV alla lingua selezionata</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {activeLang && activeLang !== 'it' && !isTranslating && (
          <div className="space-y-2 mt-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs text-emerald-700 font-medium">
                L'anteprima mostra il CV tradotto in {LANGUAGES.find(l => l.code === activeLang)?.label}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Scarica PDF tradotto
              </button>
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Italiano
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
