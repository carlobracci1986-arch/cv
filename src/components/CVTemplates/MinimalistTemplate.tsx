import React from 'react';
import { CVData, CVSettings } from '../../types/cv.types';

interface Props {
  cvData: CVData;
  settings: CVSettings;
  id?: string;
}

const fontSizeMap = { small: '13px', medium: '14px', large: '15px' };
const spacingMap = { compact: '12px', standard: '20px', spacious: '28px' };

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year) return '';
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

const languageLevelFull: Record<string, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
  B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficient', Native: 'Native',
};

export const MinimalistTemplate: React.FC<Props> = ({ cvData, settings, id }) => {
  const { personalInfo, professionalSummary, experiences, education, skills, languages } = cvData;
  const other = cvData.other || { certifications: [], drivingLicenses: [], hobbies: [] };
  const { accentColor, fontSize, spacing, showSections, sectionOrder } = settings;

  const baseFontSize = fontSizeMap[fontSize];
  const sectionGap = spacingMap[spacing];
  const nameColor = accentColor || '#111827';

  const thinRule = (
    <hr style={{
      border: 'none',
      borderTop: '1px solid #e5e7eb',
      margin: `${sectionGap} 0`,
    }} />
  );

  const sectionTitle = (title: string) => (
    <h2 style={{
      fontSize: '11px',
      fontWeight: 400,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      margin: `0 0 12px 0`,
    }}>
      {title}
    </h2>
  );

  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  const sectionComponents: Record<string, React.ReactNode> = {
    professionalSummary: showSections.professionalSummary && professionalSummary ? (
      <section key="professionalSummary">
        {thinRule}
        {sectionTitle('Profilo Professionale')}
        <p style={{
          fontSize: baseFontSize,
          color: '#4b5563',
          lineHeight: 1.75,
          margin: 0,
          fontWeight: 300,
        }}>
          {professionalSummary}
        </p>
      </section>
    ) : null,

    experiences: showSections.experiences && experiences.length > 0 ? (
      <section key="experiences">
        {thinRule}
        {sectionTitle('Esperienze Lavorative')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
          {experiences.map((exp) => (
            <div key={exp.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '3px' }}>
                <span style={{ fontWeight: 600, fontSize: baseFontSize, color: '#111827' }}>{exp.position}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 300 }}>
                  {formatDate(exp.startDate)}
                  {exp.startDate ? ' — ' : ''}
                  {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontStyle: 'italic' }}>
                {exp.company}
                {exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.description && (
                <div style={{ fontSize: baseFontSize, color: '#4b5563', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                  {exp.description.split('\n').map((line, i) => (
                    line.trim() ? (
                      <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '2px' }}>
                        <span style={{ color: '#d1d5db', flexShrink: 0 }}>–</span>
                        <span style={{ fontWeight: 300 }}>{line.trim().replace(/^[-•]\s*/, '')}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null,

    education: showSections.education && education.length > 0 ? (
      <section key="education">
        {thinRule}
        {sectionTitle('Formazione')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
          {education.map((edu) => (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: baseFontSize, color: '#111827' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 300 }}>
                  {formatDate(edu.startDate)}
                  {edu.startDate ? ' — ' : ''}
                  {formatDate(edu.endDate)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontStyle: 'italic' }}>
                {edu.institution}
                {edu.grade ? ` · ${edu.grade}` : ''}
              </div>
              {edu.description && (
                <p style={{ fontSize: baseFontSize, color: '#4b5563', lineHeight: 1.65, margin: '4px 0 0 0', fontWeight: 300 }}>
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
        {thinRule}
        {sectionTitle('Competenze')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {['technical', 'soft'].map(category => {
            const categorySkills = skills.filter(s => s.category === category);
            if (!categorySkills.length) return null;
            return (
              <div key={category}>
                <span style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 400,
                }}>
                  {category === 'technical' ? 'Technical' : 'Soft'}
                </span>
                <p style={{ margin: 0, fontSize: baseFontSize, color: '#4b5563', fontWeight: 300, lineHeight: 1.6 }}>
                  {categorySkills.map(s => s.name).join(' · ')}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    ) : null,

    languages: showSections.languages && languages.length > 0 ? (
      <section key="languages">
        {thinRule}
        {sectionTitle('Lingue')}
        <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '32px', rowGap: '6px' }}>
          {languages.map(lang => (
            <div key={lang.id} style={{ fontSize: baseFontSize }}>
              <span style={{ fontWeight: 600, color: '#111827' }}>{lang.name}</span>
              <span style={{ color: '#9ca3af', fontWeight: 300, marginLeft: '6px' }}>{languageLevelFull[lang.level]}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: showSections.certifications && other.certifications.length > 0 ? (
      <section key="certifications">
        {thinRule}
        {sectionTitle('Certificazioni')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {other.certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
              <div style={{ fontSize: baseFontSize }}>
                <span style={{ fontWeight: 600, color: '#111827' }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#6b7280', fontWeight: 300 }}>, {cert.issuer}</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 300, whiteSpace: 'nowrap' }}>
                {formatDate(cert.date)}
                {cert.expiryDate && ` — ${formatDate(cert.expiryDate)}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    drivingLicenses: showSections.drivingLicenses && other.drivingLicenses.length > 0 ? (
      <section key="drivingLicenses">
        {thinRule}
        {sectionTitle('Patenti')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {other.drivingLicenses.map(license => (
            <div key={license.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ fontSize: baseFontSize, fontWeight: 600, color: '#111827' }}>{license.licenseType}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 300, whiteSpace: 'nowrap' }}>
                {license.issuingDate && formatDate(license.issuingDate)}
                {license.expiryDate && ` — ${formatDate(license.expiryDate)}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    hobbies: showSections.hobbies && other.hobbies.length > 0 ? (
      <section key="hobbies">
        {thinRule}
        {sectionTitle('Interessi')}
        <p style={{ fontSize: baseFontSize, color: '#4b5563', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
          {other.hobbies.join(' · ')}
        </p>
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
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: baseFontSize,
        color: '#111827',
        background: '#ffffff',
        padding: '52px 56px',
        minHeight: '297mm',
        boxSizing: 'border-box',
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: '6px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 200,
          color: nameColor,
          margin: '0 0 4px 0',
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
        }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            fontWeight: 300,
            margin: '0 0 12px 0',
            letterSpacing: '0.02em',
          }}>
            {personalInfo.jobTitle}
          </p>
        )}
        {contactParts.length > 0 && (
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            fontWeight: 300,
            margin: 0,
            lineHeight: 1.6,
          }}>
            {contactParts.join('  ·  ')}
          </p>
        )}
      </header>

      {orderedSections}
    </div>
  );
};
