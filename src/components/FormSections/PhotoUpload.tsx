import React, { useRef, useState, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Camera, AlertCircle, Check, RotateCcw } from 'lucide-react';

interface Props {
  photo?: string;
  onChange: (photo: string | undefined) => void;
}

/** Estrae il canvas ritagliato dall'immagine originale */
function extractCroppedCanvas(image: HTMLImageElement, pixelCrop: PixelCrop): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const outputSize = 300;
  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    outputSize,
    outputSize,
  );

  return canvas;
}

/** Crea un crop iniziale centrato quadrato */
function makeCenteredCrop(width: number, height: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
    width,
    height,
  );
}

export const PhotoUpload: React.FC<Props> = ({ photo, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Stato del flusso: 'idle' | 'cropping'
  const [stage, setStage] = useState<'idle' | 'cropping'>('idle');
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);

  /* ---- Caricamento file ---- */
  const loadFile = useCallback((file: File) => {
    setError(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato non supportato. Usa JPG, PNG o WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File troppo grande. Massimo 5 MB');
      return;
    }

    // Revoca URL precedente per evitare memory leak
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setStage('cropping');
  }, [srcUrl]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  /* ---- Immagine caricata nell'editor: setta crop iniziale ---- */
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(makeCenteredCrop(width, height));
  }, []);

  /* ---- Applica il crop ---- */
  const handleApply = useCallback(() => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = extractCroppedCanvas(imgRef.current, completedCrop);
    const base64 = canvas.toDataURL('image/jpeg', 0.88);
    onChange(base64);

    // Pulizia
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setSrcUrl(null);
    setStage('idle');
  }, [completedCrop, onChange, srcUrl]);

  /* ---- Annulla crop ---- */
  const handleCancel = useCallback(() => {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setSrcUrl(null);
    setStage('idle');
  }, [srcUrl]);

  /* ---- Rimuovi foto esistente ---- */
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setError(null);
  }, [onChange]);

  /* ========== RENDER ========== */

  /* --- Editor di crop (modal a schermo intero) --- */
  if (stage === 'cropping' && srcUrl) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-700">
          <div>
            <p className="text-white font-semibold text-sm">Ritaglia la foto</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Trascina il riquadro per riposizionare • Trascina gli angoli per ridimensionare
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
            aria-label="Annulla"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            minWidth={60}
            minHeight={60}
            className="max-h-[70vh]"
          >
            <img
              ref={imgRef}
              src={srcUrl}
              alt="Immagine da ritagliare"
              onLoad={onImageLoad}
              style={{ maxHeight: '70vh', maxWidth: '90vw', objectFit: 'contain' }}
            />
          </ReactCrop>
        </div>

        {/* Anteprima + azioni */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900 border-t border-gray-700 gap-4">
          {/* Mini-preview del crop */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0 bg-gray-800">
              {completedCrop && imgRef.current ? (
                <CropPreview image={imgRef.current} crop={completedCrop} size={56} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  anteprima
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-300 text-xs font-medium">Anteprima</p>
              <p className="text-gray-500 text-xs">Come apparirà nel CV</p>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Ripristina crop centrato */}
            <button
              onClick={() => {
                if (imgRef.current) {
                  const { width, height } = imgRef.current;
                  setCrop(makeCenteredCrop(width, height));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
              title="Ripristina al centro"
            >
              <RotateCcw size={14} />
              Centra
            </button>

            {/* Annulla */}
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
            >
              Annulla
            </button>

            {/* Applica */}
            <button
              onClick={handleApply}
              disabled={!completedCrop || completedCrop.width < 10}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              <Check size={15} />
              Applica
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* --- Stato normale (nessuna foto / foto presente) --- */
  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
        aria-label="Carica foto profilo"
      />

      {photo ? (
        /* Foto presente */
        <div className="flex flex-col items-center gap-3">
          <div className="relative inline-block">
            <img
              src={photo}
              alt="Foto profilo"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Rimuovi foto"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={openFilePicker}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors focus:outline-none focus:underline"
            >
              <Camera size={15} />
              Cambia foto
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          aria-label="Carica foto profilo. Clicca o trascina un'immagine"
          onClick={openFilePicker}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFilePicker(); } }}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={[
            'flex flex-col items-center justify-center gap-3 w-40 h-40 rounded-full border-2 border-dashed cursor-pointer select-none transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/50',
          ].join(' ')}
        >
          <div className={['flex items-center justify-center w-11 h-11 rounded-full transition-colors', isDragging ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'].join(' ')}>
            {isDragging ? <Upload size={22} /> : <Camera size={22} />}
          </div>
          <div className="text-center px-3">
            <p className={['text-xs font-medium', isDragging ? 'text-primary-600' : 'text-gray-600'].join(' ')}>
              {isDragging ? 'Rilascia qui' : 'Aggiungi foto'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP • max 5 MB</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm max-w-xs">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Componente interno: anteprima live del crop usando un canvas        */
/* ------------------------------------------------------------------ */
const CropPreview: React.FC<{ image: HTMLImageElement; crop: PixelCrop; size: number }> = ({
  image,
  crop,
  size,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      size,
      size,
    );
  }, [image, crop, size]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} />;
};
