import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { CVData } from '../types/cv.types';
import { PDFImportModal } from './PDFImportModal';

interface Props {
  onImport: (data: CVData) => void;
}

export const PDFImportButton: React.FC<Props> = ({ onImport }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors border border-orange-200"
        title="Importa CV da PDF"
      >
        <FileText className="h-4 w-4" />
        Importa PDF
      </button>

      <PDFImportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onImport={onImport}
      />
    </>
  );
};
