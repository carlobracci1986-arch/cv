/// <reference types="vite/client" />
/**
 * atsScoring.ts — Valutazione ATS del CV
 *
 * STORICO VERSIONI (per ripristino futuro):
 * ──────────────────────────────────────────
 * v1 (commit ~207d035): calculateATSScore() — algoritmo locale rule-based
 *   - Valutazione basata su regole fisse (email, telefono, esperienze, ecc.)
 *   - Nessuna chiamata API, risultato istantaneo
 *   → Se si vuole tornare all'algoritmo locale, usare calculateATSScore()
 *     che è ancora presente nel file e funzionante.
 *
 * v2 (commit ~ff5adf1): evaluateATSWithClaude() — valutazione AI (versione corrente)
 *   - Chiama Claude API con il testo del CV formattato
 *   - Restituisce score, issues, passedChecks, keywords presenti/mancanti
 *   - Fallback recovery: estrae lo score anche se il JSON è parzialmente malformato
 *   - Il parsing JSON ora usa il parseJSON centralizzato (char-by-char)
 *   → STABILE: usa evaluateATSWithClaude come funzione principale
 *
 * NOTA: Per richiamare l'algoritmo locale senza API, basta importare
 *   calculateATSScore invece di evaluateATSWithClaude in Editor.tsx
 */
import { CVData, CVSettings } from '../types/cv.types';
import { ATSScoreResult, ATSIssue } from '../types/ai.types';

export const calculateATSScore = (cvData: CVData, settings: CVSettings, jobKeywords?: string[]): ATSScoreResult => {
  const issues: ATSIssue[] = [];
  const passedChecks: string[] = [];
  let totalScore = 100;

  // Check contact info
  if (!cvData.personalInfo.email) {
    issues.push({ id: 'no-email', severity: 'critical', category: 'content', message: 'Email mancante', suggestion: 'Aggiungi indirizzo email', autoFixable: false });
    totalScore -= 15;
  } else passedChecks.push('Email presente');

  if (!cvData.personalInfo.phone) {
    issues.push({ id: 'no-phone', severity: 'warning', category: 'content', message: 'Telefono mancante', suggestion: 'Aggiungi numero di telefono', autoFixable: false });
    totalScore -= 5;
  } else passedChecks.push('Telefono presente');

  if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
    issues.push({ id: 'no-name', severity: 'critical', category: 'content', message: 'Nome o cognome mancante', suggestion: 'Inserisci nome e cognome completi', autoFixable: false });
    totalScore -= 20;
  } else passedChecks.push('Nome completo presente');

  // Check professional summary
  if (!cvData.professionalSummary || cvData.professionalSummary.length < 50) {
    issues.push({ id: 'no-summary', severity: 'warning', category: 'content', message: 'Profilo professionale mancante o troppo breve', suggestion: 'Aggiungi un profilo professionale di almeno 50 caratteri', autoFixable: false });
    totalScore -= 10;
  } else passedChecks.push('Profilo professionale presente');

  // Check experiences
  if (cvData.experiences.length === 0) {
    issues.push({ id: 'no-experience', severity: 'warning', category: 'content', message: 'Nessuna esperienza lavorativa', suggestion: 'Aggiungi almeno un\'esperienza lavorativa', autoFixable: false });
    totalScore -= 15;
  } else {
    passedChecks.push('Esperienze lavorative presenti');
    cvData.experiences.forEach((exp, i) => {
      if (!exp.description || exp.description.length < 30) {
        issues.push({ id: `exp-no-desc-${i}`, severity: 'warning', category: 'content', message: `Descrizione mancante per: ${exp.position} @ ${exp.company}`, suggestion: 'Aggiungi una descrizione dettagliata delle mansioni', autoFixable: false });
        totalScore -= 5;
      }
    });
  }

  // Check education
  if (cvData.education.length === 0) {
    issues.push({ id: 'no-education', severity: 'info', category: 'content', message: 'Nessuna formazione inserita', suggestion: 'Aggiungi almeno un titolo di studio', autoFixable: false });
    totalScore -= 5;
  } else passedChecks.push('Formazione presente');

  // Check skills
  if (cvData.skills.length === 0) {
    issues.push({ id: 'no-skills', severity: 'warning', category: 'content', message: 'Nessuna competenza inserita', suggestion: 'Aggiungi le tue competenze tecniche e trasversali', autoFixable: false });
    totalScore -= 10;
  } else if (cvData.skills.length < 5) {
    issues.push({ id: 'few-skills', severity: 'info', category: 'content', message: 'Poche competenze (meno di 5)', suggestion: 'Aggiungi più competenze per aumentare la visibilità ATS', autoFixable: false });
    totalScore -= 3;
  } else passedChecks.push('Competenze presenti');

  // Check ATS-friendly template
  if (settings.template === 'creative') {
    issues.push({ id: 'creative-template', severity: 'warning', category: 'formatting', message: 'Template creativo non ottimale per ATS', suggestion: 'Usa il template Classic o Modern per migliore compatibilità ATS', autoFixable: true });
    totalScore -= 10;
  } else passedChecks.push('Template ATS-friendly');

  // Photo check
  if (settings.showPhoto && cvData.personalInfo.profilePhoto) {
    issues.push({ id: 'photo-ats', severity: 'info', category: 'formatting', message: 'La foto profilo potrebbe essere ignorata dagli ATS', suggestion: 'Alcuni ATS ignorano le immagini. Valuta se necessaria', autoFixable: false });
  }

  // Keywords check
  const cvText = [
    cvData.professionalSummary,
    ...cvData.experiences.map(e => `${e.position} ${e.description}`),
    ...cvData.skills.map(s => s.name),
  ].join(' ').toLowerCase();

  const keywordsFound: string[] = [];
  const keywordsMissing: string[] = [];

  if (jobKeywords && jobKeywords.length > 0) {
    jobKeywords.forEach(kw => {
      if (cvText.includes(kw.toLowerCase())) {
        keywordsFound.push(kw);
      } else {
        keywordsMissing.push(kw);
      }
    });

    if (keywordsMissing.length > 0) {
      issues.push({
        id: 'missing-keywords',
        severity: 'warning',
        category: 'keywords',
        message: `Mancano ${keywordsMissing.length} keywords dalla job description`,
        suggestion: `Keywords mancanti: ${keywordsMissing.slice(0, 5).join(', ')}${keywordsMissing.length > 5 ? '...' : ''}`,
        autoFixable: false,
      });
      totalScore -= Math.min(keywordsMissing.length * 3, 20);
    }
  }

  // Clamp score
  const finalScore = Math.max(0, Math.min(100, totalScore));

  const getLevel = (score: number): ATSScoreResult['level'] => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs_improvement';
    return 'poor';
  };

  return {
    score: finalScore,
    level: getLevel(finalScore),
    issues,
    passedChecks,
    keywordsPresent: keywordsFound,
    keywordsMissing,
  };
};

