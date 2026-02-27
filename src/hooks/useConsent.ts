import { useCallback } from 'react';
import { usePrivacy } from '../contexts/PrivacyContext';

export const useConsent = () => {
  const { consent, updateConsent } = usePrivacy();

  const grantConsent = useCallback(() => {
    updateConsent({
      hasConsented: true,
      consentDate: new Date().toISOString(),
    });
  }, [updateConsent]);

  const grantAIConsent = useCallback((save = false) => {
    updateConsent({
      aiConsent: true,
      aiConsentDate: new Date().toISOString(),
      saveAIConsent: save,
    });
  }, [updateConsent]);

  const revokeAIConsent = useCallback(() => {
    updateConsent({ aiConsent: false, saveAIConsent: false });
  }, [updateConsent]);

  return {
    hasConsented: consent.hasConsented,
    hasAIConsent: consent.aiConsent,
    saveAIConsent: consent.saveAIConsent,
    grantConsent,
    grantAIConsent,
    revokeAIConsent,
  };
};
