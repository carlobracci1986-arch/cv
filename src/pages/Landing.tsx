import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AIExplainerSection } from '../components/landing/AIExplainerSection';
import { Testimonials } from '../components/landing/Testimonials';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <AIExplainerSection />
      <Testimonials />
      <CTASection />
      <LandingFooter />
    </div>
  );
};
