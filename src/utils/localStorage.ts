import { CVData, CVVersion, CVSettings, defaultCVData, defaultSettings } from '../types/cv.types';
import { ConsentState, DataActivity } from '../types/privacy.types';

const KEYS = {
  CV_DATA: 'cvbuilder_cv_data',
  CV_SETTINGS: 'cvbuilder_settings',
  VERSIONS: 'cvbuilder_versions',
  CONSENT: 'cvbuilder_consent',
  ACTIVITY_LOG: 'cvbuilder_activity_log',
  COVER_LETTERS: 'cvbuilder_cover_letters',
  JOB_DESCRIPTIONS: 'cvbuilder_job_descriptions',
  ONBOARDING_DONE: 'cvbuilder_onboarding_done',
  CURRENT_VERSION_ID: 'cvbuilder_current_version_id',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write error:', e);
  }
}

// CV Data
export const getCVData = (): CVData => safeGet(KEYS.CV_DATA, defaultCVData);
export const saveCVData = (data: CVData): void => safeSet(KEYS.CV_DATA, data);

// Settings
export const getCVSettings = (): CVSettings => safeGet(KEYS.CV_SETTINGS, defaultSettings);
export const saveCVSettings = (settings: CVSettings): void => safeSet(KEYS.CV_SETTINGS, settings);

// Versions
export const getVersions = (): CVVersion[] => safeGet(KEYS.VERSIONS, []);
export const saveVersions = (versions: CVVersion[]): void => safeSet(KEYS.VERSIONS, versions);

export const addVersion = (version: CVVersion): void => {
  const versions = getVersions();
  const existing = versions.findIndex(v => v.id === version.id);
  if (existing >= 0) {
    versions[existing] = version;
  } else {
    versions.unshift(version);
  }
  saveVersions(versions);
};

export const deleteVersion = (id: string): void => {
  const versions = getVersions().filter(v => v.id !== id);
  saveVersions(versions);
};

// Consent
export const getConsent = (): ConsentState => safeGet(KEYS.CONSENT, {
  hasConsented: false,
  consentDate: null,
  aiConsent: false,
  aiConsentDate: null,
  saveAIConsent: false,
});
export const saveConsent = (consent: ConsentState): void => safeSet(KEYS.CONSENT, consent);

// Activity Log
export const getActivityLog = (): DataActivity[] => safeGet(KEYS.ACTIVITY_LOG, []);
export const addActivity = (activity: Omit<DataActivity, 'id' | 'timestamp'>): void => {
  const log = getActivityLog();
  log.unshift({
    ...activity,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  // Keep last 100 activities
  if (log.length > 100) log.splice(100);
  safeSet(KEYS.ACTIVITY_LOG, log);
};

// Cover Letters
export const getCoverLetters = (): { id: string; versionId?: string; content: string; jobDescription: string; createdAt: string }[] =>
  safeGet(KEYS.COVER_LETTERS, []);
export const saveCoverLetters = (letters: { id: string; versionId?: string; content: string; jobDescription: string; createdAt: string }[]): void =>
  safeSet(KEYS.COVER_LETTERS, letters);

// Onboarding
export const isOnboardingDone = (): boolean => safeGet(KEYS.ONBOARDING_DONE, false);
export const setOnboardingDone = (): void => safeSet(KEYS.ONBOARDING_DONE, true);

// Current version
export const getCurrentVersionId = (): string | null => safeGet(KEYS.CURRENT_VERSION_ID, null);
export const saveCurrentVersionId = (id: string | null): void => safeSet(KEYS.CURRENT_VERSION_ID, id);

// Export all data
export const exportAllData = (): string => {
  const data = {
    cvData: getCVData(),
    settings: getCVSettings(),
    versions: getVersions(),
    coverLetters: getCoverLetters(),
    activityLog: getActivityLog(),
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0',
  };
  return JSON.stringify(data, null, 2);
};

// Import data
export const importData = (jsonString: string): void => {
  const data = JSON.parse(jsonString);
  if (data.cvData) saveCVData(data.cvData);
  if (data.settings) saveCVSettings(data.settings);
  if (data.versions) saveVersions(data.versions);
  if (data.coverLetters) saveCoverLetters(data.coverLetters);
};

// Clear all data (GDPR - diritto all'oblio)
export const clearAllData = (): void => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};
