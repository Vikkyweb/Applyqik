'use client';

import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok 
} from 'react-icons/fa';
import { 
  SiThreads, 
  SiMastodon, 
  SiBluesky 
} from 'react-icons/si';
import { Check } from 'lucide-react';

const PlatformIcon = ({ Icon, name, size = 'md', badge = false }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-100 flex items-center justify-center bg-white shadow-sm hover:shadow-md transition`}>
        <Icon className="w-2/3 h-2/3" />
      </div>
      {badge && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
          <Check size={16} className="text-white" strokeWidth={3} />
        </div>
      )}
      <span className="text-xs text-gray-600 font-medium text-center">{name}</span>
    </div>
  );
};

export default function HeroDiagram() {
  const sourceplatforms = [
    { Icon: SiMastodon, name: 'Mastodon', color: '#6364FF' },
    { Icon: SiThreads, name: 'Threads', color: '#000000' },
    { Icon: SiBluesky, name: 'Bluesky', color: '#1185FE' },
  ];

  const destinationPlatforms = [
    { Icon: FaYoutube, name: 'YouTube', color: '#FF0000' },
    { Icon: FaTiktok, name: 'TikTok', color: '#000000' },
    { Icon: SiBluesky, name: 'Bluesky', color: '#1185FE' },
    { Icon: SiMastodon, name: 'Mastodon', color: '#6364FF' },
    { Icon: FaFacebook, name: 'Facebook', color: '#1877F2' },
    { Icon: FaLinkedin, name: 'LinkedIn', color: '#0A66C2' },
    { Icon: FaTwitter, name: 'X', color: '#000000' },
    { Icon: FaInstagram, name: 'Instagram', color: '#E4405F' },
  ];

  const supportedPlatforms = [
    { Icon: FaTwitter, name: 'X' },
    { Icon: SiBluesky, name: 'Bluesky' },
    { Icon: SiThreads, name: 'Threads' },
    { Icon: SiMastodon, name: 'Mastodon' },
    { Icon: FaLinkedin, name: 'LinkedIn' },
    { Icon: FaInstagram, name: 'Instagram' },
    { Icon: FaFacebook, name: 'Facebook' },
    { Icon: FaYoutube, name: 'YouTube' },
    { Icon: FaTiktok, name: 'TikTok' },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Distribution Diagram */}
        <div className="mb-16 lg:mb-24">
          <div className="relative min-h-96 flex items-center justify-center">
            {/* SVG Canvas for Distribution Lines */}
            <svg 
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
              viewBox="0 0 1200 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Main hub line */}
              <line 
                x1="100" y1="200" 
                x2="600" y2="200" 
                stroke="#999999" 
                strokeWidth="3" 
              />

              {/* Distribution lines to destinations */}
              <path d="M 600 200 Q 800 80 1100 60" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 110 1100 120" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 140 1100 180" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 170 1100 220" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 200 1100 260" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 230 1100 300" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 260 1100 340" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
              <path d="M 600 200 Q 800 290 1100 380" stroke="#CCCCCC" strokeWidth="2.5" fill="none" strokeDasharray="8,4" />
            </svg>

            {/* Left Source Platforms */}
            <div className="absolute left-0 top-0 bottom-0 w-1/4 flex flex-col justify-around items-center px-4">
              {sourceplatforms.map((platform, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center bg-white shadow-sm">
                    <platform.Icon className="w-8 h-8" style={{ color: platform.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Center Hub */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 rounded-full border-4 border-gray-200 bg-white shadow-lg flex items-center justify-center">
                <SiThreads size={48} className="text-black" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Right Destination Platforms */}
            <div className="absolute right-0 top-0 bottom-0 w-1/4 flex flex-col justify-around items-center px-4">
              {destinationPlatforms.map((platform, idx) => (
                <div key={idx} className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center bg-white shadow-sm hover:shadow-md transition">
                    <platform.Icon className="w-8 h-8" style={{ color: platform.color }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Platforms Section */}
        <div className="border-t border-gray-200 pt-12 lg:pt-16">
          <div className="text-center mb-8">
            <h3 className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-widest">
              Supported Platforms
            </h3>
          </div>
          
          <div className="flex justify-center flex-wrap gap-6 lg:gap-8">
            {supportedPlatforms.map((platform, idx) => (
              <div 
                key={idx} 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-gray-200 bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:border-gray-300 transition cursor-pointer"
              >
                <platform.Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            ))}
          </div>
        </div>

        {/* Optional Trust Statement */}
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-gray-600 text-sm lg:text-base">
            Distribute your content across all major social platforms seamlessly
          </p>
        </div>
      </div>
    </div>
  );
}