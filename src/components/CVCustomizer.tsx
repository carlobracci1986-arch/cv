import React, { useRef } from 'react';
import {
  Palette,
  Type,
  Layout,
  Eye,
  Globe,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { CVSettings, FontOption, LanguageCode, SpacingOption, TemplateType } from '../types/cv.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  settings: CVSettings;
  onChange: (settings: Partial<CVSettings>) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRESET_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#059669',
  '#dc2626',
  '#d97706',
  '#0891b2',
  '#db2777',
  '#111827',
];

interface TemplateOption {
  id: TemplateType;
  label: string;
  description: string;
  ats: boolean;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Layout tradizionale con intestazione formale',
    ats: true,
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Design contemporaneo con colonne',
    ats: true,
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Stile essenziale, massima leggibilità',
    ats: false,
  },
];

interface FontOption_ {
  id: FontOption;
  label: string;
  sublabel: string;
}

const FONTS: FontOption_[] = [
  { id: 'inter', label: 'Inter', sublabel: 'Moderno' },
  { id: 'georgia', label: 'Georgia', sublabel: 'Classico' },
  { id: 'playfair', label: 'Playfair', sublabel: 'Elegante' },
];

interface SectionToggle {
  key: keyof CVSettings['showSections'];
  label: string;
  mandatory: boolean;
}

const SECTIONS: SectionToggle[] = [
  { key: 'professionalSummary', label: 'Profilo', mandatory: false },
  { key: 'experiences', label: 'Esperienze', mandatory: true },
  { key: 'education', label: 'Formazione', mandatory: true },
  { key: 'skills', label: 'Competenze', mandatory: false },
  { key: 'languages', label: 'Lingue', mandatory: false },
  { key: 'certifications', label: 'Certificazioni', mandatory: false },
  { key: 'drivingLicenses', label: 'Patenti', mandatory: false },
  { key: 'hobbies', label: 'Hobby & Interessi', mandatory: false },
];

interface LangOption {
  code: LanguageCode;
  flag: string;
  label: string;
}

const LANGUAGES: LangOption[] = [
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
];

