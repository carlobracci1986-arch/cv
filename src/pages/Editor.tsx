import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Download, Sparkles, ChevronLeft, ChevronRight,
  Palette, FolderOpen, Settings, Brain, Wand2, Menu, X,
  PenLine, Eye, ZoomIn, ZoomOut, Trophy, ArrowLeft, Trash2, FileText
} from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useWizard } from '../hooks/useWizard';

import { useCV } from '../contexts/CVContext';
import { usePrivacy } from '../contexts/PrivacyContext';
import { useConsent } from '../hooks/useConsent';

import { PersonalInfoForm } from '../components/FormSections/PersonalInfo';
import { ExperienceForm } from '../components/FormSections/Experience';
import { EducationForm } from '../components/FormSections/Education';
import { SkillsForm } from '../components/FormSections/Skills';
import { OtherSectionsForm } from '../components/FormSections/OtherSections';
import { PhotoUpload } from '../components/FormSections/PhotoUpload';
import { ProfessionalSummary } from '../components/FormSections/ProfessionalSummary';

import { CVPreview } from '../components/CVPreview';
import { CVCustomizer } from '../components/CVCustomizer';
import { PDFImportButton } from '../components/PDFImportButton';
import { VersionList } from '../components/VersionManager/VersionList';
import { PrivacySettings } from '../components/Privacy/PrivacySettings';
import { AIConsentDialog } from '../components/Privacy/AIConsentDialog';
import { WelcomeModal } from '../components/wizard/WelcomeModal';
import { WizardContainer } from '../components/wizard/WizardContainer';
import { CompletionModal } from '../components/wizard/CompletionModal';
import { AIBadge } from '../components/ai-ui/AIBadge';
import { AIFloatingButton } from '../components/ai-ui/AIFloatingButton';
import { AIPromptBanner } from '../components/ai-ui/AIPromptBanner';
import { AIProcessingModal } from '../components/ai-ui/AIProcessingModal';
import { ExportCelebrationModal } from '../components/export/ExportCelebrationModal';
import { AdvancedSettings } from '../components/Settings/AdvancedSettings';
import { PrivacyIndicator } from '../components/trust/PrivacyIndicator';

import { JobDescriptionInput } from '../components/AIFeatures/CVOptimizer/JobDescriptionInput';
import { OptimizationModal } from '../components/AIFeatures/CVOptimizer/OptimizationModal';
import { ATSScoreCard } from '../components/AIFeatures/ATSChecker/ATSScoreCard';
import { IssuesList } from '../components/AIFeatures/ATSChecker/IssuesList';
import { CoverLetterForm } from '../components/AIFeatures/CoverLetterGenerator/CoverLetterForm';
import { CoverLetterPreview } from '../components/AIFeatures/CoverLetterGenerator/CoverLetterPreview';
import { QuestionsList } from '../components/AIFeatures/InterviewPrep/QuestionsList';
import { MockInterviewSimulator } from '../components/AIFeatures/InterviewPrep/MockInterviewSimulator';
import { TranslationPanel } from '../components/AIFeatures/TranslationPanel';

import * as aiProvider from '../services/aiProvider';
import { generatePDFFromElement, generateFilename } from '../utils/pdfGenerator';
import { evaluateATSWithClaude } from '../utils/atsScoring';
import { generateMockCVData } from '../services/mockDataGenerator';
import { analytics } from '../utils/analytics';
import { ANALYTICS_EVENTS } from '../constants/analyticsEvents';
import { conversionFunnel, FUNNEL_STAGES } from '../utils/conversionFunnel';
import { useTrackTime } from '../hooks/useTrackEvent';
import { OptimizationChange, OptimizationResult, ATSScoreResult, InterviewQuestion, CoverLetterOptions } from '../types/ai.types';
import { CVData } from '../types/cv.types';

type MainTab = 'editor' | 'ai' | 'versions' | 'settings';
type EditorSection = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'other';
type AITab = 'optimizer' | 'ats' | 'cover-letter' | 'interview' | 'translate';
type MobileView = 'form' | 'preview';

const EDITOR_SECTIONS: { id: EditorSection; label: string; aiOptimizable?: boolean }[] = [
  { id: 'personal', label: 'Chi sei' },
  { id: 'summary', label: 'La tua storia', aiOptimizable: true },
  { id: 'experience', label: 'Esperienze', aiOptimizable: true },
  { id: 'education', label: 'Formazione' },
  { id: 'skills', label: 'Superpoteri', aiOptimizable: true },
  { id: 'other', label: 'Altro' },
];

