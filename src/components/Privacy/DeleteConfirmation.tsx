import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ITEMS_TO_DELETE = [
  'Tutti i tuoi CV e dati personali',
  'Lettere di presentazione',
  'Versioni salvate del CV',
  'Descrizioni delle offerte di lavoro',
  'Preferenze e impostazioni',
];

const CONFIRM_WORD = 'CANCELLA';

export const DeleteConfirmation: React.FC<Props> = ({ isOpen, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const isConfirmEnabled = inputValue === CONFIRM_WORD;

  const handleCancel = () => {
    setInputValue('');
    onCancel();
  };

  const handleConfirm = () => {
    if (!isConfirmEnabled) return;
    setInputValue('');
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-modal="true"
      role="alertdialog"
      aria-labelledby="delete-confirm-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <h2 id="delete-confirm-title" className="text-xl font-bold text-gray-900">
            Eliminazione Dati
          </h2>
        </div>

        {/* What will be deleted */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Verranno eliminati permanentemente:
          </p>
          <ul className="space-y-2">
            {ITEMS_TO_DELETE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Trash2 className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Irreversible alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-800 text-center uppercase tracking-widest">
            IRREVERSIBILE
          </p>
          <p className="text-xs text-red-600 text-center mt-1">
            Questa operazione non può essere annullata. Assicurati di aver esportato un
            backup prima di procedere.
          </p>
        </div>

        {/* Confirmation input */}
        <div className="space-y-2">
          <label
            htmlFor="delete-confirm-input"
            className="block text-sm font-medium text-gray-700"
          >
            Per confermare, digita{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-red-600 font-mono text-xs font-bold">
              {CONFIRM_WORD}
            </code>{' '}
            nel campo sottostante:
          </label>
          <input
            id="delete-confirm-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={CONFIRM_WORD}
            autoComplete="off"
            className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-mono transition-colors outline-none ${
              inputValue === ''
                ? 'border-gray-300 focus:border-red-400'
                : isConfirmEnabled
                ? 'border-green-400 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              isConfirmEnabled
                ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Si, elimina tutto
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
