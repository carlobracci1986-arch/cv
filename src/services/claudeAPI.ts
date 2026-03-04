/// <reference types="vite/client" />
/**
 * claudeAPI.ts — Servizio AI con Claude (Anthropic)
 *
 * STORICO VERSIONI (per ripristino futuro):
 * ──────────────────────────────────────────
 * v1 (commit ~207d035): Prima implementazione con fetch diretta.
 *   - optimizeCV: restituiva intero JSON del CV ottimizzato (max_tokens 6000)
 *   - parseJSON: regex semplice /```json...```/ + JSON.parse diretto
 *   → PROBLEMA: JSON troncato per CV grandi → errore parse
 *
 * v2 (commit ~b3f195a): Cleanup regex aggressivo nel parseJSON
 *   - Aggiunto cleanup: replace \r, \n, trailing commas, quoted strings
 *   → PROBLEMA: il regex /:s*"([^"]*)"/g corrompeva stringhe con escape interni
 *
 * v3 (commit ~3697408): Parser char-by-char (versione corrente stabile)
 *   - parseJSON: 3 tentativi progressivi (as-is → minimal fixes → char-by-char)
 *   - optimizeCV: restituisce SOLO le changes (non intero CV), applica lato client
 *   - generateInterviewPrep: max 8 domande, CV compatto, job desc 5000 chars
 *   - generateCoverLetter: aggiunta opzione length (brief/full)
 *   → STABILE: usa questo approccio come baseline per future modifiche
 *
 * NOTA: Se si vuole tornare a optimizeCV che restituisce l'intero CV,
 *   aumentare max_tokens a 8000 e ridurre il CV input al minimo necessario.
 *   Attenzione: Claude ha limite output ~8096 token per risposta.
 */
import { CVData } from '../types/cv.types';
import { OptimizationResult, CoverLetterOptions, InterviewPrepResult } from '../types/ai.types';
import { sanitizeDataForAPI } from '../utils/gdprConsent';

const getApiKey = (): string => {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!key) throw new Error('API key Anthropic non configurata. Aggiungi VITE_ANTHROPIC_API_KEY nel file .env');
  return key;
};

