import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ConsentState, DataActivity } from '../types/privacy.types';
import { getConsent, saveConsent, getActivityLog, addActivity as addActivityStorage } from '../utils/localStorage';

interface PrivacyContextType {
  consent: ConsentState;
  updateConsent: (partial: Partial<ConsentState>) => void;
  activityLog: DataActivity[];
  addActivity: (activity: Omit<DataActivity, 'id' | 'timestamp'>) => void;
}

const PrivacyContext = createContext<PrivacyContextType | null>(null);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<ConsentState>(getConsent);
  const [activityLog, setActivityLog] = useState<DataActivity[]>(getActivityLog);

  const updateConsent = useCallback((partial: Partial<ConsentState>) => {
    setConsent(prev => {
      const next = { ...prev, ...partial };
      saveConsent(next);
      return next;
    });
  }, []);

  const addActivity = useCallback((activity: Omit<DataActivity, 'id' | 'timestamp'>) => {
    addActivityStorage(activity);
    setActivityLog(getActivityLog());
  }, []);

  return (
    <PrivacyContext.Provider value={{ consent, updateConsent, activityLog, addActivity }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error('usePrivacy must be used within PrivacyProvider');
  return ctx;
};
