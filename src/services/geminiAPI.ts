/// <reference types="vite/client" />
import { CVData } from '../types/cv.types';
import { OptimizationResult, CoverLetterOptions, InterviewPrepResult } from '../types/ai.types';

const getApiKey = (): string => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('API key Gemini non configurata. Aggiungi VITE_GEMINI_API_KEY nel file .env');
  return key;
};

const callGemini = async (prompt: string, maxTokens = 4096): Promise<string> => {
  const apiKey = getApiKey();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Risposta inattesa da Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
};

const parseJSON = <T>(text: string): T => {
  // Extract JSON from potential markdown code blocks
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
  return JSON.parse(jsonStr);
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

  const text = await callGemini(prompt, 6000);
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

  const prompt = `Sei un esperto career coach italiano. Scrivi una lettera di presentazione personalizzata.

TONO: ${toneDescriptions[options.tone]}
LUNGHEZZA TARGET: 250-400 parole

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

  return await callGemini(prompt, 2000);
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

  const text = await callGemini(prompt, 5000);
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

  const text = await callGemini(prompt, 5000);
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

  const text = await callGemini(prompt, 1000);
  return parseJSON(text);
};