const callClaude = async (prompt: string, maxTokens = 4096): Promise<string> => {
  const apiKey = getApiKey();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `Errore API: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

const parseJSON = <T>(text: string): T => {
  // Extract JSON from markdown code blocks if present
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = markdownMatch ? markdownMatch[1].trim() : text.trim();

  // If no markdown, find the outermost JSON object
  if (!markdownMatch) {
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Impossibile estrarre JSON dalla risposta');
    jsonStr = jsonStr.substring(start, end + 1);
  }

  // Attempt 1: parse as-is
  try { return JSON.parse(jsonStr); } catch (_) {}

  // Attempt 2: minimal safe fixes only (trailing commas, no string mutation)
  const minimal = jsonStr
    .replace(/,\s*([}\]])/g, '$1')   // trailing commas
    .replace(/\r/g, '');             // carriage returns
  try { return JSON.parse(minimal); } catch (_) {}

  // Attempt 3: fix unescaped newlines/tabs ONLY inside string values
  // Walk char-by-char to safely escape literal newlines inside strings
  let fixed = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < minimal.length; i++) {
    const ch = minimal[i];
    if (escaped) { fixed += ch; escaped = false; continue; }
    if (ch === '\\') { escaped = true; fixed += ch; continue; }
    if (ch === '"') { inString = !inString; fixed += ch; continue; }
    if (inString && ch === '\n') { fixed += '\\n'; continue; }
    if (inString && ch === '\t') { fixed += '\\t'; continue; }
    fixed += ch;
  }
  try { return JSON.parse(fixed); } catch (error) {
    console.error('Parsing JSON fallito dopo tutti i tentativi:', (error as Error).message);
    console.error('Primi 400 char:', fixed.substring(0, 400));
    throw error;
  }
};

export const optimizeCV = async (cvData: CVData, jobDescription: string): Promise<OptimizationResult> => {
  const sanitizedCV = sanitizeDataForAPI(cvData);

  // Compact CV representation to reduce prompt size
  const cvCompact = {
    titolo: sanitizedCV.personalInfo.jobTitle,
    profilo: sanitizedCV.professionalSummary?.substring(0, 400),
    esperienze: sanitizedCV.experiences.map((e: any) => ({
      id: e.id, ruolo: e.position, azienda: e.company,
      desc: e.description?.substring(0, 200),
    })),
    competenze: sanitizedCV.skills.map((s: any) => ({ id: s.id, nome: s.name })),
  };

  const prompt = `Sei un esperto recruiter italiano. Analizza questo CV e genera modifiche di ottimizzazione per la job description.

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

CV ATTUALE:
${JSON.stringify(cvCompact)}

COMPITO: Genera SOLO le modifiche necessarie (NON restituire l'intero CV).
- Riformula profilo professionale con le keyword chiave
- Ottimizza descrizioni esperienze con metodo STAR
- Analizza keyword match

OUTPUT: Rispondi SOLO con JSON compatto in UNA SOLA RIGA:
{"matchScore":85,"keywordsFound":["kw1"],"keywordsMissing":["kw2"],"changes":[{"section":"professionalSummary","field":"professionalSummary","before":"testo prima","after":"testo ottimizzato","reason":"motivo breve","accepted":true}],"suggestions":["suggerimento 1"]}

REGOLE:
- MAX 5 changes totali
- before/after max 150 caratteri ciascuno
- reason max 60 caratteri
- MAX 3 suggestions
- NON restituire optimizedCV - viene costruito lato client
- Output in UNA SOLA RIGA senza newline`;

  const text = await callClaude(prompt, 3000);
  const partial = parseJSON<Omit<OptimizationResult, 'optimizedCV'>>(text);

  // Apply changes to build optimizedCV client-side
  const optimizedCV = JSON.parse(JSON.stringify(sanitizedCV)) as typeof sanitizedCV;
  for (const change of partial.changes ?? []) {
    if (change.section === 'professionalSummary') {
      (optimizedCV as any).professionalSummary = change.after;
    } else if (change.section === 'experience') {
      const exp = (optimizedCV as any).experiences?.find((e: any) => e.id === (change as any).itemId);
      if (exp && change.field) (exp as any)[change.field] = change.after;
    }
  }

  return {
    optimizedCV: optimizedCV as any,
    matchScore: partial.matchScore ?? 0,
    keywordsFound: partial.keywordsFound ?? [],
    keywordsMissing: partial.keywordsMissing ?? [],
    changes: (partial.changes ?? []).map(c => ({ ...c, accepted: true })),
    suggestions: partial.suggestions ?? [],
  };
};

export const generateCoverLetter = async (
  cvData: CVData,
  jobDescription: string,
  options: CoverLetterOptions
): Promise<string> => {
  const toneDescriptions = {
    formal: 'formale e corporate, usando lei',
    professional: 'professionale e bilanciato, usando lei',
    creative: 'creativo e dinamico, usando tu',
    technical: 'tecnico e preciso, focalizzato su competenze',
  };

  const lengthDescriptions = {
    brief: '2-3 paragrafi brevi (150-200 parole)',
    full: '4-5 paragrafi completi (300-450 parole)',
  };

  const lengthGuidelines = {
    brief: `STRUTTURA BREVE:
- Paragrafo 1: Breve introduzione e motivazione (1-2 frasi)
- Paragrafo 2: Una esperienza chiave / competenza rilevante (2-3 frasi)
- Paragrafo 3: Chiusura propositiva (1-2 frasi)`,
    full: `STRUTTURA COMPLETA:
- Paragrafo 1: Introduzione accattivante e motivazione (2-3 frasi)
- Paragrafo 2: Prima esperienza rilevante o competenza principale (2-3 frasi)
- Paragrafo 3: Seconda esperienza o competenza complementare (2-3 frasi)
- Paragrafo 4: Fit culturale e motivazione (1-2 frasi)
- Paragrafo 5: Chiusura propositiva e call to action (1-2 frasi)`,
  };

  const languageInstruction = options.language && options.language !== 'it'
    ? `\nLINGUA: Scrivi INTERAMENTE in ${({ en: 'English', fr: 'Français', de: 'Deutsch' } as Record<string, string>)[options.language]}. Adatta formule di apertura/chiusura alle convenzioni del paese.`
    : '';

  const prompt = `Sei un esperto career coach italiano. Scrivi una lettera di presentazione personalizzata.

TONO: ${toneDescriptions[options.tone]}
LUNGHEZZA: ${lengthDescriptions[options.length || 'full']}${languageInstruction}

JOB DESCRIPTION:
${jobDescription}

CV DEL CANDIDATO:
${JSON.stringify(cvData, null, 2)}

${options.additionalInstructions ? `ISTRUZIONI AGGIUNTIVE: ${options.additionalInstructions}` : ''}

REQUISITI LETTERA:
1. Personalizzata per questa specifica offerta
${options.length === 'brief' ? '2. Evidenzia 1 esperienza chiave' : '2. Evidenzia 2-3 esperienze più rilevanti'}
3. Mostra motivazione e fit culturale
4. ${lengthGuidelines[options.length || 'full']}
5. Includi keywords dall'offerta naturalmente
6. NO cliché come "sono una persona dinamica e proattiva"
7. Rispetta RIGOROSAMENTE la lunghezza indicata

Scrivi SOLO la lettera di presentazione, senza commenti aggiuntivi.`;

  return await callClaude(prompt, 2000);
};

export const translateCV = async (cvData: CVData, targetLanguage: string): Promise<CVData> => {
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish (España)',
    de: 'German',
    fr: 'French',
    it: 'Italian',
  };

  const prompt = `You are a professional translator and career expert. Translate this Italian CV to ${languageNames[targetLanguage] || targetLanguage}.

TRANSLATION RULES:
1. Maintain professional terminology appropriate for the target country's job market
2. Adapt idiomatic expressions, not just translate literally
3. Keep proper names (person name, company names) unchanged
4. Technical terms: keep English technical terms if standard in the field
5. Dates: adapt to target country format
6. Keep the exact same JSON structure

ORIGINAL CV (JSON):
${JSON.stringify(cvData, null, 2)}

OUTPUT: Respond ONLY with valid JSON with the same structure as the input, but with all text fields translated.`;

  const text = await callClaude(prompt, 5000);
  return parseJSON<CVData>(text);
};

export const generateInterviewPrep = async (cvData: CVData, jobDescription: string): Promise<InterviewPrepResult> => {
  // Only send relevant CV fields to reduce prompt size
  const cvSummary = {
    nome: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
    titolo: cvData.personalInfo.jobTitle,
    profilo: cvData.professionalSummary?.substring(0, 300),
    esperienze: cvData.experiences.map(e => ({
      ruolo: e.position, azienda: e.company,
      periodo: `${e.startDate} - ${e.endDate || 'presente'}`,
      descrizione: e.description?.substring(0, 150),
    })),
    formazione: cvData.education.map(e => ({ titolo: e.degree, campo: e.field, istituto: e.institution })),
    competenze: cvData.skills.map(s => s.name).slice(0, 15),
  };

  // Strip spaces for character count, keep up to 5000 non-space chars
  const jdCompact = jobDescription.replace(/\s+/g, ' ').trim();

  const prompt = `Sei un esperto recruiter italiano. Genera domande di colloquio basate su questo CV e job description.

JOB DESCRIPTION:
${jdCompact.substring(0, 5000)}

CV RIASSUNTO:
${JSON.stringify(cvSummary, null, 1)}

Genera ESATTAMENTE 8 domande con risposte brevi (max 80 parole ciascuna) e 2-3 punti deboli.

OUTPUT: Rispondi SOLO con questo JSON minimo e compatto:
{
  "questions": [
    {
      "id": "q1",
      "question": "Domanda breve?",
      "type": "motivational",
      "difficulty": "low",
      "probability": "high",
      "suggestedAnswer": "Risposta breve max 80 parole.",
      "tips": ["Consiglio 1"],
      "keyPoints": ["Punto chiave"]
    }
  ],
  "weaknesses": [
    {
      "type": "gap",
      "description": "Breve descrizione.",
      "suggestions": ["Suggerimento breve"]
    }
  ],
  "overallTips": ["Consiglio 1", "Consiglio 2", "Consiglio 3"]
}

REGOLE STRICT:
- ESATTAMENTE 8 domande, non di più
- suggestedAnswer MAX 60 parole, nessun a capo
- tips: solo 1 elemento per domanda, max 10 parole
- keyPoints: solo 1 elemento per domanda, max 5 parole
- suggestions per weakness: solo 1 elemento, max 15 parole
- overallTips: esattamente 3 elementi, max 10 parole ciascuno
- type validi: "behavioral","technical","motivational","situational","weakness"
- type weaknesses: "gap","frequent_change","missing_skill","inactivity"
- difficulty/probability: "low","medium","high"
- NON usare virgolette nei testi delle stringhe
- NON usare apostrofi nei testi (usa forma senza apostrofo)`;

  const text = await callClaude(prompt, 5000);
  return parseJSON<InterviewPrepResult>(text);
};

export const extractTextFromImages = async (
  images: { base64: string; mediaType: string }[]
): Promise<string> => {
  const apiKey = getApiKey();

  const imageBlocks = images.map((img) => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: img.mediaType,
      data: img.base64,
    },
  }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: `Estrai tutto il testo visibile da queste ${images.length} immagini di un'offerta di lavoro.
Le immagini sono in ordine: unisci il testo in un unico documento coerente.
Mantieni la struttura originale (titoli, elenchi puntati, paragrafi).
Restituisci SOLO il testo estratto, senza commenti o spiegazioni aggiuntive.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `Errore API: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

export const evaluateMockAnswer = async (
  question: string,
  answer: string,
  jobDescription: string
): Promise<{ score: number; feedback: string; improvements: string[] }> => {
  const prompt = `Sei un recruiter esperto. Valuta questa risposta a una domanda di colloquio.

CONTESTO LAVORO: ${jobDescription.substring(0, 500)}

DOMANDA: ${question}

RISPOSTA DEL CANDIDATO: ${answer}

Valuta la risposta e fornisci feedback costruttivo.

OUTPUT JSON:
{
  "score": 75,
  "feedback": "La risposta è... Punti di forza: ... Aree di miglioramento: ...",
  "improvements": ["Aggiungi un esempio concreto", "Quantifica i risultati ottenuti"]
}`;

  const text = await callClaude(prompt, 1000);
  return parseJSON(text);
};
