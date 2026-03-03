/// <reference types="vite/client" />
import * as claudeAPI from './claudeAPI';
import * as geminiAPI from './geminiAPI';
import * as openrouterAPI from './openrouterAPI';
import { CVData } from '../types/cv.types';
import { OptimizationResult, CoverLetterOptions, InterviewPrepResult } from '../types/ai.types';

const getProvider = () => {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'claude';
  if (provider !== 'claude' && provider !== 'gemini' && provider !== 'openrouter') {
    console.warn(`Provider non riconosciuto: ${provider}. Usando 'claude' come fallback.`);
    return 'claude';
  }
  console.log(`Usando provider AI: ${provider}`);
  return provider as 'claude' | 'gemini' | 'openrouter';
};

export const optimizeCV = async (cvData: CVData, jobDescription: string): Promise<OptimizationResult> => {
  const provider = getProvider();
  if (provider === 'claude') return claudeAPI.optimizeCV(cvData, jobDescription);
  if (provider === 'gemini') return geminiAPI.optimizeCV(cvData, jobDescription);
  return openrouterAPI.optimizeCV(cvData, jobDescription);
};

export const generateCoverLetter = async (
  cvData: CVData,
  jobDescription: string,
  options: CoverLetterOptions
): Promise<string> => {
  const provider = getProvider();
  if (provider === 'claude') return claudeAPI.generateCoverLetter(cvData, jobDescription, options);
  if (provider === 'gemini') return geminiAPI.generateCoverLetter(cvData, jobDescription, options);
  return openrouterAPI.generateCoverLetter(cvData, jobDescription, options);
};

export const translateCV = async (cvData: CVData, targetLanguage: string): Promise<CVData> => {
  const provider = getProvider();
  if (provider === 'claude') return claudeAPI.translateCV(cvData, targetLanguage);
  if (provider === 'gemini') return geminiAPI.translateCV(cvData, targetLanguage);
  return openrouterAPI.translateCV(cvData, targetLanguage);
};

export const generateInterviewPrep = async (
  cvData: CVData,
  jobDescription: string
): Promise<InterviewPrepResult> => {
  const provider = getProvider();
  if (provider === 'claude') return claudeAPI.generateInterviewPrep(cvData, jobDescription);
  if (provider === 'gemini') return geminiAPI.generateInterviewPrep(cvData, jobDescription);
  return openrouterAPI.generateInterviewPrep(cvData, jobDescription);
};

export const evaluateMockAnswer = async (
  question: string,
  answer: string,
  jobDescription: string
): Promise<{ score: number; feedback: string; improvements: string[] }> => {
  const provider = getProvider();
  if (provider === 'claude') return claudeAPI.evaluateMockAnswer(question, answer, jobDescription);
  if (provider === 'gemini') return geminiAPI.evaluateMockAnswer(question, answer, jobDescription);
  return openrouterAPI.evaluateMockAnswer(question, answer, jobDescription);
};

export const extractTextFromImages = async (
  images: { base64: string; mediaType: string }[]
): Promise<string> => {
  const provider = getProvider();
  if (provider === 'claude') return claudeAPI.extractTextFromImages(images);
  if (provider === 'gemini') return geminiAPI.extractTextFromImages(images);
  return openrouterAPI.extractTextFromImages(images);
};

// Funzione helper per ottenere il provider attuale (utile per debug/UI)
export const getCurrentProvider = (): string => {
  return getProvider();
};
