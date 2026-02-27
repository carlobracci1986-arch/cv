export const GDPR_CONSENT_TEXTS = {
  minimal: `Autorizzo il trattamento dei dati personali ai sensi del GDPR (Regolamento UE 2016/679).`,

  standard: `Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice Privacy).`,

  extended: `Autorizzo il trattamento dei dati personali contenuti nel mio curriculum vitae in base all'art. 13 del Regolamento UE 2016/679 (GDPR) e all'art. 13 del D.Lgs. 196/2003 (Codice Privacy) per le finalità di ricerca e selezione del personale.`,

  complete: `Il/La sottoscritto/a [NOME COGNOME], nato/a a [LUOGO] il [DATA], residente a [INDIRIZZO], consapevole delle sanzioni penali previste in caso di dichiarazioni mendaci, dichiara sotto la propria responsabilità che quanto riportato nel presente curriculum corrisponde a verità.
Autorizzo il trattamento dei dati personali contenuti nel presente documento in base all'art. 13 del Regolamento UE 2016/679 (GDPR) e all'art. 13 del D.Lgs. 196/2003 (Codice Privacy) per le finalità di ricerca e selezione del personale.`,
} as const;

export const PROTECTED_CATEGORY_LABELS = {
  art1: 'Art. 1 - Disabili con invalidità superiore al 46%',
  art18: 'Art. 18 - Invalidi di guerra, invalidi civili di guerra, invalidi per servizio',
  altra: 'Altra categoria protetta',
} as const;
