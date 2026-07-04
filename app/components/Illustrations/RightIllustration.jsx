export default function RightIllustration() {
  return (
    <svg
      viewBox="0 0 420 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* ground line */}
      <line
        x1="10"
        y1="470"
        x2="410"
        y2="470"
        stroke="#C9D3CF"
        strokeWidth="2"
      />

      {/* bench / step for seated figure */}
      <rect x="200" y="430" width="150" height="14" rx="4" fill="#DCE3E1" />
      <rect x="216" y="444" width="14" height="26" fill="#C9D3CF" />
      <rect x="322" y="444" width="14" height="26" fill="#C9D3CF" />

      {/* --- back figure: standing, waving, curly hair, necklace --- */}
      <g transform="translate(120,110)">
        {/* hair afro */}
        <circle cx="4" cy="26" r="34" fill="#1F2A2E" />
        {/* head */}
        <circle cx="4" cy="34" r="24" fill="#8A5A3B" />
        {/* torso top */}
        <path
          d="M-26 74c2-10 16-16 30-16s26 6 28 16l6 96h-70z"
          fill="#2E6E71"
        />
        {/* necklace */}
        <path
          d="M-14 66c6 8 22 8 28 0"
          stroke="#F45D48"
          strokeWidth="3"
          fill="none"
        />
        {/* waving arm up */}
        <path
          d="M28 78c16-4 30 4 36 18s2 30-10 36"
          stroke="#2E6E71"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle cx="52" cy="112" r="12" fill="#8A5A3B" />
        {/* other arm down */}
        <path
          d="M-26 84c-12 8-18 22-16 38"
          stroke="#2E6E71"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* skirt / pants flare */}
        <path d="M-24 168l-16 84h84l-16-84z" fill="#F1EEE6" stroke="#DCE3E1" strokeWidth="2" />
        {/* legs */}
        <path d="M-4 252l-4 64" stroke="#8A5A3B" strokeWidth="14" strokeLinecap="round" />
        <path d="M16 252l6 64" stroke="#8A5A3B" strokeWidth="14" strokeLinecap="round" />
        {/* shoes */}
        <ellipse cx="-10" cy="322" rx="13" ry="6" fill="#F45D48" />
        <ellipse cx="26" cy="322" rx="13" ry="6" fill="#F45D48" />
      </g>

      {/* --- front figure: seated on step, relaxed --- */}
      <g transform="translate(230,300)">
        {/* hair bob */}
        <path
          d="M4 4c-20 0-34 14-34 32 0 8 2 14 6 20l6-4c-3-5-5-10-5-16 0-16 12-26 27-26s27 10 27 26c0 6-2 12-5 17l6 4c4-6 6-13 6-21 0-18-14-32-34-32z"
          fill="#1F2A2E"
        />
        {/* head */}
        <circle cx="0" cy="38" r="22" fill="#F0B79A" />
        {/* torso - teal top */}
        <path
          d="M-22 74c2-9 14-15 26-15s24 6 26 15l4 46h-60z"
          fill="#3C8A87"
        />
        {/* arm resting back */}
        <path
          d="M28 78c10 6 14 16 12 28"
          stroke="#3C8A87"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* arm forward on knee */}
        <path
          d="M-22 84c-10 10-12 22-6 34"
          stroke="#3C8A87"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* bent legs sitting */}
        <path
          d="M-16 118c-6 14-6 28 2 40l30 4c8-10 8-26 4-40z"
          fill="#F45D48"
        />
        {/* shins down to shoe */}
        <path d="M-14 158l-4 40" stroke="#F0B79A" strokeWidth="13" strokeLinecap="round" />
        <path d="M18 160l10 38" stroke="#F0B79A" strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="-18" cy="202" rx="12" ry="6" fill="#1F2A2E" />
        <ellipse cx="30" cy="202" rx="12" ry="6" fill="#1F2A2E" />
      </g>

      {/* small ground plant accents */}
      <g transform="translate(70,438)">
        <path d="M0 28 C -4 10 4 -4 12 -8 C 10 6 6 18 0 28Z" fill="#2E6E71" />
      </g>
      <g transform="translate(370,432)">
        <path d="M0 30 C -4 10 4 -6 14 -10 C 12 6 8 20 0 30Z" fill="#3C8A87" />
        <path d="M6 30 C 10 12 22 2 34 4 C 28 16 20 26 6 30Z" fill="#2E6E71" />
      </g>
    </svg>
  );
}
