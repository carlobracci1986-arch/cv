import React, { useState } from 'react';
import { Plus, Trash2, Award, ChevronDown, ChevronUp, GripVertical, X, Heart, Car } from 'lucide-react';
import { Certification, DrivingLicense, OtherSection } from '../../types/cv.types';
import { nanoid } from '../../utils/nanoid';

interface Props {
  data: OtherSection;
  onChange: (data: OtherSection) => void;
}

export const OtherSectionsForm: React.FC<Props> = ({ data, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    data.certifications.length > 0 ? data.certifications[0].id : null
  );
  const [hobbyInput, setHobbyInput] = useState('');
  const [expandedLicenseId, setExpandedLicenseId] = useState<string | null>(
    data.drivingLicenses.length > 0 ? data.drivingLicenses[0].id : null
  );

  // Certificazioni
  const addCertification = () => {
    const newCert: Certification = {
      id: nanoid(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      url: '',
    };
    onChange({
      ...data,
      certifications: [...data.certifications, newCert],
    });
    setExpandedId(newCert.id);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onChange({
      ...data,
      certifications: data.certifications.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter(c => c.id !== id),
    });
    if (expandedId === id) setExpandedId(null);
  };

  // Hobby
  const addHobby = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (data.hobbies.some(h => h.toLowerCase() === trimmed.toLowerCase())) return;
    onChange({
      ...data,
      hobbies: [...data.hobbies, trimmed],
    });
    setHobbyInput('');
  };

  const removeHobby = (hobby: string) => {
    onChange({
      ...data,
      hobbies: data.hobbies.filter(h => h !== hobby),
    });
  };

  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addHobby(hobbyInput);
    }
  };

  // Patenti
  const addDrivingLicense = () => {
    const newLicense: DrivingLicense = {
      id: nanoid(),
      licenseType: '',
      issuingDate: '',
      expiryDate: '',
    };
    onChange({
      ...data,
      drivingLicenses: [...data.drivingLicenses, newLicense],
    });
    setExpandedLicenseId(newLicense.id);
  };

  const updateDrivingLicense = (id: string, updates: Partial<DrivingLicense>) => {
    onChange({
      ...data,
      drivingLicenses: data.drivingLicenses.map(l =>
        l.id === id ? { ...l, ...updates } : l
      ),
    });
  };

  const removeDrivingLicense = (id: string) => {
    onChange({
      ...data,
      drivingLicenses: data.drivingLicenses.filter(l => l.id !== id),
    });
    if (expandedLicenseId === id) setExpandedLicenseId(null);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-6">
      {/* Certificazioni Section */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Award className="h-4 w-4" />
          Certificazioni
        </h4>

        <div className="space-y-3">
          {data.certifications.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Award className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nessuna certificazione aggiunta</p>
            </div>
          )}

          {data.certifications.map((cert) => (
            <div key={cert.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {cert.name || 'Nuova Certificazione'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cert.issuer && <span>{cert.issuer}</span>}
                      {cert.date && <span className="ml-1">{cert.issuer ? ' · ' : ''}{cert.date}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); removeCertification(cert.id); }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Rimuovi"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expandedId === cert.id
                    ? <ChevronUp className="h-4 w-4 text-gray-400" />
                    : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </div>

              {expandedId === cert.id && (
                <div className="p-4 space-y-3">
                  <div>
                    <label className={labelClass}>Nome Certificazione <span className="text-red-500">*</span></label>
                    <input type="text" value={cert.name}
                      onChange={e => updateCertification(cert.id, { name: e.target.value })}
                      className={inputClass} placeholder="AWS Certified Solutions Architect" />
                  </div>

                  <div>
                    <label className={labelClass}>Ente Rilasciante</label>
                    <input type="text" value={cert.issuer}
                      onChange={e => updateCertification(cert.id, { issuer: e.target.value })}
                      className={inputClass} placeholder="Amazon Web Services" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Data Conseguimento</label>
                      <input type="month" value={cert.date}
                        onChange={e => updateCertification(cert.id, { date: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Data Scadenza</label>
                      <input type="month" value={cert.expiryDate ?? ''}
                        onChange={e => updateCertification(cert.id, { expiryDate: e.target.value })}
                        className={inputClass} placeholder="Opzionale" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>URL / Link di Verifica</label>
                    <input type="url" value={cert.url ?? ''}
                      onChange={e => updateCertification(cert.id, { url: e.target.value })}
                      className={inputClass} placeholder="https://credentials.example.com/verify/..." />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button onClick={addCertification}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Aggiungi Certificazione
          </button>
        </div>
      </div>

      {/* Patenti Section */}
      <div className="border-t pt-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Car className="h-4 w-4" />
          Patenti
        </h4>

        <div className="space-y-3">
          {data.drivingLicenses.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Car className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nessuna patente aggiunta</p>
            </div>
          )}

          {data.drivingLicenses.map((license) => (
            <div key={license.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedLicenseId(expandedLicenseId === license.id ? null : license.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {license.licenseType || 'Nuova Patente'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); removeDrivingLicense(license.id); }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Rimuovi"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expandedLicenseId === license.id
                    ? <ChevronUp className="h-4 w-4 text-gray-400" />
                    : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </div>

              {expandedLicenseId === license.id && (
                <div className="p-4 space-y-3">
                  <div>
                    <label className={labelClass}>Tipologia Patente <span className="text-red-500">*</span></label>
                    <input type="text" value={license.licenseType}
                      onChange={e => updateDrivingLicense(license.id, { licenseType: e.target.value })}
                      className={inputClass} placeholder="es. Patente B, Patente D, ecc." />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Data Conseguimento</label>
                      <input type="month" value={license.issuingDate ?? ''}
                        onChange={e => updateDrivingLicense(license.id, { issuingDate: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Data Scadenza</label>
                      <input type="month" value={license.expiryDate ?? ''}
                        onChange={e => updateDrivingLicense(license.id, { expiryDate: e.target.value })}
                        className={inputClass} placeholder="Opzionale" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button onClick={addDrivingLicense}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Aggiungi Patente
          </button>
        </div>
      </div>

      {/* Hobbies Section */}
      <div className="border-t pt-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Hobby &amp; Interessi
        </h4>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={hobbyInput}
            onChange={e => setHobbyInput(e.target.value)}
            onKeyDown={handleHobbyKeyDown}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Scrivi un hobby e premi Invio..."
          />
          <button
            type="button"
            onClick={() => addHobby(hobbyInput)}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </button>
        </div>

        {data.hobbies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.hobbies.map(hobby => (
              <span
                key={hobby}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200 group"
              >
                {hobby}
                <button
                  type="button"
                  onClick={() => removeHobby(hobby)}
                  className="text-primary-400 hover:text-primary-700 transition-colors ml-0.5"
                  title="Rimuovi"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">Nessun hobby aggiunto</p>
            <p className="text-xs mt-1">Scrivi un hobby nel campo sopra e premi Invio</p>
          </div>
        )}
      </div>
    </div>
  );
};
