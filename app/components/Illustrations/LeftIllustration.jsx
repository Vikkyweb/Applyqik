export default function LeftIllustration() {
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

      {/* --- back figure: standing, holding a small plant --- */}
      <g transform="translate(190,120)">
        {/* hair */}
        <path
          d="M40 40c0-24-19-40-42-40S-44 16-44 40c0 10 3 18 8 24l6-4c-3-6-5-13-5-20 0-20 15-33 35-33s35 13 35 33c0 8-2 15-6 21l6 4c5-6 7-14 7-25z"
          fill="#1F2A2E"
          opacity="0.9"
        />
        {/* head */}
        <circle cx="-2" cy="34" r="26" fill="#F0B79A" />
        {/* torso (jumpsuit) */}
        <path
          d="M-40 78c2-14 18-24 38-24s36 10 38 24l10 150h-96z"
          fill="#F1EEE6"
          stroke="#DCE3E1"
          strokeWidth="2"
        />
        {/* utility pockets */}
        <rect x="-30" y="150" width="22" height="30" rx="4" fill="#E3DCC9" />
        <rect x="6" y="150" width="22" height="30" rx="4" fill="#E3DCC9" />
        {/* arm holding plant pot */}
        <path
          d="M-40 90c-16 6-26 20-26 38v34"
          stroke="#F1EEE6"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M40 232c8-30 8-70 8-90"
          stroke="#F0B79A"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* other arm bent holding pot centrally */}
        <path
          d="M14 92c14 8 20 24 20 40v26"
          stroke="#F1EEE6"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* legs */}
        <path
          d="M-6 228l-6 82"
          stroke="#F1EEE6"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M18 228l10 82"
          stroke="#F1EEE6"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* shoes */}
        <ellipse cx="-14" cy="316" rx="14" ry="7" fill="#2E6E71" />
        <ellipse cx="30" cy="316" rx="14" ry="7" fill="#2E6E71" />
      </g>

      {/* plant pot held in front */}
      <g transform="translate(206,205)">
        <path d="M-16 34 L16 34 L11 0 L-11 0 Z" fill="#F45D48" />
        <path
          d="M-6-2c-10-14-2-30 6-36 4 14 14 20 10 34"
          fill="#2E6E71"
        />
        <path
          d="M10-2c8-12 4-26-2-32-6 12-14 18-10 30"
          fill="#3C8A87"
        />
      </g>

      {/* --- front figure: walking, arm swinging --- */}
      <g transform="translate(90,150)">
        {/* hair - long wavy */}
        <path
          d="M28 6C10-6-14-4-24 12c-8 12-8 26-2 40l24 8c-10-10-14-24-8-36 6-12 20-18 32-14 10 4 14 14 12 24l14 4c4-16-2-32-20-32z"
          fill="#B24A3E"
        />
        {/* head */}
        <circle cx="6" cy="30" r="24" fill="#F7CBAE" />
        {/* neck + top */}
        <path
          d="M-24 68c2-10 16-16 30-16s26 6 30 16l8 130h-78z"
          fill="#FFFFFF"
          stroke="#DCE3E1"
          strokeWidth="2"
        />
        {/* cropped top color block */}
        <path d="M-24 68c2-10 16-16 30-16s26 6 30 16l4 58h-70z" fill="#F45D48" />
        {/* arm forward */}
        <path
          d="M-22 80c-14 10-20 26-16 44l14 22"
          stroke="#F7CBAE"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* arm back */}
        <path
          d="M40 82c14 6 22 20 20 36"
          stroke="#FFFFFF"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* pants - wide leg teal */}
        <path
          d="M-16 196l-14 110h30l10-86 12 86h30l-10-110z"
          fill="#2E6E71"
        />
        {/* shoes */}
        <ellipse cx="0" cy="308" rx="16" ry="7" fill="#1F2A2E" />
        <ellipse cx="42" cy="308" rx="16" ry="7" fill="#1F2A2E" />
      </g>

      {/* small ground plant accents */}
      <g transform="translate(40,440)">
        <path d="M0 30 C -4 10 4 -6 14 -10 C 12 6 8 20 0 30Z" fill="#3C8A87" />
        <path d="M6 30 C 10 12 22 2 34 4 C 28 16 20 26 6 30Z" fill="#2E6E71" />
      </g>
      <g transform="translate(360,436)">
        <path d="M0 30 C -4 10 4 -6 14 -10 C 12 6 8 20 0 30Z" fill="#3C8A87" />
      </g>
    </svg>
  );
}
