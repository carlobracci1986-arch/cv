import { GDPRConsentType } from '../types/cv.types';
import { PersonalInfo } from '../types/cv.types';
import { GDPR_CONSENT_TEXTS } from '../constants/gdprConsent';

export function getGDPRConsentText(
  type: GDPRConsentType,
  customText: string | undefined,
  personalInfo: PersonalInfo,
  includeDate: boolean = false
): string {
  let text = '';

  switch (type) {
    case 'minimal':
      text = GDPR_CONSENT_TEXTS.minimal;
      break;
    case 'standard':
      text = GDPR_CONSENT_TEXTS.standard;
      break;
    case 'extended':
      text = GDPR_CONSENT_TEXTS.extended;
      break;
    case 'complete':
      text = GDPR_CONSENT_TEXTS.complete
        .replace('[NOME COGNOME]', `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || '___________________')
        .replace('[LUOGO]', personalInfo.city || '___________________')
        .replace('[DATA]', personalInfo.dateOfBirth || '___________________')
        .replace('[INDIRIZZO]', personalInfo.address || '___________________');
      break;
    case 'custom':
      text = customText || GDPR_CONSENT_TEXTS.standard;
      break;
    default:
      text = GDPR_CONSENT_TEXTS.standard;
  }

  return text;
}

export function sanitizeDataForAPI(cvData: any): any {
  const sanitized = { ...cvData };
  // Rimuovi categorie protette prima di inviare ad API esterne
  delete sanitized.protectedCategory;
  return sanitized;
}
