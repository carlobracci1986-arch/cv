# CV Builder AI

Un'applicazione web completa per creare curriculum vitae professionali con intelligenza artificiale integrata.

## Funzionalità

- **CV Builder Completo** - Form multi-sezione con preview in tempo reale
- **5 Template Professionali** - Classic, Modern, Minimalist (+ Creative, Technical in sviluppo)
- **Ottimizzazione AI** - Claude analizza la job description e ottimizza il tuo CV con diff interattivo
- **ATS Score Checker** - Analisi compatibilità con sistemi ATS (Applicant Tracking Systems)
- **Cover Letter Generator** - Lettere di presentazione personalizzate con tono selezionabile
- **Interview Prep** - Domande probabili e mock interview con timer
- **Esportazione PDF** - PDF professionale ad alta qualità
- **Versioning** - Salva e gestisci multiple versioni del CV
- **Privacy GDPR-Compliant** - Dati salvati solo in localStorage, nessun tracking
- **Responsive** - Ottimizzato per desktop e mobile

## Stack Tecnologico

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **PDF**: jsPDF + html2canvas
- **State**: React Context + useState
- **Routing**: React Router v6
- **Animazioni**: Framer Motion
- **Notifiche**: react-hot-toast
- **Icone**: lucide-react

## Quick Start

### Prerequisiti
- Node.js 18+
- npm 9+
- API key Anthropic (opzionale, solo per funzionalità AI)

### Installazione

```bash
# 1. Entra nella cartella del progetto
cd cv-builder

# 2. Installa le dipendenze
npm install

# 3. Crea il file .env (copia da .env.example)
cp .env.example .env

# 4. Inserisci la tua API key nel file .env
# Modifica .env e inserisci: VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# 5. Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su: **http://localhost:3000**

### Configurazione API Key (Opzionale)

Le funzionalità AI richiedono una API key di Anthropic:

1. Vai su [console.anthropic.com](https://console.anthropic.com)
2. Crea un account e genera una API key
3. Copia la key nel file `.env`:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   ```
4. Riavvia il server (`npm run dev`)

> **Nota**: Senza API key, tutte le funzionalità base (form, preview, PDF, versioning) funzionano normalmente. Solo le features AI (ottimizzazione, cover letter, interview prep) richiedono la key.

## Struttura Progetto

```
src/
├── components/
│   ├── FormSections/      # Form di input CV
│   ├── CVTemplates/       # Template visual (Classic, Modern, Minimalist)
│   ├── AIFeatures/        # Ottimizzatore, ATS, Cover Letter, Interview Prep
│   ├── VersionManager/    # Gestione versioni
│   ├── Privacy/           # GDPR consent, privacy settings
│   └── Layout/            # Header, Footer, Sidebar
├── pages/                 # Editor, Privacy Policy, Terms, Cookie Policy
├── contexts/              # CVContext, PrivacyContext
├── services/              # Claude API service
├── utils/                 # PDF generator, ATS scoring, localStorage
└── types/                 # TypeScript interfaces
```

## Build per Produzione

```bash
npm run build
# Output in /dist - pronto per deploy su Vercel, Netlify, Cloudflare Pages
```

### Deploy su Vercel

```bash
npm install -g vercel
vercel --prod
```

Aggiungi la variabile d'ambiente `VITE_ANTHROPIC_API_KEY` nelle impostazioni del progetto Vercel.

## Privacy & GDPR

- Tutti i dati del CV sono salvati **esclusivamente** nel localStorage del browser
- **Nessun server backend** - zero dati inviati a server propri
- Chiamate API Anthropic avvengono **solo con consenso esplicito**
- **Nessun cookie** di tracking o analytics
- Diritto all'oblio: "Cancella tutti i dati" nelle Impostazioni
- Privacy Policy completa disponibile in-app e su `/privacy-policy`

## Sicurezza

- API key **non esposta** in commit (`.env` in `.gitignore`)
- Input sanitizzati prima della visualizzazione
- HTTPS obbligatorio in produzione
- Nessuna dipendenza con vulnerabilità critiche note

## Licenza

MIT License - Vedi file LICENSE per dettagli

---

Sviluppato con Claude Code AI
