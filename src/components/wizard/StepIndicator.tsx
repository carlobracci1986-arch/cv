import React from 'react';
import { CheckCircle2, User, Briefcase, GraduationCap, Star, FileText } from 'lucide-react';
import { WizardStep } from '../../hooks/useWizard';

interface Props {
  steps: WizardStep[];
  currentStep: number;
  onGoToStep: (index: number) => void;
  getStepValidation: (index: number) => { valid: boolean; missing: string[] };
}

const STEP_ICONS = [User, Briefcase, GraduationCap, Star, FileText];

export const StepIndicator: React.FC<Props> = ({ steps, currentStep, onGoToStep, getStepValidation }) => {
  return (
    <>
      {/* Desktop: indicatore verticale laterale */}
      <div className="hidden md:flex flex-col gap-1 w-56 flex-shrink-0 p-4 bg-gray-50 border-r border-gray-200">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const { valid } = getStepValidation(i);
          const isActive = i === currentStep;
          const isCompleted = valid && i !== currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onGoToStep(i)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : isCompleted
                  ? 'text-green-700 hover:bg-green-50'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isActive
                  ? 'bg-brand-blue text-white'
                  : isCompleted
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-blue' : isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 truncate">{step.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile: pallini orizzontali */}
      <div className="md:hidden flex justify-center gap-2 py-3 bg-gray-50 border-b border-gray-200">
        {steps.map((step, i) => {
          const { valid } = getStepValidation(i);
          const isActive = i === currentStep;
          const isCompleted = valid && i !== currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onGoToStep(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                isActive
                  ? 'bg-brand-blue scale-125'
                  : isCompleted
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              title={step.title}
            />
          );
        })}
      </div>
    </>
  );
};
