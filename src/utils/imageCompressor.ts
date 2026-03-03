/**
 * Utility per compressione e conversione immagini client-side.
 * Usato per preparare screenshot di offerte di lavoro prima dell'invio all'IA.
 */

export const getMediaType = (file: File): string => {
  const typeMap: Record<string, string> = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/gif': 'image/gif',
    'image/webp': 'image/webp',
  };
  return typeMap[file.type] || 'image/jpeg';
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g. "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Errore nella lettura del file'));
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, maxWidth = 1200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Se l'immagine è già piccola, restituisci base64 diretto
      if (img.width <= maxWidth && file.size < 500_000) {
        fileToBase64(file).then(resolve).catch(reject);
        return;
      }

      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas non supportato'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Errore nel caricamento dell\'immagine'));
    };

    img.src = url;
  });
};
