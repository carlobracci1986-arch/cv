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
  'Accenture', 'Deloitte', 'EY', 'PwC', 'KPMG',
  'Tim', 'Vodafone', 'Telecom Italia', 'Eni', 'Enel',
  'Ferrero', 'Luxottica', 'Ferrari', 'Barilla', 'Pirelli'
];

const positions = [
  'Software Developer', 'Senior Developer', 'Junior Developer',
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Business Analyst', 'Project Manager',
  'Product Manager', 'QA Engineer', 'DevOps Engineer',
  'Consulente', 'Responsabile IT', 'Coordinatore Progetti'
];

const universities = [
  'Politecnico di Milano', 'Università Bocconi', 'Università Statale di Milano',
  'Sapienza Università di Roma', 'Università di Bologna', 'Politecnico di Torino',
  'Università Cattolica', 'Università Commerciale Luigi Bocconi'
];

const degrees = [
  'Laurea in Informatica', 'Laurea in Ingegneria Informatica',
  'Laurea in Economia', 'Laurea in Ingegneria Gestionale',
  'Laurea Magistrale in Informatica', 'Master in Business Administration',
  'Laurea in Ingegneria Software'
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
  { name: 'REST API', category: 'technical' as const },
  { name: 'Problem Solving', category: 'soft' as const },
  { name: 'Leadership', category: 'soft' as const },
  { name: 'Communication', category: 'soft' as const },
  { name: 'Team Collaboration', category: 'soft' as const },
  { name: 'Project Management', category: 'soft' as const },
  { name: 'Analytical Thinking', category: 'soft' as const }
];

const certifications = [
  'AWS Solutions Architect',
  'Google Cloud Professional',
  'Scrum Master',
  'ISO 27001',
  'CompTIA Security+',
  'Microsoft Azure Administrator'
];

const languages = [
  { name: 'Italiano', level: 'Native' as const },
  { name: 'Inglese', level: 'C1' as const },
  { name: 'Francese', level: 'B1' as const },
  { name: 'Spagnolo', level: 'A2' as const },
  { name: 'Tedesco', level: 'B2' as const }
];

const cities = [
  'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze',
  'Palermo', 'Napoli', 'Genova', 'Venezia', 'Verona'
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
    description: `Responsible for developing and maintaining web applications. Collaborated with team members to deliver projects on time.
      Improved code quality and implemented best practices. Participated in code reviews and mentored junior developers.`
  }));

  const education = Array.from({ length: randomInt(2, 3) }, () => ({
    id: Math.random().toString(),
    institution: randomElement(universities),
    degree: randomElement(degrees),
    field: 'Computer Science',
    startDate: randomDate(2010, 2018),
    endDate: randomDate(2013, 2021),
    currentlyStudying: false,
    grade: `${randomInt(85, 110)}/110`,
    description: 'Thesis on modern web development practices'
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
    professionalSummary: `Passionate ${randomElement(positions)} with ${randomInt(3, 10)} years of experience in building scalable and reliable applications.
      Strong problem solver with excellent communication skills. Always eager to learn new technologies and best practices.`,
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
      hobbies: ['Reading', 'Coding', 'Sports', 'Photography', 'Traveling']
        .sort(() => Math.random() - 0.5)
        .slice(0, randomInt(2, 4))
    }
  };
}
