export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email obbligatoria';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Email non valida';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return null; // optional
  const re = /^[\d\s\+\-\(\)]{6,20}$/;
  if (!re.test(phone)) return 'Numero di telefono non valido';
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null; // optional
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return null;
  } catch {
    return 'URL non valido';
  }
};

export const validateImageFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Formato non supportato. Usa JPG, PNG o WebP';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'File troppo grande. Massimo 5MB';
  }
  return null;
};

export const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
