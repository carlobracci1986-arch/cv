# CV Builder AI 🚀

Un'applicazione web moderna per creare, ottimizzare e gestire il tuo CV con l'intelligenza artificiale.

## ✨ Caratteristiche

### 📋 Editor CV Completo
- ✅ Form split-view (modulo + anteprima in tempo reale)
- ✅ Template professionali (Classic, Modern, Minimalist)
- ✅ Supporto foto profilo
- ✅ Export PDF di alta qualità

### 🤖 AI Features
- **CV Optimizer**: Ottimizza il CV in base alla job description
- **ATS Checker**: Valuta la compatibilità ATS del tuo CV
- **Cover Letter Generator**: Genera lettere di presentazione personalizzate
- **Interview Prep**: Prepara le risposte alle domande di colloquio
- **Mock Interview**: Simula un colloquio con valutazione delle risposte
- **CV Translator**: Traduce il CV in altre lingue

### 🔄 Multi-Provider AI
- 🤖 **Anthropic Claude** (default) - Modello: `claude-sonnet-4-20250514`
- 🔮 **Google Gemini** - Modello: `gemini-2.0-flash`
- 🌐 **OpenRouter** - Modello: `openai/gpt-oss-120b:free`

Cambia provider modificando semplicemente il file `.env`!

### 📊 Gestione Versioni
- Salva più versioni del tuo CV
- Duplica e confronta versioni
- Carica/scarica versioni

## 🛠️ Tecnologie

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Animazioni**: Framer Motion
- **PDF**: jsPDF + html2canvas
- **UI Components**: Lucide React

## 📦 Installazione

### 1. Clone il repository
\`\`\`bash
git clone https://github.com/carlobracci1986-arch/cv.git
cd cv
\`\`\`

### 2. Installa le dipendenze
\`\`\`bash
npm install
\`\`\`

### 3. Configura le API
Copia il file \`.env.example\` in \`.env\`:
\`\`\`bash
cp .env.example .env
\`\`\`

Compila le variabili d'ambiente:
\`\`\`env
VITE_AI_PROVIDER=claude

# Scegli uno di questi provider:
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...      # Claude
VITE_GEMINI_API_KEY=AIzaSy...                # Gemini
VITE_OPENROUTER_API_KEY=sk-or-v1-...         # OpenRouter
\`\`\`

## 🚀 Avvio

### Development
\`\`\`bash
npm run dev
\`\`\`
Apri \`http://localhost:3000\` nel browser

### Build per produzione
\`\`\`bash
npm run build
\`\`\`

## 📖 Setup Dettagliato

### Per Anthropic Claude
1. Vai su: https://console.anthropic.com
2. Crea una nuova API key
3. Aggiungi al \`.env\`:
\`\`\`env
VITE_AI_PROVIDER=claude
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
\`\`\`

### Per Google Gemini
1. Vai su: https://aistudio.google.com/apikey
2. Crea una nuova API key
3. Aggiungi al \`.env\`:
\`\`\`env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=AIzaSy...
\`\`\`

### Per OpenRouter
1. Vai su: https://openrouter.ai/keys
2. Crea una nuova API key
3. Aggiungi al \`.env\`:
\`\`\`env
VITE_AI_PROVIDER=openrouter
VITE_OPENROUTER_API_KEY=sk-or-v1-...
\`\`\`

Per dettagli completi, leggi [SETUP_GEMINI.md](./SETUP_GEMINI.md)

## 🏗️ Struttura del Progetto

\`\`\`
src/
├── components/           # Componenti React
│   ├── AIFeatures/      # Funzionalità AI
│   ├── FormSections/    # Form CV
│   ├── CVTemplates/     # Template CV
│   └── Layout/          # Layout
├── pages/               # Pagine principali
├── services/            # Servizi API
│   ├── aiProvider.ts    # Provider switcher
│   ├── claudeAPI.ts     # Claude integration
│   ├── geminiAPI.ts     # Gemini integration
│   └── openrouterAPI.ts # OpenRouter integration
├── types/               # TypeScript types
├── utils/               # Utilities
├── contexts/            # React contexts
└── hooks/              # Custom hooks
\`\`\`

## 🔐 Sicurezza

- ✅ API keys **mai committate** (protette da \`.gitignore\`)
- ✅ Consensi GDPR gestiti localmente
- ✅ Nessun dato persistente su server
- ✅ LocalStorage per backup locale

## 🚄 CI/CD

Il progetto usa **GitHub Actions** per:
- ✅ Build automatico ad ogni push
- ✅ Deploy automatico su GitHub Pages
- ✅ Controllo di qualità

Visualizza i workflow in: https://github.com/carlobracci1986-arch/cv/actions

## 🐛 Troubleshooting

### Errore API
- Verifica che le API keys siano corrette nel \`.env\`
- Assicurati di avere quota disponibile
- Controlla la console del browser (F12) per dettagli

### Errore Build
\`\`\`bash
# Pulisci e reinstalla
rm -rf node_modules package-lock.json
npm install
npm run build
\`\`\`

## 📄 Licenza

MIT License

## 🤝 Contribuisci

Le pull request sono benvenute!

## 🙏 Ringraziamenti

- Anthropic Claude
- Google Gemini
- OpenRouter
- React & Vite community

---

**Fatto con ❤️ per facilitare la ricerca di lavoro**
