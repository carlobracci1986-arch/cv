import React from 'react';
import { PersonalInfo, GDPRConsentType } from '../../types/cv.types';
import { getGDPRConsentText } from '../../utils/gdprConsent';

interface Props {
  personalInfo: PersonalInfo;
  gdprConsentType: GDPRConsentType;
  customGdprText?: string;
  includeConsentDate: boolean;
  includeSignature: boolean;
}

export const GDPRConsentSection: React.FC<Props> = ({
  personalInfo,
  gdprConsentType,
  customGdprText,
  includeConsentDate,
  includeSignature,
}) => {
  const gdprText = getGDPRConsentText(
    gdprConsentType,
    customGdprText,
    personalInfo,
    includeConsentDate
  );

  return (
    <section className="cv-section gdpr-consent">
      <div className="gdpr-text">
        {gdprText.split('\n').map((line, index) => (
          line.trim() && (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          )
        ))}
      </div>

      {includeSignature && (
        <div className="signature-field">
          <div className="signature-container">
            <div className="signature-item">
              <p className="signature-label">Luogo e Data</p>
              <div className="signature-line"></div>
            </div>
            <div className="signature-item">
              <p className="signature-label">Firma</p>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
