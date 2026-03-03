/**
 * Sistema di tracciamento eventi centralizzato per CVVincente
 * Usa Plausible Analytics per rispettare la privacy (GDPR compliant)
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export interface EventProperties {
  [key: string]: string | number | boolean;
}

class AnalyticsService {
  private enabled: boolean;
  private isDev: boolean;

  constructor() {
    this.isDev = import.meta.env.MODE !== 'production';
    this.enabled = !this.isDev;
  }

  /**
   * Traccia un evento personalizzato
   */
  trackEvent(eventName: string, properties?: EventProperties): void {
    if (this.isDev) {
      console.log(`[Analytics] ${eventName}`, properties || '');
      return;
    }

    if (!this.enabled) return;

    try {
      if (window.plausible) {
        window.plausible(eventName, properties ? { props: properties } : undefined);
      }
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }

  /**
   * Traccia un obiettivo di conversione
   */
  trackGoal(goal: string, value?: number): void {
    this.trackEvent(goal, value !== undefined ? { value } : undefined);
  }

  /**
   * Abilita/disabilita analytics (per consenso utente)
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const analytics = new AnalyticsService();
