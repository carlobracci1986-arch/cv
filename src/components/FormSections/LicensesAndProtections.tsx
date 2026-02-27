import React, { useState } from 'react';
import { Plus, Trash2, Award, Heart } from 'lucide-react';
import { DrivingLicense, DrivingLicenseCategory, ProtectedCategoryInfo } from '../../types/cv.types';

interface Props {
  drivingLicenses: DrivingLicense[];
  protectedCategory: ProtectedCategoryInfo;
  onDrivingLicensesChange: (licenses: DrivingLicense[]) => void;
  onProtectedCategoryChange: (info: ProtectedCategoryInfo) => void;
}

const LICENSE_CATEGORIES: { value: DrivingLicenseCategory; label: string }[] = [
  { value: 'AM', label: 'AM - Ciclomotori' },
  { value: 'A1', label: 'A1 - Motocicli leggeri' },
  { value: 'A2', label: 'A2 - Motocicli' },
  { value: 'A', label: 'A - Motocicli (illimitato)' },
  { value: 'B1', label: 'B1 - Quadricicli leggeri' },
  { value: 'B', label: 'B - Autovetture' },
  { value: 'C1', label: 'C1 - Autocarri leggeri' },
  { value: 'C', label: 'C - Autocarri' },
  { value: 'D1', label: 'D1 - Autobus piccoli' },
  { value: 'D', label: 'D - Autobus' },
  { value: 'BE', label: 'BE - Rimorchi leggeri' },
  { value: 'C1E', label: 'C1E - Autocarri leggeri + rimorchi' },
  { value: 'CE', label: 'CE - Autocarri + rimorchi' },
  { value: 'D1E', label: 'D1E - Autobus piccoli + rimorchi' },
  { value: 'DE', label: 'DE - Autobus + rimorchi' },
];

const PROTECTED_CATEGORIES = [
  { value: 'none', label: 'Nessuna categoria protetta' },
  { value: 'law_104', label: 'Legge 104/92 - Disabilità' },
  { value: 'ethnic_minority', label: 'Appartenenza a minoranza etnica' },
  { value: 'other', label: 'Altra categoria protetta' },
];

export const LicensesAndProtections: React.FC<Props> = ({
  drivingLicenses,
  protectedCategory,
  onDrivingLicensesChange,
  onProtectedCategoryChange,
}) => {
  const [newLicense, setNewLicense] = useState<Partial<DrivingLicense>>({
    categories: [],
    releaseDate: new Date().toISOString().split('T')[0],
  });

  const handleAddLicense = () => {
    if (newLicense.categories && newLicense.categories.length > 0 && newLicense.releaseDate) {
      const license: DrivingLicense = {
        id: `license-${Date.now()}`,
        categories: newLicense.categories,
        releaseDate: newLicense.releaseDate,
        expiryDate: newLicense.expiryDate,
      };
      onDrivingLicensesChange([...drivingLicenses, license]);
      setNewLicense({ categories: [], releaseDate: new Date().toISOString().split('T')[0] });
    }
  };

  const handleRemoveLicense = (id: string) => {
    onDrivingLicensesChange(drivingLicenses.filter((l) => l.id !== id));
  };

  const toggleCategory = (category: DrivingLicenseCategory) => {
    const current = newLicense.categories || [];
    if (current.includes(category)) {
      setNewLicense({
        ...newLicense,
        categories: current.filter((c) => c !== category),
      });
    } else {
      setNewLicense({
        ...newLicense,
        categories: [...current, category],
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Driving Licenses Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Patenti di Guida</h3>
            <p className="text-xs text-gray-500">Le tue categorie di patente</p>
          </div>
        </div>

        {/* Existing Licenses */}
        {drivingLicenses.length > 0 && (
          <div className="space-y-3 mb-5">
            {drivingLicenses.map((license) => (
              <div
                key={license.id}
                className="flex items-start justify-between p-4 rounded-xl bg-amber-50 border border-amber-100"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {license.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 text-white"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    Rilascio: {new Date(license.releaseDate).toLocaleDateString('it-IT')}
                    {license.expiryDate && (
                      <>
                        {' '}
                        • Scadenza: {new Date(license.expiryDate).toLocaleDateString('it-IT')}
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveLicense(license.id)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Rimuovi patente"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New License */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Aggiungi Patente</h4>

          {/* Categories Grid */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-2 block">Categorie</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LICENSE_CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(newLicense.categories || []).includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                    className="w-4 h-4 rounded accent-amber-600"
                  />
                  <span className="text-xs text-gray-700">{cat.value}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Data Rilascio *
              </label>
              <input
                type="date"
                value={newLicense.releaseDate || ''}
                onChange={(e) => setNewLicense({ ...newLicense, releaseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Data Scadenza
              </label>
              <input
                type="date"
                value={newLicense.expiryDate || ''}
                onChange={(e) => setNewLicense({ ...newLicense, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAddLicense}
            disabled={(newLicense.categories || []).length === 0 || !newLicense.releaseDate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Aggiungi Patente
          </button>
        </div>
      </div>

      {/* Protected Category Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50">
            <Heart className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Categorie Protette</h3>
            <p className="text-xs text-gray-500">Dichiarazione volontaria (Art. 13 GDPR)</p>
          </div>
        </div>

        <div className="space-y-3">
          {PROTECTED_CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="protectedCategory"
                value={cat.value}
                checked={protectedCategory.category === cat.value}
                onChange={() => onProtectedCategoryChange({ category: cat.value as any })}
                className="w-4 h-4 accent-rose-600"
              />
              <span className="text-sm text-gray-700 font-medium">{cat.label}</span>
            </label>
          ))}

          {protectedCategory.category === 'other' && (
            <textarea
              placeholder="Descrivi la tua categoria protetta..."
              value={protectedCategory.description || ''}
              onChange={(e) =>
                onProtectedCategoryChange({
                  ...protectedCategory,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
            />
          )}
        </div>

        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          Ai sensi dell'art. 13 del GDPR, il conferimento di questi dati è completamente volontario.
          I dati dichiarati potranno essere trattati esclusivamente per i fini selezionati dal candidato.
        </p>
      </div>
    </div>
  );
};