/**
 * Evaluate CV readability and ATS compatibility using Claude AI
 * Provides intelligent feedback on CV structure, content, and ATS-friendliness
 */
export const evaluateATSWithClaude = async (
  cvData: CVData,
  settings: CVSettings,
  jobKeywords?: string[]
): Promise<ATSScoreResult> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  console.log('ATS Evaluation - API Key configured:', !!apiKey);
  console.log('Environment variables:', {
    hasKey: !!apiKey,
    provider: import.meta.env.VITE_AI_PROVIDER,
  });

  if (!apiKey) {
    const error = 'API key Anthropic non configurata. Aggiungi VITE_ANTHROPIC_API_KEY nel file .env';
    console.error(error);
    throw new Error(error);
  }

  // Format CV data for Claude
  const cvText = formatCVForAnalysis(cvData);

  const prompt = `Analizza questo CV per la leggibilità ATS (Applicant Tracking System) e fornisci una valutazione dettagliata in formato JSON.

CV:
${cvText}

${jobKeywords ? `Keywords dalla job description: ${jobKeywords.join(', ')}` : ''}

Fornisci una risposta JSON con questa struttura esatta:
{
  "score": <numero 0-100>,
  "level": "excellent" | "good" | "needs_improvement" | "poor",
  "issues": [
    {
      "id": "unique-id",
      "severity": "critical" | "warning" | "info",
      "category": "content" | "formatting" | "keywords",
      "message": "descrizione del problema",
      "suggestion": "suggerimento per risolvere"
    }
  ],
  "passedChecks": ["elemento 1", "elemento 2"],
  "keywordsPresent": [${jobKeywords ? '"keyword1", "keyword2"' : ''}],
  "keywordsMissing": [${jobKeywords ? '"keyword3"' : ''}]
}

Valuta:
1. Completezza dei dati (nome, email, telefono)
2. Chiarezza e struttura del contenuto
3. Presenze di esperienze e formazione
4. Qualità delle descrizioni
5. Leggibilità per i sistemi ATS
6. Corrispondenza con i keywords della job description (se forniti)
7. Formatting compatibility con ATS

Score: 90-100 = Eccellente, 70-89 = Buono, 50-69 = Migliorabile, 0-49 = Povero`;

  try {
    console.log('Fetching ATS evaluation from Claude...');

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
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    console.log('API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
      const errorMsg = err.error?.message || `API error: ${response.status}`;
      console.error('API Error:', errorMsg);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('API Response received:', !!data.content);

    const responseText = data.content[0].text;
    console.log('Claude response (first 200 chars):', responseText.substring(0, 200));

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr: string;

    // Try markdown code block first
    const markdownMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
    if (markdownMatch) {
      jsonStr = markdownMatch[1];
    } else {
      // Try direct JSON match
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Failed to parse JSON from response:', responseText);
        throw new Error('Failed to parse Claude response - no JSON found');
      }
      jsonStr = jsonMatch[0];
    }

    // Clean up the JSON string carefully
    jsonStr = jsonStr
      .replace(/\r/g, '')                    // Remove carriage returns
      .replace(/\n(?=[^"]*"[^"]*$)/g, ' ')   // Replace newlines not in quotes with space
      .replace(/\\n/g, '\\\\n')              // Escape literal \n in strings
      .replace(/,\s*}/g, '}')                // Remove trailing commas before }
      .replace(/,\s*\]/g, ']')               // Remove trailing commas before ]
      .replace(/:\s*"([^"]*)\n([^"]*)"/g, ': "$1 $2"')  // Fix newlines inside quoted strings
      .replace(/"\s*:\s*"([^"]*)"\s*,/g, '": "$1",')    // Fix spacing around colons

    console.log('Parsed JSON (first 200 chars):', jsonStr.substring(0, 200));

    try {
      const result = JSON.parse(jsonStr) as ATSScoreResult;
      console.log('ATS Evaluation completed successfully');
      return result;
    } catch (parseError) {
      // If parsing fails, try extracting just the values we need
      console.warn('Primary JSON parse failed, trying recovery:', parseError);

      try {
        // Extract score
        const scoreMatch = jsonStr.match(/"score"\s*:\s*(\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;

        // Determine level based on score
        const level: ATSScoreResult['level'] =
          score >= 90 ? 'excellent' :
          score >= 70 ? 'good' :
          score >= 50 ? 'needs_improvement' :
          'poor';

        // Extract issues - try to get actual messages and suggestions
        const issues: ATSIssue[] = [];

        // Try to extract issue objects
        const issueRegex = /\{\s*"id"\s*:\s*"([^"]+)"[^}]*"severity"\s*:\s*"([^"]+)"[^}]*"message"\s*:\s*"([^"]+)"[^}]*"suggestion"\s*:\s*"([^"]+)"[^}]*\}/g;
        let match;
        let issueCount = 0;

        while ((match = issueRegex.exec(jsonStr)) !== null && issueCount < 10) {
          issues.push({
            id: match[1] || `issue-${issueCount}`,
            severity: (match[2] as any) || 'warning',
            category: 'content',
            message: match[3]?.substring(0, 200) || 'Problema rilevato',
            suggestion: match[4]?.substring(0, 200) || 'Rivedi questo aspetto del CV',
            autoFixable: false
          });
          issueCount++;
        }

        // If no issues found with regex, create a generic one
        if (issues.length === 0) {
          issues.push({
            id: 'parse-note',
            severity: 'info',
            category: 'content',
            message: 'Valutazione ricevuta da Claude AI',
            suggestion: 'La valutazione è stata completata. Alcuni dettagli non sono stati parsati correttamente.',
            autoFixable: false
          });
        }

        console.log('Recovery successful with', score, 'score');
        return {
          score,
          level,
          issues: issues.length > 0 ? issues : [
            {
              id: 'parse-note',
              severity: 'info',
              category: 'content',
              message: 'Valutazione ricevuta da Claude ma alcuni dettagli non sono stati parsati',
              suggestion: 'La valutazione è stata completata, verifica i dettagli nella risposta di Claude',
              autoFixable: false
            }
          ],
          passedChecks: [],
          keywordsPresent: [],
          keywordsMissing: []
        };
      } catch (recoveryError) {
        console.error('Recovery failed:', recoveryError);
        throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('ATS Evaluation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error during ATS evaluation');
  }
};

/**
 * Format CV data for Claude analysis
 */
function formatCVForAnalysis(cvData: CVData): string {
  const { personalInfo, professionalSummary, experiences, education, skills, languages, other } = cvData;

  let text = `DATI PERSONALI
Nome: ${personalInfo.firstName} ${personalInfo.lastName}
Email: ${personalInfo.email}
Telefono: ${personalInfo.phone}
Città: ${personalInfo.city}
Paese: ${personalInfo.country}
Data di Nascita: ${personalInfo.dateOfBirth}
Titolo Professionale: ${personalInfo.jobTitle}

`;

  if (professionalSummary) {
    text += `PROFILO PROFESSIONALE
${professionalSummary}

`;
  }

  if (experiences.length > 0) {
    text += `ESPERIENZE LAVORATIVE
`;
    experiences.forEach((exp, i) => {
      text += `${i + 1}. ${exp.position} @ ${exp.company} (${exp.location})
   ${exp.startDate} - ${exp.endDate || (exp.currentlyWorking ? 'Presente' : '')}
   ${exp.description}

`;
    });
  }

  if (education.length > 0) {
    text += `FORMAZIONE
`;
    education.forEach((edu, i) => {
      text += `${i + 1}. ${edu.degree} in ${edu.field}
   ${edu.institution}
   ${edu.startDate} - ${edu.endDate}
   ${edu.description || ''}

`;
    });
  }

  if (skills.length > 0) {
    text += `COMPETENZE
`;
    skills.forEach(skill => {
      text += `- ${skill.name} (${skill.category})
`;
    });
    text += '\n';
  }

  if (languages.length > 0) {
    text += `LINGUE
`;
    languages.forEach(lang => {
      text += `- ${lang.name}: ${lang.level}
`;
    });
    text += '\n';
  }

  if (other.certifications.length > 0) {
    text += `CERTIFICAZIONI
`;
    other.certifications.forEach(cert => {
      text += `- ${cert.name} (${cert.issuer})
`;
    });
  }

  return text;
}
