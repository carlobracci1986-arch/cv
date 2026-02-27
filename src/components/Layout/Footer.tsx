import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText } from 'lucide-react';

const LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Termini di Servizio', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
];

const GDPR_TEXT = `
"Con la compilazione del presente CV Builder, il candidato autorizza espressamente il trattamento dei propri dati personali ai sensi dell'articolo 13 del Regolamento (UE) n. 2016/679 (GDPR).
Il conferimento dei dati è completamente volontario.
I dati forniti potranno essere utilizzati esclusivamente per i fini per i quali sono stati racccolti (ricerca di lavoro, valutazione professionale, contatti di reclutamento).
Per esercitare i diritti riconosciuti dal GDPR (accesso, rettifica, cancellazione, limitazione, portabilità), è possibile contattare: privacy@cvbuilder.it"
`;

export const Footer: React.FC = () => {
  const [showGDPRModal, setShowGDPRModal] = React.useState(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
          {/* GDPR Authorization Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Autorizzazione al Trattamento dei Dati (GDPR Art. 13)
                  </h3>
                  <p className="text-xs text-blue-700 leading-relaxed mb-2">
                    Con la compilazione e l'uso di CV Builder, autorizzi il trattamento dei tuoi dati personali secondo quanto previsto dal GDPR.
                  </p>
                  <button
                    onClick={() => setShowGDPRModal(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline transition-colors"
                  >
                    Leggi il testo completo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Brand + GDPR badge */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>© 2024 CV Builder AI - GDPR Compliant</span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Email */}
            <div className="text-sm text-gray-500">
              <a
                href="mailto:privacy@cvbuilder.it"
                className="hover:text-blue-600 transition-colors"
              >
                privacy@cvbuilder.it
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* GDPR Modal */}
      {showGDPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Autorizzazione al Trattamento dei Dati Personali
                </h2>
              </div>
              <button
                onClick={() => setShowGDPRModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {GDPR_TEXT}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Diritti GDPR dell'Interessato:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✓ <strong>Diritto di accesso:</strong> Ottenere conferma del trattamento e accesso ai dati</li>
                  <li>✓ <strong>Diritto di rettifica:</strong> Correggere dati inesatti</li>
                  <li>✓ <strong>Diritto all'oblio:</strong> Richiedere la cancellazione dei dati</li>
                  <li>✓ <strong>Diritto di limitazione:</strong> Limitare il trattamento dei dati</li>
                  <li>✓ <strong>Diritto di portabilità:</strong> Ricevere i dati in formato strutturato</li>
                  <li>✓ <strong>Diritto di opposizione:</strong> Opporsi al trattamento</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
                <strong>Nota:</strong> Per esercitare i tuoi diritti GDPR o per qualsiasi dubbio sul trattamento dei dati, contatta: privacy@cvbuilder.it
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowGDPRModal(false)}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                Ho compreso
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
