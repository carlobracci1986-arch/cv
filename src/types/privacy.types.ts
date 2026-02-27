export interface ConsentState {
  hasConsented: boolean;
  consentDate: string | null;
  aiConsent: boolean;
  aiConsentDate: string | null;
  saveAIConsent: boolean;
}

export interface DataActivity {
  id: string;
  timestamp: string;
  action: 'cv_created' | 'cv_updated' | 'cv_exported' | 'ai_optimization' | 'ai_cover_letter' | 'ai_translation' | 'ai_interview_prep' | 'version_saved' | 'data_deleted' | 'data_exported';
  details: string;
  requiresConsent: boolean;
}
