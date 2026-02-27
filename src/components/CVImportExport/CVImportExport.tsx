import React, { useRef } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { CVData } from '../../types/cv.types';

interface Props {
  cvData: CVData;
  onImport: (data: CVData) => void;
}

export const CVImportExport: React.FC<Props> = ({ cvData, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const dataToExport = {
        data: cvData,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `cv-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('CV esportato con successo! 📥');
    } catch (error) {
      toast.error('Errore durante l\'esportazione');
      console.error('Export error:', error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // Validate the imported data structure
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Formato file non valido');
      }

      // Check if it has the required fields
      if (!parsed.data.personalInfo || !Array.isArray(parsed.data.experiences)) {
        throw new Error('Il file non contiene una struttura CV valida');
      }

      // Import the data
      onImport(parsed.data);
      toast.success('CV importato con successo! ✅');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante l\'importazione';
      toast.error(message);
      console.error('Import error:', error);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Import Button */}
      <button
        onClick={handleImportClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
        title="Importa un CV da file JSON"
      >
        <Upload className="h-4 w-4" />
        Importa CV
      </button>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
        title="Esporta CV come file JSON"
      >
        <Download className="h-4 w-4" />
        Esporta CV
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleziona file CV da importare"
      />

      {/* Info tooltip */}
      <div className="flex items-center gap-1 text-xs text-gray-500 ml-2 px-3 py-2 bg-gray-50 rounded border border-gray-200">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Esporta e importa il tuo CV in formato JSON</span>
      </div>
    </div>
  );
};
