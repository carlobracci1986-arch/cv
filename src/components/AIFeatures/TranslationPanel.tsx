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
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, CVData>>(new Map());

  const handleTranslate = async () => {
    if (!selectedLang) return;

    // Check cache
    const cached = cacheRef.current.get(selectedLang);
    if (cached) {
      onTranslated(selectedLang, cached);
      return;
    }

    setIsTranslating(true);
    setError(null);
    analytics.trackEvent(ANALYTICS_EVENTS.CV_TRANSLATION_STARTED, { target_language: selectedLang });

    try {
      const translated = await aiProvider.translateCV(cvData, selectedLang);
      cacheRef.current.set(selectedLang, translated);
      onTranslated(selectedLang, translated);
      analytics.trackEvent(ANALYTICS_EVENTS.CV_TRANSLATION_COMPLETED, { target_language: selectedLang });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante la traduzione');
      analytics.trackEvent(ANALYTICS_EVENTS.CV_TRANSLATION_ERROR, { target_language: selectedLang });
    } finally {
      setIsTranslating(false);
    }
  };

  const isShowingTranslation = activeLang && activeLang !== 'it';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Traduci il tuo CV</h3>
        <p className="text-xs text-gray-500 mb-3">
          L'IA traduce il tuo CV adattando terminologia professionale, titoli delle sezioni e convenzioni del paese
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Seleziona lingua di destinazione</h4>
            <p className="text-xs text-gray-500">
              {isShowingTranslation
                ? `Stai visualizzando il CV in ${LANGUAGES.find(l => l.code === activeLang)?.label}`
                : 'Il CV è in italiano (originale)'}
            </p>
          </div>
        </div>

        {/* Language selection */}
        <div className="space-y-2 mb-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            const isCached = cacheRef.current.has(lang.code);
            const isCurrentlyActive = activeLang === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                disabled={isTranslating}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl leading-none">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {lang.label}
                  </p>
                  <p className="text-[11px] text-gray-400">{lang.description}</p>
                </div>
                {isCached && (
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    In cache
                  </span>
                )}
                {isCurrentlyActive && (
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                    Attivo
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Translate button */}
        <button
          onClick={handleTranslate}
          disabled={!selectedLang || isTranslating}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Traduzione in corso...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              {selectedLang
                ? `Traduci in ${LANGUAGES.find(l => l.code === selectedLang)?.label}`
                : 'Seleziona una lingua'}
            </>
          )}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {isShowingTranslation && !isTranslating && (
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
                Torna all'italiano
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
