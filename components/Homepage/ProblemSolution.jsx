import { Globe, Building2, Search, Layers, Briefcase, Bot, ArrowRight } from 'lucide-react';

const platformIcons = [Globe, Building2, Search, Layers, Briefcase];

// Scattered, tangled positions — no shared center
const chaosPositions = [
  { x: 12, y: 20, r: -12 },
  { x: 45, y: 10, r: 8 },
  { x: 80, y: 32, r: -7 },
  { x: 24, y: 78, r: 14 },
  { x: 68, y: 80, r: -10 },
];
const chaosLines = [
  [0, 2],
  [1, 3],
  [2, 4],
  [0, 4],
];

// Evenly spaced pentagon around a center hub
const orderPositions = [
  { x: 50, y: 10 },
  { x: 86, y: 37 },
  { x: 72, y: 80 },
  { x: 28, y: 80 },
  { x: 14, y: 37 },
];
const hub = { x: 50, y: 50 };

function MiniDiagram({ variant }) {
  const positions = variant === 'chaos' ? chaosPositions : orderPositions;
  const lineColor = variant === 'chaos' ? '#D4D4D8' : '#000000';
  const iconColor = variant === 'chaos' ? 'text-gray-400' : 'text-gray-900';
  const borderColor = variant === 'chaos' ? 'border-gray-200' : 'border-gray-900';

  return (
    <div
      className={`relative w-full max-w-[220px] sm:max-w-xs mx-auto aspect-[3/2] ${
        variant === 'chaos' ? 'opacity-70' : ''
      }`}
    >
      <svg viewBox="0 0 100 66" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {variant === 'chaos'
          ? chaosLines.map(([a, b], i) => {
              const pa = chaosPositions[a];
              const pb = chaosPositions[b];
              return (
                <line
                  key={i}
                  x1={pa.x}
                  y1={pa.y * 0.66}
                  x2={pb.x}
                  y2={pb.y * 0.66}
                  stroke={lineColor}
                  strokeWidth="0.6"
                />
              );
            })
          : orderPositions.map((p, i) => (
              <line
                key={i}
                x1={hub.x}
                y1={hub.y * 0.66}
                x2={p.x}
                y2={p.y * 0.66}
                stroke={lineColor}
                strokeWidth="0.6"
              />
            ))}
      </svg>

      {variant === 'order' && (
        <div
          className="absolute w-8 h-8 sm:w-10 sm:h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-900 bg-white flex items-center justify-center"
          style={{ left: `${hub.x}%`, top: `${hub.y * 0.66}%` }}
        >
          <Bot size={14} className="text-gray-900 sm:hidden" strokeWidth={1.75} />
          <Bot size={16} className="text-gray-900 hidden sm:block" strokeWidth={1.75} />
        </div>
      )}

      {positions.map((p, i) => {
        const Icon = platformIcons[i];
        return (
          <div
            key={i}
            className={`absolute w-7 h-7 sm:w-8 sm:h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border ${borderColor} bg-white flex items-center justify-center`}
            style={{
              left: `${p.x}%`,
              top: `${p.y * 0.66}%`,
              transform: `translate(-50%, -50%) rotate(${p.r || 0}deg)`,
            }}
          >
            <Icon size={12} className={`${iconColor} sm:hidden`} strokeWidth={1.75} />
            <Icon size={13} className={`${iconColor} hidden sm:block`} strokeWidth={1.75} />
          </div>
        );
      })}
    </div>
  );
}

export default function ProblemSolutionSection() {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-10">
          {/* Problem */}
          <div className="flex-1 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-400 mb-4 leading-tight">
              The job search process is broken.
            </h2>
            <p className="text-[15px] leading-relaxed text-gray-500 mb-8 lg:mb-10 max-w-md mx-auto ">
                Finding the right opportunity takes too much time.
                You search across multiple platforms, rewrite your resume repeatedly, and apply
                without knowing if you're actually a good match.
            </p>

            <MiniDiagram variant="chaos" />
          </div>

          {/* Connector */}
          <div className="flex justify-center lg:px-2 shrink-0">
            <ArrowRight size={50} className="text-gray-300 rotate-90 lg:rotate-0" />
          </div>

          {/* Solution */}
          <div className="flex-1 text-center ">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
              Applyqik changes that.
            </h2>
            <p className="text-[15px] leading-relaxed text-gray-600 mb-8 lg:mb-10 max-w-md mx-auto">
              Your AI career assistant continuously discovers relevant jobs, analyzes your fit,
              and prepares your applications automatically — so you focus on opportunities instead of endless
              searching.
            </p>

            <MiniDiagram variant="order" />
          </div>
        </div>
      </div>
    </section>
  );
}