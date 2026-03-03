import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Zap,
  AlertTriangle, Lightbulb
} from 'lucide-react';
import { CVData, CVSettings } from '../../types/cv.types';
import { useIsMobile } from '../../hooks/useIsMobile';
import { WizardStep } from '../../hooks/useWizard';
import { StepIndicator } from './StepIndicator';

import { PersonalInfoForm } from '../FormSections/PersonalInfo';
import { PhotoUpload } from '../FormSections/PhotoUpload';
import { ExperienceForm } from '../FormSections/Experience';
import { EducationForm } from '../FormSections/Education';
import { SkillsForm } from '../FormSections/Skills';
import { ProfessionalSummary } from '../FormSections/ProfessionalSummary';

// Suggerimenti contestuali per ogni passaggio
const STEP_TIPS: Record<string, string> = {
  personal: 'Come ti chiami? Come possono contattarti? Queste informazioni permettono ai selezionatori di trovarti.',
  experience: 'Trucco del mestiere: usa verbi d\'azione come "Gestito", "Sviluppato", "Aumentato del 30%". I numeri fanno colpo!',
  education: 'Parti dal titolo pi\u00f9 recente. Anche corsi, certificazioni e progetti personali contano!',
  skills: 'Quali sono i tuoi superpoteri? Aggiungi competenze tecniche E trasversali. Le lingue sono un asso nella manica!',
  summary: 'Racconta chi sei in 2-3 frasi. Pensa: "Cosa mi rende speciale?". L\'IA potr\u00e0 perfezionarlo dopo.',
};

interface Props {
  cvData: CVData;
  settings: CVSettings;
  steps: WizardStep[];
  currentStep: number;
  isCurrentStepValid: boolean;
  completionPercent: number;
  getStepValidation: (index: number) => { valid: boolean; missing: string[] };
  onNext: () => void;
  onPrev: () => void;
  onGoToStep: (index: number) => void;
  onExit: () => void;
  onUpdateCVData: (data: Partial<CVData>) => void;
}

export const WizardContainer: React.FC<Props> = ({
  cvData,
  settings,
  steps,
  currentStep,
  isCurrentStepValid,
  completionPercent,
  getStepValidation,
  onNext,
  onPrev,
  onGoToStep,
  onExit,
  onUpdateCVData,
}) => {
  const isMobile = useIsMobile();
  const step = steps[currentStep];
  const { missing } = getStepValidation(currentStep);
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Indicatore passaggi laterale (desktop) */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onGoToStep={onGoToStep}
        getStepValidation={getStepValidation}
      />

      {/* Contenuto principale */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Intestazione con progresso */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400 hidden sm:block">
                Passaggio {currentStep + 1} di {steps.length}
              </span>
              <button
                onClick={onExit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Passa alla modalit&agrave; avanzata"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modalit&agrave; avanzata</span>
              </button>
            </div>
          </div>

          {/* Barra di avanzamento */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-brand-blue to-blue-400"
              initial={false}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">Avanzamento</span>
            <span className="text-xs font-medium text-brand-blue">{completionPercent}% compilato</span>
          </div>
        </div>

        {/* Suggerimento contestuale */}
        {STEP_TIPS[step.id] && (
          <div className="mx-4 sm:mx-6 mt-4 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{STEP_TIPS[step.id]}</p>
          </div>
        )}

        {/* Contenuto del passaggio */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${isMobile ? 'pb-32' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step.id === 'personal' && (
                <div className="space-y-6">
                  {settings.showPhoto && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Foto Profilo (facoltativa)</h4>
                      <PhotoUpload
                        photo={cvData.personalInfo.profilePhoto}
                        onChange={photo => onUpdateCVData({ personalInfo: { ...cvData.personalInfo, profilePhoto: photo } })}
                      />
                    </div>
                  )}
                  <PersonalInfoForm
                    data={cvData.personalInfo}
                    onChange={personalInfo => onUpdateCVData({ personalInfo: { ...cvData.personalInfo, ...personalInfo } })}
                  />
                </div>
              )}
              {step.id === 'experience' && (
                <ExperienceForm
                  experiences={cvData.experiences}
                  onChange={experiences => onUpdateCVData({ experiences })}
                />
              )}
              {step.id === 'education' && (
                <EducationForm
                  education={cvData.education}
                  onChange={education => onUpdateCVData({ education })}
                />
              )}
              {step.id === 'skills' && (
                <SkillsForm
                  skills={cvData.skills}
                  languages={cvData.languages}
                  onSkillsChange={skills => onUpdateCVData({ skills })}
                  onLanguagesChange={languages => onUpdateCVData({ languages })}
                />
              )}
              {step.id === 'summary' && (
                <ProfessionalSummary
                  value={cvData.professionalSummary}
                  onChange={v => onUpdateCVData({ professionalSummary: v })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barra di navigazione */}
        <div className={`bg-white border-t border-gray-200 px-4 sm:px-6 py-4 ${isMobile ? 'fixed bottom-0 left-0 right-0 z-50 safe-area-bottom' : ''}`}>
          {/* Avviso campi mancanti */}
          {!isCurrentStepValid && missing.length > 0 && (
            <div className="flex items-start gap-2 mb-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>Mancano:</strong> {missing.join(', ')}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>

            <div className="flex gap-2">
              {isLastStep ? (
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Completa CV
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md"
                >
                  Avanti
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