export const Editor: React.FC = () => {
  const { cvData, settings, versions, lastSaved, isDirty, updateCVData, updateSettings, saveVersion, loadVersion, deleteVersion, duplicateVersion, resetToDefaults } = useCV();
  const { addActivity } = usePrivacy();
  const { hasAIConsent, saveAIConsent, grantAIConsent } = useConsent();

  const isMobile = useIsMobile();
  const wizard = useWizard(cvData);

  const [mainTab, setMainTab] = useState<MainTab>('editor');
  const [editorSection, setEditorSection] = useState<EditorSection>('personal');
  const [aiTab, setAITab] = useState<AITab>('optimizer');
  const [showPreview, setShowPreview] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.45);
  const [mobilePreviewScale, setMobilePreviewScale] = useState(0.5);
  const [pageCount, setPageCount] = useState(1);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('form');

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

  const [translatedCV, setTranslatedCV] = useState<CVData | null>(null);
  const [translationLang, setTranslationLang] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPhase, setExportPhase] = useState<'generating' | 'celebration'>('generating');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // AI Consent
  const [pendingAIAction, setPendingAIAction] = useState<{ action: string; fn: () => Promise<void> } | null>(null);
  const [showAIConsent, setShowAIConsent] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const sectionTabsRef = useRef<HTMLDivElement>(null);

  // Analytics: traccia tempo nell'editor e apertura funnel
  useTrackTime('editor');
  React.useEffect(() => {
    conversionFunnel.markStage(FUNNEL_STAGES.EDITOR_OPENED, {
      device: isMobile ? 'mobile' : 'desktop',
    });
  }, []);

  const scrollSectionTabIntoView = useCallback((sectionId: string) => {
    requestAnimationFrame(() => {
      const container = sectionTabsRef.current;
      if (!container) return;
      const idx = EDITOR_SECTIONS.findIndex(s => s.id === sectionId);
      const btn = container.children[idx] as HTMLElement | undefined;
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }, []);

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
      toast.error('Incolla prima un\'offerta di lavoro, così l\'IA sa cosa cercare!');
      return;
    }
    requireAIConsent('Ottimizzazione CV', async () => {
      setIsOptimizing(true);
      analytics.trackEvent(ANALYTICS_EVENTS.AI_OPTIMIZE_STARTED, {
        job_description_length: jobDescription.length,
        device: isMobile ? 'mobile' : 'desktop',
      });
      const t0 = Date.now();
      try {
        const result = await aiProvider.optimizeCV(cvData, jobDescription);
        setOptimizationResult(result);
        setShowOptimizationModal(true);
        addActivity({ action: 'ai_optimization', details: `Match score: ${result.matchScore}%`, requiresConsent: true });
        analytics.trackEvent(ANALYTICS_EVENTS.AI_OPTIMIZE_COMPLETED, {
          match_score: result.matchScore,
          changes_count: result.changes?.length || 0,
          duration_ms: Date.now() - t0,
        });
        conversionFunnel.markStage(FUNNEL_STAGES.AI_USED);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Ops, qualcosa è andato storto. Riproviamo!');
        analytics.trackEvent(ANALYTICS_EVENTS.AI_OPTIMIZE_ERROR, { duration_ms: Date.now() - t0 });
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
    toast.success(`${accepted.length} miglioramenti applicati! Il tuo CV è più forte ora 💪`);
    analytics.trackEvent(ANALYTICS_EVENTS.AI_CHANGES_APPLIED, { accepted_count: accepted.length, total_count: changes.length });
  };

  const handleCheckATS = async () => {
    setIsCheckingATS(true);
    analytics.trackEvent(ANALYTICS_EVENTS.ATS_CHECK_STARTED);
    try {
      const result = await evaluateATSWithClaude(cvData, settings);
      setAtsResult(result);
      toast.success('Analisi completata! Scopri come migliorare il tuo punteggio');
      analytics.trackEvent(ANALYTICS_EVENTS.ATS_CHECK_COMPLETED, { score: result.score });
    } catch (error) {
      console.error('ATS evaluation error:', error);
      toast.error('Non riesco ad analizzare il CV. Controlla la connessione e riprova.');
    } finally {
      setIsCheckingATS(false);
    }
  };

  const handleGenerateCoverLetter = (options: CoverLetterOptions) => {
    requireAIConsent('Genera Lettera di Presentazione', async () => {
      setIsGeneratingCoverLetter(true);
      try {
        const letter = await aiProvider.generateCoverLetter(cvData, jobDescription, options);
        setCoverLetter(letter);
        addActivity({ action: 'ai_cover_letter', details: `Tono: ${options.tone}`, requiresConsent: true });
        analytics.trackEvent(ANALYTICS_EVENTS.COVER_LETTER_GENERATED, { tone: options.tone });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Impossibile generare la lettera. Riprova tra poco!');
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
        analytics.trackEvent(ANALYTICS_EVENTS.INTERVIEW_PREP_GENERATED, { questions_count: result.questions.length });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Impossibile preparare le domande. Riprova!');
      } finally {
        setIsLoadingInterview(false);
      }
    });
  };

  const handleDownloadPDF = async () => {
    const el = document.getElementById('cv-preview-export');
    if (!el) { toast.error('Anteprima non disponibile. Ricarica la pagina.'); return; }
    setIsPdfLoading(true);
    setExportPhase('generating');
    setShowExportModal(true);
    analytics.trackEvent(ANALYTICS_EVENTS.PDF_EXPORT_STARTED, { device: isMobile ? 'mobile' : 'desktop' });
    const t0 = Date.now();
    try {
      const filename = generateFilename(cvData.personalInfo.firstName, cvData.personalInfo.lastName);
      await generatePDFFromElement(el, {
        filename,
        quality: 'high',
        authorName: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
        title: 'Curriculum Vitae',
      });
      addActivity({ action: 'cv_exported', details: filename, requiresConsent: false });
      setExportPhase('celebration');
      analytics.trackEvent(ANALYTICS_EVENTS.PDF_EXPORT_COMPLETED, { duration_ms: Date.now() - t0 });
      conversionFunnel.markStage(FUNNEL_STAGES.PDF_EXPORTED);
    } catch (err) {
      setShowExportModal(false);
      toast.error('Ops, il PDF non è stato generato. Riprova!');
      analytics.trackEvent(ANALYTICS_EVENTS.PDF_EXPORT_ERROR);
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
      <header className="bg-white border-b border-gray-200 px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between z-20 shadow-sm relative">
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none">
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 font-bold text-gray-900">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <Trophy className="h-3.5 md:h-4 w-3.5 md:w-4 text-white" />
            </div>
            <span className="text-sm md:text-lg font-heading">CV<span className="text-brand-blue">Vincente</span></span>
          </Link>
          <AIBadge variant="header" />

          {/* Main tabs - Desktop */}
          <nav className="hidden md:flex gap-1 ml-2">
            {([
              { id: 'editor', label: 'Editor CV', icon: null },
              { id: 'ai', label: 'Strumenti IA', icon: <Brain className="h-3.5 w-3.5" /> },
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

        {/* Status and Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden sm:block text-xs text-gray-400 whitespace-nowrap">{lastSavedText}</span>
          <div className={`hidden sm:block w-2 h-2 rounded-full flex-shrink-0 ${isDirty ? 'bg-yellow-400' : 'bg-green-400'}`} title={isDirty ? 'Modifiche non salvate' : 'Salvato'} />

          {/* PDF Import - Desktop only */}
          <div className="hidden sm:block">
            <PDFImportButton
              onImport={(importedData) => updateCVData(importedData)}
            />
          </div>

          {/* Mock Data Generator - Desktop only */}
          <button
            onClick={() => {
              const mockData = generateMockCVData();
              updateCVData(mockData);
              toast.success('CV di esempio caricato! Perfetto per esplorare le funzionalità');
              addActivity({
                action: 'cv_updated',
                details: 'Mock data generated for testing',
                requiresConsent: false
              });
            }}
            title="Genera dati di test"
            className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex-shrink-0"
          >
            <Wand2 className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Dati Test</span>
          </button>

          {/* Clear All - Desktop */}
          <button
            onClick={() => setShowClearConfirm(true)}
            title="Svuota tutti i campi"
            className="hidden sm:flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex-shrink-0"
          >
            <Trash2 className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">Svuota</span>
          </button>

          {/* Download PDF - Desktop */}
          <button
            onClick={handleDownloadPDF}
            disabled={isPdfLoading}
            className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors disabled:opacity-60 flex-shrink-0"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">{isPdfLoading ? 'Generando...' : 'PDF'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Menu"
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden z-10"
          >
            <nav className="flex flex-col divide-y divide-gray-100">
              {([
                { id: 'editor', label: 'Editor CV', icon: <PenLine className="h-4 w-4" /> },
                { id: 'ai', label: 'Strumenti IA', icon: <Brain className="h-4 w-4" /> },
                { id: 'versions', label: 'Versioni', icon: <FolderOpen className="h-4 w-4" /> },
                { id: 'settings', label: 'Impostazioni', icon: <Settings className="h-4 w-4" /> },
              ] as { id: MainTab; label: string; icon: React.ReactNode }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMainTab(tab.id);
                    setMobileView('form');
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors ${
                    mainTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              {/* Additional mobile actions */}
              <div className="px-4 py-3 space-y-2">
                <PDFImportButton
                  onImport={(importedData) => {
                    updateCVData(importedData);
                    setShowMobileMenu(false);
                  }}
                />
                <button
                  onClick={() => { setShowClearConfirm(true); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Svuota tutti i campi
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tab Bar: Compila / Anteprima */}
      {isMobile && mainTab === 'editor' && (
        <div className="md:hidden flex bg-white border-b border-gray-200">
          <button
            onClick={() => setMobileView('form')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileView === 'form'
                ? 'text-brand-blue border-b-2 border-brand-blue bg-blue-50/50'
                : 'text-gray-500'
            }`}
          >
            <PenLine className="w-4 h-4" />
            Compila
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileView === 'preview'
                ? 'text-brand-blue border-b-2 border-brand-blue bg-blue-50/50'
                : 'text-gray-500'
            }`}
          >
            <Eye className="w-4 h-4" />
            Anteprima
          </button>
        </div>
      )}

      {/* Banner IA - visibile sopra il contenuto quando in modalità editor */}
      {!wizard.isWizardMode && mainTab === 'editor' && (
        <AIPromptBanner
          onOptimize={() => { setMainTab('ai'); setAITab('optimizer'); }}
          hasJobDescription={!!jobDescription.trim()}
          visible={!wizard.showWelcome}
        />
      )}

      {/* Modale elaborazione IA */}
      <AIProcessingModal isOpen={isOptimizing} />

      {/* Pulsante fluttuante IA (mobile) */}
      {!wizard.isWizardMode && mainTab === 'editor' && (
        <AIFloatingButton
          onClick={() => { setMainTab('ai'); setAITab('optimizer'); if (isMobile) setShowMobileMenu(false); }}
          hasUsedAI={!!optimizationResult}
        />
      )}

      {/* Wizard Welcome Modal */}
      <WelcomeModal
        isOpen={wizard.showWelcome}
        onStart={wizard.startWizard}
        onSkip={wizard.skipWizard}
      />

      {/* Wizard Completion Modal */}
      <CompletionModal
        isOpen={wizard.showCompletion}
        onViewPreview={() => {
          wizard.completeWizard();
          if (isMobile) setMobileView('preview');
        }}
        onDownloadPDF={() => {
          wizard.completeWizard();
          handleDownloadPDF();
        }}
        onClose={wizard.completeWizard}
      />

      {/* Wizard Mode */}
      {wizard.isWizardMode ? (
        <WizardContainer
          cvData={cvData}
          settings={settings}
          steps={wizard.steps}
          currentStep={wizard.currentStep}
          isCurrentStepValid={wizard.isCurrentStepValid}
          completionPercent={wizard.completionPercent}
          getStepValidation={wizard.getStepValidation}
          onNext={wizard.nextStep}
          onPrev={wizard.prevStep}
          onGoToStep={wizard.goToStep}
          onExit={wizard.exitWizard}
          onUpdateCVData={updateCVData}
        />
      ) : (
      <>
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - form (hidden on mobile when preview active) */}
        <div className={`${isMobile && mobileView === 'preview' ? 'hidden' : 'flex'} w-full md:w-1/2 lg:w-5/12 flex-col overflow-hidden border-r border-gray-200 bg-white ${isMobile ? 'pb-20' : ''}`}>
          {mainTab === 'editor' && (
            <>
              {/* Section tabs */}
              <div ref={sectionTabsRef} className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                {EDITOR_SECTIONS.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => { setEditorSection(sec.id); analytics.trackEvent(ANALYTICS_EVENTS.SECTION_OPENED, { section: sec.id }); }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                      editorSection === sec.id
                        ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {sec.label}
                    {sec.aiOptimizable && <Sparkles className="w-3 h-3 text-purple-400" />}
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
                        <PrivacyIndicator />
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
                    {editorSection === 'other' && (
                      <OtherSectionsForm
                        data={cvData.other}
                        onChange={other => updateCVData({ other })}
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
                      if (idx > 0) {
                        const prevId = EDITOR_SECTIONS[idx - 1].id;
                        setEditorSection(prevId);
                        scrollSectionTabIntoView(prevId);
                      }
                    }}
                    disabled={editorSection === EDITOR_SECTIONS[0].id}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" /> Precedente
                  </button>

                  {editorSection === EDITOR_SECTIONS[EDITOR_SECTIONS.length - 1].id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setMobileView('preview'); setShowPreview(true); }}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" /> Anteprima CV
                      </button>
                      <button
                        onClick={() => { setMainTab('ai'); setAITab('optimizer'); }}
                        className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <Brain className="h-4 w-4" /> Usa IA
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const idx = EDITOR_SECTIONS.findIndex(s => s.id === editorSection);
                        if (idx < EDITOR_SECTIONS.length - 1) {
                          const nextId = EDITOR_SECTIONS[idx + 1].id;
                          setEditorSection(nextId);
                          scrollSectionTabIntoView(nextId);
                        }
                      }}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      Successivo <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {mainTab === 'ai' && (
            <div className="flex flex-col h-full">
              {/* AI sub-tabs */}
              <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                {([
                  { id: 'optimizer', label: '✨ Fai brillare' },
                  { id: 'ats', label: '📊 Supera i filtri' },
                  { id: 'cover-letter', label: '📝 Lettera vincente' },
                  { id: 'interview', label: '🎤 Prepara colloquio' },
                  { id: 'translate', label: '🌍 Traduci CV' },
                ] as { id: AITab; label: string }[]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAITab(tab.id);
                      if (tab.id !== 'translate' && translatedCV) {
                        setTranslatedCV(null);
                        setTranslationLang(null);
                      }
                    }}
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
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Fai brillare il CV per quella posizione</h3>
                      <p className="text-xs text-gray-500 mb-3">Incolla l'offerta di lavoro e l'IA riscrive il tuo CV per superare la selezione</p>
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
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Il tuo CV supera i filtri automatici?</h3>
                      <p className="text-xs text-gray-500 mb-3">Scopri se il tuo CV viene letto dai recruiter o scartato dai robot</p>
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
                          '📊 Verifica il mio CV'
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
                          <h3 className="text-sm font-semibold text-gray-800 mb-1">Una lettera che conquista</h3>
                          <p className="text-xs text-gray-500 mb-3">L'IA scrive una lettera di presentazione su misura che ti fa notare</p>
                          {!jobDescription && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 mb-3">
                              💡 Aggiungi un'offerta di lavoro nella tab "Fai brillare" per una lettera ancora più mirata
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
                          toast.success('Lettera di presentazione scaricata! In bocca al lupo 🍀');
                        }}
                        onRegenerate={() => setCoverLetter('')}
                      />
                    )}
                  </div>
                )}

                {aiTab === 'interview' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Arriva preparato, conquista il colloquio</h3>
                      <p className="text-xs text-gray-500 mb-3">Scopri le domande che ti faranno e prepara risposte che colpiscono</p>
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
                          '🎤 Prepara le mie domande'
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

                {aiTab === 'translate' && (
                  <TranslationPanel
                    cvData={cvData}
                    onTranslated={(lang, translated) => {
                      setTranslationLang(lang);
                      setTranslatedCV({
                        ...translated,
                        sectionLabels: { ...translated.sectionLabels, _lang: lang },
                      });
                    }}
                    onReset={() => {
                      setTranslationLang(null);
                      setTranslatedCV(null);
                    }}
                    onDownloadPDF={async () => {
                      const el = document.getElementById('cv-preview-export');
                      if (!el) { toast.error('Anteprima non disponibile'); return; }
                      setIsPdfLoading(true);
                      try {
                        const langLabel = translationLang || 'it';
                        const filename = generateFilename(cvData.personalInfo.firstName, cvData.personalInfo.lastName).replace('.pdf', `_${langLabel}.pdf`);
                        await generatePDFFromElement(el, { filename, quality: 'high' });
                        toast.success('PDF tradotto scaricato!');
                      } catch {
                        toast.error('Errore nella generazione del PDF');
                      } finally {
                        setIsPdfLoading(false);
                      }
                    }}
                    activeLang={translationLang}
                    isTranslating={isTranslating}
                    setIsTranslating={setIsTranslating}
                  />
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
                onSaveNew={name => { saveVersion(name); toast.success(`Versione "${name}" salvata! Così non perdi nulla`); analytics.trackEvent(ANALYTICS_EVENTS.VERSION_SAVED); }}
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

        {/* Right panel - Preview (desktop always, mobile only when preview tab active) */}
        <div className={`${isMobile ? (mobileView === 'preview' ? 'flex' : 'hidden') : 'hidden md:flex'} flex-col flex-1 overflow-hidden bg-gray-100 ${isMobile ? 'pb-20' : ''}`}>
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Anteprima CV</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => isMobile ? setMobilePreviewScale(s => Math.max(0.3, s - 0.1)) : setPreviewScale(s => Math.max(0.3, s - 0.05))}
                className="w-9 h-9 md:w-auto md:h-auto md:px-2 md:py-1 flex items-center justify-center text-xs border border-gray-200 rounded-lg md:rounded hover:bg-gray-50"
              >
                <ZoomOut className="w-4 h-4 md:hidden" />
                <span className="hidden md:inline">&minus;</span>
              </button>
              <span className="text-xs text-gray-500 w-12 text-center">{Math.round((isMobile ? mobilePreviewScale : previewScale) * 100)}%</span>
              {/* Page count badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                pageCount === 1 ? 'bg-green-100 text-green-700' :
                pageCount === 2 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <FileText className="w-3 h-3" />
                {pageCount} pag.
              </span>
              <button
                onClick={() => isMobile ? setMobilePreviewScale(s => Math.min(1, s + 0.1)) : setPreviewScale(s => Math.min(1, s + 0.05))}
                className="w-9 h-9 md:w-auto md:h-auto md:px-2 md:py-1 flex items-center justify-center text-xs border border-gray-200 rounded-lg md:rounded hover:bg-gray-50"
              >
                <ZoomIn className="w-4 h-4 md:hidden" />
                <span className="hidden md:inline">+</span>
              </button>
            </div>
          </div>

          {/* Preview container */}
          <div className="flex-1 overflow-auto flex justify-center p-4 md:p-6">
            <div style={{ transformOrigin: 'top center' }}>
              <CVPreview
                cvData={translatedCV || cvData}
                settings={settings}
                scale={isMobile ? mobilePreviewScale : previewScale}
                id="cv-preview-export"
                onPageCountChange={setPageCount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 safe-area-bottom">
          {mainTab === 'editor' && mobileView === 'form' && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  saveVersion('Bozza');
                  toast.success('Bozza salvata! Il tuo lavoro è al sicuro');
                }}
                className="flex-1 h-12 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors active:bg-gray-50"
              >
                Salva bozza
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold rounded-xl text-sm transition-colors active:bg-blue-700"
              >
                Vedi anteprima
                <Eye className="w-4 h-4" />
              </button>
            </div>
          )}
          {mainTab === 'editor' && mobileView === 'preview' && (
            <div className="flex gap-3">
              <button
                onClick={() => setMobileView('form')}
                className="flex-1 h-12 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors active:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Modifica
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isPdfLoading}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold rounded-xl text-sm transition-colors active:bg-blue-700 disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {isPdfLoading ? 'Generando...' : 'Scarica PDF'}
              </button>
            </div>
          )}
          {mainTab !== 'editor' && (
            <div className="flex gap-3">
              <button
                onClick={() => { setMainTab('editor'); setMobileView('form'); }}
                className="flex-1 h-12 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors active:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna al CV
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isPdfLoading}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold rounded-xl text-sm transition-colors active:bg-blue-700 disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {isPdfLoading ? 'Generando...' : 'Scarica PDF'}
              </button>
            </div>
          )}
        </div>
      )}

      </>
      )}

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

      <ExportCelebrationModal
        isOpen={showExportModal}
        phase={exportPhase}
        cvData={cvData}
        onClose={() => setShowExportModal(false)}
        onOptimizeWithAI={() => { setMainTab('ai'); setAITab('optimizer'); }}
      />

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Svuota tutti i campi</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Stai per cancellare tutti i dati del CV. Vuoi salvare una versione prima di procedere?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const versionName = `Backup ${new Date().toLocaleDateString('it-IT')} ${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
                    saveVersion(versionName);
                    resetToDefaults();
                    setTranslatedCV(null);
                    setTranslationLang(null);
                    setShowClearConfirm(false);
                    toast.success('Versione salvata e campi svuotati');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Salva versione e cancella
                </button>
                <button
                  onClick={() => {
                    resetToDefaults();
                    setTranslatedCV(null);
                    setTranslationLang(null);
                    setShowClearConfirm(false);
                    toast.success('Tutti i campi sono stati svuotati');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancella tutto
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
