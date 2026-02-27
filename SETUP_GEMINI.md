# Setup Gemini API per CV Builder

Questo documento spiega come configurare il progetto per usare Google Gemini al posto di Anthropic Claude.

## 1. Ottenere le API Keys

### Per Anthropic Claude (provider di default)
1. Vai a: https://console.anthropic.com
2. Crea un account o accedi
3. Naviga su "API Keys"
4. Crea una nuova API key
5. Copia la key (inizia con `sk-ant-`)

### Per Google Gemini
1. Vai a: https://aistudio.google.com/apikey
2. Accedi con il tuo account Google
3. Clicca su "Create API key"
4. Seleziona il progetto o creane uno nuovo
5. Copia la key (inizia con `AIzaSy`)

## 2. Configurare il file .env

1. Copia il file `.env.example` e rinominalo in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Apri il file `.env` e compila i valori:

```env
# Scegli il provider: 'claude' o 'gemini'
VITE_AI_PROVIDER=gemini

# Anthropic Claude API (opzionale se usi Gemini)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Google Gemini API (opzionale se usi Claude)
VITE_GEMINI_API_KEY=AIzaSy...
```

3. Salva il file

## 3. Testare la configurazione

### Per testare con Gemini:
1. Assicurati che nel `.env` hai:
   ```
   VITE_AI_PROVIDER=gemini
   VITE_GEMINI_API_KEY=tua_api_key_gemini
   ```

2. Avvia il dev server:
   ```bash
   npm run dev
   ```

3. Vai in "AI Tools" → "CV Optimizer"
4. Aggiungi una job description e clicca "Ottimizza CV"
5. Dovresti vedere il progetto usare Gemini

### Per testare con Claude:
1. Cambia nel `.env`:
   ```
   VITE_AI_PROVIDER=claude
   VITE_ANTHROPIC_API_KEY=tua_api_key_claude
   ```

2. Ricarica la pagina nel browser (il dev server si aggiorna automaticamente)
3. Prova di nuovo le stesse operazioni

## 4. Capire il sistema di provider

Il progetto usa un sistema di **provider switcher** in `src/services/aiProvider.ts` che:

1. Legge la variabile `VITE_AI_PROVIDER` dal `.env`
2. Sceglie automaticamente quale servizio usare:
   - `claude` → `src/services/claudeAPI.ts`
   - `gemini` → `src/services/geminiAPI.ts`

3. Espone le stesse funzioni per entrambi i provider:
   - `optimizeCV()` - Ottimizzazione CV basata su job description
   - `generateCoverLetter()` - Generazione lettera di presentazione
   - `generateInterviewPrep()` - Preparazione colloquio
   - `evaluateMockAnswer()` - Valutazione risposte colloquio
   - `translateCV()` - Traduzione CV

## 5. Differenze tra i provider

### Gemini (Google)
- **Modello**: `gemini-2.0-flash`
- **API**: REST API ufficiale
- **Costo**: Generoso free tier con quota di 15 request/minuto
- **Documentazione**: https://ai.google.dev/

### Claude (Anthropic)
- **Modello**: `claude-sonnet-4-20250514`
- **API**: REST API nativa
- **Costo**: Pay-per-use, più caro ma molto preciso
- **Documentazione**: https://docs.anthropic.com/

## 6. Troubleshooting

### Errore: "API key Gemini non configurata"
- Controlla che `VITE_GEMINI_API_KEY` sia presente nel `.env`
- Verifica che il valore sia corretto (non copiato con spazi)
- Assicurati che `VITE_AI_PROVIDER=gemini`

### Errore: "API error: 401"
- La API key è scaduta o non valida
- Genera una nuova key dal sito del provider

### Errore: "API error: 429"
- Hai superato il rate limit
- Aspetta qualche minuto prima di riprovare
- Per Gemini: massimo 15 request/minuto

### La risposta è sempre la stessa anche con provider diverso
- Pulisci la cache del browser (Ctrl+Shift+Delete)
- Ricarica la pagina
- Controlla che il `.env` sia aggiornato

## 7. Monitorare quale provider è attivo

Nel console del browser, vedrai un log che dice quale provider è stato caricato:
```
Usando provider AI: gemini
```

Puoi anche controllare il debug aggiungendo nel codice:
```javascript
import { getCurrentProvider } from '../services/aiProvider';
console.log(getCurrentProvider()); // stampa 'gemini' o 'claude'
```

## 8. Variabili d'ambiente

Assicurati che il tuo `.env` **NON** sia committato su git!

Aggiungi al `.gitignore`:
```
.env
.env.local
.env.*.local
```

## 9. Deploy (Vercel/Netlify)

Se deployi l'app, ricorda di aggiungere le variabili di ambiente nel pannello di configurazione:
- `VITE_AI_PROVIDER`
- `VITE_ANTHROPIC_API_KEY` (se usi Claude)
- `VITE_GEMINI_API_KEY` (se usi Gemini)

---

**Fatto!** 🎉 Il tuo CV Builder AI è pronto a usare Gemini o Claude a tua scelta!
