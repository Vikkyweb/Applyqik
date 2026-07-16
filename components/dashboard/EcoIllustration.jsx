export default function EcoIllustration() {
  return (
    <svg
      viewBox="0 0 520 340"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a solar and wind powered facility"
    >
      <defs>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fae63" />
          <stop offset="100%" stopColor="#6e9147" />
        </linearGradient>
        <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b4a5a" />
          <stop offset="100%" stopColor="#232f3a" />
        </linearGradient>
        <linearGradient id="panelG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c2733" />
          <stop offset="100%" stopColor="#0f1720" />
        </linearGradient>
        <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9e4da" />
          <stop offset="100%" stopColor="#d3ccbd" />
        </linearGradient>
      </defs>

      <ellipse cx="260" cy="290" rx="220" ry="34" fill="url(#ground)" opacity="0.9" />
      <ellipse cx="260" cy="284" rx="196" ry="26" fill="#7ba055" opacity="0.6" />

      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const rx = 205;
        const ry = 30;
        const cx = 260 + Math.cos(angle) * rx;
        const cy = 292 + Math.sin(angle) * ry;
        const r = 14 + (i % 3) * 4;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={i % 2 ? '#4c7a34' : '#5b8f3e'} />
            <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.5} fill="#6fa04a" opacity="0.7" />
          </g>
        );
      })}

      {[
        { x: 150, y: 60, h: 130, s: 0.75 },
        { x: 195, y: 40, h: 150, s: 0.9 },
        { x: 250, y: 25, h: 165, s: 1 },
        { x: 300, y: 45, h: 145, s: 0.85 },
      ].map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y})`}>
          <line x1="0" y1="0" x2="0" y2={t.h} stroke="#c9cdd1" strokeWidth={4 * t.s} />
          <g transform={`translate(0 0) rotate(${i * 35})`}>
            {[0, 120, 240].map((rot) => (
              <ellipse
                key={rot}
                cx="0"
                cy={-26 * t.s}
                rx={5 * t.s}
                ry={26 * t.s}
                fill="#dfe2e5"
                transform={`rotate(${rot})`}
              />
            ))}
          </g>
          <circle r={5 * t.s} fill="#b7bcc2" />
        </g>
      ))}

      <g transform="translate(120 110)">
        <polygon points="-6,90 6,90 2,0 -2,0" fill="#8b8f93" />
        <line x1="-6" y1="70" x2="6" y2="55" stroke="#8b8f93" strokeWidth="2" />
        <line x1="-6" y1="45" x2="6" y2="30" stroke="#8b8f93" strokeWidth="2" />
        <circle cx="0" cy="-4" r="4" fill="#c96b4a" />
      </g>

      <g transform="translate(190 150)">
        <polygon points="0,90 150,90 150,30 0,30" fill="url(#wallG)" />
        <polygon points="150,90 178,74 178,14 150,30" fill="#c3bcac" />
        <polygon points="-6,32 150,32 178,16 22,16" fill="url(#roof)" />
        <g>
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => {
              const x = 6 + c * 20 - r * 2;
              const y = 20 - r * 3.4;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={17}
                  height={9}
                  fill="url(#panelG)"
                  stroke="#31404f"
                  strokeWidth="0.6"
                  transform={`skewX(-8)`}
                />
              );
            })
          )}
        </g>
        <rect x="12" y="70" width="16" height="20" rx="3" fill="#cfd3d6" />
        <rect x="34" y="70" width="16" height="20" rx="3" fill="#cfd3d6" />
        <rect x="56" y="76" width="14" height="14" rx="3" fill="#b9bdc0" />
      </g>

      {[40, 90, 340, 380, 410].map((x, i) => (
        <ellipse key={i} cx={x} cy={278 + (i % 2) * 6} rx={16} ry={12} fill="#5b8f3e" />
      ))}
    </svg>
  );
}
