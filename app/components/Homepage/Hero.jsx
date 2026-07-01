'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok ,
  FaBuilding,
  FaBriefcase,
} from 'react-icons/fa';
import { 
  SiIndeed,
  SiGlassdoor
} from 'react-icons/si';


import { Briefcase, Check, Globe, Zap, FileCheck, Bot, UserRound, Sparkles, TrendingUp, Gift } from 'lucide-react';
import Image from 'next/image';

export default function HeroDiagram() {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const destIconsRef = useRef([]);
    const [lines, setLines] = useState([]);
    const [active,setActive] = useState(0);

    const sourceplatforms = [
    { Icon: UserRound, name: 'Profile', color: '#6364FF' },
    { Icon: Sparkles, name: 'Resume', color: '#000000' },
    { Icon: FileCheck, name: 'Applied', color: '#1185FE' },
    ];

    const destinationPlatforms = [
        { Icon: 'https://cdn.prod.website-files.com/6668a687e71e2722fccb8357/679a83f29b0fde85378eb397_gh_Icon-greenhouse-green.png', name: 'Greenhouse', color: '#1877F2' },
        { Icon: 'https://www.lever.co/images/favicon-lever.png', name: 'Lever', color: '#0A66C2' },
        { Icon: 'https://www.ashbyhq.com/favicon.png', name: 'Ashbyhq', color: '#E4405F' },
        { Icon: 'https://wellfound.com/wellfound-favicon-57x.png', name: 'Wellfound', color: '#FF0000' },
        { Icon: 'https://bookface-static.ycombinator.com/assets/ycdc/favicon-c8a914eeeba9fe6f7a863b35608b55aeedd7c1ff409c97b9ecb96b7a6c278d70.ico', name: 'YCombinator', color: '#000000' },
        { Icon: 'https://remoteok.com/assets/logo-square.png', name: 'RemoteOK', color: '#000000' },
    ];


    useEffect(() => {
        const calculateLines = () => {
        if (!containerRef.current || !svgRef.current) return;

        const container = containerRef.current;
        const svg = svgRef.current;
        const svgRect = svg.getBoundingClientRect();

        const viewBoxStr = svg.getAttribute('viewBox');
        const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBoxStr.split(' ').map(Number);

        // Hub position in viewBox coordinates (center)
        const hubSvgX = viewBoxX + viewBoxWidth / 2;
        const hubSvgY = viewBoxY + viewBoxHeight / 2;

        // Scale factors from screen pixels to viewBox coordinates
        const scaleX = viewBoxWidth / svgRect.width;
        const scaleY = viewBoxHeight / svgRect.height;

        const newLines = destIconsRef.current.map((ref) => {
            if (!ref) return null;
            
            const iconRect = ref.getBoundingClientRect();
            
            // Get icon center position relative to SVG
            const iconCenterX = iconRect.left - svgRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top - svgRect.top + iconRect.height / 2;

            // Convert to viewBox coordinates
            const iconSvgX = viewBoxX + iconCenterX * scaleX;
            const iconSvgY = viewBoxY + iconCenterY * scaleY;

            return {
            x1: hubSvgX,
            y1: hubSvgY,
            x2: iconSvgX,
            y2: iconSvgY,
            };
        });

        setLines(newLines);
        };

        calculateLines();

        const resizeObserver = new ResizeObserver(calculateLines);
        if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', calculateLines);

        return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', calculateLines);
        };
    }, []);

    const jobSources = [
        {
            name: "LinkedIn Jobs",
            icon: FaLinkedin,
            color: "text-blue-600"
        },
        {
            name: "Indeed",
            icon: SiIndeed,
            color: "text-blue-500"
        },
        {
            name: "Glassdoor",
            icon: SiGlassdoor,
            color: "text-green-600"
        },
        {
            name: "Company Careers",
            icon: FaBuilding,
            color: "text-purple-600"
        },
        {
            name: "Remote Job Boards",
            icon: FaBriefcase,
            color: "text-orange-500"
        }
    ];

    useEffect(()=>{

    const timer = setInterval(()=>{

        setActive((prev)=>
        (prev + 1) % jobSources.length
        )

    },2500);

    return ()=> clearInterval(timer);


    },[]);

    const CurrentIcon = jobSources[active].icon;

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseBadge {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
            transform: scale(1.05);
          }
        }
        
        @keyframes floatHub {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes floatCardAlt {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }
        
        @keyframes glow {
          0%, 100% { 
            filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.6));
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-badge {
          animation: pulseBadge 2s infinite;
        }

        .hub-float {
          animation: floatHub 3s ease-in-out infinite;
        }

        .hub-glow {
          animation: glow 2.5s ease-in-out infinite;
        }

        .float-card {
          animation: floatCard 4s ease-in-out infinite;
        }

        .float-card-alt {
          animation: floatCardAlt 4.5s ease-in-out infinite;
        }

        .icon-hover:hover {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }
      `}</style>

      <div className="lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Floating Cards - Left Side */}
        <div className="hidden lg:block absolute left-0 top-20 w-64 space-y-6 pointer-events-none">
          {/* Resume Matching Card */}
          <div className="float-card opacity-40 hover:opacity-60 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-4">Resume Matching</h3>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 flex items-center justify-center bg-blue-50 dark:bg-blue-950">
                    <span className="text-lg font-bold text-blue-400">92%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Perks Card */}
          <div className="float-card-alt opacity-40 hover:opacity-60 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Gift size={16} className="text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500">Company Perks</h3>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-indigo-200 dark:bg-indigo-900 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cards - Right Side */}
        <div className="hidden lg:block absolute right-0 top-20 w-64 space-y-6 pointer-events-none">
          {/* Hiring Trends Card */}
          <div className="float-card-alt opacity-40 hover:opacity-60 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500">Hiring Trends</h3>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-purple-200 dark:bg-purple-900 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>

          {/* Quick Apply Card */}
          <div className="float-card opacity-40 hover:opacity-60 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-4">Quick Apply</h3>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950 px-3 py-2 rounded-lg">
                  <span className="text-xs font-semibold text-blue-400">One-Click</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-50 to-indigo-50 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 border border-green-200">
            <span className="text-gray-600">Hunting across 5+ relevant job sources</span>
            <span className="text-green-600">→</span>
          </div>
        </div>

        {/* Headline */}
        <div className="lg:max-w-[50%] m-auto text-center mb-8 ">
          <h1 className="text-4xl md:text-4xl font-bold leading-tight text-gray-900">
            Your AI career agent, working while you sleep.
          </h1>

          {/* <h1 className="text-5xl sm:text-6xl lg:text-2xl font-black leading-tight mb-4 tracking-tight text-[#0B0D12]">
            Your AI career agent that finds the right jobs, matches your skills, and prepares your applications.
          </h1> */}

          {/* <div className="flex items-center
            justify-center
            gap-3
            mb-2
            transition-all
            duration-500
            ">
                <CurrentIcon

                size={38}

                className={`
                ${jobSources[active].color}
                transition-all
                duration-500
                `}

                />

                <h4

                key={jobSources[active].name}

                className="
                text-2xl
                sm:text-2xl
                lg:text-3xl
                font-black
                italic
                text-slate-900
                animate-in
                fade-in
                slide-in-from-bottom-3
                duration-500
                "

                >

                {jobSources[active].name}

                </h4>
            </div> */}
        </div>

        {/* Subheading */}
        <div className="text-center mb-3 max-w-2xl mx-auto">
          {/* <p>
            Stop spending hours searching and applying. JobPilot continuously discovers opportunities, analyzes your fit, and helps you prepare stronger applications — while you focus on your career.
          </p> */}
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Finds the right jobs, matches your skills, and prepares your applications — automatically.
            </p>
        </div>

        {/* Distribution Diagram */}
        <div className="mb-16 lg:mb-10 lg:max-w-[80%] m-auto">
          <div 
            ref={containerRef}
            className="relative flex items-center justify-center"
            style={{ minHeight: '400px' }}
          >
            {/* SVG Canvas for Dotted Lines */}
            <svg 
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
              viewBox="0 0 1200 400"
              preserveAspectRatio="xMidYMid meet"
            >
                <line 
                    x1="150" y1="200" 
                    x2="600" y2="200" 
                    stroke="#999999" 
                    strokeWidth="3" 
                />
              {/* Dotted lines from hub to each destination */}
              {lines.map((line, idx) =>
                line ? (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#CCCCCC"
                    strokeWidth="2.5"
                    strokeDasharray="6,4"
                    style={{
                      opacity: 0.7,
                    }}
                  />
                ) : null
              )}
            </svg>

            {/* Left Source Platforms */}
            <div className="absolute left-0 top-0 bottom-0 w-1/4 flex flex-col justify-around items-center px-2 sm:px-4">
              {sourceplatforms.map((platform, idx) => (
                <div 
                  key={idx} 
                  className="relative flex flex-col items-center gap-2 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 icon-hover">
                    <platform.Icon className="w-6 h-6" style={{ color: platform.color }} />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center">{platform.name}</span>
                </div>
              ))}
            </div>

            {/* Center Hub */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hub-float hub-glow">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                  <Bot size={48} className="text-black dark:text-white" />
                </div>
              </div>
            </div>

            {/* Right Destination Platforms - 6 icons */}
            <div className="absolute right-0 top-0 bottom-0 w-1/4 flex flex-col justify-around items-center px-2 sm:px-4">
              {destinationPlatforms.map((platform, idx) => (
                <div 
                  key={idx}
                  ref={(el) => {
                    if (el) destIconsRef.current[idx] = el;
                  }}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${(idx + 3) * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 icon-hover">
                    {/* <platform.Icon className="w-8 h-8" style={{ color: platform.color }} /> */}
                    <Image src={`${platform.Icon}`} alt='' height={100} width={100}/>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center animate-pulse-badge" style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className=" pt-0 lg:pt-0 hidden md:block">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Globe size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Aggregate Sources</h4>
              <p className="text-sm text-slate-600">Pulls from all major job boards in real-time</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                <Zap size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">AI Matching</h4>
              <p className="text-sm text-slate-600">Analyzes your profile against 50K+ opportunities</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-4">
                <Check size={24} className="text-teal-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Smart Categorize</h4>
              <p className="text-sm text-slate-600">Organizes into roles and industries you care about</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-7 lg:mt-10 hidden md:block">
          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            <Briefcase size={18} />
            Start Smart Job Hunting
          </button>
        </div>
      </div>
    </div>
  );
}