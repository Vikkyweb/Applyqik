'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = [
  {
    id: 'summary',
    label: 'Job Matches',
    icon: '🔍',
    screenshot: '/screenshots/one.png',
  },
  {
    id: 'copilot',
    label: 'Copilot Extension',
    icon: '⚡',
    screenshot: '/screenshots/two.png',
  },
  {
    id: 'resume',
    label: 'AI Resume Builder',
    icon: '📋',
    screenshot: '/screenshots/three.png',
  },
  {
    id: 'tracker',
    label: 'Job Tracker',
    icon: '💼',
    screenshot: '/screenshots/one.png',
  },
];

const STAGES = [
  {
    title: 'SCREEN',
    count: 5,
    color: 'from-blue-400 to-blue-500',
    jobs: [
      { title: 'Business to Business Sale...', icon: '💧', company: 'Dropbox' },
      { title: 'Product Manager', icon: '⬛', company: 'Unknown' },
      { title: 'Design Engineer', icon: '📦', company: 'Vercel' },
      { title: 'Advanced Support Consul...', icon: '👥', company: 'Support' },
      { title: 'Business Development Re...', icon: '📊', company: 'Growth' },
    ],
  },
  {
    title: 'INTERVIEWING',
    count: 4,
    color: 'from-cyan-400 to-blue-400',
    jobs: [
      { title: 'Product Design Intern', icon: '⚙️', company: 'Startup' },
      { title: 'Engineer', icon: '📈', company: 'Tech' },
      { title: 'Product Designer', icon: '🎨', company: 'Design' },
      { title: 'Product Designer', icon: '📐', company: 'Creative' },
    ],
  },
  {
    title: 'OFFER',
    count: 3,
    color: 'from-green-400 to-indigo-500',
    jobs: [
      { title: 'Project Manager', icon: '⬛', company: 'Enterprise' },
      { title: 'Product Designer', icon: '🌿', company: 'Growth' },
      { title: 'Software Engineer', icon: '🔧', company: 'Platform' },
    ],
  },
];

const SummaryChart = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Your Job Search Summarized ✨</h3>
    
    <div className="space-y-3">
      {[
        { label: 'Applications', value: 450, color: 'bg-blue-400' },
        { label: 'Phone Screen', value: 50, color: 'bg-blue-400' },
        { label: 'Interview', value: 20, color: 'bg-orange-300' },
        { label: 'Rejected', value: 177, color: 'bg-red-300' },
        { label: 'No Answer', value: 285, color: 'bg-gray-300' },
      ].map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">{item.label}</span>
            <span className="text-gray-500 text-xs">{item.value}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className={`h-full ${item.color} opacity-70`}
              style={{
                width: `${Math.min((item.value / 450) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const JobCard = ({ job, index }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
          {job.icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{job.title}</h4>
        <p className="text-xs text-gray-500">{job.company}</p>
      </div>
    </div>
  </div>
);

const StageColumn = ({ stage, index }) => (
  <div className="flex-shrink-0 w-full sm:w-80 md:flex-1">
    <div className="space-y-4">
      {/* Column Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-bold text-gray-600 tracking-wider">{stage.title}</h3>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
          {stage.count}
        </span>
      </div>

      {/* Jobs */}
      <div className="space-y-3">
        {stage.jobs.map((job, jobIdx) => (
          <JobCard key={jobIdx} job={job} index={jobIdx} />
        ))}
      </div>
    </div>
  </div>
);

export default function JobTrackerSection() {
  const [activeTab, setActiveTab] = useState('summary');
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-rotate tabs every 5 seconds
  // useEffect(() => {
  //   if (!autoRotate) return;

  //   const interval = setInterval(() => {
  //     setActiveTab((current) => {
  //       const currentIndex = TABS.findIndex((tab) => tab.id === current);
  //       const nextIndex = (currentIndex + 1) % TABS.length;
  //       return TABS[nextIndex].id;
  //     });
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, [autoRotate]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setAutoRotate(true);
  };

  const handlePrevStage = () => {
    const container = document.getElementById('stages-scroll');
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleNextStage = () => {
    const container = document.getElementById('stages-scroll');
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const currentTab = TABS.find(tab => tab.id === activeTab);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        {/* Tab Navigation */}
        <div className="mb-12">
          <style>{`
            .tabs-scroll::-webkit-scrollbar {
              height: 4px;
            }
            .tabs-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .tabs-scroll::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 2px;
            }
            .tabs-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.3);
            }
            .tabs-scroll {
              scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
              scrollbar-width: thin;
            }
          `}</style>
          <div className="flex justify-center">
            <div className="flex gap-2 sm:gap-3 bg-gray-400 p-2 rounded-2xl overflow-x-auto tabs-scroll max-w-full">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                    flex items-center gap-2 whitespace-nowrap flex-shrink-0
                    ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border-8 border-indigo-200 overflow-hidden">
          {currentTab?.screenshot && (
            <div className="animate-fadeIn">
              <img
                src={currentTab.screenshot}
                alt={currentTab.label}
                className="w-full h-auto display-block"
              />
            </div>
          )}

          {/* Fallback content if no screenshot */}
          {!currentTab?.screenshot && (
            <>
              {activeTab === 'summary' && (
                <div className="animate-fadeIn p-6 sm:p-8 lg:p-10 max-w-2xl">
                  <SummaryChart />
                </div>
              )}

              {activeTab === 'copilot' && (
                <div className="animate-fadeIn p-6 sm:p-8 lg:p-10">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Copilot Extension</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Get AI-powered suggestions as you browse job listings.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="animate-fadeIn p-6 sm:p-8 lg:p-10">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">AI Resume Builder</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Build a professional resume with AI assistance.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'tracker' && (
                <div className="animate-fadeIn p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">My Job Tracker</h3>

                  {/* Desktop View - Grid */}
                  <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {STAGES.map((stage, idx) => (
                      <StageColumn key={idx} stage={stage} index={idx} />
                    ))}
                  </div>

                  {/* Mobile/Tablet View - Horizontal Scroll */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={handlePrevStage}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>

                      <div
                        id="stages-scroll"
                        className="flex-1 overflow-x-auto scrollbar-hide"
                      >
                        <div className="flex gap-4 pb-2">
                          {STAGES.map((stage, idx) => (
                            <StageColumn key={idx} stage={stage} index={idx} />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleNextStage}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Swipe or use arrows to scroll</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 300ms ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}