import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar, Award } from 'lucide-react';
import { CVData, CVSettings } from '../../types/cv.types';

interface Props {
  cvData: CVData;
  settings: CVSettings;
  id?: string;
}

const fontSizeMap = { small: '12px', medium: '13px', large: '14px' };
const spacingMap = { compact: '8px', standard: '14px', spacious: '20px' };

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year) return '';
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

const languageLevelLabel: Record<string, string> = {
  A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2', Native: 'Native',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function darkenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.max(0, rgb.r - amount);
  const g = Math.max(0, rgb.g - amount);
  const b = Math.max(0, rgb.b - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const ModernTemplate: React.FC<Props> = ({ cvData, settings, id }) => {
  const { personalInfo, professionalSummary, experiences, education, skills, languages, other } = cvData;
  const { accentColor, fontSize, spacing, showPhoto, showSections, sectionOrder } = settings;

  const baseFontSize = fontSizeMap[fontSize];
  const sectionGap = spacingMap[spacing];
  const accent = accentColor || '#2563eb';
  const sidebarDark = darkenColor(accent, 40);

  const sidebarSectionTitle = (title: string) => (
    <h3 style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.7)',
      margin: `0 0 8px 0`,
      paddingBottom: '5px',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    }}>
      {title}
    </h3>
  );

  const mainSectionTitle = (title: string) => (
    <div style={{ marginBottom: '16px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '4px', height: '22px', background: accent, borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#111827',
        margin: 0,
        paddingTop: '1px',
      }}>
        {title}
      </h2>
    </div>
  );

  const SkillDots: React.FC<{ level: number }> = ({ level }) => (
    <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: i <= level ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
          }}
        />
      ))}
    </div>
  );

  const timelineDot = (
    <div style={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: accent,
      border: '2px solid white',
      boxShadow: `0 0 0 2px ${accent}`,
      flexShrink: 0,
      marginTop: '4px',
    }} />
  );

  const technicalSkills = skills.filter(s => s.category === 'technical');
  const softSkills = skills.filter(s => s.category === 'soft');

  // Sidebar sections
  const sidebarContent = (
    <div style={{
      width: '30%',
      minHeight: '297mm',
      background: accent,
      padding: '0',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}>
      {/* Photo + Name area */}
      <div style={{ background: sidebarDark, padding: '28px 20px 20px', textAlign: 'center' }}>
        {showPhoto && personalInfo.profilePhoto && (
          <img
            src={personalInfo.profilePhoto}
            alt="Foto profilo"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255,255,255,0.4)',
              marginBottom: '12px',
              display: 'block',
              margin: '0 auto 12px',
            }}
          />
        )}
        {(!showPhoto || !personalInfo.profilePhoto) && (
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '26px',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 700,
          }}>
            {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
          </div>
        )}
      </div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: sectionGap }}>
        {/* Contact */}
        <div>
          {sidebarSectionTitle('Contatti')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {personalInfo.email && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Mail size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', wordBreak: 'break-all', lineHeight: 1.4 }}>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            {personalInfo.dateOfBirth && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>{personalInfo.dateOfBirth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        {(personalInfo.website || personalInfo.linkedin || personalInfo.github) && (
          <div>
            {sidebarSectionTitle('Link')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {personalInfo.website && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Globe size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', wordBreak: 'break-all', lineHeight: 1.4 }}>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Linkedin size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', wordBreak: 'break-all', lineHeight: 1.4 }}>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Github size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', wordBreak: 'break-all', lineHeight: 1.4 }}>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {showSections.skills && skills.length > 0 && (
          <div>
            {sidebarSectionTitle('Competenze')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {technicalSkills.length > 0 && (
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Technical</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {technicalSkills.map(skill => (
                      <div key={skill.id}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>{skill.name}</span>
                        <SkillDots level={skill.level} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {softSkills.length > 0 && (
                <div style={{ marginTop: softSkills.length > 0 && technicalSkills.length > 0 ? '4px' : '0' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Competenze Trasversali</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {softSkills.map(skill => (
                      <span key={skill.id} style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.9)',
                      }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {showSections.languages && languages.length > 0 && (
          <div>
            {sidebarSectionTitle('Lingue')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {languages.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>{lang.name}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 600,
                  }}>
                    {languageLevelLabel[lang.level]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {showSections.hobbies && other.hobbies.length > 0 && (
          <div>
            {sidebarSectionTitle('Interessi')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {other.hobbies.map((hobby, i) => (
                <span key={i} style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.9)',
                }}>
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Main content sections
  const mainSectionComponents: Record<string, React.ReactNode> = {
    professionalSummary: showSections.professionalSummary && professionalSummary ? (
      <section key="professionalSummary" style={{ marginBottom: sectionGap }}>
        {mainSectionTitle('Profilo Professionale')}
        <p style={{ fontSize: baseFontSize, color: '#374151', lineHeight: 1.7, margin: 0 }}>{professionalSummary}</p>
      </section>
    ) : null,

    experiences: showSections.experiences && experiences.length > 0 ? (
      <section key="experiences" style={{ marginBottom: sectionGap }}>
        {mainSectionTitle('Esperienze Lavorative')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
          {experiences.map((exp) => (
            <div key={exp.id} style={{ display: 'flex', gap: '12px' }}>
              {timelineDot}
              <div style={{ flex: 1, paddingBottom: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: baseFontSize, color: '#111827', display: 'block' }}>{exp.position}</span>
                    <span style={{ fontSize: '12px', color: accent, fontWeight: 600 }}>{exp.company}</span>
                    {exp.location && <span style={{ fontSize: '11px', color: '#9ca3af' }}> · {exp.location}</span>}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                  }}>
                    {formatDate(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontSize: baseFontSize, color: '#4b5563', lineHeight: 1.6, margin: '5px 0 0 0', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    education: showSections.education && education.length > 0 ? (
      <section key="education" style={{ marginBottom: sectionGap }}>
        {mainSectionTitle('Formazione')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', gap: '12px' }}>
              {timelineDot}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: baseFontSize, color: '#111827', display: 'block' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </span>
                    <span style={{ fontSize: '12px', color: accent, fontWeight: 600 }}>{edu.institution}</span>
                    {edu.grade && <span style={{ fontSize: '11px', color: '#9ca3af' }}> · Grade: {edu.grade}</span>}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                  }}>
                    {formatDate(edu.startDate)}{edu.startDate ? ' – ' : ''}{formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p style={{ fontSize: baseFontSize, color: '#4b5563', lineHeight: 1.6, margin: '5px 0 0 0', whiteSpace: 'pre-line' }}>
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    certifications: showSections.certifications && other.certifications.length > 0 ? (
      <section key="certifications" style={{ marginBottom: sectionGap }}>
        {mainSectionTitle('Certificazioni')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {other.certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Award size={14} color={accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: baseFontSize, color: '#111827' }}>{cert.name}</span>
                    {cert.issuer && <span style={{ fontSize: '12px', color: '#6b7280' }}> · {cert.issuer}</span>}
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {formatDate(cert.date)}
                    {cert.expiryDate && ` – ${formatDate(cert.expiryDate)}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    drivingLicenses: showSections.drivingLicenses && other.drivingLicenses.length > 0 ? (
      <section key="drivingLicenses" style={{ marginBottom: sectionGap }}>
        {mainSectionTitle('Patenti')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {other.drivingLicenses.map(license => (
            <div key={license.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Award size={14} color={accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: baseFontSize, color: '#111827' }}>{license.licenseType}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {license.issuingDate && formatDate(license.issuingDate)}
                    {license.expiryDate && ` – ${formatDate(license.expiryDate)}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,

    // Skills, languages, hobbies are in sidebar — render nothing in main for those
    skills: null,
    languages: null,
    hobbies: null,
  };

  const orderedMainSections = sectionOrder
    .map(key => mainSectionComponents[key])
    .filter(Boolean);

  return (
    <div
      id={id}
      style={{
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontSize: baseFontSize,
        color: '#111827',
        background: '#ffffff',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar */}
      {sidebarContent}

      {/* Main Content */}
      <div style={{ flex: 1, padding: '28px 28px 28px 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* Name & Title */}
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid #f3f4f6` }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#111827',
            margin: '0 0 4px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            {personalInfo.firstName} <span style={{ color: accent }}>{personalInfo.lastName}</span>
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, margin: 0 }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Ordered main sections */}
        {orderedMainSections}
      </div>
    </div>
  );
};
