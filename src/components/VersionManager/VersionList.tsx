import React, { useState } from 'react';
import { CVVersion } from '../../types/cv.types';
import { VersionCard } from './VersionCard';
import { Plus, Layers, X, Check } from 'lucide-react';

interface Props {
  versions: CVVersion[];
  currentVersionId: string | null;
  onLoad: (version: CVVersion) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSaveNew: (name: string) => void;
}

export const VersionList: React.FC<Props> = ({
  versions,
  currentVersionId,
  onLoad,
  onDelete,
  onDuplicate,
  onSaveNew,
}) => {
  const [showNameInput, setShowNameInput] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSave = () => {
    const trimmed = versionName.trim();
    if (!trimmed) {
      setNameError('Inserisci un nome per la versione.');
      return;
    }
    if (versions.some((v) => v.name.toLowerCase() === trimmed.toLowerCase())) {
      setNameError('Esiste già una versione con questo nome.');
      return;
    }
    onSaveNew(trimmed);
    setVersionName('');
    setNameError('');
    setShowNameInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setShowNameInput(false);
      setVersionName('');
      setNameError('');
    }
  };

  const handleCancelInput = () => {
    setShowNameInput(false);
    setVersionName('');
    setNameError('');
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Versioni del CV</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {versions.length} {versions.length === 1 ? 'versione salvata' : 'versioni salvate'}
          </p>
        </div>

        {!showNameInput ? (
          <button
            onClick={() => setShowNameInput(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Salva Versione
          </button>
        ) : null}
      </div>

      {/* Name input panel */}
      {showNameInput && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-900">Nuova versione</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={versionName}
              onChange={(e) => {
                setVersionName(e.target.value);
                if (nameError) setNameError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Es. Versione per Acme S.p.A."
              autoFocus
              className={`flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                nameError
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-blue-300 bg-white focus:border-blue-500'
              }`}
            />
            <button
              onClick={handleSave}
              className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Salva"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelInput}
              className="p-2.5 bg-white border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
              title="Annulla"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {nameError && <p className="text-xs text-red-600">{nameError}</p>}
          <p className="text-xs text-blue-600">
            Premi Invio per salvare, Esc per annullare.
          </p>
        </div>
      )}

      {/* Versions grid */}
      {versions.length === 0 ? (
        <EmptyState onSave={() => setShowNameInput(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {versions.map((version) => (
            <VersionCard
              key={version.id}
              version={version}
              isCurrent={version.id === currentVersionId}
              onLoad={() => onLoad(version)}
              onDelete={() => onDelete(version.id)}
              onDuplicate={() => onDuplicate(version.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface EmptyStateProps {
  onSave: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSave }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
      <Layers className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-700 mb-2">Nessuna versione salvata</h3>
    <p className="text-sm text-gray-500 max-w-xs mb-6">
      Salva diverse versioni del tuo CV personalizzate per ogni candidatura, ad esempio
      per aziende diverse o ruoli specifici.
    </p>
    <button
      onClick={onSave}
      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Salva Prima Versione
    </button>
  </div>
);

export default VersionList;
