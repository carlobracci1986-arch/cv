import { GDPRConsentType } from '../types/cv.types';
import { PersonalInfo } from '../types/cv.types';
import { GDPR_CONSENT_TEXTS, GDPR_BY_LANGUAGE } from '../constants/gdprConsent';

export function getGDPRConsentText(
  type: GDPRConsentType,
  customText: string | undefined,
  personalInfo: PersonalInfo,
  includeDate: boolean = false,
  language: string = 'it'
): string {
  const texts = GDPR_BY_LANGUAGE[language] || GDPR_CONSENT_TEXTS;
  let text = '';

  switch (type) {
    case 'minimal':
      text = texts.minimal;
      break;
    case 'standard':
      text = texts.standard;
      break;
    case 'extended':
      text = texts.extended;
      break;
    case 'complete':
      text = texts.complete
        .replace('[NOME COGNOME]', `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || '___________________')
        .replace('[LUOGO]', personalInfo.city || '___________________')
        .replace('[DATA]', personalInfo.dateOfBirth || '___________________')
        .replace('[INDIRIZZO]', personalInfo.address || '___________________');
      break;
    case 'custom':
      text = customText || texts.standard;
      break;
    default:
      text = texts.standard;
  }

  return text;
}

export function sanitizeDataForAPI(cvData: any): any {
  const sanitized = { ...cvData };
  // Rimuovi categorie protette prima di inviare ad API esterne
  delete sanitized.protectedCategory;
  return sanitized;
}