// ---------------------------------------------------------------------------
// Small sub-components
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="text-blue-600">{icon}</span>
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
  </div>
);

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false, label }) => (
  <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

// ---------------------------------------------------------------------------
// Template thumbnail
// ---------------------------------------------------------------------------

interface TemplateThumbnailProps {
  id: TemplateType;
  accentColor: string;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ id, accentColor }) => {
  if (id === 'classic') {
    return (
      <svg viewBox="0 0 80 60" className="w-full h-full" aria-hidden="true">
        <rect width="80" height="60" fill="#f9fafb" rx="2" />
        {/* Header bar */}
        <rect x="0" y="0" width="80" height="14" fill={accentColor} rx="2" />
        <rect x="6" y="3" width="30" height="4" fill="white" rx="1" opacity="0.9" />
        <rect x="6" y="8" width="20" height="2.5" fill="white" rx="1" opacity="0.6" />
        {/* Content lines */}
        <rect x="6" y="18" width="68" height="2" fill="#e5e7eb" rx="1" />
        <rect x="6" y="22" width="55" height="2" fill="#e5e7eb" rx="1" />
        <rect x="6" y="28" width="25" height="2.5" fill={accentColor} rx="1" opacity="0.7" />
        <rect x="6" y="33" width="68" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="6" y="36" width="60" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="6" y="39" width="64" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="6" y="44" width="25" height="2.5" fill={accentColor} rx="1" opacity="0.7" />
        <rect x="6" y="49" width="68" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="6" y="52" width="50" height="1.5" fill="#e5e7eb" rx="1" />
      </svg>
    );
  }

  if (id === 'modern') {
    return (
      <svg viewBox="0 0 80 60" className="w-full h-full" aria-hidden="true">
        <rect width="80" height="60" fill="#f9fafb" rx="2" />
        {/* Left sidebar */}
        <rect x="0" y="0" width="26" height="60" fill={accentColor} rx="2" />
        <rect x="3" y="6" width="20" height="8" fill="white" rx="8" opacity="0.3" />
        <rect x="5" y="17" width="16" height="2" fill="white" rx="1" opacity="0.8" />
        <rect x="5" y="21" width="12" height="1.5" fill="white" rx="1" opacity="0.5" />
        <rect x="5" y="28" width="16" height="1.5" fill="white" rx="1" opacity="0.5" />
        <rect x="5" y="31" width="12" height="1.5" fill="white" rx="1" opacity="0.5" />
        <rect x="5" y="34" width="14" height="1.5" fill="white" rx="1" opacity="0.5" />
        {/* Right content */}
        <rect x="30" y="6" width="44" height="2.5" fill="#d1d5db" rx="1" />
        <rect x="30" y="10" width="35" height="2" fill="#e5e7eb" rx="1" />
        <rect x="30" y="16" width="20" height="2.5" fill={accentColor} rx="1" opacity="0.6" />
        <rect x="30" y="21" width="44" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="30" y="24" width="38" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="30" y="27" width="40" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="30" y="33" width="20" height="2.5" fill={accentColor} rx="1" opacity="0.6" />
        <rect x="30" y="38" width="44" height="1.5" fill="#e5e7eb" rx="1" />
        <rect x="30" y="41" width="30" height="1.5" fill="#e5e7eb" rx="1" />
      </svg>
    );
  }

  // minimalist
  return (
    <svg viewBox="0 0 80 60" className="w-full h-full" aria-hidden="true">
      <rect width="80" height="60" fill="#ffffff" rx="2" />
      {/* Thin accent line */}
      <rect x="6" y="0" width="3" height="60" fill={accentColor} rx="1" />
      {/* Name */}
      <rect x="13" y="6" width="35" height="3" fill="#111827" rx="1" />
      <rect x="13" y="11" width="24" height="2" fill="#9ca3af" rx="1" />
      {/* Divider */}
      <rect x="13" y="16" width="61" height="0.75" fill="#e5e7eb" rx="0.5" />
      {/* Content */}
      <rect x="13" y="20" width="20" height="2" fill="#374151" rx="1" />
      <rect x="13" y="24" width="61" height="1.5" fill="#e5e7eb" rx="1" />
      <rect x="13" y="27" width="50" height="1.5" fill="#e5e7eb" rx="1" />
      <rect x="13" y="33" width="20" height="2" fill="#374151" rx="1" />
      <rect x="13" y="37" width="61" height="1.5" fill="#e5e7eb" rx="1" />
      <rect x="13" y="40" width="45" height="1.5" fill="#e5e7eb" rx="1" />
      <rect x="13" y="43" width="55" height="1.5" fill="#e5e7eb" rx="1" />
      <rect x="13" y="49" width="20" height="2" fill="#374151" rx="1" />
      <rect x="13" y="53" width="40" height="1.5" fill="#e5e7eb" rx="1" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const CVCustomizer: React.FC<Props> = ({ settings, onChange }) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleSectionToggle = (key: keyof CVSettings['showSections'], value: boolean) => {
    onChange({
      showSections: {
        ...settings.showSections,
        [key]: value,
      },
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 space-y-5">

        {/* ---------------------------------------------------------------- */}
        {/* 1. Template Selector                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <SectionHeader icon={<Layout className="w-4 h-4" />} title="Template" />
          <div className="grid grid-cols-3 gap-2.5">
            {TEMPLATES.map((tmpl) => {
              const isSelected = settings.template === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onChange({ template: tmpl.id })}
                  className={`relative rounded-lg border-2 p-2 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  {/* ATS badge */}
                  {tmpl.ats && (
                    <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-semibold px-1 py-0.5 rounded border border-emerald-200 leading-none">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      ATS
                    </span>
                  )}

                  {/* Thumbnail */}
                  <div className="w-full aspect-[4/3] rounded overflow-hidden mb-2 border border-gray-100">
                    <TemplateThumbnail id={tmpl.id} accentColor={settings.accentColor} />
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-blue-500" />
                  )}

                  <p className="text-xs font-semibold text-gray-800 leading-tight">{tmpl.label}</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-2">{tmpl.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Color Picker                                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <SectionHeader icon={<Palette className="w-4 h-4" />} title="Colore Accento" />

          {/* Current color preview */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 flex-shrink-0"
              style={{ backgroundColor: settings.accentColor }}
            />
            <span className="text-xs text-gray-500 font-mono">{settings.accentColor}</span>
          </div>

          {/* Preset swatches */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_COLORS.map((color) => {
              const isSelected = settings.accentColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange({ accentColor: color })}
                  title={color}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${
                    isSelected
                      ? 'border-white shadow-lg scale-110 ring-2 ring-offset-1'
                      : 'border-transparent hover:scale-105 hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: color,
                    ringColor: isSelected ? color : undefined,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>

          {/* Custom color input */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Palette className="w-3.5 h-3.5" />
              Colore personalizzato
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={settings.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="sr-only"
              aria-label="Colore personalizzato"
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Typography                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <SectionHeader icon={<Type className="w-4 h-4" />} title="Tipografia" />

          {/* Font selector */}
          <p className="text-xs font-medium text-gray-500 mb-2">Font</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {FONTS.map((f) => {
              const isSelected = settings.font === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange({ font: f.id })}
                  className={`rounded-lg border-2 px-2 py-2.5 text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="block text-sm font-semibold leading-tight"
                    style={{ fontFamily: f.id === 'inter' ? 'Inter, sans-serif' : f.id === 'georgia' ? 'Georgia, serif' : '"Playfair Display", Georgia, serif' }}
                  >
                    {f.label}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">{f.sublabel}</span>
                </button>
              );
            })}
          </div>

          {/* Font size */}
          <p className="text-xs font-medium text-gray-500 mb-2">Dimensione testo</p>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => {
              const labels = { small: 'Piccolo', medium: 'Medio', large: 'Grande' };
              const isSelected = settings.fontSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onChange({ fontSize: size })}
                  className={`flex-1 rounded-lg border-2 py-2 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  {labels[size]}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Layout                                                         */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <SectionHeader icon={<Layout className="w-4 h-4" />} title="Layout" />

          {/* Spacing */}
          <p className="text-xs font-medium text-gray-500 mb-2">Spaziatura</p>
          <div className="flex gap-2 mb-4">
            {([
              { id: 'compact', label: 'Compatto' },
              { id: 'standard', label: 'Standard' },
              { id: 'spacious', label: 'Ampio' },
            ] as { id: SpacingOption; label: string }[]).map((s) => {
              const isSelected = settings.spacing === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ spacing: s.id })}
                  className={`flex-1 rounded-lg border-2 py-2 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Show photo toggle */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">Mostra Foto Profilo</span>
            </div>
            <ToggleSwitch
              checked={settings.showPhoto}
              onChange={(val) => onChange({ showPhoto: val })}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Sections Visibility                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <SectionHeader icon={<Eye className="w-4 h-4" />} title="Sezioni" />
          <div className="space-y-1">
            {SECTIONS.map((section, idx) => {
              const isVisible = settings.showSections[section.key];
              return (
                <div
                  key={section.key}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    section.mandatory ? 'bg-gray-50' : 'hover:bg-gray-50'
                  } ${idx > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-gray-700 font-medium">{section.label}</span>
                    {section.mandatory && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200 leading-none flex-shrink-0">
                        Obbligatorio
                      </span>
                    )}
                  </div>
                  <ToggleSwitch
                    checked={section.mandatory ? true : isVisible}
                    onChange={(val) => handleSectionToggle(section.key, val)}
                    disabled={section.mandatory}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 6. Language Selector                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <SectionHeader icon={<Globe className="w-4 h-4" />} title="Lingua CV" />
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const isSelected = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onChange({ language: lang.code as LanguageCode })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <span role="img" aria-label={lang.label} className="text-base leading-none">
                    {lang.flag}
                  </span>
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CVCustomizer;
