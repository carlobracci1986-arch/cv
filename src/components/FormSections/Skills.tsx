import React, { useState } from 'react';
import { Plus, X, Star, Languages } from 'lucide-react';
import { Skill, Language, SkillLevel, LanguageLevel } from '../../types/cv.types';
import { nanoid } from '../../utils/nanoid';

interface Props {
  skills: Skill[];
  languages: Language[];
  onSkillsChange: (skills: Skill[]) => void;
  onLanguagesChange: (languages: Language[]) => void;
}

const LANGUAGE_LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

const StarRating: React.FC<{ value: SkillLevel; onChange: (v: SkillLevel) => void }> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star as SkillLevel)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="p-0.5 focus:outline-none"
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              star <= (hovered ?? value)
                ? 'fill-primary-500 text-primary-500'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const SkillsForm: React.FC<Props> = ({ skills, languages, onSkillsChange, onLanguagesChange }) => {
  const [skillInput, setSkillInput] = useState('');
  const [langName, setLangName] = useState('');
  const [langLevel, setLangLevel] = useState<LanguageLevel>('B2' as LanguageLevel);

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    onSkillsChange([...skills, { id: nanoid(), name: trimmed, level: 3 as SkillLevel, category: 'technical' }]);
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const updateSkillLevel = (id: string, level: SkillLevel) => {
    onSkillsChange(skills.map(s => s.id === id ? { ...s, level } : s));
  };

  const updateSkillCategory = (id: string, category: 'technical' | 'soft') => {
    onSkillsChange(skills.map(s => s.id === id ? { ...s, category } : s));
  };

  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter(s => s.id !== id));
  };

  const addLanguage = () => {
    const trimmed = langName.trim();
    if (!trimmed) return;
    if (languages.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) return;
    onLanguagesChange([...languages, { id: nanoid(), name: trimmed, level: langLevel }]);
    setLangName('');
    setLangLevel('B2');
  };

  const updateLanguageLevel = (id: string, level: LanguageLevel) => {
    onLanguagesChange(languages.map(l => l.id === id ? { ...l, level } : l));
  };

  const removeLanguage = (id: string) => {
    onLanguagesChange(languages.filter(l => l.id !== id));
  };

  const technicalSkills = skills.filter(s => s.category === 'technical');
  const softSkills = skills.filter(s => s.category === 'soft');

  const levelLabel = (level: number) => {
    const labels: Record<number, string> = { 1: 'Base', 2: 'Elementare', 3: 'Intermedio', 4: 'Avanzato', 5: 'Esperto' };
    return labels[level] || '';
  };

  const levelColor = (level: LanguageLevel) => {
    const colors: Record<LanguageLevel, string> = {
      'A1': 'bg-red-100 text-red-700',
      'A2': 'bg-orange-100 text-orange-700',
      'B1': 'bg-yellow-100 text-yellow-700',
      'B2': 'bg-blue-100 text-blue-700',
      'C1': 'bg-green-100 text-green-700',
      'C2': 'bg-emerald-100 text-emerald-700',
      'Native': 'bg-purple-100 text-purple-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Competenze</h4>

        {/* Tag Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Scrivi una competenza e premi Invio..."
          />
          <button
            type="button"
            onClick={() => addSkill(skillInput)}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </button>
        </div>

        {/* Technical Skills */}
        {technicalSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Competenze Tecniche</p>
            <div className="space-y-2">
              {technicalSkills.map(skill => (
                <div key={skill.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group">
                  <span className="flex-1 text-sm text-gray-800 font-medium min-w-0 truncate">{skill.name}</span>
                  <span className="text-xs text-gray-400 w-20 text-right hidden sm:block">{levelLabel(skill.level)}</span>
                  <StarRating value={skill.level} onChange={v => updateSkillLevel(skill.id, v)} />
                  <button
                    type="button"
                    onClick={() => updateSkillCategory(skill.id, 'soft')}
                    className="text-xs text-gray-400 hover:text-primary-600 transition-colors hidden group-hover:block"
                    title="Sposta in Soft Skills"
                  >
                    Soft
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {softSkills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Soft Skills</p>
            <div className="space-y-2">
              {softSkills.map(skill => (
                <div key={skill.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg group">
                  <span className="flex-1 text-sm text-gray-800 font-medium min-w-0 truncate">{skill.name}</span>
                  <span className="text-xs text-gray-400 w-20 text-right hidden sm:block">{levelLabel(skill.level)}</span>
                  <StarRating value={skill.level} onChange={v => updateSkillLevel(skill.id, v)} />
                  <button
                    type="button"
                    onClick={() => updateSkillCategory(skill.id, 'technical')}
                    className="text-xs text-gray-400 hover:text-primary-600 transition-colors hidden group-hover:block"
                    title="Sposta in Competenze Tecniche"
                  >
                    Tech
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">Nessuna competenza aggiunta</p>
            <p className="text-xs mt-1">Scrivi una competenza nel campo sopra e premi Invio</p>
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="border-t pt-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Languages className="h-4 w-4" />
          Lingue
        </h4>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={langName}
            onChange={e => setLangName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLanguage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Nome lingua (es. Inglese)"
          />
          <select
            value={langLevel}
            onChange={e => setLangLevel(e.target.value as LanguageLevel)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {LANGUAGE_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addLanguage}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {languages.length > 0 ? (
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <span className="flex-1 text-sm text-gray-800 font-medium">{lang.name}</span>
                <select
                  value={lang.level}
                  onChange={e => updateLanguageLevel(lang.id, e.target.value as LanguageLevel)}
                  className={`px-2 py-1 rounded-md text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer ${levelColor(lang.level as LanguageLevel)}`}
                >
                  {LANGUAGE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">Nessuna lingua aggiunta</p>
          </div>
        )}
      </div>
    </div>
  );
};
