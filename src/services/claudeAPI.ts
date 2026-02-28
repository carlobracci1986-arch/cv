/// <reference types="vite/client" />
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
  // Extract JSON from potential markdown code blocks
  const markdownMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
  let jsonStr = markdownMatch ? markdownMatch[1] : text;

  // If no markdown match, try direct JSON match
  if (!markdownMatch) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossibile estrarre JSON dalla risposta');
    }
    jsonStr = jsonMatch[0];
  }

  // Clean up the JSON string carefully
  jsonStr = jsonStr
    .replace(/\r/g, '')                         // Remove carriage returns
    .replace(/\n/g, ' ')                        // Replace all newlines with spaces first
    .replace(/\s+/g, ' ')                       // Collapse multiple spaces
    .replace(/:\s*"([^"]*)"/g, (match, p1) => {  // Fix all quoted strings
      // Replace any remaining escape issues in quoted strings
      const clean = p1
        .replace(/\\+n/g, ' ')                  // Remove any escaped newlines
        .replace(/\\+t/g, ' ')                  // Remove any escaped tabs
        .replace(/\\/g, '\\\\')                 // Escape backslashes
        .replace(/"/g, '\\"')                   // Escape unescaped quotes
        .trim();
      return `: "${clean}"`;
    })
    .replace(/,\s*}/g, '}')                     // Remove trailing commas before }
    .replace(/,\s*\]/g, ']')                    // Remove trailing commas before ]
    .replace(/:\s*\[\s*\]/g, ': []')            // Fix empty arrays
    .replace(/:\s*\{\s*\}/g, ': {}');           // Fix empty objects

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Parsing JSON fallito dopo pulizia:', error);
    console.error('Tentato di parsare:', jsonStr.substring(0, 300));
    throw error;
  }
};

export const optimizeCV = async (cvData: CVData, jobDescription: string): Promise<OptimizationResult> => {
  // Sanitize sensitive data before sending to API
  const sanitizedCV = sanitizeDataForAPI(cvData);

  const prompt = `Sei un esperto recruiter e career coach italiano. Analizza questo CV e ottimizzalo per la seguente offerta di lavoro.

JOB DESCRIPTION:
${jobDescription}

CV ATTUALE (JSON):
${JSON.stringify(sanitizedCV, null, 2)}

COMPITO:
1. Analizza le keyword e competenze richieste nella job description
2. Ottimizza il CV per massimizzare il match mantenendo SEMPRE la veridicità
3. Riformula le descrizioni delle esperienze usando STAR method quando possibile
4. Riordina le competenze mettendo in evidenza quelle più rilevanti
5. Adatta il profilo professionale alle keywords dell'offerta
6. Ottimizza per ATS (Applicant Tracking Systems)

REGOLE CRITICHE:
- NON inventare esperienze o competenze non presenti
- NON modificare date o fatti
- Mantieni lo stesso livello di competenza dichiarato
- Sii onesto ma strategico nella presentazione
- Scrivi in italiano se il CV originale è in italiano

OUTPUT: Rispondi SOLO con JSON valido in questo formato:
{
  "optimizedCV": { ...struttura CV identica all'originale ma ottimizzata... },
  "matchScore": 85,
  "keywordsFound": ["Python", "AWS"],
  "keywordsMissing": ["Docker", "Kubernetes"],
  "changes": [
    {
      "section": "professionalSummary",
      "field": "professionalSummary",
      "before": "testo originale",
      "after": "testo ottimizzato",
      "reason": "Aggiunto focus su X richiesto nell'offerta",
      "accepted": true
    }
  ],
  "suggestions": ["Considera di aggiungere certificazione Y", "Includi link GitHub"]
}`;

  const text = await callClaude(prompt, 6000);
  const result = parseJSON<OptimizationResult>(text);

  // Ensure all changes have accepted: true by default
  result.changes = result.changes.map(c => ({ ...c, accepted: true }));
  return result;
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

  const prompt = `Sei un esperto career coach italiano. Scrivi una lettera di presentazione personalizzata.

TONO: ${toneDescriptions[options.tone]}
LUNGHEZZA: ${lengthDescriptions[options.length || 'full']}

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
- suggestedAnswer MAX 80 parole
- tips: solo 1 elemento per domanda
- keyPoints: solo 1 elemento per domanda
- suggestions per weakness: solo 1 elemento
- overallTips: esattamente 3 elementi
- type validi: "behavioral","technical","motivational","situational","weakness"
- type weaknesses: "gap","frequent_change","missing_skill","inactivity"
- difficulty/probability: "low","medium","high"`;

  const text = await callClaude(prompt, 5000);
  return parseJSON<InterviewPrepResult>(text);
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
