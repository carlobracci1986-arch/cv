import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar } from 'lucide-react';
import { CVData, CVSettings } from '../../types/cv.types';

interface Props {
  cvData: CVData;
  settings: CVSettings;
  id?: string;
}

const fontSizeMap = { small: '13px', medium: '14px', large: '15px' };
const spacingMap = { compact: '10px', standard: '16px', spacious: '24px' };

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year) return '';
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

const skillLevelLabel: Record<number, string> = { 1: 'Beginner', 2: 'Basic', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };
const languageLevelLabel: Record<string, string> = {
  A1: 'A1 – Beginner', A2: 'A2 – Elementary', B1: 'B1 – Intermediate',
  B2: 'B2 – Upper Intermediate', C1: 'C1 – Advanced', C2: 'C2 – Proficient', Native: 'Native',
};

export const ClassicTemplate: React.FC<Props> = ({ cvData, settings, id }) => {
  const { personalInfo, professionalSummary, experiences, education, skills, languages, other } = cvData;
  const { accentColor, fontSize, spacing, showPhoto, showSections, sectionOrder } = settings;

  const baseFontSize = fontSizeMap[fontSize];
  const sectionGap = spacingMap[spacing];
  const accent = accentColor || '#1a365d';

  const divider = (
    <hr style={{ border: 'none', borderTop: `1.5px solid ${accent}`, margin: `${sectionGap} 0 ${sectionGap} 0`, opacity: 0.25 }} />
  );

  const sectionTitle = (title: string) => (
    <div style={{ marginBottom: '8px' }}>
      <h2 style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: accent,
        margin: 0,
        paddingBottom: '4px',
        borderBottom: `2px solid ${accent}`,
        display: 'inline-block',
      }}>
        {title}
      </h2>
    </div>
  );

  const technicalSkills = skills.filter(s => s.category === 'technical');
  const softSkills = skills.filter(s => s.category === 'soft');

  const sectionComponents: Record<string, React.ReactNode> = {
    professionalSummary: showSections.professionalSummary && professionalSummary ? (
      <section key="professionalSummary">
        {divider}
        {sectionTitle('Profilo Professionale')}
        <p style={{ fontSize: baseFontSize, color: '#374151', lineHeight: 1.65, margin: 0 }}>{professionalSummary}</p>
      </section>
    ) : null,

    experiences: showSections.experiences && experiences.length > 0 ? (
      <section key="experiences">
        {divider}
        {sectionTitle('Esperienze Lavorative')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
          {experiences.map((exp) => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: baseFontSize, color: '#111827' }}>{exp.position}</span>
                  {exp.company && (
                    <span style={{ fontSize: baseFontSize, color: accent, fontWeight: 600 }}> · {exp.company}</span>
                  )}
                  {exp.location && (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}> · {exp.location}</span>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {formatDate(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <p style={{ fontSize: baseFontSize, color: '#374151', lineHeight: 1.6, margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    education: showSections.education && education.length > 0 ? (
      <section key="education">
        {divider}
        {sectionTitle('Formazione')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
          {education.map((edu) => (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: baseFontSize, color: '#111827' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </span>
                  {edu.institution && (
                    <span style={{ fontSize: baseFontSize, color: accent, fontWeight: 600 }}> · {edu.institution}</span>
                  )}
                  {edu.grade && (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}> · Grade: {edu.grade}</span>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.startDate)}{edu.startDate ? ' – ' : ''}{formatDate(edu.endDate)}
                </span>
              </div>
              {edu.description && (
                <p style={{ fontSize: baseFontSize, color: '#374151', lineHeight: 1.6, margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    skills: showSections.skills && skills.length > 0 ? (
      <section key="skills">
        {divider}
        {sectionTitle('Competenze')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {technicalSkills.length > 0 && (
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Technical
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                {technicalSkills.map(skill => (
                  <span key={skill.id} style={{
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    border: `1px solid ${accent}`,
                    color: accent,
                    background: 'transparent',
                    fontWeight: 500,
                  }}>
                    {skill.name}
                    <span style={{ fontSize: '10px', color: '#9ca3af', marginLeft: '4px' }}>
                      {skillLevelLabel[skill.level]}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {softSkills.length > 0 && (
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Soft Skills
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                {softSkills.map(skill => (
                  <span key={skill.id} style={{
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontWeight: 500,
                  }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    ) : null,

    languages: showSections.languages && languages.length > 0 ? (
      <section key="languages">
        {divider}
        {sectionTitle('Lingue')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {languages.map(lang => (
            <span key={lang.id} style={{
              fontSize: baseFontSize,
              color: '#374151',
            }}>
              <span style={{ fontWeight: 600 }}>{lang.name}</span>
              <span style={{ color: '#6b7280', marginLeft: '4px' }}>({languageLevelLabel[lang.level]})</span>
            </span>
          ))}
        </div>
      </section>
    ) : null,

    certifications: showSections.certifications && other.certifications.length > 0 ? (
      <section key="certifications">
        {divider}
        {sectionTitle('Certificazioni')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {other.certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: baseFontSize, color: '#111827' }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: baseFontSize, color: '#6b7280' }}> · {cert.issuer}</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                {formatDate(cert.date)}
                {cert.expiryDate && ` – ${formatDate(cert.expiryDate)}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    drivingLicenses: showSections.drivingLicenses && other.drivingLicenses.length > 0 ? (
      <section key="drivingLicenses">
        {divider}
        {sectionTitle('Patenti')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {other.drivingLicenses.map(license => (
            <div key={license.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: baseFontSize, color: '#111827' }}>{license.licenseType}</span>
              <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                {license.issuingDate && formatDate(license.issuingDate)}
                {license.expiryDate && ` – ${formatDate(license.expiryDate)}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    hobbies: showSections.hobbies && other.hobbies.length > 0 ? (
      <section key="hobbies">
        {divider}
        {sectionTitle('Hobby e Interessi')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {other.hobbies.map((hobby, i) => (
            <span key={i} style={{
              fontSize: baseFontSize,
              padding: '2px 8px',
              borderRadius: '3px',
              background: '#f3f4f6',
              color: '#374151',
            }}>
              {hobby}
            </span>
          ))}
        </div>
      </section>
    ) : null,
  };

  const orderedSections = sectionOrder
    .map(key => sectionComponents[key])
    .filter(Boolean);

  return (
    <div
      id={id}
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: baseFontSize,
        color: '#111827',
        background: '#ffffff',
        padding: '36px 44px',
        minHeight: '297mm',
        boxSizing: 'border-box',
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          {showPhoto && personalInfo.profilePhoto && (
            <img
              src={personalInfo.profilePhoto}
              alt="Profile"
              style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 2px 0',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.jobTitle && (
              <p style={{ fontSize: '15px', color: accent, fontWeight: 600, margin: '0 0 8px 0' }}>
                {personalInfo.jobTitle}
              </p>
            )}
            {/* Contact row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#4b5563' }}>
              {personalInfo.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={11} color={accent} />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={11} color={accent} />
                  {personalInfo.phone}
                </span>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} color={accent} />
                  {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                </span>
              )}
              {personalInfo.website && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={11} color={accent} />
                  {personalInfo.website}
                </span>
              )}
              {personalInfo.linkedin && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Linkedin size={11} color={accent} />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.github && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Github size={11} color={accent} />
                  {personalInfo.github}
                </span>
              )}
              {personalInfo.dateOfBirth && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={11} color={accent} />
                  {personalInfo.dateOfBirth}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Ordered Sections */}
      {orderedSections}
    </div>
  );
};
