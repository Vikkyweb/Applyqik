'use client';


import FaqSection from './components/Homepage/FaqSection';
import HeroDiagram from './components/Homepage/Hero';
import HowItWorks from './components/Homepage/HowItWorks';
import JobTrackerSection from './components/Homepage/JobTrackerSection';
import ProblemSolutionSection from './components/Homepage/ProblemSolution';
import StackedFeaturess from './components/Homepage/StackedFeaturess';
import Testimonials from './components/Homepage/Testimonials';
import TrustSection from './components/Homepage/TrustSection';
import PricingPage from './pricing/page';

export default function Homepage() {

  return (
    <div className="min-h-dvh bg-white text-black">
      <HeroDiagram />

      <ProblemSolutionSection />

      <HowItWorks />  

      <StackedFeaturess />

      <TrustSection />
      <Testimonials />

      <PricingPage />

      <FaqSection />
      
    </div>
  );
}