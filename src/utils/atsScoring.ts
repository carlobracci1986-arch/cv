/// <reference types="vite/client" />
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

  if (!apiKey) {
    throw new Error('API key Anthropic non configurata. Aggiungi VITE_ANTHROPIC_API_KEY nel file .env');
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

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(err.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.content[0].text;

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const result = JSON.parse(jsonStr) as ATSScoreResult;

    return result;
  } catch (error) {
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
