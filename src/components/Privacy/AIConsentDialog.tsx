import React, { useState } from 'react';
import { Cpu, ExternalLink, Check, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  action: string;
  onConfirm: (saveConsent: boolean) => void;
  onCancel: () => void;
}

export const AIConsentDialog: React.FC<Props> = ({
  isOpen,
  action,
  onConfirm,
  onCancel,
}) => {
  const [rememberChoice, setRememberChoice] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(rememberChoice);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="ai-consent-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-xl flex-shrink-0">
              <Cpu className="w-5 h-5 text-purple-600" />
            </div>
            <h2 id="ai-consent-title" className="text-lg font-bold text-gray-900">
              Consenso Invio Dati AI
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action badge */}
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">
            Azione richiesta
          </p>
          <p className="text-sm font-semibold text-purple-800">{action}</p>
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Per completare questa azione, alcuni dati del tuo CV verranno inviati all'
            <strong>API di Anthropic</strong>. Ecco cosa viene condiviso:
          </p>
          <ul className="space-y-2">
            {[
              'Testo del tuo CV (sezioni rilevanti)',
              'Istruzioni per l\'azione richiesta',
              'Nessun dato sensibile come password o dati di pagamento',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Anthropic privacy link */}
        <a
          href="https://www.anthropic.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          Leggi la Privacy Policy di Anthropic
        </a>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Remember choice checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                rememberChoice
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-white group-hover:border-blue-400'
              }`}
            >
              {rememberChoice && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          <span className="text-sm text-gray-700">Ricorda questa scelta</span>
        </label>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            Procedi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsentDialog;
