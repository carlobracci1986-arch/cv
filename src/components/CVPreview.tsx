import React, { forwardRef } from 'react';
import { CVData, CVSettings } from '../types/cv.types';
import { ClassicTemplate } from './CVTemplates/ClassicTemplate';
import { ModernTemplate } from './CVTemplates/ModernTemplate';
import { MinimalistTemplate } from './CVTemplates/MinimalistTemplate';
import { ProtectedCategorySection } from './CVSections/ProtectedCategorySection';
import { GDPRConsentSection } from './CVSections/GDPRConsentSection';

interface Props {
  cvData: CVData;
  settings: CVSettings;
  scale?: number;
  id?: string;
}

export const CVPreview = forwardRef<HTMLDivElement, Props>(({ cvData, settings, scale = 1, id = 'cv-preview' }, ref) => {
  const renderTemplate = () => {
    switch (settings.template) {
      case 'classic':
        return <ClassicTemplate cvData={cvData} settings={settings} />;
      case 'modern':
        return <ModernTemplate cvData={cvData} settings={settings} />;
      case 'minimalist':
        return <MinimalistTemplate cvData={cvData} settings={settings} />;
      default:
        return <ModernTemplate cvData={cvData} settings={settings} />;
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}
      id={id}
    >
      <div style={{ flex: 1 }}>
        {renderTemplate()}
      </div>

      {/* Protected Category Section */}
      <div style={{ padding: '0 20mm' }}>
        <ProtectedCategorySection
          protectedCategory={cvData.protectedCategory}
          show={settings.showSections.protectedCategory}
        />
      </div>

      {/* GDPR Consent Section */}
      <div style={{ padding: '0 20mm', marginTop: 'auto' }}>
        <GDPRConsentSection
          personalInfo={cvData.personalInfo}
          gdprConsentType={settings.gdprConsentType}
          customGdprText={settings.customGdprText}
          includeConsentDate={settings.includeConsentDate}
          includeSignature={settings.includeSignature}
        />
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';
