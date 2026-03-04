import React, { forwardRef, useEffect, useRef as useLocalRef, useState, useCallback } from 'react';
import { CVData, CVSettings } from '../types/cv.types';
import { ClassicTemplate } from './CVTemplates/ClassicTemplate';
import { ModernTemplate } from './CVTemplates/ModernTemplate';
import { MinimalistTemplate } from './CVTemplates/MinimalistTemplate';
import { ProtectedCategorySection } from './CVSections/ProtectedCategorySection';
import { GDPRConsentSection } from './CVSections/GDPRConsentSection';

// A4 height in pixels at 96 DPI: 297mm * (96/25.4) ≈ 1122.52px
const A4_HEIGHT_PX = 1122.52;

interface Props {
  cvData: CVData;
  settings: CVSettings;
  scale?: number;
  id?: string;
  onPageCountChange?: (count: number) => void;
}

export const CVPreview = forwardRef<HTMLDivElement, Props>(({ cvData, settings, scale = 1, id = 'cv-preview', onPageCountChange }, ref) => {
  const contentRef = useLocalRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  const updatePageCount = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const height = el.scrollHeight;
    const pages = Math.max(1, Math.ceil(height / A4_HEIGHT_PX));
    if (pages !== pageCount) {
      setPageCount(pages);
      onPageCountChange?.(pages);
    }
  }, [pageCount, onPageCountChange]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    updatePageCount();

    const observer = new ResizeObserver(() => {
      updatePageCount();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [updatePageCount]);

  // Also recalculate when cvData or settings change
  useEffect(() => {
    // Small delay to let the DOM update
    const timer = setTimeout(updatePageCount, 100);
    return () => clearTimeout(timer);
  }, [cvData, settings, updatePageCount]);

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

  const pageBreakLines = [];
  for (let i = 1; i < pageCount; i++) {
    pageBreakLines.push(
      <div
        key={i}
        className="page-break-line"
        style={{ top: `${i * A4_HEIGHT_PX}px` }}
        data-html2canvas-ignore="true"
      >
        <span className="page-break-label">Pag. {i} | Pag. {i + 1}</span>
      </div>
    );
  }

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
        position: 'relative',
      }}
      id={id}
    >
      <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
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
            language={cvData.sectionLabels?._lang || 'it'}
          />
        </div>
      </div>

      {/* Page break indicators overlay */}
      {pageBreakLines.length > 0 && (
        <div className="page-break-overlay" data-html2canvas-ignore="true">
          {pageBreakLines}
        </div>
      )}
    </div>
  );
});

CVPreview.displayName = 'CVPreview';
