/**
 * Tracciamento imbuto di conversione per CVVincente
 */

import { analytics } from './analytics';

export const FUNNEL_STAGES = {
  LANDING: 'landing',
  EDITOR_OPENED: 'editor_opened',
  FIRST_SECTION_FILLED: 'first_section_filled',
  HALF_COMPLETED: 'half_completed',
  CV_COMPLETE: 'cv_complete',
  AI_USED: 'ai_used',
  PDF_EXPORTED: 'pdf_exported',
} as const;

type FunnelStage = typeof FUNNEL_STAGES[keyof typeof FUNNEL_STAGES];

const STORAGE_KEY = 'cv_funnel_stages';

class ConversionFunnel {
  private completedStages: Set<string>;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    // Restore from session
    const saved = sessionStorage.getItem(STORAGE_KEY);
    this.completedStages = saved ? new Set(JSON.parse(saved)) : new Set();
  }

  /**
   * Segna una fase dell'imbuto come completata
   */
  markStage(stage: FunnelStage, properties?: Record<string, string | number | boolean>): void {
    if (this.completedStages.has(stage)) return;

    this.completedStages.add(stage);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...this.completedStages]));

    const elapsed = Math.round((Date.now() - this.startTime) / 1000);

    analytics.trackEvent(`funnel_${stage}`, {
      ...properties,
      elapsed_seconds: elapsed,
      stages_completed: this.completedStages.size,
    });
  }

  getCompletedStages(): string[] {
    return [...this.completedStages];
  }

  getCompletionPercent(): number {
    const total = Object.keys(FUNNEL_STAGES).length;
    return Math.round((this.completedStages.size / total) * 100);
  }
}

export const conversionFunnel = new ConversionFunnel();
