import { CVData } from '../types/cv.types';

const firstNames = [
  'Marco', 'Alessandro', 'Luca', 'Andrea', 'Giovanni',
  'Francesco', 'Paolo', 'Antonio', 'Matteo', 'Davide',
  'Sara', 'Giulia', 'Francesca', 'Alessia', 'Martina',
  'Federica', 'Valentina', 'Elisa', 'Chiara', 'Silvia'
];

const lastNames = [
  'Rossi', 'Bianchi', 'Ferrari', 'Gallo', 'Russo',
  'Fontana', 'Conti', 'Marino', 'Pellegrini', 'Costa',
  'Colombo', 'De Luca', 'Ferraro', 'Barone', 'Santoro'
];

const companies = [
  'Accenture Italia', 'Deloitte', 'EY Italia', 'PwC Italia', 'KPMG',
  'Tim', 'Vodafone Italia', 'Telecom Italia', 'Eni', 'Enel',
  'Ferrero', 'Luxottica', 'Ferrari', 'Barilla', 'Pirelli',
  'Leonardo', 'Thales Alenia Space', 'Intesa Sanpaolo'
];

const positions = [
  'Sviluppatore Software', 'Sviluppatore Senior', 'Sviluppatore Junior',
  'Full Stack Developer', 'Sviluppatore Frontend', 'Sviluppatore Backend',
  'Analista Dati', 'Business Analyst', 'Project Manager',
  'Product Manager', 'Ingegnere QA', 'Ingegnere DevOps',
  'Consulente IT', 'Responsabile IT', 'Coordinatore Progetti',
  'Architetto Software', 'Specialista Cloud'
];

const universities = [
  'Politecnico di Milano', 'Università Bocconi', 'Università Statale di Milano',
  'Sapienza Università di Roma', 'Università di Bologna', 'Politecnico di Torino',
  'Università Cattolica del Sacro Cuore', 'Università Commerciale Luigi Bocconi',
  'Università di Padova', 'Università di Firenze'
];

const degrees = [
  'Laurea in Informatica', 'Laurea in Ingegneria Informatica',
  'Laurea in Economia', 'Laurea in Ingegneria Gestionale',
  'Laurea Magistrale in Informatica', 'Master in Amministrazione Aziendale',
  'Laurea in Ingegneria del Software', 'Laurea in Scienze dell\'Informazione'
];

const skills = [
  { name: 'JavaScript', category: 'technical' as const },
  { name: 'TypeScript', category: 'technical' as const },
  { name: 'React', category: 'technical' as const },
  { name: 'Node.js', category: 'technical' as const },
  { name: 'SQL', category: 'technical' as const },
  { name: 'Python', category: 'technical' as const },
  { name: 'Git', category: 'technical' as const },
  { name: 'Docker', category: 'technical' as const },
  { name: 'API REST', category: 'technical' as const },
  { name: 'Risoluzione Problemi', category: 'soft' as const },
  { name: 'Leadership', category: 'soft' as const },
  { name: 'Comunicazione', category: 'soft' as const },
  { name: 'Lavoro di Gruppo', category: 'soft' as const },
  { name: 'Gestione Progetti', category: 'soft' as const },
  { name: 'Pensiero Analitico', category: 'soft' as const }
];

const certifications = [
  'AWS Solutions Architect Associate',
  'Google Cloud Professional Data Engineer',
  'Scrum Master Certificato',
  'ISO 27001 Information Security Manager',
  'Microsoft Azure Administrator',
  'Certificazione Kubernetes'
];

const languages = [
  { name: 'Italiano', level: 'Native' as const },
  { name: 'Inglese', level: 'C1' as const },
  { name: 'Francese', level: 'B1' as const },
  { name: 'Spagnolo', level: 'B1' as const },
  { name: 'Tedesco', level: 'B2' as const }
];

const cities = [
  'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze',
  'Palermo', 'Napoli', 'Genova', 'Venezia', 'Verona',
  'Brescia', 'Pisa', 'Rimini'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear: number, endYear: number): string {
  const year = randomInt(startYear, endYear);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  return `${month}/${year}`;
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'linkedin.com'];
  const domain = randomElement(domains);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generatePhone(): string {
  return `+39 ${String(randomInt(200, 999))} ${String(randomInt(1000000, 9999999))}`;
}

