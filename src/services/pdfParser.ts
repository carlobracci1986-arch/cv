import * as pdfjsLib from 'pdfjs-dist';
import { CVData, defaultCVData } from '../types/cv.types';

// Set up the worker using the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).href;

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

/**
 * Parse extracted text and fill CV data
 */
export function parseCVText(text: string): Partial<CVData> {
  const cvData = { ...defaultCVData };

  // Normalize text
  const normalizedText = text.toLowerCase();

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    cvData.personalInfo.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    cvData.personalInfo.phone = phoneMatch[0];
  }

  // Extract name (usually first line with capital letters)
  const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  if (nameMatch) {
    const [first, last] = nameMatch[1].split(' ');
    cvData.personalInfo.firstName = first;
    cvData.personalInfo.lastName = last;
  }

  // Extract job title (look for common patterns)
  const jobTitleKeywords = ['developer', 'engineer', 'designer', 'manager', 'consultant', 'analyst', 'architect', 'specialist'];
  const jobTitleMatch = text.match(new RegExp(jobTitleKeywords.join('|'), 'i'));
  if (jobTitleMatch) {
    // Try to get the full job title line
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(jobTitleMatch[0].toLowerCase())) {
        cvData.personalInfo.jobTitle = line.trim().substring(0, 100);
        break;
      }
    }
  }

  // Extract professional summary (look for summary/objective section)
  const summaryMatch = text.match(/(professional summary|summary|objective|profile)[:\s]*([^\n]{20,200})/i);
  if (summaryMatch) {
    cvData.professionalSummary = summaryMatch[2].trim().substring(0, 500);
  }

  // Parse experiences
  const expSection = text.match(/(experience|work experience|employment)[:\s]*(.+?)(?=education|skills|certifications|languages|$)/is);
  if (expSection) {
    const experiences = parseExperienceSection(expSection[2]);
    cvData.experiences = experiences;
  }

  // Parse education
  const eduSection = text.match(/(education|academic|formation|qualifications)[:\s]*(.+?)(?=skills|certifications|languages|experience|$)/is);
  if (eduSection) {
    const education = parseEducationSection(eduSection[2]);
    cvData.education = education;
  }

  // Parse skills
  const skillsSection = text.match(/(skills|competencies|technical skills)[:\s]*(.+?)(?=certifications|languages|experience|education|$)/is);
  if (skillsSection) {
    const skills = parseSkillsSection(skillsSection[2]);
    cvData.skills = skills;
  }

  // Parse languages
  const langSection = text.match(/(languages?|language proficiency)[:\s]*(.+?)(?=skills|certifications|experience|education|$)/is);
  if (langSection) {
    const languages = parseLanguageSection(langSection[2]);
    cvData.languages = languages;
  }

  // Parse certifications
  const certSection = text.match(/(certifications?|certificates)[:\s]*(.+?)(?=languages|skills|experience|education|$)/is);
  if (certSection) {
    const certs = parseCertificationSection(certSection[2]);
    cvData.other.certifications = certs;
  }

  return cvData;
}

/**
 * Parse experience section
 */
function parseExperienceSection(text: string) {
  const { Experience } = require('../types/cv.types');
  const experiences = [];

  // Split by common delimiters (newlines with capital letters or dates)
  const entries = text.split(/\n(?=[A-Z]|\d{4})/);

  for (const entry of entries) {
    if (entry.trim().length < 10) continue;

    const exp: any = {
      id: Math.random().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: ''
    };

    const lines = entry.split('\n');

    // Try to extract company and position
    if (lines[0]) {
      const parts = lines[0].split(/[-–•]/);
      exp.position = parts[0].trim();
      exp.company = parts[1]?.trim() || '';
    }

    // Extract dates
    const dateMatch = entry.match(/(\d{4}|\d{1,2}\/\d{1,2})\s*[-–]\s*(\d{4}|present|current|ongoing|now)?/i);
    if (dateMatch) {
      exp.startDate = dateMatch[1];
      exp.endDate = dateMatch[2] || '';
      if (dateMatch[2]?.toLowerCase().match(/present|current|ongoing|now/)) {
        exp.currentlyWorking = true;
      }
    }

    // Rest as description
    exp.description = lines.slice(1).join('\n').substring(0, 500);

    if (exp.position || exp.company) {
      experiences.push(exp);
    }
  }

  return experiences;
}

