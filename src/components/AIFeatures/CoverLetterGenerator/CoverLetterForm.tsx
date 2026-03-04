import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  Palette,
  Code2,
  Star,
  Loader2,
} from 'lucide-react';
import { CVData } from '../../../types/cv.types';
import { CoverLetterOptions } from '../../../types/ai.types';

interface Props {
  cvData: CVData;
  jobDescription: string;
  onGenerate: (options: CoverLetterOptions) => void;
  isLoading: boolean;
}

interface ToneOption {
  value: CoverLetterOptions['tone'];
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  selectedClass: string;
}

const toneOptions: ToneOption[] = [
  {
    value: 'formal',
    label: 'Formale',
    description: 'Linguaggio ufficiale e distaccato, ideale per enti pubblici e grandi aziende tradizionali.',
    icon: <Briefcase className="w-5 h-5" />,
    colorClass: 'text-slate-600',
    selectedClass: 'border-slate-500 bg-slate-50 ring-slate-200',
  },
  {
    value: 'professional',
    label: 'Professionale',
    description: 'Tono equilibrato e autorevole, perfetto per la maggior parte dei contesti lavorativi.',
    icon: <Star className="w-5 h-5" />,
    colorClass: 'text-blue-600',
    selectedClass: 'border-blue-500 bg-blue-50 ring-blue-200',
  },
  {
    value: 'creative',
    label: 'Creativo',
    description: 'Stile vivace e originale, ideale per agenzie creative, startup e ruoli nel marketing.',
    icon: <Palette className="w-5 h-5" />,
    colorClass: 'text-purple-600',
    selectedClass: 'border-purple-500 bg-purple-50 ring-purple-200',
  },
  {
    value: 'technical',
    label: 'Tecnico',
    description: 'Focalizzato su competenze e dati, ottimale per posizioni IT, ingegneristiche e scientifiche.',
    icon: <Code2 className="w-5 h-5" />,
    colorClass: 'text-emerald-600',
    selectedClass: 'border-emerald-500 bg-emerald-50 ring-emerald-200',
  },
];

export const CoverLetterForm: React.FC<Props> = ({
  cvData,
  jobDescription,
  onGenerate,
  isLoading,
}) => {
  const [selectedTone, setSelectedTone] = useState<CoverLetterOptions['tone']>('professional');
  const [selectedLength, setSelectedLength] = useState<CoverLetterOptions['length']>('full');
  const [selectedLanguage, setSelectedLanguage] = useState<CoverLetterOptions['language']>('it');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const languageOptions: { code: NonNullable<CoverLetterOptions['language']>; flag: string; label: string }[] = [
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  ];

  const handleGenerate = () => {
    onGenerate({
      tone: selectedTone,
      length: selectedLength,
      language: selectedLanguage,
      additionalInstructions: additionalInstructions.trim() || undefined,
    });
  };

  const applicantName = `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim();
  const canGenerate = jobDescription.trim().length > 10;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Genera Lettera di Presentazione
          </h3>
          {applicantName && (
            <p className="text-xs text-gray-500">
              Per{' '}
              <span className="font-medium text-gray-700">{applicantName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Length selector */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Lunghezza della lettera
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedLength('brief')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
              selectedLength === 'brief'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Breve (2-3 paragrafi)
          </button>
          <button
            onClick={() => setSelectedLength('full')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
              selectedLength === 'full'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completa (4-5 paragrafi)
          </button>
        </div>
      </div>

      {/* Tone selector */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Tono della lettera
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toneOptions.map((option) => {
            const isSelected = selectedTone === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedTone(option.value)}
                disabled={isLoading}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isSelected
                    ? `${option.selectedClass} ring-2 shadow-sm`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`flex-shrink-0 mt-0.5 ${
                    isSelected ? option.colorClass : 'text-gray-400'
                  }`}
                >
                  {option.icon}
                </span>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language selector */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Lingua della lettera
        </label>
        <div className="flex gap-2">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${
                selectedLanguage === lang.code
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional instructions */}
      <div className="mb-5">
        <label
          htmlFor="additional-instructions"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Istruzioni aggiuntive{' '}
          <span className="text-gray-400 font-normal">(facoltativo)</span>
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Aggiungi dettagli specifici da includere, aspetti da enfatizzare o qualsiasi altra indicazione.
        </p>
        <textarea
          id="additional-instructions"
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          rows={3}
          disabled={isLoading}
          maxLength={500}
          placeholder="Es. Sottolinea la mia esperienza in project management, menziona la disponibilità immediata..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">
            {additionalInstructions.length} / 500
          </span>
        </div>
      </div>

      {!canGenerate && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-700">
            Aggiungi una descrizione del lavoro per generare la lettera di presentazione.
          </p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading || !canGenerate}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-sm hover:from-indigo-600 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generazione in corso...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Genera Lettera
          </>
        )}
      </button>
    </div>
  );
};
