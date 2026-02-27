import React from 'react';
import { Heart, Info, AlertTriangle } from 'lucide-react';
import { ProtectedCategory } from '../../types/cv.types';
import { PROTECTED_CATEGORY_LABELS } from '../../constants/gdprConsent';

interface Props {
  protectedCategory: ProtectedCategory | undefined;
  onProtectedCategoryChange: (category: ProtectedCategory) => void;
}

export const ProtectedCategoryForm: React.FC<Props> = ({
  protectedCategory,
  onProtectedCategoryChange,
}) => {
  const data = protectedCategory || { belongsToProtectedCategory: false };

  const handleToggle = (value: boolean) => {
    onProtectedCategoryChange({
      ...data,
      belongsToProtectedCategory: value,
      categoryType: value ? data.categoryType : undefined,
      categoryTypeOther: value ? data.categoryTypeOther : undefined,
      disabilityPercentage: value ? data.disabilityPercentage : undefined,
      details: value ? data.details : undefined,
    });
  };

  const handleCategoryTypeChange = (value: string) => {
    onProtectedCategoryChange({
      ...data,
      categoryType: (value as any) || undefined,
      categoryTypeOther: value === 'altra' ? data.categoryTypeOther : undefined,
    });
  };

  const handleCategoryTypeOtherChange = (value: string) => {
    onProtectedCategoryChange({
      ...data,
      categoryTypeOther: value,
    });
  };

  const handleDisabilityPercentageChange = (value: string) => {
    const num = value ? parseInt(value, 10) : undefined;
    onProtectedCategoryChange({
      ...data,
      disabilityPercentage: num && num >= 1 && num <= 100 ? num : undefined,
    });
  };

  const handleDetailsChange = (value: string) => {
    onProtectedCategoryChange({
      ...data,
      details: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50">
          <Heart className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Categorie Protette (Opzionale)</h3>
          <p className="text-xs text-gray-500">Legge 68/99 sulla disabilità</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-5 p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Questa sezione è completamente <strong>opzionale</strong>. Le informazioni fornite saranno
          incluse nel CV solo se lo desideri e sono tutelate dalla normativa sulla privacy.
        </p>
      </div>

      {/* Checkbox */}
      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors mb-4">
        <input
          type="checkbox"
          checked={data.belongsToProtectedCategory}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-4 h-4 rounded accent-rose-600"
        />
        <span className="text-sm font-medium text-gray-700">
          Appartengo a categorie protette (Legge 68/99)
        </span>
      </label>

      {/* Conditional Fields */}
      {data.belongsToProtectedCategory && (
        <div className="space-y-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
          {/* Category Type Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipologia Categoria Protetta *
            </label>
            <select
              value={data.categoryType || ''}
              onChange={(e) => handleCategoryTypeChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
            >
              <option value="">Seleziona una categoria...</option>
              <option value="art1">Art. 1 - Disabili con invalidità superiore al 46%</option>
              <option value="art18">Art. 18 - Invalidi di guerra, invalidi civili di guerra, invalidi per servizio</option>
              <option value="altra">Altra categoria</option>
            </select>
          </div>

          {/* Other Category Type Input */}
          {data.categoryType === 'altra' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specifica categoria *
              </label>
              <input
                type="text"
                value={data.categoryTypeOther || ''}
                onChange={(e) => handleCategoryTypeOtherChange(e.target.value)}
                placeholder="Es: Orfani, vedove, profughi..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>
          )}

          {/* Disability Percentage */}
          {(data.categoryType === 'art1' || data.categoryType === 'art18') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Percentuale di invalidità (%)
              </label>
              <input
                type="number"
                value={data.disabilityPercentage || ''}
                onChange={(e) => handleDisabilityPercentageChange(e.target.value)}
                min="1"
                max="100"
                placeholder="Es: 50"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
              />
              <p className="text-xs text-gray-600 mt-1">
                Inserisci la percentuale di invalidità riconosciuta (da 1 a 100)
              </p>
            </div>
          )}

          {/* Details Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note aggiuntive (opzionale)
            </label>
            <textarea
              value={data.details || ''}
              onChange={(e) => handleDetailsChange(e.target.value)}
              placeholder="Eventuali dettagli aggiuntivi..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none resize-none"
            />
          </div>

          {/* Warning Alert */}
          <div className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>⚠️ Attenzione:</strong> Queste informazioni sono sensibili. Verranno incluse
              nel CV solo se mantieni questa sezione abilitata. Puoi rimuoverle in qualsiasi momento.
            </p>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          🔒 <strong>Privacy:</strong> Queste informazioni sono trattate con la massima riservatezza
          e non verranno mai condivise con terze parti senza il tuo consenso esplicito.
        </p>
      </div>
    </div>
  );
};
