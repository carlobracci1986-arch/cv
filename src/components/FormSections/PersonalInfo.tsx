import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Globe, Linkedin, Github, Briefcase } from 'lucide-react';
import { PersonalInfo as PersonalInfoType } from '../../types/cv.types';

interface Props {
  data: PersonalInfoType;
  onChange: (data: Partial<PersonalInfoType>) => void;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome <span className="text-red-500">*</span></label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" value={data.firstName} onChange={e => onChange({ firstName: e.target.value })}
              className={`${inputClass} pl-9`} placeholder="Mario" required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Cognome <span className="text-red-500">*</span></label>
          <input type="text" value={data.lastName} onChange={e => onChange({ lastName: e.target.value })}
            className={inputClass} placeholder="Rossi" required />
        </div>
      </div>

      <div>
        <label className={labelClass}>Titolo / Posizione <span className="text-red-500">*</span></label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" value={data.jobTitle} onChange={e => onChange({ jobTitle: e.target.value })}
            className={`${inputClass} pl-9`} placeholder="Software Engineer" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email <span className="text-red-500">*</span></label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="email" value={data.email} onChange={e => onChange({ email: e.target.value })}
              className={`${inputClass} pl-9`} placeholder="mario.rossi@email.com" required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Telefono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="tel" value={data.phone} onChange={e => onChange({ phone: e.target.value })}
              className={`${inputClass} pl-9`} placeholder="+39 333 123 4567" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Città</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" value={data.city} onChange={e => onChange({ city: e.target.value })}
              className={`${inputClass} pl-9`} placeholder="Milano" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Paese</label>
          <input type="text" value={data.country} onChange={e => onChange({ country: e.target.value })}
            className={inputClass} placeholder="Italia" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Indirizzo</label>
        <input type="text" value={data.address} onChange={e => onChange({ address: e.target.value })}
          className={inputClass} placeholder="Via Roma 1" />
      </div>

      <div>
        <label className={labelClass}>Data di Nascita</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="date" value={data.dateOfBirth} onChange={e => onChange({ dateOfBirth: e.target.value })}
            className={`${inputClass} pl-9`} />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Link Professionali</h4>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Sito Web / Portfolio</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="url" value={data.website || ''} onChange={e => onChange({ website: e.target.value })}
                className={`${inputClass} pl-9`} placeholder="https://miosito.com" />
            </div>
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="url" value={data.linkedin || ''} onChange={e => onChange({ linkedin: e.target.value })}
                className={`${inputClass} pl-9`} placeholder="https://linkedin.com/in/mariorossi" />
            </div>
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <div className="relative">
              <Github className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="url" value={data.github || ''} onChange={e => onChange({ github: e.target.value })}
                className={`${inputClass} pl-9`} placeholder="https://github.com/mariorossi" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
