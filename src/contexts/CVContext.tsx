import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CVData, CVSettings, CVVersion, defaultCVData, defaultSettings } from '../types/cv.types';
import {
  getCVData, saveCVData, getCVSettings, saveCVSettings,
  getVersions, addVersion, deleteVersion as deleteVersionStorage,
} from '../utils/localStorage';
import { nanoid } from '../utils/nanoid';

interface CVContextType {
  cvData: CVData;
  settings: CVSettings;
  versions: CVVersion[];
  currentVersionId: string | null;
  lastSaved: Date | null;
  isDirty: boolean;
  updateCVData: (data: Partial<CVData>) => void;
  updateSettings: (settings: Partial<CVSettings>) => void;
  saveVersion: (name: string, jobDescription?: string, notes?: string) => CVVersion;
  loadVersion: (version: CVVersion) => void;
  deleteVersion: (id: string) => void;
  duplicateVersion: (id: string) => void;
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

const CVContext = createContext<CVContextType | null>(null);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvData, setCvData] = useState<CVData>(getCVData);
  const [settings, setSettings] = useState<CVSettings>(getCVSettings);
  const [versions, setVersions] = useState<CVVersion[]>(getVersions);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveCVData(cvData);
      saveCVSettings(settings);
      setLastSaved(new Date());
      setIsDirty(false);
    }, 30000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [cvData, settings]);

  const updateCVData = useCallback((data: Partial<CVData>) => {
    setCvData(prev => {
      const next = { ...prev, ...data };
      saveCVData(next);
      return next;
    });
    setIsDirty(true);
    setLastSaved(new Date());
  }, []);

  const updateSettings = useCallback((newSettings: Partial<CVSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      saveCVSettings(next);
      return next;
    });
  }, []);

  const saveVersion = useCallback((name: string, jobDescription?: string, notes?: string): CVVersion => {
    const now = new Date().toISOString();
    const version: CVVersion = {
      id: nanoid(),
      name,
      createdAt: now,
      updatedAt: now,
      data: cvData,
      settings,
      jobDescription,
      notes,
      isOptimized: false,
      tags: [],
    };
    addVersion(version);
    setVersions(getVersions());
    setCurrentVersionId(version.id);
    return version;
  }, [cvData, settings]);

  const loadVersion = useCallback((version: CVVersion) => {
    setCvData(version.data);
    setSettings(version.settings);
    setCurrentVersionId(version.id);
    saveCVData(version.data);
    saveCVSettings(version.settings);
    setIsDirty(false);
  }, []);

  const deleteVersion = useCallback((id: string) => {
    deleteVersionStorage(id);
    setVersions(getVersions());
    if (currentVersionId === id) setCurrentVersionId(null);
  }, [currentVersionId]);

  const duplicateVersion = useCallback((id: string) => {
    const version = versions.find(v => v.id === id);
    if (!version) return;
    const now = new Date().toISOString();
    const newVersion: CVVersion = {
      ...version,
      id: nanoid(),
      name: `${version.name} (copia)`,
      createdAt: now,
      updatedAt: now,
    };
    addVersion(newVersion);
    setVersions(getVersions());
  }, [versions]);

  const resetToDefaults = useCallback(() => {
    setCvData(defaultCVData);
    setSettings(defaultSettings);
    saveCVData(defaultCVData);
    saveCVSettings(defaultSettings);
    setCurrentVersionId(null);
    setIsDirty(false);
  }, []);

  const exportJSON = useCallback((): string => {
    return JSON.stringify({ cvData, settings, versions }, null, 2);
  }, [cvData, settings, versions]);

  const importJSON = useCallback((json: string) => {
    const data = JSON.parse(json);
    if (data.cvData) { setCvData(data.cvData); saveCVData(data.cvData); }
    if (data.settings) { setSettings(data.settings); saveCVSettings(data.settings); }
  }, []);

  return (
    <CVContext.Provider value={{
      cvData, settings, versions, currentVersionId,
      lastSaved, isDirty,
      updateCVData, updateSettings, saveVersion,
      loadVersion, deleteVersion, duplicateVersion,
      resetToDefaults, exportJSON, importJSON,
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCV must be used within CVProvider');
  return ctx;
};
