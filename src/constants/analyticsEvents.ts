/**
 * Definizioni centralizzate di tutti gli eventi analytics
 */

export const ANALYTICS_EVENTS = {
  // LANDING & NAVIGAZIONE
  LANDING_CTA_CLICK: 'landing_cta_click',
  LANDING_SCROLL_DEPTH: 'landing_scroll_depth',

  // ONBOARDING / WIZARD
  WELCOME_SHOWN: 'welcome_shown',
  WIZARD_STARTED: 'wizard_started',
  WIZARD_STEP_CHANGED: 'wizard_step_changed',
  WIZARD_COMPLETED: 'wizard_completed',
  WIZARD_SKIPPED: 'wizard_skipped',
  WIZARD_ABANDONED: 'wizard_abandoned',

  // COMPILAZIONE CV
  SECTION_OPENED: 'section_opened',
  PHOTO_UPLOADED: 'photo_uploaded',
  EXPERIENCE_ADDED: 'experience_added',
  EDUCATION_ADDED: 'education_added',
  SKILL_ADDED: 'skill_added',
  LANGUAGE_ADDED: 'language_added',

  // INTELLIGENZA ARTIFICIALE
  AI_OPTIMIZE_STARTED: 'ai_optimize_started',
  AI_OPTIMIZE_COMPLETED: 'ai_optimize_completed',
  AI_OPTIMIZE_ERROR: 'ai_optimize_error',
  AI_CHANGES_APPLIED: 'ai_changes_applied',
  AI_CHANGES_REJECTED: 'ai_changes_rejected',
  ATS_CHECK_STARTED: 'ats_check_started',
  ATS_CHECK_COMPLETED: 'ats_check_completed',
  COVER_LETTER_GENERATED: 'cover_letter_generated',
  INTERVIEW_PREP_GENERATED: 'interview_prep_generated',
  MOCK_INTERVIEW_STARTED: 'mock_interview_started',

  // TEMPLATE & PERSONALIZZAZIONE
  TEMPLATE_CHANGED: 'template_changed',
  COLOR_CHANGED: 'color_changed',

  // ESPORTAZIONE PDF
  PDF_EXPORT_STARTED: 'pdf_export_started',
  PDF_EXPORT_COMPLETED: 'pdf_export_completed',
  PDF_EXPORT_ERROR: 'pdf_export_error',
  PDF_IMPORT_STARTED: 'pdf_import_started',
  PDF_IMPORT_COMPLETED: 'pdf_import_completed',

  // CONDIVISIONE
  SHARE_COPIED: 'share_copied',

  // VERSIONING
  VERSION_SAVED: 'version_saved',
  VERSION_LOADED: 'version_loaded',

  // ESTRAZIONE TESTO DA SCREENSHOT
  JOB_SCREENSHOT_UPLOADED: 'job_screenshot_uploaded',
  JOB_TEXT_EXTRACTION_STARTED: 'job_text_extraction_started',
  JOB_TEXT_EXTRACTION_COMPLETED: 'job_text_extraction_completed',
  JOB_TEXT_EXTRACTION_ERROR: 'job_text_extraction_error',

  // ERRORI
  ERROR_VALIDATION: 'error_validation',
  ERROR_GENERIC: 'error_generic',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
