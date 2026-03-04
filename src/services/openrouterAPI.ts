/// <reference types="vite/client" />
import { CVData } from '../types/cv.types';
import { OptimizationResult, CoverLetterOptions, InterviewPrepResult } from '../types/ai.types';

const getApiKey = (): string => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!key) throw new Error('API key OpenRouter non configurata. Aggiungi VITE_OPENROUTER_API_KEY nel file .env');
  return key;
};

const callOpenRouter = async (prompt: string, maxTokens = 4096): Promise<string> => {
  const apiKey = getApiKey();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'CV Builder AI',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `Errore API: ${response.status}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Risposta inattesa da OpenRouter API');
  }

  return data.choices[0].message.content;
};

const parseJSON = <T>(text: string): T => {
  let jsonStr = text;

  // Try markdown code blocks first
  const markdownMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  if (markdownMatch) {
    jsonStr = markdownMatch[1];
  } else {
    // Try to find JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
  }

  // Aggressive cleanup
  jsonStr = jsonStr
    // Remove comments
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Fix unquoted keys
    .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    // Remove trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix single quotes to double quotes (but preserve escaped quotes)
    .replace(/:\s*'([^']*)'(?=[,}\]])/g, ': "$1"')
    // Remove newlines in strings and fix them
    .replace(/\n\s*/g, ' ')
    // Fix multiple spaces
    .replace(/\s+/g, ' ')
    .trim();

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Try a more aggressive approach: find valid JSON chunks
    console.warn('Parsing JSON fallito, tentando recupero:', e);

    // Try to extract just the first valid JSON object/array
    const match = jsonStr.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        console.error('Recupero fallito:', e2);
      }
    }

    throw new Error(`Errore parsing JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
};

export const optimizeCV = async (cvData: CVData, jobDescription: string): Promise<OptimizationResult> => {
  const prompt = `Sei un esperto recruiter e career coach italiano. Analizza questo CV e ottimizzalo per la seguente offerta di lavoro.

JOB DESCRIPTION:
${jobDescription}

CV ATTUALE (JSON):
${JSON.stringify(cvData, null, 2)}

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

  const text = await callOpenRouter(prompt, 6000);
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

  const languageInstruction = options.language && options.language !== 'it'
    ? `\nLINGUA: Scrivi INTERAMENTE in ${({ en: 'English', fr: 'Français', de: 'Deutsch' } as Record<string, string>)[options.language]}. Adatta formule di apertura/chiusura alle convenzioni del paese.`
    : '';

  const prompt = `Sei un esperto career coach italiano. Scrivi una lettera di presentazione personalizzata.

TONO: ${toneDescriptions[options.tone]}
LUNGHEZZA TARGET: 250-400 parole${languageInstruction}

JOB DESCRIPTION:
${jobDescription}

CV DEL CANDIDATO:
${JSON.stringify(cvData, null, 2)}

${options.additionalInstructions ? `ISTRUZIONI AGGIUNTIVE: ${options.additionalInstructions}` : ''}

REQUISITI LETTERA:
1. Personalizzata per questa specifica offerta
2. Evidenzia le 2-3 esperienze più rilevanti
3. Mostra motivazione e fit culturale
4. Struttura: apertura accattivante, corpo (max 2 paragrafi), chiusura propositiva
5. Includi keywords dall'offerta naturalmente
6. NO cliché come "sono una persona dinamica e proattiva"

Scrivi SOLO la lettera di presentazione, senza commenti aggiuntivi.`;

  return await callOpenRouter(prompt, 2000);
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

  const text = await callOpenRouter(prompt, 5000);
  return parseJSON<CVData>(text);
};

export const generateInterviewPrep = async (cvData: CVData, jobDescription: string): Promise<InterviewPrepResult> => {
  const prompt = `Sei un esperto recruiter e career coach italiano. Analizza questo CV e la job description e genera una preparazione completa per il colloquio.

JOB DESCRIPTION:
${jobDescription}

CV:
${JSON.stringify(cvData, null, 2)}

Genera:
1. 15-20 domande probabili con risposte suggerite usando metodo STAR
2. Analisi dei punti deboli del CV
3. Consigli generali per il colloquio

OUTPUT: Rispondi SOLO con JSON valido:
{
  "questions": [
    {
      "id": "q1",
      "question": "Parlami di te",
      "type": "motivational",
      "difficulty": "low",
      "probability": "high",
      "suggestedAnswer": "Risposta strutturata STAR...",
      "tips": ["Consiglio 1", "Consiglio 2"],
      "keyPoints": ["Punto chiave 1"]
    }
  ],
  "weaknesses": [
    {
      "type": "gap",
      "description": "Gap di 6 mesi nel 2022",
      "suggestions": ["Puoi spiegare dicendo...", "Enfatizza cosa hai fatto nel periodo"]
    }
  ],
  "overallTips": ["Arriva 10 minuti prima", "Porta copia del CV stampata"]
}

I type validi per questions sono: "behavioral", "technical", "motivational", "situational", "weakness"
I type validi per weaknesses sono: "gap", "frequent_change", "missing_skill", "inactivity"
difficulty e probability: "low", "medium", "high"`;

  const text = await callOpenRouter(prompt, 5000);
  return parseJSON<InterviewPrepResult>(text);
};

export const extractTextFromImages = async (
  images: { base64: string; mediaType: string }[]
): Promise<string> => {
  const apiKey = getApiKey();

  const imageContent = images.map((img) => ({
    type: 'image_url' as const,
    image_url: {
      url: `data:${img.mediaType};base64,${img.base64}`,
    },
  }));

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'CV Builder AI',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
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
      max_tokens: 4096,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `Errore API: ${response.status}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message) {
    throw new Error('Risposta inattesa da OpenRouter API');
  }
  return data.choices[0].message.content;
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

  const text = await callOpenRouter(prompt, 1000);
  return parseJSON(text);
};
