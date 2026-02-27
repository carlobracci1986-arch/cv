import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Download, Sparkles, ChevronLeft, ChevronRight,
  Palette, FolderOpen, Settings, Brain
} from 'lucide-react';

import { useCV } from '../contexts/CVContext';
import { usePrivacy } from '../contexts/PrivacyContext';
import { useConsent } from '../hooks/useConsent';

import { PersonalInfoForm } from '../components/FormSections/PersonalInfo';
import { ExperienceForm } from '../components/FormSections/Experience';
import { EducationForm } from '../components/FormSections/Education';
import { SkillsForm } from '../components/FormSections/Skills';
import { CertificationsForm } from '../components/FormSections/Certifications';
import { ProtectedCategoryForm } from '../components/FormSections/ProtectedCategory';
import { PhotoUpload } from '../components/FormSections/PhotoUpload';
import { ProfessionalSummary } from '../components/FormSections/ProfessionalSummary';

import { CVPreview } from '../components/CVPreview';
import { CVCustomizer } from '../components/CVCustomizer';
import { VersionList } from '../components/VersionManager/VersionList';
import { PrivacySettings } from '../components/Privacy/PrivacySettings';
import { AIConsentDialog } from '../components/Privacy/AIConsentDialog';
import { AdvancedSettings } from '../components/Settings/AdvancedSettings';

import { JobDescriptionInput } from '../components/AIFeatures/CVOptimizer/JobDescriptionInput';
import { OptimizationModal } from '../components/AIFeatures/CVOptimizer/OptimizationModal';
import { ATSScoreCard } from '../components/AIFeatures/ATSChecker/ATSScoreCard';
import { IssuesList } from '../components/AIFeatures/ATSChecker/IssuesList';
import { CoverLetterForm } from '../components/AIFeatures/CoverLetterGenerator/CoverLetterForm';
import { CoverLetterPreview } from '../components/AIFeatures/CoverLetterGenerator/CoverLetterPreview';
import { QuestionsList } from '../components/AIFeatures/InterviewPrep/QuestionsList';
import { MockInterviewSimulator } from '../components/AIFeatures/InterviewPrep/MockInterviewSimulator';

import * as aiProvider from '../services/aiProvider';
import { generatePDFFromElement, generateFilename } from '../utils/pdfGenerator';
import { calculateATSScore } from '../utils/atsScoring';
import { OptimizationChange, OptimizationResult, ATSScoreResult, InterviewQuestion, CoverLetterOptions } from '../types/ai.types';

type MainTab = 'editor' | 'ai' | 'versions' | 'settings';
type EditorSection = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'protected';
type AITab = 'optimizer' | 'ats' | 'cover-letter' | 'interview';

const EDITOR_SECTIONS: { id: EditorSection; label: string }[] = [
  { id: 'personal', label: 'Dati Personali' },
  { id: 'summary', label: 'Profilo' },
  { id: 'experience', label: 'Esperienze' },
  { id: 'education', label: 'Formazione' },
  { id: 'skills', label: 'Competenze' },
  { id: 'certifications', label: 'Certificazioni' },
  { id: 'protected', label: 'Categorie Protette' },
];

