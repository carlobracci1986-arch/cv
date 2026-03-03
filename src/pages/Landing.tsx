import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { TrustBadges } from '../components/landing/TrustBadges';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { StatsSection } from '../components/landing/StatsSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AIExplainerSection } from '../components/landing/AIExplainerSection';
import { Testimonials } from '../components/landing/Testimonials';
import { FAQSection } from '../components/landing/FAQSection';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { conversionFunnel, FUNNEL_STAGES } from '../utils/conversionFunnel';
import { useTrackScrollDepth, useTrackTime } from '../hooks/useTrackEvent';

export const Landing: React.FC = () => {
  useTrackScrollDepth();
  useTrackTime('landing');

  useEffect(() => {
    conversionFunnel.markStage(FUNNEL_STAGES.LANDING);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBadges />
      <FeaturesSection />
      <StatsSection />
      <HowItWorks />
      <AIExplainerSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};
