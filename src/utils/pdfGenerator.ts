import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  filename?: string;
  quality?: 'standard' | 'high';
  includeMetadata?: boolean;
  authorName?: string;
  title?: string;
  watermark?: string;
}

export const generatePDFFromElement = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'curriculum-vitae.pdf',
    quality = 'high',
    includeMetadata = true,
    authorName = '',
    title = 'Curriculum Vitae',
    watermark,
  } = options;

  const scale = quality === 'high' ? 4 : 2.5;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    imageTimeout: 0,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  if (includeMetadata) {
    pdf.setProperties({
      title,
      author: authorName,
      subject: 'Curriculum Vitae',
      keywords: 'curriculum, cv, resume',
      creator: 'CV Builder AI',
    });
  }

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  // Handle multi-page documents
  const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    pdf.addImage(
      imgData,
      'JPEG',
      imgX,
      imgY - page * pdfHeight,
      imgWidth * ratio,
      imgHeight * ratio,
    );

    if (watermark) {
      pdf.setFontSize(40);
      pdf.setTextColor(200, 200, 200);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.3 }));
      pdf.text(watermark, pdfWidth / 2, pdfHeight / 2, {
        angle: -45,
        align: 'center',
      });
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
    }
  }

  pdf.save(filename);
};

export const generateFilename = (
  firstName: string,
  lastName: string,
  company?: string
): string => {
  const date = new Date().toISOString().split('T')[0];
  const name = `${lastName}_${firstName}`.replace(/\s+/g, '_');
  const companyPart = company ? `_${company.replace(/\s+/g, '_')}` : '';
  return `CV_${name}${companyPart}_${date}.pdf`;
};