export const Editor: React.FC = () => {
  const { cvData, settings, versions, lastSaved, isDirty, updateCVData, updateSettings, saveVersion, loadVersion, deleteVersion, duplicateVersion } = useCV();
  const { addActivity } = usePrivacy();
  const { hasAIConsent, saveAIConsent, grantAIConsent } = useConsent();

  const [mainTab, setMainTab] = useState<MainTab>('editor');
  const [editorSection, setEditorSection] = useState<EditorSection>('personal');
  const [aiTab, setAITab] = useState<AITab>('optimizer');
  const [showPreview, setShowPreview] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.45);

  // AI states
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);

  const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(null);
  const [isCheckingATS, setIsCheckingATS] = useState(false);

  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // AI Consent
  const [pendingAIAction, setPendingAIAction] = useState<{ action: string; fn: () => Promise<void> } | null>(null);
  const [showAIConsent, setShowAIConsent] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const requireAIConsent = useCallback((action: string, fn: () => Promise<void>) => {
    if (hasAIConsent && saveAIConsent) {
      fn();
    } else {
      setPendingAIAction({ action, fn });
      setShowAIConsent(true);
    }
  }, [hasAIConsent, saveAIConsent]);

  const handleAIConsentConfirm = (save: boolean) => {
    setShowAIConsent(false);
    grantAIConsent(save);
    if (pendingAIAction) {
      pendingAIAction.fn();
      setPendingAIAction(null);
    }
  };

  const handleOptimize = () => {
    if (!jobDescription.trim()) {
      toast.error('Inserisci una job description prima di ottimizzare');
      return;
    }
    requireAIConsent('Ottimizzazione CV', async () => {
      setIsOptimizing(true);
      try {
        const result = await aiProvider.optimizeCV(cvData, jobDescription);
        setOptimizationResult(result);
        setShowOptimizationModal(true);
        addActivity({ action: 'ai_optimization', details: `Match score: ${result.matchScore}%`, requiresConsent: true });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore ottimizzazione');
      } finally {
        setIsOptimizing(false);
      }
    });
  };

  const handleApplyOptimization = (changes: OptimizationChange[]) => {
    if (!optimizationResult) return;
    // Apply accepted changes to CV
    const accepted = changes.filter(c => c.accepted);
    if (accepted.length === 0) {
      toast('Nessuna modifica selezionata');
      return;
    }
    // Use the full optimized CV but only apply accepted sections
    updateCVData(optimizationResult.optimizedCV);
    setShowOptimizationModal(false);
    toast.success(`${accepted.length} modifiche applicate!`);
  };

  const handleCheckATS = () => {
    setIsCheckingATS(true);
    setTimeout(() => {
      const result = calculateATSScore(cvData, settings);
      setAtsResult(result);
      setIsCheckingATS(false);
    }, 800);
  };

  const handleGenerateCoverLetter = (options: CoverLetterOptions) => {
    requireAIConsent('Genera Lettera di Presentazione', async () => {
      setIsGeneratingCoverLetter(true);
      try {
        const letter = await aiProvider.generateCoverLetter(cvData, jobDescription, options);
        setCoverLetter(letter);
        addActivity({ action: 'ai_cover_letter', details: `Tono: ${options.tone}`, requiresConsent: true });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore generazione lettera');
      } finally {
        setIsGeneratingCoverLetter(false);
      }
    });
  };

  const handleGenerateInterview = () => {
    requireAIConsent('Preparazione Colloquio AI', async () => {
      setIsLoadingInterview(true);
      try {
        const result = await aiProvider.generateInterviewPrep(cvData, jobDescription);
        setInterviewQuestions(result.questions);
        addActivity({ action: 'ai_interview_prep', details: `${result.questions.length} domande generate`, requiresConsent: true });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Errore generazione domande');
      } finally {
        setIsLoadingInterview(false);
      }
    });
  };

  const handleDownloadPDF = async () => {
    const el = document.getElementById('cv-preview-export');
    if (!el) { toast.error('Anteprima non trovata'); return; }
    setIsPdfLoading(true);
    try {
      const filename = generateFilename(cvData.personalInfo.firstName, cvData.personalInfo.lastName);
      await generatePDFFromElement(el, {
        filename,
        quality: 'high',
        authorName: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
        title: 'Curriculum Vitae',
      });
      addActivity({ action: 'cv_exported', details: filename, requiresConsent: false });
      toast.success('PDF scaricato!');
    } catch (err) {
      toast.error('Errore generazione PDF');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleClearAllData = () => {
    window.location.reload();
  };

  const lastSavedText = lastSaved
    ? `Salvato ${Math.round((Date.now() - lastSaved.getTime()) / 60000)} min fa`
    : 'Non ancora salvato';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <span className="text-lg">CV Builder AI</span>
          </div>

          {/* Main tabs */}
          <nav className="hidden md:flex gap-1">
            {([
              { id: 'editor', label: 'CV Editor', icon: null },
              { id: 'ai', label: 'AI Tools', icon: <Brain className="h-3.5 w-3.5" /> },
              { id: 'versions', label: 'Versioni', icon: <FolderOpen className="h-3.5 w-3.5" /> },
              { id: 'settings', label: 'Impostazioni', icon: <Settings className="h-3.5 w-3.5" /> },
            ] as { id: MainTab; label: string; icon: React.ReactNode }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mainTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-gray-400">{lastSavedText}</span>
          <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-yellow-400' : 'bg-green-400'}`} title={isDirty ? 'Modifiche non salvate' : 'Salvato'} />
          <button
            onClick={handleDownloadPDF}
            disabled={isPdfLoading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {isPdfLoading ? 'Generando...' : 'Scarica PDF'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col overflow-hidden border-r border-gray-200 bg-white">
          {mainTab === 'editor' && (
            <>
              {/* Section tabs */}
              <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                {EDITOR_SECTIONS.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setEditorSection(sec.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      editorSection === sec.id
                        ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* Form content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={editorSection}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {editorSection === 'personal' && (
                      <div className="space-y-6">
                        {settings.showPhoto && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Foto Profilo</h3>
                            <PhotoUpload
                              photo={cvData.personalInfo.profilePhoto}
                              onChange={photo => updateCVData({ personalInfo: { ...cvData.personalInfo, profilePhoto: photo } })}
                            />
                          </div>
                        )}
                        <PersonalInfoForm
                          data={cvData.personalInfo}
                          onChange={personalInfo => updateCVData({ personalInfo: { ...cvData.personalInfo, ...personalInfo } })}
                        />
                      </div>
                    )}
                    {editorSection === 'summary' && (
                      <ProfessionalSummary
                        value={cvData.professionalSummary}
                        onChange={v => updateCVData({ professionalSummary: v })}
                      />
                    )}
                    {editorSection === 'experience' && (
                      <ExperienceForm
                        experiences={cvData.experiences}
                        onChange={experiences => updateCVData({ experiences })}
                      />
                    )}
                    {editorSection === 'education' && (
                      <EducationForm
                        education={cvData.education}
                        onChange={education => updateCVData({ education })}
                      />
                    )}
                    {editorSection === 'skills' && (
                      <SkillsForm
                        skills={cvData.skills}
                        languages={cvData.languages}
                        onSkillsChange={skills => updateCVData({ skills })}
                        onLanguagesChange={languages => updateCVData({ languages })}
                      />
                    )}
                    {editorSection === 'certifications' && (
                      <CertificationsForm
                        certifications={cvData.certifications}
                        hobbies={cvData.hobbies}
                        onCertificationsChange={certifications => updateCVData({ certifications })}
                        onHobbiesChange={hobbies => updateCVData({ hobbies })}
                      />
                    )}
                    {editorSection === 'protected' && (
                      <ProtectedCategoryForm
                        protectedCategory={cvData.protectedCategory}
                        onProtectedCategoryChange={protectedCategory => updateCVData({ protectedCategory })}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      const idx = EDITOR_SECTIONS.findIndex(s => s.id === editorSection);
                      if (idx > 0) setEditorSection(EDITOR_SECTIONS[idx - 1].id);
                    }}
                    disabled={editorSection === EDITOR_SECTIONS[0].id}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" /> Precedente
                  </button>
                  <button
                    onClick={() => {
                      const idx = EDITOR_SECTIONS.findIndex(s => s.id === editorSection);
                      if (idx < EDITOR_SECTIONS.length - 1) setEditorSection(EDITOR_SECTIONS[idx + 1].id);
                    }}
                    disabled={editorSection === EDITOR_SECTIONS[EDITOR_SECTIONS.length - 1].id}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Successivo <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {mainTab === 'ai' && (
            <div className="flex flex-col h-full">
              {/* AI sub-tabs */}
              <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                {([
                  { id: 'optimizer', label: '✨ Ottimizza' },
                  { id: 'ats', label: '📊 ATS Score' },
                  { id: 'cover-letter', label: '📝 Cover Letter' },
                  { id: 'interview', label: '🎤 Colloquio' },
                ] as { id: AITab; label: string }[]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAITab(tab.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      aiTab === tab.id
                        ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {aiTab === 'optimizer' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Ottimizza per Job Posting</h3>
                      <p className="text-xs text-gray-500 mb-3">Incolla l'offerta di lavoro e lascia che l'AI ottimizzi il tuo CV</p>
                    </div>
                    <JobDescriptionInput
                      jobDescription={jobDescription}
                      onChange={setJobDescription}
                      onOptimize={handleOptimize}
                      isLoading={isOptimizing}
                    />
                  </div>
                )}

                {aiTab === 'ats' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">ATS Compatibility Score</h3>
                      <p className="text-xs text-gray-500 mb-3">Analizza la compatibilità del tuo CV con i sistemi ATS</p>
                    </div>
                    {!atsResult ? (
                      <button
                        onClick={handleCheckATS}
                        disabled={isCheckingATS}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {isCheckingATS ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analisi in corso...</>
                        ) : (
                          '📊 Analizza Compatibilità ATS'
                        )}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <ATSScoreCard result={atsResult} onRefresh={() => setAtsResult(null)} />
                        <IssuesList issues={atsResult.issues} passedChecks={atsResult.passedChecks} />
                      </div>
                    )}
                  </div>
                )}

                {aiTab === 'cover-letter' && (
                  <div className="space-y-4">
                    {!coverLetter ? (
                      <>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 mb-1">Genera Lettera di Presentazione</h3>
                          <p className="text-xs text-gray-500 mb-3">AI genera una lettera personalizzata basata sul tuo CV e l'offerta</p>
                          {!jobDescription && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 mb-3">
                              💡 Aggiungi una job description nella tab "Ottimizza" per una lettera più mirata
                            </div>
                          )}
                        </div>
                        <CoverLetterForm
                          cvData={cvData}
                          jobDescription={jobDescription}
                          onGenerate={handleGenerateCoverLetter}
                          isLoading={isGeneratingCoverLetter}
                        />
                      </>
                    ) : (
                      <CoverLetterPreview
                        content={coverLetter}
                        onChange={setCoverLetter}
                        onDownloadPDF={async () => {
                          const el = document.createElement('div');
                          el.style.cssText = 'font-family:Georgia,serif;font-size:12pt;line-height:1.8;padding:40px;max-width:600px;white-space:pre-wrap;';
                          el.textContent = coverLetter;
                          document.body.appendChild(el);
                          await generatePDFFromElement(el, { filename: 'lettera_presentazione.pdf' });
                          document.body.removeChild(el);
                          toast.success('PDF lettera scaricato!');
                        }}
                        onRegenerate={() => setCoverLetter('')}
                      />
                    )}
                  </div>
                )}

                {aiTab === 'interview' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Preparazione Colloquio</h3>
                      <p className="text-xs text-gray-500 mb-3">AI genera domande probabili e risposte suggerite basate sul tuo CV</p>
                    </div>
                    {interviewQuestions.length === 0 ? (
                      <button
                        onClick={handleGenerateInterview}
                        disabled={isLoadingInterview}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {isLoadingInterview ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generazione domande...</>
                        ) : (
                          '🎤 Genera Domande Colloquio'
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowMockInterview(true)}
                            className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            🎬 Avvia Mock Interview
                          </button>
                          <button
                            onClick={() => setInterviewQuestions([])}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                          >
                            Rigenera
                          </button>
                        </div>
                        <QuestionsList questions={interviewQuestions} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {mainTab === 'versions' && (
            <div className="flex-1 overflow-y-auto p-4">
              <VersionList
                versions={versions}
                currentVersionId={null}
                onLoad={loadVersion}
                onDelete={deleteVersion}
                onDuplicate={duplicateVersion}
                onSaveNew={name => { saveVersion(name); toast.success(`Versione "${name}" salvata!`); }}
              />
            </div>
          )}

          {mainTab === 'settings' && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-4 w-4 text-primary-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Personalizzazione Template</h3>
                </div>
                <CVCustomizer settings={settings} onChange={updateSettings} />
              </div>
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Privacy & Dati</h3>
                <PrivacySettings onClearAllData={handleClearAllData} />
              </div>
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Impostazioni Avanzate</h3>
                <AdvancedSettings
                  settings={settings}
                  personalInfo={cvData.personalInfo}
                  onSettingsChange={updateSettings}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Preview */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden bg-gray-100">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Anteprima CV</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewScale(s => Math.max(0.3, s - 0.05))} className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">−</button>
              <span className="text-xs text-gray-500 w-12 text-center">{Math.round(previewScale * 100)}%</span>
              <button onClick={() => setPreviewScale(s => Math.min(1, s + 0.05))} className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">+</button>
            </div>
          </div>

          {/* Preview container */}
          <div className="flex-1 overflow-auto flex justify-center p-6">
            <div style={{ transformOrigin: 'top center' }}>
              <CVPreview
                cvData={cvData}
                settings={settings}
                scale={previewScale}
                id="cv-preview-export"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOptimizationModal && optimizationResult && (
        <OptimizationModal
          isOpen={showOptimizationModal}
          result={optimizationResult}
          onApply={handleApplyOptimization}
          onClose={() => setShowOptimizationModal(false)}
        />
      )}

      {showMockInterview && (
        <MockInterviewSimulator
          questions={interviewQuestions.slice(0, 10)}
          jobDescription={jobDescription}
          onComplete={() => setShowMockInterview(false)}
          onClose={() => setShowMockInterview(false)}
        />
      )}

      <AIConsentDialog
        isOpen={showAIConsent}
        action={pendingAIAction?.action || ''}
        onConfirm={handleAIConsentConfirm}
        onCancel={() => { setShowAIConsent(false); setPendingAIAction(null); }}
      />
    </div>
  );
};
