import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ number, title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-baseline gap-2">
      <span className="text-blue-600 font-extrabold">{number}.</span>
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-2 text-sm">{children}</div>
  </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-3">
    <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
    <div className="text-sm text-gray-600 space-y-1">{children}</div>
  </div>
);

export const PrivacyPolicy: React.FC = () => {
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
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Informativa sulla Privacy</h1>
            <p className="text-sm text-gray-400 mt-1">
              Ultimo aggiornamento: <time dateTime="2026-02-27">27 Febbraio 2026</time>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-700 mb-10 leading-relaxed">
          La presente informativa descrive come <strong>CV Builder</strong> tratta i dati personali degli
          utenti in conformit&agrave; al <strong>Regolamento UE 2016/679 (GDPR)</strong> e al{' '}
          <strong>D.Lgs. 196/2003</strong> (Codice Privacy italiano) come modificato dal D.Lgs. 101/2018.
        </div>

        {/* Sections */}
        <Section number="1" title="Titolare del Trattamento">
          <p>
            Il Titolare del Trattamento dei dati &egrave; il gestore dell&apos;applicazione{' '}
            <strong>CV Builder</strong>. Per qualsiasi questione relativa alla privacy &egrave; possibile
            contattarci tramite i recapiti indicati nella sezione 12 della presente informativa.
          </p>
          <p>
            Non &egrave; stato designato un Data Protection Officer (DPO) in quanto il trattamento non
            rientra nei casi obbligatori previsti dall&apos;art. 37 GDPR.
          </p>
        </Section>

        <Section number="2" title="Principi Generali del Trattamento (GDPR UE 2016/679)">
          <p>
            Il trattamento dei dati personali avviene nel rispetto dei seguenti principi sanciti
            dall&apos;art. 5 GDPR:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
            <li>
              <strong>Liceit&agrave;, correttezza e trasparenza</strong>: i dati sono trattati in modo
              lecito, corretto e trasparente nei confronti dell&apos;interessato.
            </li>
            <li>
              <strong>Limitazione della finalit&agrave;</strong>: i dati sono raccolti per finalit&agrave;
              determinate, esplicite e legittime e non ulteriormente trattati in modo incompatibile.
            </li>
            <li>
              <strong>Minimizzazione dei dati</strong>: solo i dati adeguati, pertinenti e limitati a
              quanto necessario rispetto alle finalit&agrave; sono trattati.
            </li>
            <li>
              <strong>Esattezza</strong>: i dati sono aggiornati e inesatti quando necessario.
            </li>
            <li>
              <strong>Limitazione della conservazione</strong>: i dati sono conservati per il tempo
              strettamente necessario alle finalit&agrave; dichiarate.
            </li>
            <li>
              <strong>Integrit&agrave; e riservatezza</strong>: i dati sono trattati in modo da
              garantire adeguata sicurezza.
            </li>
          </ul>
          <p className="mt-2">
            La base giuridica del trattamento &egrave; il <strong>consenso dell&apos;interessato</strong>{' '}
            (art. 6, par. 1, lett. a GDPR) espresso tramite l&apos;utilizzo volontario dell&apos;applicazione,
            nonch&eacute; il <strong>legittimo interesse</strong> al corretto funzionamento del servizio
            (art. 6, par. 1, lett. f GDPR).
          </p>
        </Section>

        <Section number="3" title="Dati Raccolti">
          <p>
            L&apos;applicazione raccoglie esclusivamente i dati che l&apos;utente inserisce volontariamente
            per la creazione del curriculum vitae. Non vengono raccolti dati di navigazione, non vengono
            utilizzati cookie di tracciamento e non vengono profilati gli utenti.
          </p>

          <SubSection title="Dati del Curriculum Vitae">
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Dati anagrafici: nome, cognome, data di nascita, nazionalit&agrave;</li>
              <li>Contatti: indirizzo e-mail, numero di telefono, indirizzo fisico</li>
              <li>Foto profilo (opzionale, compressa localmente a 300&times;300 px)</li>
              <li>Profilo professionale e obiettivi di carriera</li>
              <li>Esperienze lavorative: aziende, ruoli, date, descrizioni</li>
              <li>Formazione accademica: istituti, titoli, voti, date</li>
              <li>Competenze tecniche e linguistiche</li>
              <li>Certificazioni e corsi di formazione</li>
              <li>Eventuali altri dati inseriti liberamente dall&apos;utente</li>
            </ul>
          </SubSection>

          <SubSection title="Dati Non Raccolti">
            <p>
              L&apos;applicazione <strong>non raccoglie</strong> dati relativi a: origine razziale o
              etnica, opinioni politiche, convinzioni religiose o filosofiche, appartenenza sindacale,
              dati genetici, dati biometrici, dati sulla salute, vita sessuale o orientamento sessuale
              (categorie particolari ai sensi dell&apos;art. 9 GDPR). Si raccomanda all&apos;utente di
              non inserire tali categorie di dati nel curriculum.
            </p>
          </SubSection>
        </Section>

        <Section number="4" title="Dove Sono Conservati i Dati">
          <SubSection title="localStorage del Browser">
            <p>
              Tutti i dati del curriculum sono conservati esclusivamente nel{' '}
              <strong>localStorage</strong> del browser dell&apos;utente sul proprio dispositivo. I dati
              non vengono mai trasmessi a server propri dell&apos;applicazione n&eacute; condivisi con
              terze parti, ad eccezione di quanto indicato al punto seguente.
            </p>
          </SubSection>

          <SubSection title="API Anthropic (Elaborazione Temporanea)">
            <p>
              Se l&apos;utente sceglie di utilizzare le funzionalit&agrave; di assistenza basate su
              intelligenza artificiale, i dati del curriculum vengono temporaneamente trasmessi all&apos;API
              di <strong>Anthropic, Inc.</strong> (USA) per l&apos;elaborazione della richiesta. Tali
              dati sono trattati in modo anonimo, non vengono conservati da Anthropic oltre il tempo
              strettamente necessario all&apos;elaborazione e non vengono utilizzati per addestrare modelli.
              Si rimanda alla sezione 8 per i trasferimenti extra-UE.
            </p>
          </SubSection>
        </Section>

        <Section number="5" title="Durata della Conservazione">
          <p>
            I dati inseriti nel curriculum rimangono nel localStorage del browser dell&apos;utente fino a:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>Cancellazione manuale da parte dell&apos;utente tramite le funzioni dell&apos;applicazione</li>
            <li>Cancellazione manuale della cronologia/dati di navigazione del browser</li>
            <li>Disinstallazione o reset del browser</li>
          </ul>
          <p className="mt-2">
            I dati trasmessi all&apos;API di Anthropic sono conservati esclusivamente per il tempo
            necessario all&apos;elaborazione della singola richiesta (di norma pochi secondi) e
            successivamente eliminati.
          </p>
        </Section>

        <Section number="6" title="Diritti dell'Interessato (GDPR)">
          <p>
            Ai sensi degli artt. 15&ndash;22 del GDPR, l&apos;utente ha i seguenti diritti:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1.5 mt-2">
            <li>
              <strong>Diritto di accesso</strong> (art. 15): ottenere conferma del trattamento e copia
              dei dati personali.
            </li>
            <li>
              <strong>Diritto di rettifica</strong> (art. 16): correggere dati inesatti o completare
              dati incompleti.
            </li>
            <li>
              <strong>Diritto alla cancellazione (&ldquo;diritto all&apos;oblio&rdquo;)</strong> (art. 17):
              ottenere la cancellazione dei propri dati personali. Poich&eacute; tutti i dati sono
              conservati localmente nel browser, l&apos;utente pu&ograve; esercitare questo diritto
              direttamente eliminando i dati dall&apos;applicazione.
            </li>
            <li>
              <strong>Diritto alla limitazione del trattamento</strong> (art. 18): richiedere la
              limitazione del trattamento nelle ipotesi previste dalla norma.
            </li>
            <li>
              <strong>Diritto alla portabilit&agrave;</strong> (art. 20): ricevere i propri dati in
              formato strutturato, di uso comune e leggibile da dispositivo automatico (es. JSON/PDF
              tramite le funzioni di esportazione dell&apos;app).
            </li>
            <li>
              <strong>Diritto di opposizione</strong> (art. 21): opporsi al trattamento dei dati
              personali in qualsiasi momento.
            </li>
            <li>
              <strong>Diritto di non essere sottoposto a decisioni automatizzate</strong> (art. 22):
              non essere soggetto a decisioni basate unicamente sul trattamento automatizzato.
            </li>
          </ul>
          <p className="mt-3">
            Per esercitare i propri diritti, l&apos;utente pu&ograve; contattarci ai recapiti indicati
            nella sezione 12. La risposta verr&agrave; fornita entro 30 giorni dalla ricezione della
            richiesta.
          </p>
        </Section>

        <Section number="7" title="Misure di Sicurezza">
          <p>
            Adottiamo le seguenti misure tecniche e organizzative per proteggere i dati personali:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>
              <strong>HTTPS</strong>: tutta la comunicazione con servizi esterni avviene tramite
              protocollo HTTPS con crittografia TLS.
            </li>
            <li>
              <strong>Nessun backend proprietario</strong>: l&apos;applicazione non possiede server
              propri; i dati rimangono sul dispositivo dell&apos;utente.
            </li>
            <li>
              <strong>Elaborazione locale</strong>: la compressione e il ritaglio delle immagini
              avvengono interamente nel browser tramite Canvas API.
            </li>
            <li>
              <strong>Nessun tracking</strong>: non vengono utilizzati sistemi di analisi, tracker o
              script di terze parti che raccolgano dati comportamentali.
            </li>
          </ul>
          <p className="mt-2">
            Nonostante le misure adottate, nessun sistema di trasmissione o archiviazione dati pu&ograve;
            essere garantito sicuro al 100%. L&apos;utente &egrave; responsabile della sicurezza del
            proprio dispositivo.
          </p>
        </Section>

        <Section number="8" title="Trasferimento Extra-UE">
          <p>
            I dati trasmessi all&apos;API di <strong>Anthropic, Inc.</strong>, con sede negli{' '}
            <strong>Stati Uniti d&apos;America</strong>, sono soggetti al trasferimento di dati personali
            verso paesi terzi rispetto all&apos;Unione Europea.
          </p>
          <p className="mt-2">
            Tale trasferimento avviene nel rispetto dell&apos;art. 46 GDPR, attraverso le{' '}
            <strong>Clausole Contrattuali Standard (SCC)</strong> adottate dalla Commissione Europea
            (Decisione 2021/914/UE), che garantiscono un livello di protezione adeguato. Si invita
            l&apos;utente a consultare l&apos;informativa privacy di Anthropic per ulteriori dettagli:{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              anthropic.com/privacy
            </a>
            .
          </p>
        </Section>

        <Section number="9" title="Cookie Policy">
          <p>
            CV Builder <strong>non utilizza cookie di tracciamento, profilazione o marketing</strong>.
          </p>
          <p className="mt-2">
            L&apos;unico storage utilizzato &egrave; il <strong>localStorage</strong> del browser, che
            non &egrave; un cookie e non viene trasmesso automaticamente a nessun server. Esso &egrave;
            utilizzato esclusivamente per salvare i dati del curriculum sul dispositivo dell&apos;utente
            tra una sessione e l&apos;altra.
          </p>
          <p className="mt-2">
            Per maggiori informazioni consultare la nostra{' '}
            <Link to="/cookie-policy" className="text-blue-600 hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
        </Section>

        <Section number="10" title="Minori">
          <p>
            Il servizio &egrave; destinato a persone maggiorenni o comunque capaci di agire in modo
            autonomo. Ai sensi dell&apos;art. 8 GDPR e dell&apos;art. 2-quinquies D.Lgs. 196/2003:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>
              In <strong>Italia</strong>: i minori di <strong>14 anni</strong> devono ottenere il
              consenso del titolare della responsabilit&agrave; genitoriale.
            </li>
            <li>
              Negli altri <strong>Stati UE</strong>: il limite &egrave; generalmente fissato a{' '}
              <strong>16 anni</strong>, salvo deroghe nazionali.
            </li>
          </ul>
          <p className="mt-2">
            Non raccogliamo consapevolmente dati di minori al di sotto delle soglie indicate. Se
            venissimo a conoscenza di tale trattamento, provvederemo alla cancellazione immediata dei
            dati.
          </p>
        </Section>

        <Section number="11" title="Modifiche alla Present Informativa">
          <p>
            Il Titolare si riserva il diritto di apportare modifiche alla presente informativa in
            qualsiasi momento, dandone comunicazione agli utenti tramite la pubblicazione della versione
            aggiornata nell&apos;applicazione. La data dell&apos;ultimo aggiornamento &egrave; indicata
            in cima alla pagina.
          </p>
          <p className="mt-2">
            L&apos;utilizzo continuato del servizio dopo la pubblicazione delle modifiche costituisce
            accettazione della nuova informativa.
          </p>
        </Section>

        <Section number="12" title="Contatti e Garante Privacy">
          <p>
            Per esercitare i propri diritti o per qualsiasi richiesta relativa al trattamento dei dati
            personali, &egrave; possibile contattarci tramite:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>
              <strong>Email</strong>: utilizzare il modulo di contatto disponibile nell&apos;applicazione
            </li>
          </ul>

          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="font-semibold text-gray-700 mb-1">Garante per la Protezione dei Dati Personali</p>
            <p>
              Qualora l&apos;utente ritenga che il trattamento dei propri dati personali violi il GDPR,
              ha il diritto di proporre reclamo all&apos;Autorit&agrave; di controllo competente:
            </p>
            <address className="not-italic mt-2 space-y-0.5">
              <p>Garante per la Protezione dei Dati Personali</p>
              <p>Piazza Venezia, 11 &ndash; 00187 Roma (RM)</p>
              <p>
                Sito web:{' '}
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.garanteprivacy.it
                </a>
              </p>
            </address>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>&copy; 2026 CV Builder. Tutti i diritti riservati.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Termini di Servizio
            </Link>
            <Link to="/cookie-policy" className="hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
