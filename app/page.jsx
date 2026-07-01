'use client';


import HeroDiagram from './components/Homepage/HeroDiagram';
import HowItWorks from './components/Homepage/HowItWorks';
import JobTrackerSection from './components/Homepage/JobTrackerSection';
import StackedFeatures from './components/Homepage/StackedFeatures';
import Testimonials from './components/Homepage/Testimonials';

export default function Homepage() {

  return (
    <div className="min-h-screen bg-white text-black">
      <HeroDiagram />

      {/* <JobTrackerSection /> */}
      <HowItWorks />  

      <StackedFeatures />
      <Testimonials />
    </div>
  );
}