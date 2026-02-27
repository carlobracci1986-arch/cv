import React, { useRef, useState } from 'react';
import { FileUp, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { CVData } from '../types/cv.types';
import { extractTextFromPDF, parseCVText } from '../services/pdfParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: CVData) => void;
}

export const PDFImportModal: React.FC<Props> = ({ isOpen, onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast.error('Per favore seleziona un file PDF');
      return;
    }

    setIsLoading(true);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);

      if (!text.trim()) {
        toast.error('Impossibile estrarre testo dal PDF');
        return;
      }

      // Parse the text to extract CV data
      const parsedData = parseCVText(text);

      // Import the data
      onImport(parsedData as CVData);

      toast.success('CV importato da PDF! ✅ Verifica e completa i dettagli');

      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante l\'importazione del PDF';
      toast.error(message);
      console.error('PDF import error:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Importa CV da PDF</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📄 Seleziona un file PDF del tuo CV. Il sistema estrarrà il testo e compilierà automaticamente i form.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              💡 Ricorda di controllare e completare i dettagli dopo l'importazione.
            </p>
          </div>

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Clicca per selezionare un PDF</p>
            <p className="text-xs text-gray-500 mt-1">oppure trascina il file qui</p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-blue-600">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Elaborazione PDF in corso...</span>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <p className="font-medium mb-1">✨ Cosa verrà importato:</p>
            <ul className="space-y-0.5 text-gray-500">
              <li>✓ Nome e contatti (email, telefono)</li>
              <li>✓ Titolo professionale</li>
              <li>✓ Esperienze lavorative</li>
              <li>✓ Formazione scolastica</li>
              <li>✓ Competenze</li>
              <li>✓ Lingue e certificazioni</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FileUp className="h-4 w-4" />
            Seleziona PDF
          </button>
        </div>
      </div>
    </div>
  );
};
