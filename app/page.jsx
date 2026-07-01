'use client';


import HeroDiagram from './components/Homepage/Hero';
import HowItWorks from './components/Homepage/HowItWorks';
import JobTrackerSection from './components/Homepage/JobTrackerSection';
import StackedFeatures from './components/Homepage/StackedFeatures';
import Testimonials from './components/Homepage/Testimonials';

export default function Homepage() {

  return (
    <div className="min-h-dvh bg-white text-black">
      <HeroDiagram />

      {/* <JobTrackerSection /> */}
      <HowItWorks />  

      <StackedFeatures />
      <Testimonials />
    </div>
  );
}