export const GDPR_CONSENT_TEXTS = {
  minimal: `Autorizzo il trattamento dei dati personali ai sensi del GDPR (Regolamento UE 2016/679).`,

  standard: `Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice Privacy).`,

  extended: `Autorizzo il trattamento dei dati personali contenuti nel mio curriculum vitae in base all'art. 13 del Regolamento UE 2016/679 (GDPR) e all'art. 13 del D.Lgs. 196/2003 (Codice Privacy) per le finalità di ricerca e selezione del personale.`,

  complete: `Il/La sottoscritto/a [NOME COGNOME], nato/a a [LUOGO] il [DATA], residente a [INDIRIZZO], consapevole delle sanzioni penali previste in caso di dichiarazioni mendaci, dichiara sotto la propria responsabilità che quanto riportato nel presente curriculum corrisponde a verità.
Autorizzo il trattamento dei dati personali contenuti nel presente documento in base all'art. 13 del Regolamento UE 2016/679 (GDPR) e all'art. 13 del D.Lgs. 196/2003 (Codice Privacy) per le finalità di ricerca e selezione del personale.`,
} as const;

type GDPRTexts = { minimal: string; standard: string; extended: string; complete: string };

export const GDPR_CONSENT_TEXTS_EN: GDPRTexts = {
  minimal: `I authorize the processing of personal data pursuant to the GDPR (EU Regulation 2016/679).`,
  standard: `I authorize the processing of my personal data pursuant to EU Regulation 2016/679 (GDPR).`,
  extended: `I authorize the processing of the personal data contained in my curriculum vitae pursuant to Art. 13 of EU Regulation 2016/679 (GDPR) for the purposes of recruitment and personnel selection.`,
  complete: `I, the undersigned [NOME COGNOME], born in [LUOGO] on [DATA], residing at [INDIRIZZO], aware of the penalties for false declarations, declare under my own responsibility that the information contained in this CV is true and accurate.
I authorize the processing of the personal data contained in this document pursuant to Art. 13 of EU Regulation 2016/679 (GDPR) for the purposes of recruitment and personnel selection.`,
};

export const GDPR_CONSENT_TEXTS_FR: GDPRTexts = {
  minimal: `J'autorise le traitement de mes données personnelles conformément au RGPD (Règlement UE 2016/679).`,
  standard: `J'autorise le traitement de mes données personnelles conformément au Règlement UE 2016/679 (RGPD).`,
  extended: `J'autorise le traitement des données personnelles contenues dans mon curriculum vitae conformément à l'art. 13 du Règlement UE 2016/679 (RGPD) aux fins de recrutement et de sélection du personnel.`,
  complete: `Je soussigné(e) [NOME COGNOME], né(e) à [LUOGO] le [DATA], résidant à [INDIRIZZO], conscient(e) des sanctions pénales en cas de fausses déclarations, déclare sous ma responsabilité que les informations contenues dans ce CV sont véridiques.
J'autorise le traitement des données personnelles contenues dans ce document conformément à l'art. 13 du Règlement UE 2016/679 (RGPD) aux fins de recrutement et de sélection du personnel.`,
};

export const GDPR_CONSENT_TEXTS_DE: GDPRTexts = {
  minimal: `Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der DSGVO (EU-Verordnung 2016/679) zu.`,
  standard: `Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der EU-Verordnung 2016/679 (DSGVO) zu.`,
  extended: `Ich stimme der Verarbeitung der in meinem Lebenslauf enthaltenen personenbezogenen Daten gemäß Art. 13 der EU-Verordnung 2016/679 (DSGVO) zum Zwecke der Personalsuche und -auswahl zu.`,
  complete: `Ich, [NOME COGNOME], geboren in [LUOGO] am [DATA], wohnhaft in [INDIRIZZO], erkläre hiermit unter eigener Verantwortung, dass die in diesem Lebenslauf enthaltenen Angaben der Wahrheit entsprechen.
Ich stimme der Verarbeitung der in diesem Dokument enthaltenen personenbezogenen Daten gemäß Art. 13 der EU-Verordnung 2016/679 (DSGVO) zum Zwecke der Personalsuche und -auswahl zu.`,
};

export const GDPR_BY_LANGUAGE: Record<string, GDPRTexts> = {
  it: GDPR_CONSENT_TEXTS,
  en: GDPR_CONSENT_TEXTS_EN,
  fr: GDPR_CONSENT_TEXTS_FR,
  de: GDPR_CONSENT_TEXTS_DE,
};

export const PROTECTED_CATEGORY_LABELS = {
  art1: 'Art. 1 - Disabili con invalidità superiore al 46%',
  art18: 'Art. 18 - Invalidi di guerra, invalidi civili di guerra, invalidi per servizio',
  altra: 'Altra categoria protetta',
} as const;
