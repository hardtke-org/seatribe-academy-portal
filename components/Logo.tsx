interface LogoProps {
  size?: number;
  color?: string;
}

export default function Logo({ size = 56, color = "#417970" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SeaTribe Skipper Academy"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="47" stroke={color} strokeWidth="4" fill="white" />

      {/* Top arc text: SEATRIBE */}
      <defs>
        <path id="topArc" d="M 10,50 A 40,40 0 0,1 90,50" />
        <path id="bottomArc" d="M 15,58 A 38,38 0 0,0 85,58" />
      </defs>
      <text
        fontSize="11"
        fontFamily="'Open Sans', sans-serif"
        fontWeight="700"
        fill={color}
        letterSpacing="3"
      >
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          SEATRIBE
        </textPath>
      </text>

      {/* Bottom arc text: SKIPPER ACADEMY */}
      <text
        fontSize="8"
        fontFamily="'Open Sans', sans-serif"
        fontWeight="600"
        fill={color}
        letterSpacing="1.5"
      >
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          SKIPPER ACADEMY
        </textPath>
      </text>

      {/* Anchor icon in center */}
      <g transform="translate(50, 46) scale(0.85)">
        {/* Anchor ring */}
        <circle cx="0" cy="-14" r="5" stroke={color} strokeWidth="2.5" fill="none" />
        {/* Anchor vertical bar */}
        <line x1="0" y1="-9" x2="0" y2="14" stroke={color} strokeWidth="2.5" />
        {/* Anchor horizontal bar */}
        <line x1="-10" y1="-5" x2="10" y2="-5" stroke={color} strokeWidth="2.5" />
        {/* Anchor left arm */}
        <path d="M -10,14 Q -18,14 -18,8" stroke={color} strokeWidth="2.5" fill="none" />
        {/* Anchor right arm */}
        <path d="M 10,14 Q 18,14 18,8" stroke={color} strokeWidth="2.5" fill="none" />
        {/* Anchor left curve end */}
        <path d="M -18,8 A 10,10 0 0,1 -8,2" stroke={color} strokeWidth="2.5" fill="none" />
        {/* Anchor right curve end */}
        <path d="M 18,8 A 10,10 0 0,0 8,2" stroke={color} strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  );
}
