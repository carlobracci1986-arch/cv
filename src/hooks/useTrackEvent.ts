import { useCallback, useEffect, useRef } from 'react';
import { analytics, EventProperties } from '../utils/analytics';

/**
 * Hook per tracciare eventi analytics
 */
export function useTrackEvent() {
  return useCallback((eventName: string, properties?: EventProperties) => {
    analytics.trackEvent(eventName, properties);
  }, []);
}

/**
 * Hook per tracciare la visualizzazione di un componente (una sola volta al mount)
 */
export function useTrackView(componentName: string) {
  useEffect(() => {
    analytics.trackEvent('component_viewed', { component: componentName });
  }, [componentName]);
}

/**
 * Hook per tracciare il tempo trascorso su un componente
 * Invia evento allo smontaggio del componente
 */
export function useTrackTime(componentName: string) {
  const startTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration > 2) { // Ignora visite brevissime
        analytics.trackEvent('time_on_component', {
          component: componentName,
          duration_seconds: duration,
        });
      }
    };
  }, [componentName]);
}

/**
 * Hook per tracciare la profondità di scroll nella landing page
 */
export function useTrackScrollDepth() {
  useEffect(() => {
    const thresholdsReached = new Set<number>();

    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / pageHeight) * 100);

      [25, 50, 75, 100].forEach(threshold => {
        if (scrollPercent >= threshold && !thresholdsReached.has(threshold)) {
          thresholdsReached.add(threshold);
          analytics.trackEvent('scroll_depth', { percent: threshold });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
