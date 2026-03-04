import React, { useState } from 'react';
import { Shield, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onConsent: () => void;
  /** If true, renders as a blocking full-screen modal (used in editor).
   *  If false, renders as a non-blocking bottom banner (used on landing). */
  blocking?: boolean;
}

const BULLET_POINTS = [
  'Dati salvati localmente sul tuo browser',
  'Nessun cookie di tracciamento',
  'Dati AI inviati solo con tuo consenso',
  'Puoi cancellare tutti i dati in qualsiasi momento',
];

export const ConsentModal: React.FC<Props> = ({ isOpen, onConsent, blocking = true }) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  // --- Non-blocking banner mode (landing page) ---
  if (!blocking) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-1">La tua privacy è al sicuro</h3>
              <p className="text-sm text-gray-600 mb-3">
                I tuoi dati restano sul tuo dispositivo. Nessun cookie di tracciamento.
                Leggi la nostra{' '}
                <Link
                  to="/privacy-policy"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                        accepted
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 bg-white group-hover:border-blue-400'
                      }`}
                    >
                      {accepted && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">Accetto la Privacy Policy</span>
                </label>
                <button
                  onClick={onConsent}
                  disabled={!accepted}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                    accepted
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Accetta e continua
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Blocking modal mode (editor) ---
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="consent-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-6">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <h1 id="consent-title" className="text-2xl font-bold text-gray-900">
            Benvenuto in CVVincente
          </h1>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          Prima di iniziare, vogliamo spiegarti come trattiamo i tuoi dati personali.
          La tua privacy è la nostra priorità.
        </p>

        {/* Bullet points */}
        <ul className="space-y-3">
          {BULLET_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </span>
              <span className="text-sm text-gray-700">{point}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                accepted
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-white group-hover:border-blue-400'
              }`}
            >
              {accepted && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          <span className="text-sm text-gray-700 leading-relaxed">
            Ho letto e accetto la{' '}
            <Link
              to="/privacy-policy"
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* CTA button */}
        <button
          onClick={onConsent}
          disabled={!accepted}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            accepted
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Inizia a creare il tuo CV
        </button>

        <p className="text-xs text-gray-400 text-center">
          Devi accettare la Privacy Policy per utilizzare l'editor.
        </p>
      </div>
    </div>
  );
};

export default ConsentModal;
