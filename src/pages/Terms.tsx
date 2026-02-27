import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

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

export const Terms: React.FC = () => {
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
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Termini di Servizio</h1>
            <p className="text-sm text-gray-400 mt-1">
              Ultimo aggiornamento: <time dateTime="2026-02-27">27 Febbraio 2026</time>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-700 mb-10 leading-relaxed">
          Leggere attentamente i presenti Termini di Servizio prima di utilizzare{' '}
          <strong>CV Builder</strong>. L&apos;utilizzo del servizio implica l&apos;accettazione
          integrale di tutti i termini e le condizioni di seguito riportati.
        </div>

        <Section number="1" title="Accettazione dei Termini">
          <p>
            Accedendo e utilizzando l&apos;applicazione <strong>CV Builder</strong> (&ldquo;il
            Servizio&rdquo;, &ldquo;l&apos;Applicazione&rdquo;), l&apos;utente dichiara di aver letto,
            compreso e accettato integralmente i presenti Termini di Servizio (&ldquo;Termini&rdquo;),
            nonch&eacute; la nostra{' '}
            <Link to="/privacy-policy" className="text-blue-600 hover:underline">
              Informativa sulla Privacy
            </Link>{' '}
            e la{' '}
            <Link to="/cookie-policy" className="text-blue-600 hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
          <p>
            Qualora l&apos;utente non accetti anche solo parzialmente i presenti Termini, &egrave;
            tenuto a interrompere immediatamente l&apos;utilizzo del Servizio.
          </p>
          <p>
            Il Servizio &egrave; disponibile esclusivamente a persone che abbiano raggiunto la
            maggiore et&agrave; o, per i minori, previo consenso del titolare della responsabilit&agrave;
            genitoriale, come indicato nell&apos;Informativa sulla Privacy.
          </p>
        </Section>

        <Section number="2" title="Descrizione del Servizio">
          <p>
            CV Builder &egrave; uno strumento web gratuito che consente agli utenti di creare, modificare
            ed esportare curriculum vitae in formato professionale. Il Servizio offre le seguenti
            funzionalit&agrave;:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>Creazione e modifica di curriculum vitae tramite form guidate</li>
            <li>Anteprima in tempo reale del curriculum</li>
            <li>Esportazione in formato PDF</li>
            <li>Salvataggio automatico dei dati nel browser tramite localStorage</li>
            <li>
              Assistenza opzionale basata su intelligenza artificiale (API Anthropic) per la stesura
              di testi professionali
            </li>
          </ul>
          <p className="mt-2">
            Il Servizio &egrave; fornito <strong>&ldquo;cos&igrave; com&apos;&egrave;&rdquo;</strong>{' '}
            (&ldquo;as is&rdquo;) e <strong>gratuitamente</strong>, senza garanzie di alcun tipo in
            merito alla continuit&agrave;, all&apos;accuratezza o all&apos;idone&igrave;t&agrave; per
            uno scopo specifico.
          </p>
          <p>
            Il Titolare si riserva il diritto di modificare, sospendere o interrompere il Servizio in
            qualsiasi momento, senza preavviso e senza responsabilit&agrave; nei confronti degli utenti.
          </p>
        </Section>

        <Section number="3" title="Propriet&agrave; Intellettuale">
          <p>
            Tutti i diritti di propriet&agrave; intellettuale relativi all&apos;Applicazione &mdash;
            inclusi, a titolo esemplificativo, il codice sorgente, il design, i loghi, le interfacce
            grafiche, i testi e i template di curriculum &mdash; sono di esclusiva propriet&agrave; del
            Titolare o dei rispettivi licenziatari.
          </p>
          <p>
            L&apos;utilizzo del Servizio non trasferisce all&apos;utente alcun diritto di propriet&agrave;
            intellettuale sull&apos;Applicazione. &Egrave; vietata qualsiasi riproduzione, distribuzione,
            modifica, opera derivata, trasmissione o sfruttamento commerciale dell&apos;Applicazione
            senza previa autorizzazione scritta del Titolare.
          </p>
          <p>
            I <strong>contenuti inseriti dall&apos;utente</strong> (testi, immagini, dati del curriculum)
            rimangono di esclusiva propriet&agrave; dell&apos;utente. Il Titolare non rivendica alcun
            diritto su tali contenuti.
          </p>
        </Section>

        <Section number="4" title="Utilizzo Consentito e Vietato">
          <p>
            L&apos;utente si impegna a utilizzare il Servizio esclusivamente per finalit&agrave; lecite
            e personali. In particolare, &egrave; <strong>vietato</strong>:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>
              Utilizzare il Servizio per creare curriculum con dati falsi, fuorvianti o finalizzati a
              commettere frodi
            </li>
            <li>
              Tentare di violare la sicurezza dell&apos;Applicazione, effettuare reverse engineering o
              accedere a parti non autorizzate del codice
            </li>
            <li>
              Utilizzare bot, crawler, scraper o altri sistemi automatizzati per accedere al Servizio
              senza autorizzazione
            </li>
            <li>
              Trasmettere virus, malware o qualsiasi codice malevolo tramite il Servizio
            </li>
            <li>
              Utilizzare il Servizio per scopi commerciali, rivendita o fornitura a terzi senza
              autorizzazione scritta
            </li>
            <li>
              Inserire contenuti illeciti, offensivi, discriminatori o in violazione dei diritti di
              terzi
            </li>
            <li>
              Violare diritti di propriet&agrave; intellettuale, privacy o qualsiasi altra norma
              applicabile
            </li>
          </ul>
          <p className="mt-2">
            Il Titolare si riserva il diritto di sospendere o revocare l&apos;accesso al Servizio in
            caso di violazione dei presenti Termini.
          </p>
        </Section>

        <Section number="5" title="Limitazione di Responsabilit&agrave;">
          <p>
            Nei limiti consentiti dalla legge italiana ed europea, il Titolare non &egrave; responsabile
            per:
          </p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li>
              Danni diretti, indiretti, incidentali, consequenziali o punitivi derivanti
              dall&apos;utilizzo o dall&apos;impossibilit&agrave; di utilizzo del Servizio
            </li>
            <li>
              Perdita di dati causata da malfunzionamenti del browser, pulizia della cache, formattazione
              del dispositivo o qualsiasi altro evento al di fuori del controllo del Titolare
            </li>
            <li>
              Risultati della ricerca di lavoro ottenuti (o non ottenuti) mediante l&apos;utilizzo dei
              curriculum creati con il Servizio
            </li>
            <li>
              Contenuti generati dall&apos;intelligenza artificiale (API Anthropic) che potrebbero
              contenere imprecisioni
            </li>
            <li>
              Accessi non autorizzati ai dati dell&apos;utente dovuti a vulnerabilit&agrave; del
              dispositivo o del browser dell&apos;utente stesso
            </li>
            <li>
              Interruzioni, sospensioni o cessazione del Servizio
            </li>
          </ul>
          <p className="mt-2">
            L&apos;utente &egrave; l&apos;unico responsabile dei contenuti inseriti nel curriculum e del
            loro utilizzo. Il Titolare consiglia di conservare sempre una copia di backup dei propri dati.
          </p>
          <p>
            Nulla di quanto contenuto nei presenti Termini esclude o limita la responsabilit&agrave; del
            Titolare in caso di dolo o colpa grave, n&eacute; qualsiasi responsabilit&agrave; che non
            possa essere esclusa per legge ai sensi del diritto italiano.
          </p>
        </Section>

        <Section number="6" title="Legge Applicabile e Foro Competente">
          <p>
            I presenti Termini di Servizio sono regolati e interpretati in conformit&agrave; alla{' '}
            <strong>legge italiana</strong> e al diritto dell&apos;Unione Europea applicabile.
          </p>
          <p>
            Per qualsiasi controversia relativa all&apos;interpretazione, validit&agrave; o esecuzione
            dei presenti Termini, le parti concordano di tentare in prima istanza una risoluzione
            amichevole. In mancanza di accordo, la controversia sar&agrave; devoluta alla competenza
            esclusiva del <strong>Tribunale ordinario italiano</strong> competente per territorio.
          </p>
          <p>
            Qualora l&apos;utente sia un consumatore ai sensi del D.Lgs. 206/2005 (Codice del Consumo),
            potr&agrave; ricorrere alla piattaforma europea di risoluzione delle controversie online (ODR)
            disponibile all&apos;indirizzo:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </Section>

        <Section number="7" title="Modifiche ai Termini">
          <p>
            Il Titolare si riserva il diritto di modificare i presenti Termini in qualsiasi momento.
            Le modifiche saranno pubblicate nell&apos;Applicazione con indicazione della data di
            aggiornamento. L&apos;utilizzo continuato del Servizio dopo la pubblicazione delle modifiche
            costituisce accettazione dei nuovi Termini.
          </p>
          <p>
            In caso di modifiche sostanziali, il Titolare far&agrave; ragionevoli sforzi per
            informare gli utenti con adeguato preavviso.
          </p>
        </Section>

        <Section number="8" title="Contatti">
          <p>
            Per qualsiasi domanda, segnalazione o richiesta relativa ai presenti Termini di Servizio,
            &egrave; possibile contattarci tramite il modulo di contatto disponibile nell&apos;applicazione.
          </p>
          <p className="mt-2">
            Per questioni relative alla privacy e ai dati personali, si rimanda all&apos;
            <Link to="/privacy-policy" className="text-blue-600 hover:underline">
              Informativa sulla Privacy
            </Link>
            .
          </p>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>&copy; 2026 CV Builder. Tutti i diritti riservati.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
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
