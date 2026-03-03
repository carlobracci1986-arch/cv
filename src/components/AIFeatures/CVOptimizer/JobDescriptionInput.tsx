import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, FileText, Image, Upload, X, Loader2, Camera } from 'lucide-react';
import { extractTextFromImages } from '../../../services/aiProvider';
import { compressImage, getMediaType } from '../../../utils/imageCompressor';

interface Props {
  jobDescription: string;
  onChange: (jd: string) => void;
  onOptimize: () => void;
  isLoading: boolean;
}

type TabType = 'text' | 'screenshot';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export const JobDescriptionInput: React.FC<Props> = ({
  jobDescription,
  onChange,
  onOptimize,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxChars = 10000;
  const charCount = jobDescription.trim().length;
  const charPercentage = Math.min((charCount / maxChars) * 100, 100);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Formato non supportato: ${file.type}. Usa JPG, PNG, GIF o WebP.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File troppo grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB.`;
    }
    return null;
  };

  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setExtractionError(null);

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setExtractionError(`Massimo ${MAX_IMAGES} immagini consentite.`);
      return;
    }

    const toAdd = fileArray.slice(0, remaining);
    const errors: string[] = [];

    const validFiles: File[] = [];
    for (const file of toAdd) {
      const err = validateFile(file);
      if (err) {
        errors.push(err);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setExtractionError(errors[0]);
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }

    if (fileArray.length > remaining) {
      setExtractionError(`Aggiunte solo ${remaining} immagini. Massimo ${MAX_IMAGES}.`);
    }
  }, [images.length]);

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setExtractionError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  }, [addImages]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleExtract = async () => {
    if (images.length === 0) return;
    setIsExtracting(true);
    setExtractionError(null);

    try {
      const compressed = await Promise.all(
        images.map(async (file) => ({
          base64: await compressImage(file),
          mediaType: getMediaType(file),
        }))
      );

      const text = await extractTextFromImages(compressed);
      onChange(text);
      setActiveTab('text');
      // Cleanup
      previews.forEach((p) => URL.revokeObjectURL(p));
      setImages([]);
      setPreviews([]);
    } catch (err) {
      setExtractionError(
        err instanceof Error ? err.message : 'Errore durante l\'estrazione del testo.'
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const busy = isLoading || isExtracting;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Descrizione del lavoro
          </h3>
          <p className="text-sm text-gray-500">
            Incolla il testo o carica screenshot dell'offerta
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
        <button
          onClick={() => setActiveTab('text')}
          disabled={busy}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'text'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } disabled:opacity-50`}
        >
          <FileText className="w-4 h-4" />
          Copia e Incolla
        </button>
        <button
          onClick={() => setActiveTab('screenshot')}
          disabled={busy}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'screenshot'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } disabled:opacity-50`}
        >
          <Camera className="w-4 h-4" />
          Screenshot (max {MAX_IMAGES})
        </button>
      </div>

      {/* Tab: Text */}
      {activeTab === 'text' && (
        <>
          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={(e) => onChange(e.target.value)}
              rows={8}
              maxLength={maxChars}
              disabled={busy}
              placeholder="Incolla qui la descrizione del lavoro o l'offerta di impiego. L'AI analizzerà le parole chiave e ottimizzerà il tuo CV per massimizzare le possibilità di successo..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span
                className={`text-xs font-medium tabular-nums ${
                  charCount > maxChars * 0.9
                    ? 'text-orange-500'
                    : 'text-gray-400'
                }`}
              >
                {charCount.toLocaleString('it-IT')} / {maxChars.toLocaleString('it-IT')}
              </span>
            </div>
          </div>

          {charCount > 0 && (
            <div className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  charPercentage > 90
                    ? 'bg-orange-400'
                    : charPercentage > 60
                    ? 'bg-blue-400'
                    : 'bg-blue-300'
                }`}
                style={{ width: `${charPercentage}%` }}
              />
            </div>
          )}

          {charCount > 0 && charCount < 100 && (
            <p className="mt-2 text-xs text-amber-600">
              Testo breve — aggiungi più dettagli per un'analisi migliore.
            </p>
          )}
        </>
      )}

      {/* Tab: Screenshot */}
      {activeTab === 'screenshot' && (
        <div>
          {/* Drop zone */}
          {images.length < MAX_IMAGES && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all duration-200"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  Trascina qui gli screenshot o clicca per sfogliare
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, GIF, WebP — max 5MB per immagine
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && addImages(e.target.files)}
                className="hidden"
              />
            </div>
          )}

          {/* Image previews */}
          {images.length > 0 && (
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${images.length < MAX_IMAGES ? 'mt-4' : ''}`}>
              {previews.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3]">
                  <img
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    disabled={isExtracting}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <span className="text-xs text-white font-medium">
                      {i + 1}/{images.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {extractionError && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
              <p className="text-xs text-red-600">{extractionError}</p>
            </div>
          )}

          {/* Extract button */}
          {images.length > 0 && (
            <button
              onClick={handleExtract}
              disabled={isExtracting}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-700 shadow-sm hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Estrazione in corso...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4" />
                  Estrai testo con IA ({images.length} {images.length === 1 ? 'immagine' : 'immagini'})
                </>
              )}
            </button>
          )}

          {isExtracting && (
            <p className="mt-2 text-xs text-center text-gray-500">
              L'IA sta leggendo gli screenshot. Potrebbe richiedere qualche secondo.
            </p>
          )}
        </div>
      )}

      {/* Loading bar (optimization in progress) */}
      {isLoading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              Analisi in corso...
            </span>
            <span className="text-xs text-gray-400">Attendere prego</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-progress-bar" />
          </div>
          <style>{`
            @keyframes progressBar {
              0% { width: 10%; margin-left: 0%; }
              50% { width: 60%; margin-left: 20%; }
              100% { width: 10%; margin-left: 90%; }
            }
            .animate-progress-bar {
              animation: progressBar 1.6s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}

      {/* Footer with optimize button */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          L'analisi considera parole chiave, competenze richieste e struttura del CV.
        </p>
        <button
          onClick={onOptimize}
          disabled={busy || jobDescription.trim().length < 20}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-sm hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? 'Ottimizzazione...' : 'Ottimizza CV con AI'}
        </button>
      </div>
    </div>
  );
};
