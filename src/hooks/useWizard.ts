import { useState, useEffect, useCallback } from 'react';
import { CVData } from '../types/cv.types';
import { analytics } from '../utils/analytics';
import { ANALYTICS_EVENTS } from '../constants/analyticsEvents';

const STORAGE_KEY = 'cv_wizard_progress';
const FIRST_VISIT_KEY = 'cv_wizard_first_visit';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

const STEPS: WizardStep[] = [
  { id: 'personal', title: 'Dati Personali', description: 'Nome, contatti e foto profilo' },
  { id: 'experience', title: 'Esperienze', description: 'Le tue esperienze lavorative' },
  { id: 'education', title: 'Formazione', description: 'Studi e percorso formativo' },
  { id: 'skills', title: 'Competenze', description: 'Competenze tecniche e linguistiche' },
  { id: 'summary', title: 'Profilo Professionale', description: 'Breve descrizione di te' },
];

export function useWizard(cvData: CVData) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Controlla se è la prima visita
  useEffect(() => {
    const visited = localStorage.getItem(FIRST_VISIT_KEY);
    if (!visited) {
      setIsFirstVisit(true);
      setShowWelcome(true);
      analytics.trackEvent(ANALYTICS_EVENTS.WELCOME_SHOWN);
    }
  }, []);

  // Ripristina progresso salvato
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { step } = JSON.parse(saved);
        if (typeof step === 'number' && step >= 0 && step < STEPS.length) {
          setCurrentStep(step);
        }
      } catch {}
    }
  }, []);

  // Salva progresso ad ogni cambio passaggio
  useEffect(() => {
    if (isWizardMode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep }));
    }
  }, [currentStep, isWizardMode]);

  const startWizard = useCallback(() => {
    setShowWelcome(false);
    setIsWizardMode(true);
    setCurrentStep(0);
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
    analytics.trackEvent(ANALYTICS_EVENTS.WIZARD_STARTED);
  }, []);

  const skipWizard = useCallback(() => {
    setShowWelcome(false);
    setIsWizardMode(false);
    setIsFirstVisit(false);
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
    localStorage.removeItem(STORAGE_KEY);
    analytics.trackEvent(ANALYTICS_EVENTS.WIZARD_SKIPPED);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      analytics.trackEvent(ANALYTICS_EVENTS.WIZARD_STEP_CHANGED, { step: STEPS[nextIdx].id, step_number: nextIdx + 1 });
    } else {
      setShowCompletion(true);
      analytics.trackEvent(ANALYTICS_EVENTS.WIZARD_COMPLETED, { steps_count: STEPS.length });
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < STEPS.length) setCurrentStep(index);
  }, []);

  const completeWizard = useCallback(() => {
    setShowCompletion(false);
    setIsWizardMode(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exitWizard = useCallback(() => {
    setIsWizardMode(false);
    localStorage.removeItem(STORAGE_KEY);
    analytics.trackEvent(ANALYTICS_EVENTS.WIZARD_ABANDONED, { abandoned_at_step: currentStep + 1 });
  }, [currentStep]);

  // Validazione passaggio corrente
  const getStepValidation = useCallback((stepIndex: number): { valid: boolean; missing: string[] } => {
    const missing: string[] = [];
    const step = STEPS[stepIndex];

    switch (step.id) {
      case 'personal':
        if (!cvData.personalInfo.firstName?.trim()) missing.push('Nome');
        if (!cvData.personalInfo.lastName?.trim()) missing.push('Cognome');
        if (!cvData.personalInfo.email?.trim()) missing.push('Email');
        break;
      case 'experience':
        if (!cvData.experiences || cvData.experiences.length === 0) missing.push('Almeno un\'esperienza lavorativa');
        break;
      case 'education':
        if (!cvData.education || cvData.education.length === 0) missing.push('Almeno un titolo di studio');
        break;
      case 'skills':
        if (!cvData.skills || cvData.skills.length < 1) missing.push('Almeno una competenza');
        break;
      case 'summary':
        // Opzionale
        break;
    }

    return { valid: missing.length === 0, missing };
  }, [cvData]);

  const isCurrentStepValid = getStepValidation(currentStep).valid;

  // Percentuale completamento totale
  const completionPercent = Math.round(
    (STEPS.filter((_, i) => getStepValidation(i).valid).length / STEPS.length) * 100
  );

  return {
    steps: STEPS,
    currentStep,
    isWizardMode,
    isFirstVisit,
    showWelcome,
    showCompletion,
    isCurrentStepValid,
    completionPercent,
    getStepValidation,
    startWizard,
    skipWizard,
    nextStep,
    prevStep,
    goToStep,
    completeWizard,
    exitWizard,
    setShowCompletion,
  };
}
