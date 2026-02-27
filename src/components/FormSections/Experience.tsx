import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Experience } from '../../types/cv.types';
import { nanoid } from '../../utils/nanoid';

interface Props {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export const ExperienceForm: React.FC<Props> = ({ experiences, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    experiences.length > 0 ? experiences[0].id : null
  );

  const addExperience = () => {
    const newExp: Experience = {
      id: nanoid(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    onChange([...experiences, newExp]);
    setExpandedId(newExp.id);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange(experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-3">
      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nessuna esperienza aggiunta</p>
        </div>
      )}

      {experiences.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {exp.position || 'Nuova Esperienza'} {exp.company ? `@ ${exp.company}` : ''}
                </p>
                <p className="text-xs text-gray-500">
                  {exp.startDate && `${exp.startDate} - ${exp.currentlyWorking ? 'Presente' : exp.endDate || ''}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={e => { e.stopPropagation(); removeExperience(exp.id); }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Rimuovi"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedId === exp.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </div>

          {expandedId === exp.id && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Azienda <span className="text-red-500">*</span></label>
                  <input type="text" value={exp.company}
                    onChange={e => updateExperience(exp.id, { company: e.target.value })}
                    className={inputClass} placeholder="Google" />
                </div>
                <div>
                  <label className={labelClass}>Posizione <span className="text-red-500">*</span></label>
                  <input type="text" value={exp.position}
                    onChange={e => updateExperience(exp.id, { position: e.target.value })}
                    className={inputClass} placeholder="Software Engineer" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Sede</label>
                <input type="text" value={exp.location}
                  onChange={e => updateExperience(exp.id, { location: e.target.value })}
                  className={inputClass} placeholder="Milano, Italia" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Data Inizio</label>
                  <input type="month" value={exp.startDate}
                    onChange={e => updateExperience(exp.id, { startDate: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Data Fine</label>
                  <input type="month" value={exp.endDate}
                    onChange={e => updateExperience(exp.id, { endDate: e.target.value })}
                    className={inputClass} disabled={exp.currentlyWorking} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={exp.currentlyWorking}
                  onChange={e => updateExperience(exp.id, { currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                  className="rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">Lavoro attualmente qui</span>
              </label>

              <div>
                <label className={labelClass}>Descrizione Mansioni</label>
                <textarea value={exp.description}
                  onChange={e => updateExperience(exp.id, { description: e.target.value })}
                  className={`${inputClass} resize-none`} rows={4}
                  placeholder="Descrivi le tue responsabilità e i risultati ottenuti..."
                  maxLength={500} />
                <p className="text-xs text-gray-400 text-right mt-1">{exp.description.length}/500</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addExperience}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi Esperienza
      </button>
    </div>
  );
};
