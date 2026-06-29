'use client';


import HeroDiagram from './components/HeroDiagram';
import JobTrackerSection from './components/Homepage/JobTrackerSection';

export default function Homepage() {

  return (
    <div className="min-h-screen bg-white text-black">
      <HeroDiagram />

      <JobTrackerSection />

    </div>
  );
}