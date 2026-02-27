export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  profilePhoto?: string; // base64
  jobTitle: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  currentlyStudying?: boolean;
  grade?: string;
  description?: string;
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5;
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: 'technical' | 'soft';
}

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  url?: string;
}

export interface DrivingLicense {
  id: string;
  licenseType: string; // es: "Patente B", "Patente D", ecc.
  issuingDate?: string;
  expiryDate?: string;
}

export interface OtherSection {
  certifications: Certification[];
  hobbies: string[];
  drivingLicenses: DrivingLicense[];
}

export type GDPRConsentType = 'minimal' | 'standard' | 'extended' | 'complete' | 'custom';

export interface ProtectedCategory {
  belongsToProtectedCategory: boolean;
  categoryType?: 'art1' | 'art18' | 'altra';
  categoryTypeOther?: string;
  disabilityPercentage?: number;
  details?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  other: OtherSection;
  protectedCategory?: ProtectedCategory;
}

export type TemplateType = 'classic' | 'modern' | 'minimalist' | 'creative' | 'technical';
export type LanguageCode = 'it' | 'en' | 'es' | 'de' | 'fr';
export type FontOption = 'inter' | 'roboto' | 'georgia' | 'playfair';
export type SpacingOption = 'compact' | 'standard' | 'spacious';
export type AccentColor = string;

export interface CVSettings {
  template: TemplateType;
  accentColor: AccentColor;
  font: FontOption;
  fontSize: 'small' | 'medium' | 'large';
  spacing: SpacingOption;
  showPhoto: boolean;
  showSections: {
    professionalSummary: boolean;
    experiences: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    certifications: boolean;
    drivingLicenses: boolean;
    hobbies: boolean;
    protectedCategory: boolean;
  };
  sectionOrder: string[];
  language: LanguageCode;
  // GDPR settings
  gdprConsentType: GDPRConsentType;
  customGdprText?: string;
  includeConsentDate: boolean;
  includeSignature: boolean;
}

export interface CVVersion {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: CVData;
  settings: CVSettings;
  jobDescription?: string;
  notes?: string;
  isOptimized: boolean;
  tags: string[];
}

export const defaultPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'Italia',
  dateOfBirth: '',
  jobTitle: '',
  website: '',
  linkedin: '',
  github: '',
};

export const defaultCVData: CVData = {
  personalInfo: defaultPersonalInfo,
  professionalSummary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  other: {
    certifications: [],
    hobbies: [],
    drivingLicenses: [],
  },
  protectedCategory: {
    belongsToProtectedCategory: false,
  },
};

export const defaultSettings: CVSettings = {
  template: 'modern',
  accentColor: '#2563eb',
  font: 'inter',
  fontSize: 'medium',
  spacing: 'standard',
  showPhoto: true,
  showSections: {
    professionalSummary: true,
    experiences: true,
    education: true,
    skills: true,
    languages: true,
    certifications: true,
    drivingLicenses: false,
    hobbies: false,
    protectedCategory: false,
  },
  sectionOrder: ['professionalSummary', 'experiences', 'education', 'skills', 'languages', 'certifications', 'drivingLicenses', 'hobbies'],
  language: 'it',
  gdprConsentType: 'standard',
  customGdprText: undefined,
  includeConsentDate: true,
  includeSignature: false,
};
