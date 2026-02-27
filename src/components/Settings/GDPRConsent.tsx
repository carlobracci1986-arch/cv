import React from 'react';
import { FileText, Info } from 'lucide-react';
import { GDPRConsentType, PersonalInfo } from '../../types/cv.types';
import { GDPR_CONSENT_TEXTS } from '../../constants/gdprConsent';
import { getGDPRConsentText } from '../../utils/gdprConsent';

interface Props {
  gdprConsentType: GDPRConsentType;
  customGdprText?: string;
  includeConsentDate: boolean;
  includeSignature: boolean;
  personalInfo: PersonalInfo;
  onConsentTypeChange: (type: GDPRConsentType) => void;
  onCustomTextChange: (text: string) => void;
  onIncludeDateChange: (value: boolean) => void;
  onIncludeSignatureChange: (value: boolean) => void;
}

export const GDPRConsent: React.FC<Props> = ({
  gdprConsentType,
  customGdprText,
  includeConsentDate,
  includeSignature,
  personalInfo,
  onConsentTypeChange,
  onCustomTextChange,
  onIncludeDateChange,
  onIncludeSignatureChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Autorizzazione Trattamento Dati (GDPR)</h3>
          <p className="text-xs text-gray-500">Regolamento UE 2016/679 e D.Lgs. 196/2003</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          L'autorizzazione al trattamento dei dati personali è <strong>obbligatoria per legge</strong>
          {' '}in Italia e deve essere presente in ogni CV.
        </p>
      </div>

      {/* Radio Group - Consent Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Scegli il formato dell'autorizzazione
        </label>
        <div className="space-y-2">
          {[
            { value: 'minimal', label: 'Minimale (1 riga)' },
            { value: 'standard', label: 'Standard (consigliato)' },
            { value: 'extended', label: 'Estesa' },
            { value: 'complete', label: 'Completa con dichiarazione veridicità' },
            { value: 'custom', label: 'Personalizzata' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
            >
              <input
                type="radio"
                name="gdpr-consent-type"
                value={option.value}
                checked={gdprConsentType === option.value}
                onChange={(e) => onConsentTypeChange(e.target.value as GDPRConsentType)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Text Textarea */}
      {gdprConsentType === 'custom' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Testo personalizzato
          </label>
          <textarea
            value={customGdprText || ''}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Inserisci il tuo testo di autorizzazione..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Assicurati di includere riferimento al GDPR o alla legge sulla privacy
          </p>
        </div>
      )}

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Anteprima nel CV:</p>
        <p className="text-xs text-gray-700 leading-relaxed italic whitespace-pre-wrap">
          {getGDPRConsentText(
            gdprConsentType,
            customGdprText,
            personalInfo,
            includeConsentDate
          )}
        </p>
      </div>

      {/* Toggle Options */}
      <div className="space-y-3 border-t border-gray-200 pt-6">
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={includeConsentDate}
            onChange={(e) => onIncludeDateChange(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700">Includi data di rilascio autorizzazione</span>
            <p className="text-xs text-gray-500">Aggiunge la data odierna alla fine dell'autorizzazione</p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={includeSignature}
            onChange={(e) => onIncludeSignatureChange(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700">Includi firma (solo per PDF)</span>
            <p className="text-xs text-gray-500">Aggiunge campo firma nel PDF (da firmare a mano o digitalmente)</p>
          </div>
        </label>
      </div>

      {/* Legal Note */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Nota legale:</strong> Questa autorizzazione è conforme alla normativa italiana ed
          europea sulla protezione dei dati personali. Assicurati che il contenuto sia appropriato per
          il contesto di invio del CV.
        </p>
      </div>
    </div>
  );
};
