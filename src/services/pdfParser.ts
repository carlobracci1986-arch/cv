import * as pdfjsLib from 'pdfjs-dist';
import { CVData, defaultCVData } from '../types/cv.types';

// Set up the worker - use the public assets directory
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

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

  // Normalize text - but keep original for patterns
  const normalizedText = text.toLowerCase();

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    cvData.personalInfo.email = emailMatch[0];
  }

  // Extract phone (multiple formats)
  const phoneMatch = text.match(/(\+\d{1,3}[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}/);
  if (phoneMatch) {
    cvData.personalInfo.phone = phoneMatch[0].trim();
  }

  // Extract name (first 1-2 lines with capital letters, before email/phone)
  const nameLines = text.split('\n').slice(0, 5);
  for (const line of nameLines) {
    if (line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) && !line.includes('@')) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        cvData.personalInfo.firstName = parts[0];
        cvData.personalInfo.lastName = parts[1];
        break;
      }
    }
  }

  // Extract job title (look for common patterns - Italian + English)
  const jobTitleKeywords = ['developer', 'engineer', 'designer', 'manager', 'consultant', 'analyst', 'architect', 'specialist',
                             'sviluppatore', 'ingegnere', 'progettista', 'responsabile', 'consulente', 'analista', 'esperto', 'coordinatore'];
  const jobTitleMatch = text.match(new RegExp(jobTitleKeywords.join('|'), 'i'));
  if (jobTitleMatch) {
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(jobTitleMatch[0].toLowerCase()) && line.length < 150) {
        cvData.personalInfo.jobTitle = line.trim().substring(0, 100);
        break;
      }
    }
  }

  // Extract professional summary (Italian + English)
  const summaryMatch = text.match(/(professional summary|summary|objective|profile|sintesi|riepilogo|profilo|presentazione)[:\s]*([^\n]{20,200})/i);
  if (summaryMatch) {
    cvData.professionalSummary = summaryMatch[2].trim().substring(0, 500);
  }

  // Parse experiences (Italian + English)
  const expSection = text.match(/(experience|work experience|employment|esperienze?|esperienze? lavorativ|occupazione|lavori?)[:\s]*(.+?)(?=educazione|education|competenz|skills|certificazioni?|certifications?|lingue|languages|contatti?|$)/is);
  if (expSection) {
    const experiences = parseExperienceSection(expSection[2]);
    cvData.experiences = experiences;
  }

  // Parse education (Italian + English)
  const eduSection = text.match(/(education|academic|formation|qualifications|educazione|formazione|istruzione|studi|titoli?|laurea)[:\s]*(.+?)(?=competenz|skills|certificazioni?|certifications?|lingue|languages|esperienze?|experience|$)/is);
  if (eduSection) {
    const education = parseEducationSection(eduSection[2]);
    cvData.education = education;
  }

  // Parse skills (Italian + English)
  const skillsSection = text.match(/(skills|competencies|technical skills|competenze?|abilità|capacità)[:\s]*(.+?)(?=certificazioni?|certifications?|lingue|languages|esperienze?|experience|educazione|education|$)/is);
  if (skillsSection) {
    const skills = parseSkillsSection(skillsSection[2]);
    cvData.skills = skills;
  }

  // Parse languages (Italian + English)
  const langSection = text.match(/(languages?|language proficiency|lingue|lingue professionali|conoscenza lingue)[:\s]*(.+?)(?=competenze?|skills|certificazioni?|certifications?|esperienze?|experience|educazione|education|$)/is);
  if (langSection) {
    const languages = parseLanguageSection(langSection[2]);
    cvData.languages = languages;
  }

  // Parse certifications (Italian + English)
  const certSection = text.match(/(certifications?|certificates|certificazioni?|certificati?|patenti?)[:\s]*(.+?)(?=lingue|languages|competenze?|skills|esperienze?|experience|educazione|education|$)/is);
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

    const lines = entry.split('\n').filter(l => l.trim());

    // Try to extract company and position from first lines
    if (lines[0]) {
      const parts = lines[0].split(/[-–•,]/);
      exp.position = parts[0].trim();
      exp.company = parts[1]?.trim() || '';
    }

    // Extract dates (supports various formats: 2020, 01/2020, January 2020, etc.)
    const dateMatch = entry.match(/(\d{4}|\d{1,2}\/\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+\d{4})\s*[-–to]?\s*(\d{4}|\d{1,2}\/\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+\d{4}|present|current|ongoing|now|ad oggi|oggi|tuttora)?/i);
    if (dateMatch) {
      exp.startDate = dateMatch[1];
      exp.endDate = dateMatch[2] || '';
      if (dateMatch[2]?.toLowerCase().match(/present|current|ongoing|now|ad oggi|oggi|tuttora/)) {
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

    const lines = entry.split('\n').filter(l => l.trim());

    // First line usually has degree and/or institution
    if (lines[0]) {
      const parts = lines[0].split(/[-–•,]/);
      edu.degree = parts[0].trim();
      edu.institution = parts[1]?.trim() || '';
    }

    // Look for field/specialization (Italian + English)
    const fieldMatch = entry.match(/(?:in|specialization|major|in|campo|indirizzo|specializzazione|corso)[\s:]*([^,\n]+)/i);
    if (fieldMatch) {
      edu.field = fieldMatch[1].trim();
    }

    // Extract dates
    const dateMatch = entry.match(/(\d{4})\s*[-–]\s*(\d{4})?/);
    if (dateMatch) {
      edu.startDate = dateMatch[1];
      edu.endDate = dateMatch[2] || '';
    }

    // Look for grade/voto
    const gradeMatch = entry.match(/(?:grade|voto|media)[\s:]*([^\n]+)/i);
    if (gradeMatch) {
      edu.grade = gradeMatch[1].trim().substring(0, 50);
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

  // Categorize skills based on keywords
  const technicalKeywords = ['python', 'javascript', 'java', 'react', 'node', 'sql', 'html', 'css', 'typescript', 'api', 'rest', 'database', 'linux', 'windows', 'docker', 'kubernetes', 'git', 'nodejs', 'expressjs', 'mongodb', 'postgresql', 'mysql'];
  const softKeywords = ['management', 'leadership', 'communication', 'teamwork', 'problem-solving', 'project', 'gestione', 'comunicazione', 'leadership', 'lavoro di gruppo'];

  for (const skill of skillList.slice(0, 30)) {
    // Determine category
    let category = 'other';
    if (technicalKeywords.some(kw => skill.toLowerCase().includes(kw))) {
      category = 'technical';
    } else if (softKeywords.some(kw => skill.toLowerCase().includes(kw))) {
      category = 'soft';
    }

    skills.push({
      id: Math.random().toString(),
      name: skill,
      level: 3 as const,
      category: category as any
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

    // Try to extract level (Italian + English)
    if (cleaned.match(/fluent|native|c2|madrelingua|bilingue|perfetto|corretto/i)) level = 'C2';
    else if (cleaned.match(/professional|c1|advanced|avanzato|professionale|superiore/i)) level = 'C1';
    else if (cleaned.match(/upper\s*intermediate|b2|intermedio\s*superiore/i)) level = 'B2';
    else if (cleaned.match(/intermediate|b1|intermedio|buono/i)) level = 'B1';
    else if (cleaned.match(/elementary|a2|elementare/i)) level = 'A2';
    else if (cleaned.match(/beginner|a1|principiante/i)) level = 'A1';

    // Remove level from name (Italian + English)
    name = name.replace(/[-–]\s*(fluent|native|c2|c1|b2|b1|a2|a1|beginner|elementary|intermediate|professional|advanced|madrelingua|bilingue|perfetto|corretto|avanzato|professionale|superiore|intermedio|buono|elementare|principiante)/i, '').trim();

    if (name && name.length > 1) {
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