export function generateMockCVData(baseData?: Partial<CVData>): CVData {
  const firstName = baseData?.personalInfo?.firstName || randomElement(firstNames);
  const lastName = baseData?.personalInfo?.lastName || randomElement(lastNames);
  const currentYear = new Date().getFullYear();

  const experiences = Array.from({ length: randomInt(2, 4) }, () => ({
    id: Math.random().toString(),
    company: randomElement(companies),
    position: randomElement(positions),
    location: randomElement(cities),
    startDate: randomDate(2018, 2023),
    endDate: randomInt(0, 1) === 0 ? randomDate(2022, currentYear) : '',
    currentlyWorking: randomInt(0, 1) === 1,
    description: `Responsabile dello sviluppo e della manutenzione di applicazioni web. Ho collaborato con i team member per consegnare progetti in tempo. Ho migliorato la qualità del codice e implementato le best practices. Ho partecipato a code review e mentorizzato sviluppatori junior.`
  }));

  const education = Array.from({ length: randomInt(2, 3) }, () => ({
    id: Math.random().toString(),
    institution: randomElement(universities),
    degree: randomElement(degrees),
    field: 'Informatica e Tecnologie',
    startDate: randomDate(2010, 2018),
    endDate: randomDate(2013, 2021),
    currentlyStudying: false,
    grade: `${randomInt(85, 110)}/110`,
    description: 'Tesi su moderne pratiche di sviluppo web e architetture scalabili'
  }));

  const selectedSkills = skills
    .sort(() => Math.random() - 0.5)
    .slice(0, randomInt(8, 12));

  const selectedLanguages = languages.slice(0, randomInt(1, 3));

  const selectedCertifications = certifications
    .sort(() => Math.random() - 0.5)
    .slice(0, randomInt(0, 2))
    .map(name => ({
      id: Math.random().toString(),
      name,
      issuer: 'AWS / Google / Scrum Alliance',
      date: randomDate(2019, currentYear),
      expiryDate: randomDate(currentYear + 1, currentYear + 3)
    }));

  return {
    personalInfo: {
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      address: `Via ${['Roma', 'Milano', 'Torino'][randomInt(0, 2)]}, ${randomInt(1, 150)}`,
      city: randomElement(cities),
      country: 'Italia',
      dateOfBirth: `${String(randomInt(1, 28)).padStart(2, '0')}/0${randomInt(1, 9)}/198${randomInt(0, 9)}`,
      jobTitle: randomElement(positions),
      website: `https://${firstName.toLowerCase()}.dev`,
      linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      github: `https://github.com/${firstName.toLowerCase()}`
    },
    professionalSummary: `${randomElement(positions)} appassionato con ${randomInt(3, 10)} anni di esperienza nella realizzazione di applicazioni scalabili e affidabili. Forte capacità di risoluzione dei problemi con eccellenti competenze di comunicazione. Sempre desideroso di imparare nuove tecnologie e seguire le best practices del settore.`,
    experiences,
    education,
    skills: selectedSkills.map(skill => ({
      id: Math.random().toString(),
      name: skill.name,
      level: randomInt(1, 5) as 1 | 2 | 3 | 4 | 5,
      category: skill.category
    })),
    languages: selectedLanguages.map(lang => ({
      id: Math.random().toString(),
      name: lang.name,
      level: lang.level
    })),
    other: {
      certifications: selectedCertifications,
      drivingLicenses: randomInt(0, 1) === 1 ? [{
        id: Math.random().toString(),
        licenseType: 'Patente B',
        issuingDate: randomDate(2010, 2020),
        expiryDate: randomDate(currentYear + 1, currentYear + 5)
      }] : [],
      hobbies: ['Lettura', 'Programmazione', 'Sport', 'Fotografia', 'Viaggi', 'Musica', 'Gaming', 'Cucina']
        .sort(() => Math.random() - 0.5)
        .slice(0, randomInt(2, 4))
    }
  };
}
