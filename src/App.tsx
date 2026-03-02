import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CVProvider } from './contexts/CVContext';
import { PrivacyProvider } from './contexts/PrivacyContext';
import { Landing } from './pages/Landing';
import { Editor } from './pages/Editor';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { CookiePolicy } from './pages/CookiePolicy';
import { ConsentModal } from './components/Privacy/ConsentModal';
import { usePrivacy } from './contexts/PrivacyContext';
import { Footer } from './components/Layout/Footer';

const AppContent: React.FC = () => {
  const { consent, updateConsent } = usePrivacy();

  const handleConsent = () => {
    updateConsent({
      hasConsented: true,
      consentDate: new Date().toISOString(),
    });
  };

  return (
    <BrowserRouter>
      <ConsentModal isOpen={!consent.hasConsented} onConsent={handleConsent} />
      <Routes>
        {/* Landing page - no editor layout */}
        <Route path="/" element={<Landing />} />

        {/* Editor with original layout */}
        <Route
          path="/editor"
          element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <Editor />
              </div>
              <Footer />
            </div>
          }
        />

        {/* Legal pages */}
        <Route
          path="/privacy-policy"
          element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1"><PrivacyPolicy /></div>
              <Footer />
            </div>
          }
        />
        <Route
          path="/terms"
          element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1"><Terms /></div>
              <Footer />
            </div>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <div className="min-h-screen flex flex-col">
              <div className="flex-1"><CookiePolicy /></div>
              <Footer />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <PrivacyProvider>
      <CVProvider>
        <AppContent />
      </CVProvider>
    </PrivacyProvider>
  );
};

export default App;
