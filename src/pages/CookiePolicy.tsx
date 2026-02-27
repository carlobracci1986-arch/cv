import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, CheckCircle, XCircle, Info } from 'lucide-react';

interface BadgeProps {
  type: 'yes' | 'no';
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ type, label }) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
      type === 'yes'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-600',
    ].join(' ')}
  >
    {type === 'yes' ? <CheckCircle size={13} /> : <XCircle size={13} />}
    {label}
  </span>
);

interface TableRowProps {
  name: string;
  type: string;
  purpose: string;
  duration: string;
  used: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ name, type, purpose, duration, used }) => (
  <tr className="border-t border-gray-100">
    <td className="py-3 pr-4 text-sm font-medium text-gray-800 whitespace-nowrap">{name}</td>
    <td className="py-3 pr-4 text-sm text-gray-600">{type}</td>
    <td className="py-3 pr-4 text-sm text-gray-600">{purpose}</td>
    <td className="py-3 pr-4 text-sm text-gray-600 whitespace-nowrap">{duration}</td>
    <td className="py-3">
      <Badge type={used ? 'yes' : 'no'} label={used ? 'S&igrave;' : 'No'} />
    </td>
  </tr>
);

export const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 font-medium"
          >
            <ArrowLeft size={16} />
            Torna alla Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Title block */}
        <div className="flex items-start gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-1">
            <Cookie size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Cookie Policy</h1>
            <p className="text-sm text-gray-400 mt-1">
              Ultimo aggiornamento: <time dateTime="2026-02-27">27 Febbraio 2026</time>
            </p>
          </div>
        </div>

        {/* Main callout: no cookies */}
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-10">
          <CheckCircle size={22} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-800 text-base">
              CV Builder non utilizza cookie di tracciamento
            </p>
            <p className="text-sm text-green-700 mt-1 leading-relaxed">
              La nostra applicazione <strong>non installa alcun cookie</strong> sul tuo dispositivo per
              finalit&agrave; di tracciamento, profilazione o marketing. Non utilizziamo Google Analytics,
              Facebook Pixel, n&eacute; alcun altro sistema di monitoraggio del comportamento degli utenti.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold">1.</span> Cosa sono i Cookie?
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              I cookie sono piccoli file di testo che i siti web possono memorizzare sul dispositivo
              dell&apos;utente durante la navigazione. Vengono comunemente utilizzati per ricordare le
              preferenze dell&apos;utente, mantenere le sessioni di accesso, raccogliere statistiche e,
              in alcuni casi, per monitorare il comportamento online a scopi pubblicitari.
            </p>
            <p>
              Ai sensi del <strong>D.Lgs. 196/2003</strong> (come modificato dal D.Lgs. 101/2018),
              delle <strong>Linee guida cookie e altri strumenti di tracciamento</strong> del Garante
              Privacy (10 giugno 2021) e del <strong>GDPR UE 2016/679</strong>, l&apos;utilizzo di
              determinati cookie richiede il consenso preventivo e informato dell&apos;utente.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold">2.</span> Cookie Utilizzati da Questo Sito
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[560px] bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 tracking-wide">
                    <th className="px-4 py-3 pr-4">Nome</th>
                    <th className="px-4 py-3 pr-4">Tipo</th>
                    <th className="px-4 py-3 pr-4">Finalit&agrave;</th>
                    <th className="px-4 py-3 pr-4">Durata</th>
                    <th className="px-4 py-3">Usato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 px-4">
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">Cookie di sessione</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Tecnico</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Navigazione base</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">Sessione</td>
                    <td className="px-4 py-3">
                      <Badge type="no" label="No" />
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">Cookie analitici</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Statistico</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Analisi traffico</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">&mdash;</td>
                    <td className="px-4 py-3">
                      <Badge type="no" label="No" />
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">Cookie di profilazione</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Marketing</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Pubblicit&agrave; mirata</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">&mdash;</td>
                    <td className="px-4 py-3">
                      <Badge type="no" label="No" />
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">Cookie di terze parti</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Vario</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Social, ads, ecc.</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">&mdash;</td>
                    <td className="px-4 py-3">
                      <Badge type="no" label="No" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 italic">
              Nessun cookie &egrave; attualmente installato da questa applicazione.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold">3.</span> localStorage: non &egrave; un Cookie
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info size={17} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800">
                CV Builder utilizza il <strong>localStorage</strong> del browser &mdash; una tecnologia
                diversa dai cookie &mdash; per salvare i dati del curriculum sul tuo dispositivo.
              </p>
            </div>
            <p>
              Il localStorage &egrave; uno spazio di archiviazione locale del browser che, a differenza
              dei cookie:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                <strong>Non viene mai trasmesso automaticamente</strong> al server ad ogni richiesta HTTP
              </li>
              <li>
                Rimane <strong>sul tuo dispositivo</strong> e non &egrave; accessibile da altri siti
              </li>
              <li>
                <strong>Non ha una scadenza automatica</strong>: i dati permangono finch&eacute;
                l&apos;utente non li elimina
              </li>
              <li>
                &Egrave; utilizzato <strong>esclusivamente</strong> per salvare i dati del curriculum tra
                una sessione e l&apos;altra
              </li>
            </ul>
            <p>
              Puoi cancellare i dati del localStorage in qualsiasi momento tramite le impostazioni del
              browser oppure utilizzando le funzioni di eliminazione dati dell&apos;applicazione.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold">4.</span> Come Gestire e Cancellare i Dati
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              Poich&eacute; non utilizziamo cookie, non &egrave; presente un banner di consenso ai cookie
              n&eacute; un pannello di gestione delle preferenze cookie.
            </p>
            <p>
              Per gestire i dati salvati nel localStorage puoi:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                Utilizzare il pulsante <strong>&ldquo;Elimina tutti i dati&rdquo;</strong> presente
                nell&apos;applicazione
              </li>
              <li>
                Cancellare la cache e i dati di navigazione del tuo browser dalle impostazioni del browser
              </li>
              <li>
                Utilizzare la modalit&agrave; di navigazione in incognito/privata: i dati del localStorage
                vengono eliminati automaticamente alla chiusura della sessione
              </li>
            </ul>

            <p className="mt-3 font-medium text-gray-700">Istruzioni per browser comuni:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                <strong>Google Chrome</strong>: Impostazioni &rarr; Privacy e sicurezza &rarr; Cancella
                dati di navigazione &rarr; Seleziona &ldquo;Cookie e altri dati dei siti&rdquo;
              </li>
              <li>
                <strong>Mozilla Firefox</strong>: Impostazioni &rarr; Privacy e sicurezza &rarr;
                Cookie e dati dei siti web &rarr; Cancella dati
              </li>
              <li>
                <strong>Apple Safari</strong>: Preferenze &rarr; Privacy &rarr; Gestisci dati siti
                web &rarr; Rimuovi tutto
              </li>
              <li>
                <strong>Microsoft Edge</strong>: Impostazioni &rarr; Privacy, ricerca e servizi &rarr;
                Cancella dati di navigazione
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold">5.</span> Riferimenti Normativi
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>
                <strong>GDPR</strong> &ndash; Regolamento (UE) 2016/679 del Parlamento europeo e del
                Consiglio
              </li>
              <li>
                <strong>D.Lgs. 196/2003</strong> &ndash; Codice in materia di protezione dei dati
                personali (come modificato dal D.Lgs. 101/2018)
              </li>
              <li>
                <strong>Direttiva ePrivacy</strong> &ndash; Direttiva 2002/58/CE (recepita in Italia con
                D.Lgs. 69/2012)
              </li>
              <li>
                <strong>Linee guida cookie</strong> &ndash; Provvedimento del Garante Privacy del 10
                giugno 2021 (n. 231)
              </li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            <span className="text-blue-600 font-extrabold">6.</span> Contatti
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              Per qualsiasi domanda relativa alla presente Cookie Policy o al trattamento dei tuoi dati,
              contattaci tramite il modulo disponibile nell&apos;applicazione.
            </p>
            <p>
              Per informazioni complete sul trattamento dei dati personali consulta la nostra{' '}
              <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                Informativa sulla Privacy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>&copy; 2026 CV Builder. Tutti i diritti riservati.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Termini di Servizio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
