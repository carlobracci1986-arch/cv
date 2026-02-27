import React from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Star,
  Award,
  Heart,
} from 'lucide-react';

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
  completionPercent?: number;
}

const SECTIONS = [
  { id: 'personal', label: 'Dati Personali', icon: User },
  { id: 'summary', label: 'Profilo Professionale', icon: FileText },
  { id: 'experience', label: 'Esperienze', icon: Briefcase },
  { id: 'education', label: 'Formazione', icon: GraduationCap },
  { id: 'skills', label: 'Competenze', icon: Star },
  { id: 'certifications', label: 'Certificazioni', icon: Award },
  { id: 'hobbies', label: 'Hobby', icon: Heart },
];

export const Sidebar: React.FC<Props> = ({
  activeSection,
  onSectionChange,
  completionPercent = 0,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, completionPercent));

  return (
    <aside
      className="flex flex-col bg-white border-r border-gray-200 h-full overflow-y-auto"
      style={{ width: 240, minWidth: 240 }}
    >
      {/* Completion progress */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Completamento CV
          </span>
          <span className="text-sm font-bold text-blue-600">{clampedPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
        {clampedPercent < 100 && (
          <p className="mt-1.5 text-xs text-gray-400">
            {clampedPercent < 40
              ? 'Inizia a compilare il tuo CV'
              : clampedPercent < 70
              ? 'Stai facendo progressi!'
              : 'Quasi completo!'}
          </p>
        )}
        {clampedPercent === 100 && (
          <p className="mt-1.5 text-xs text-green-600 font-medium">CV completo!</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <button
                  onClick={() => onSectionChange(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="truncate">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          I dati sono salvati localmente
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