/**
 * Parse education section
 */
function parseEducationSection(text: string) {
  const educations = [];
  const entries = text.split(/\n(?=[A-Z])/);

  for (const entry of entries) {
    if (entry.trim().length < 10) continue;

    const edu: any = {
      id: Math.random().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: ''
    };

    const lines = entry.split('\n');

    // First line usually has degree and/or institution
    if (lines[0]) {
      const parts = lines[0].split(/[-–•,]/);
      edu.degree = parts[0].trim();
      edu.institution = parts[1]?.trim() || '';
    }

    // Look for field/specialization
    const fieldMatch = entry.match(/(?:in|specialization|major)[\s:]*([^,\n]+)/i);
    if (fieldMatch) {
      edu.field = fieldMatch[1].trim();
    }

    // Extract dates
    const dateMatch = entry.match(/(\d{4})\s*[-–]\s*(\d{4})?/);
    if (dateMatch) {
      edu.startDate = dateMatch[1];
      edu.endDate = dateMatch[2] || '';
    }

    if (edu.degree || edu.institution) {
      educations.push(edu);
    }
  }

  return educations;
}

/**
 * Parse skills section
 */
function parseSkillsSection(text: string) {
  const skills = [];

  // Split by common delimiters
  const skillList = text
    .split(/[,•\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && s.length < 100);

  for (const skill of skillList.slice(0, 20)) {
    skills.push({
      id: Math.random().toString(),
      name: skill,
      level: 3 as const,
      category: 'technical' as const
    });
  }

  return skills;
}

/**
 * Parse languages section
 */
function parseLanguageSection(text: string) {
  const languages = [];
  const entries = text.split(/[,•\n]/);

  for (const entry of entries) {
    const cleaned = entry.trim();
    if (cleaned.length < 2) continue;

    let name = cleaned;
    let level: any = 'B1';

    // Try to extract level
    if (cleaned.match(/fluent|native|c2/i)) level = 'C2';
    else if (cleaned.match(/professional|c1|advanced/i)) level = 'C1';
    else if (cleaned.match(/upper\s*intermediate|b2/i)) level = 'B2';
    else if (cleaned.match(/intermediate|b1/i)) level = 'B1';
    else if (cleaned.match(/elementary|a2/i)) level = 'A2';
    else if (cleaned.match(/beginner|a1/i)) level = 'A1';

    // Remove level from name
    name = name.replace(/[-–]\s*(fluent|native|c2|c1|b2|b1|a2|a1|beginner|elementary|intermediate|professional|advanced)/i, '').trim();

    if (name) {
      languages.push({
        id: Math.random().toString(),
        name,
        level
      });
    }
  }

  return languages;
}

/**
 * Parse certifications section
 */
function parseCertificationSection(text: string) {
  const certifications = [];
  const entries = text.split(/\n(?=[A-Z])/);

  for (const entry of entries) {
    if (entry.trim().length < 5) continue;

    const cert: any = {
      id: Math.random().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: ''
    };

    const lines = entry.split('\n');

    // First line is usually the cert name
    cert.name = lines[0].trim().substring(0, 100);

    // Look for issuer
    const issuerMatch = entry.match(/(?:issued by|from|provider)[\s:]*([^,\n]+)/i);
    if (issuerMatch) {
      cert.issuer = issuerMatch[1].trim();
    }

    // Extract dates
    const dateMatch = entry.match(/(\d{1,2}\/\d{4}|\d{4})/);
    if (dateMatch) {
      cert.date = dateMatch[1];
    }

    if (cert.name) {
      certifications.push(cert);
    }
  }

  return certifications;
}
