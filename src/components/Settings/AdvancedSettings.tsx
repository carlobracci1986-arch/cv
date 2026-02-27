import React from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { CVSettings, PersonalInfo } from '../../types/cv.types';
import { GDPRConsent } from './GDPRConsent';

interface Props {
  settings: CVSettings;
  personalInfo: PersonalInfo;
  onSettingsChange: (settings: CVSettings) => void;
}

export const AdvancedSettings: React.FC<Props> = ({
  settings,
  personalInfo,
  onSettingsChange,
}) => {
  const handleShowSectionChange = (section: keyof typeof settings.showSections, value: boolean) => {
    onSettingsChange({
      ...settings,
      showSections: {
        ...settings.showSections,
        [section]: value,
      },
    });
  };

  const handleGDPRConsentTypeChange = (type: any) => {
    onSettingsChange({
      ...settings,
      gdprConsentType: type,
    });
  };

  const handleCustomGdprTextChange = (text: string) => {
    onSettingsChange({
      ...settings,
      customGdprText: text,
    });
  };

  const handleIncludeDateChange = (value: boolean) => {
    onSettingsChange({
      ...settings,
      includeConsentDate: value,
    });
  };

  const handleIncludeSignatureChange = (value: boolean) => {
    onSettingsChange({
      ...settings,
      includeSignature: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Visibility */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50">
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Visibilità Sezioni</h3>
        </div>

        <div className="space-y-2">
          {[
            { key: 'professionalSummary', label: 'Profilo Professionale' },
            { key: 'experiences', label: 'Esperienze Lavorative' },
            { key: 'education', label: 'Formazione' },
            { key: 'skills', label: 'Competenze' },
            { key: 'languages', label: 'Lingue' },
            { key: 'certifications', label: 'Certificazioni' },
            { key: 'hobbies', label: 'Hobby e Interessi' },
            { key: 'protectedCategory', label: 'Categorie Protette' },
          ].map((section) => (
            <label
              key={section.key}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={(settings.showSections as any)[section.key]}
                onChange={(e) =>
                  handleShowSectionChange(section.key as any, e.target.checked)
                }
                className="w-4 h-4 rounded accent-purple-600"
              />
              <span className="text-sm font-medium text-gray-700">{section.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* GDPR Configuration */}
      <GDPRConsent
        gdprConsentType={settings.gdprConsentType}
        customGdprText={settings.customGdprText}
        includeConsentDate={settings.includeConsentDate}
        includeSignature={settings.includeSignature}
        personalInfo={personalInfo}
        onConsentTypeChange={handleGDPRConsentTypeChange}
        onCustomTextChange={handleCustomGdprTextChange}
        onIncludeDateChange={handleIncludeDateChange}
        onIncludeSignatureChange={handleIncludeSignatureChange}
      />
    </div>
  );
};
