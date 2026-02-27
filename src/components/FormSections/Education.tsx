import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Education } from '../../types/cv.types';
import { nanoid } from '../../utils/nanoid';

interface Props {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm: React.FC<Props> = ({ education, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    education.length > 0 ? education[0].id : null
  );

  const addEducation = () => {
    const newEdu: Education = {
      id: nanoid(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      grade: '',
      description: '',
    };
    onChange([...education, newEdu]);
    setExpandedId(newEdu.id);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(education.map(edu => edu.id === id ? { ...edu, ...updates } : edu));
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-3">
      {education.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nessuna formazione aggiunta</p>
        </div>
      )}

      {education.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {edu.degree || 'Nuova Formazione'} {edu.institution ? `@ ${edu.institution}` : ''}
                </p>
                <p className="text-xs text-gray-500">
                  {edu.field && <span>{edu.field}</span>}
                  {edu.startDate && (
                    <span className="ml-1">
                      {edu.field ? ' · ' : ''}{edu.startDate} - {edu.currentlyStudying ? 'Presente' : edu.endDate || ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={e => { e.stopPropagation(); removeEducation(edu.id); }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Rimuovi"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedId === edu.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </div>

          {expandedId === edu.id && (
            <div className="p-4 space-y-3">
              <div>
                <label className={labelClass}>Istituto / Università <span className="text-red-500">*</span></label>
                <input type="text" value={edu.institution}
                  onChange={e => updateEducation(edu.id, { institution: e.target.value })}
                  className={inputClass} placeholder="Università degli Studi di Milano" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Titolo di Studio <span className="text-red-500">*</span></label>
                  <input type="text" value={edu.degree}
                    onChange={e => updateEducation(edu.id, { degree: e.target.value })}
                    className={inputClass} placeholder="Laurea Magistrale" />
                </div>
                <div>
                  <label className={labelClass}>Campo di Studi</label>
                  <input type="text" value={edu.field}
                    onChange={e => updateEducation(edu.id, { field: e.target.value })}
                    className={inputClass} placeholder="Informatica" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Data Inizio</label>
                  <input type="month" value={edu.startDate}
                    onChange={e => updateEducation(edu.id, { startDate: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Data Fine</label>
                  <input type="month" value={edu.endDate}
                    onChange={e => updateEducation(edu.id, { endDate: e.target.value })}
                    className={inputClass} disabled={edu.currentlyStudying} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={edu.currentlyStudying}
                  onChange={e => updateEducation(edu.id, { currentlyStudying: e.target.checked, endDate: e.target.checked ? '' : edu.endDate })}
                  className="rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">Sto studiando qui attualmente</span>
              </label>

              <div>
                <label className={labelClass}>Voto / Valutazione</label>
                <input type="text" value={edu.grade}
                  onChange={e => updateEducation(edu.id, { grade: e.target.value })}
                  className={inputClass} placeholder="110/110 con lode" />
              </div>

              <div>
                <label className={labelClass}>Descrizione</label>
                <textarea value={edu.description ?? ''}
                  onChange={e => updateEducation(edu.id, { description: e.target.value })}
                  className={`${inputClass} resize-none`} rows={3}
                  placeholder="Tesi di laurea, attività extra-curriculari, borse di studio..."
                  maxLength={500} />
                <p className="text-xs text-gray-400 text-right mt-1">{(edu.description ?? '').length}/500</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" />
        Aggiungi Formazione
      </button>
    </div>
  );
};
