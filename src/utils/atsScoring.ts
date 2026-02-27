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
