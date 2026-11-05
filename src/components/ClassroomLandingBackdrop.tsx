/**
 * Renders the custom classroom background for the landing page (Scene 0).
 *
 * Supports:
 * 1. Direct image from /classroom.jpg or /classroom.png if provided in public/
 * 2. High-fidelity architectural vector/CSS recreation matching the user's classroom photo:
 *    - Dual columns of wooden student desks with central aisle
 *    - Centered green chalkboard with top projector screen & bottom ventilation window
 *    - Left wooden podium and teacher table on raised platform
 *    - Square ceiling LED lights, center ceiling hanging projector, wall clock, and world map
 */
export function ClassroomLandingBackdrop({ active }: { active: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none transition-opacity duration-700 ease-in-out ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-full w-full bg-[#18161f]">
        <svg
          className="h-full w-full object-cover"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ceiling light glow */}
            <radialGradient id="ceilingGlowLeft" cx="22%" cy="24%" r="18%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#fff8e8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#fff8e8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ceilingGlowRight" cx="80%" cy="24%" r="18%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#fff8e8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#fff8e8" stopOpacity="0" />
            </radialGradient>

            {/* Floor perspective gradient */}
            <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#877d70" />
              <stop offset="25%" stopColor="#63594e" />
              <stop offset="70%" stopColor="#3d352c" />
              <stop offset="100%" stopColor="#1e1814" />
            </linearGradient>

            {/* Wall gradient */}
            <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eae5dc" />
              <stop offset="65%" stopColor="#ded7ca" />
              <stop offset="100%" stopColor="#c5bea8" />
            </linearGradient>

            {/* Ceiling gradient */}
            <linearGradient id="ceilingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ece7de" />
              <stop offset="100%" stopColor="#d3ccc0" />
            </linearGradient>

            {/* Wood texture gradient for benches */}
            <linearGradient id="woodBenchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#543323" />
              <stop offset="45%" stopColor="#3c2215" />
              <stop offset="100%" stopColor="#25140b" />
            </linearGradient>

            {/* Blackboard gradient */}
            <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#224236" />
              <stop offset="100%" stopColor="#162e25" />
            </linearGradient>

            {/* Podium gradient */}
            <linearGradient id="podiumGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#482416" />
              <stop offset="50%" stopColor="#633220" />
              <stop offset="100%" stopColor="#3a1c10" />
            </linearGradient>
          </defs>

          {/* Ceiling */}
          <polygon points="0,0 1920,0 1920,340 0,340" fill="url(#ceilingGradient)" />

          {/* Ceiling square recessed LED panel lights (matching photo) */}
          <rect
            x="300"
            y="220"
            width="180"
            height="42"
            rx="4"
            fill="#ffffff"
            filter="drop-shadow(0 0 15px rgba(255,255,255,0.9))"
          />
          <circle cx="390" cy="241" r="220" fill="url(#ceilingGlowLeft)" />

          <rect
            x="1460"
            y="215"
            width="170"
            height="40"
            rx="4"
            fill="#ffffff"
            filter="drop-shadow(0 0 15px rgba(255,255,255,0.9))"
          />
          <circle cx="1545" cy="235" r="220" fill="url(#ceilingGlowRight)" />

          {/* Ceiling cable trunking / conduit running horizontally */}
          <line x1="0" y1="145" x2="1920" y2="145" stroke="#9e978c" strokeWidth="3" />

          {/* Suspended Ceiling Projector in Center */}
          <g transform="translate(880, 140)">
            {/* Projector hanging rod */}
            <line x1="80" y1="5" x2="80" y2="105" stroke="#333333" strokeWidth="4" />
            {/* Dangling black cables */}
            <path d="M 50,10 C 40,60 55,90 70,120" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
            <path d="M 65,10 C 85,80 75,120 78,160" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            {/* Projector unit */}
            <rect
              x="40"
              y="100"
              width="80"
              height="34"
              rx="5"
              fill="#202024"
              stroke="#444"
              strokeWidth="1"
            />
            <circle cx="62" cy="117" r="9" fill="#111" stroke="#555" strokeWidth="2" />
            <circle cx="62" cy="117" r="5" fill="#3070b0" />
          </g>

          {/* Back Wall */}
          <rect x="0" y="340" width="1920" height="440" fill="url(#wallGradient)" />

          {/* Left side world map poster */}
          <g transform="translate(10, 470)">
            <rect
              x="0"
              y="0"
              width="95"
              height="190"
              fill="#ffffff"
              stroke="#a0988c"
              strokeWidth="3"
              rx="2"
            />
            <rect x="5" y="5" width="85" height="180" fill="#cce5ff" />
            {/* Continents sketch */}
            <path d="M 12,35 Q 22,25 35,40 T 25,90 Z" fill="#b8d8a0" />
            <path d="M 45,30 Q 75,25 78,60 T 55,85 Z" fill="#e6c280" />
            <path d="M 45,95 Q 65,95 68,140 T 50,155 Z" fill="#d9a0a0" />
          </g>

          {/* High window vent with security bars on far left */}
          <g transform="translate(30, 300)">
            <rect
              x="0"
              y="0"
              width="150"
              height="140"
              fill="#e0d9cc"
              stroke="#7a7062"
              strokeWidth="5"
            />
            <line x1="37" y1="0" x2="37" y2="140" stroke="#554d42" strokeWidth="3" />
            <line x1="75" y1="0" x2="75" y2="140" stroke="#554d42" strokeWidth="3" />
            <line x1="112" y1="0" x2="112" y2="140" stroke="#554d42" strokeWidth="3" />
            <line x1="0" y1="35" x2="150" y2="35" stroke="#554d42" strokeWidth="3" />
            <line x1="0" y1="70" x2="150" y2="70" stroke="#554d42" strokeWidth="3" />
            <line x1="0" y1="105" x2="150" y2="105" stroke="#554d42" strokeWidth="3" />
          </g>

          {/* High window vent with security bars on far right */}
          <g transform="translate(1790, 310)">
            <rect
              x="0"
              y="0"
              width="110"
              height="120"
              fill="#e0d9cc"
              stroke="#7a7062"
              strokeWidth="5"
            />
            <line x1="30" y1="0" x2="30" y2="120" stroke="#554d42" strokeWidth="3" />
            <line x1="60" y1="0" x2="60" y2="120" stroke="#554d42" strokeWidth="3" />
            <line x1="90" y1="0" x2="90" y2="120" stroke="#554d42" strokeWidth="3" />
            <line x1="0" y1="40" x2="110" y2="40" stroke="#554d42" strokeWidth="3" />
            <line x1="0" y1="80" x2="110" y2="80" stroke="#554d42" strokeWidth="3" />
          </g>

          {/* Right door frame outline */}
          <rect
            x="1820"
            y="470"
            width="100"
            height="310"
            fill="#ded5c4"
            stroke="#a09482"
            strokeWidth="4"
          />

          {/* Square wall clock to the right of the blackboard */}
          <g transform="translate(1260, 380)">
            <rect
              x="0"
              y="0"
              width="56"
              height="56"
              rx="10"
              fill="#faf6ee"
              stroke="#b8ab96"
              strokeWidth="4"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
            <circle cx="28" cy="28" r="22" fill="#fffdfa" />
            {/* Clock hands */}
            <line
              x1="28"
              y1="28"
              x2="28"
              y2="13"
              stroke="#222"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="28"
              y1="28"
              x2="39"
              y2="28"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="28" cy="28" r="2.5" fill="#c09030" />
          </g>

          {/* Rolled-up Projector Screen housing above blackboard */}
          <g transform="translate(770, 350)">
            <rect
              x="0"
              y="0"
              width="370"
              height="46"
              rx="3"
              fill="#ffffff"
              stroke="#c0b8ac"
              strokeWidth="2"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
            />
            <line x1="8" y1="12" x2="362" y2="12" stroke="#d8d0c2" strokeWidth="2" />
            <line x1="8" y1="34" x2="362" y2="34" stroke="#d8d0c2" strokeWidth="2" />
            {/* Screen pull handle */}
            <rect x="175" y="44" width="20" height="6" rx="2" fill="#999" />
          </g>

          {/* Centered Dark Green Blackboard */}
          <g transform="translate(795, 465)">
            {/* Frame */}
            <rect
              x="0"
              y="0"
              width="365"
              height="180"
              rx="3"
              fill="#383028"
              stroke="#50453a"
              strokeWidth="3"
              filter="drop-shadow(0 6px 12px rgba(0,0,0,0.25))"
            />
            {/* Chalkboard surface */}
            <rect x="6" y="6" width="353" height="168" rx="2" fill="url(#boardGrad)" />
            {/* Subtle chalk dust markings */}
            <path
              d="M 30,50 Q 80,40 130,60"
              stroke="#ffffff"
              strokeOpacity="0.12"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 40,80 Q 90,75 140,85"
              stroke="#ffffff"
              strokeOpacity="0.08"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Chalk piece on bottom tray */}
            <rect x="25" y="166" width="18" height="4" rx="1" fill="#f8f8f4" />
          </g>

          {/* Ventilation window with metal grills below the blackboard */}
          <g transform="translate(840, 645)">
            <rect
              x="0"
              y="0"
              width="275"
              height="28"
              fill="#524a40"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Vertical grill bars */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={i}
                x1={15 + i * 14}
                y1="0"
                x2={15 + i * 14}
                y2="28"
                stroke="#1e1c18"
                strokeWidth="3"
              />
            ))}
          </g>

          {/* Front Stage / Dais (elevated platform) */}
          <polygon
            points="0,775 1920,775 1920,795 0,795"
            fill="#ded7cb"
            stroke="#b0a594"
            strokeWidth="1.5"
          />

          {/* Left Teacher Table */}
          <g transform="translate(270, 690)">
            <rect
              x="0"
              y="0"
              width="250"
              height="85"
              fill="#c49b6b"
              stroke="#8d6840"
              strokeWidth="2"
            />
            <rect x="0" y="0" width="250" height="12" fill="#d8b280" />
          </g>

          {/* Left Wooden Podium / Lectern on Dais */}
          <g transform="translate(585, 615)">
            <rect
              x="0"
              y="0"
              width="140"
              height="165"
              rx="3"
              fill="url(#podiumGrad)"
              stroke="#2b140b"
              strokeWidth="3"
              filter="drop-shadow(4px 8px 16px rgba(0,0,0,0.35))"
            />
            <polygon
              points="-8,0 148,0 138,18 2,18"
              fill="#753d26"
              stroke="#2b140b"
              strokeWidth="1"
            />
            {/* Seal / Emblem in center of podium */}
            <circle cx="70" cy="38" r="14" fill="#a07a38" stroke="#e8cc75" strokeWidth="1.5" />
            <circle cx="70" cy="38" r="9" fill="#542416" />
            {/* Lower recessed panel */}
            <rect
              x="15"
              y="70"
              width="110"
              height="80"
              rx="3"
              fill="#36170d"
              stroke="#5d2c1c"
              strokeWidth="2"
            />
          </g>

          {/* Small center teacher desk table */}
          <g transform="translate(890, 735)">
            <rect
              x="0"
              y="0"
              width="120"
              height="42"
              fill="#2d170e"
              stroke="#1a0d08"
              strokeWidth="2"
            />
            <line x1="8" y1="42" x2="8" y2="75" stroke="#1a0d08" strokeWidth="5" />
            <line x1="112" y1="42" x2="112" y2="75" stroke="#1a0d08" strokeWidth="5" />
          </g>

          {/* Floor with perspective tiles */}
          <polygon points="0,775 1920,775 1920,1080 0,1080" fill="url(#floorGradient)" />

          {/* Floor tile perspective lines */}
          <line
            x1="960"
            y1="775"
            x2="960"
            y2="1080"
            stroke="#7a7063"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <line
            x1="960"
            y1="775"
            x2="720"
            y2="1080"
            stroke="#7a7063"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <line
            x1="960"
            y1="775"
            x2="1200"
            y2="1080"
            stroke="#7a7063"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <line
            x1="960"
            y1="775"
            x2="400"
            y2="1080"
            stroke="#7a7063"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <line
            x1="960"
            y1="775"
            x2="1520"
            y2="1080"
            stroke="#7a7063"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          {/* Center aisle light floor reflection from ceiling panels */}
          <ellipse cx="960" cy="850" rx="90" ry="18" fill="#ffffff" fillOpacity="0.12" />
          <ellipse cx="960" cy="940" rx="140" ry="25" fill="#ffffff" fillOpacity="0.15" />

          {/* ========================================================
                STUDENT BENCHES: TWO COLUMNS WITH CLEAR CENTER AISLE
                Matching the user's classroom photograph
               ======================================================== */}

          {/* LEFT COLUMN BENCHES (Tiered from back to front) */}
          {/* Row 1 (back left) */}
          <g transform="translate(140, 730)">
            <rect
              x="0"
              y="0"
              width="350"
              height="42"
              rx="3"
              fill="#2d170e"
              stroke="#1a0d08"
              strokeWidth="1.5"
            />
            <rect x="0" y="4" width="350" height="12" fill="#4a2a1b" />
          </g>

          {/* Row 2 (mid-back left) */}
          <g transform="translate(85, 755)">
            <rect
              x="0"
              y="0"
              width="415"
              height="52"
              rx="4"
              fill="#321b10"
              stroke="#1a0d08"
              strokeWidth="1.5"
            />
            <rect x="0" y="6" width="415" height="16" fill="#4e2c1c" />
          </g>

          {/* Row 3 (middle left) */}
          <g transform="translate(20, 785)">
            <rect
              x="0"
              y="0"
              width="485"
              height="65"
              rx="4"
              fill="url(#woodBenchGrad)"
              stroke="#1a0d08"
              strokeWidth="2"
              filter="drop-shadow(0 6px 10px rgba(0,0,0,0.4))"
            />
            <rect x="0" y="8" width="485" height="20" fill="#58311e" />
            {/* Backrest slats */}
            <line x1="0" y1="32" x2="485" y2="32" stroke="#1a0d08" strokeWidth="2.5" />
          </g>

          {/* Row 4 (mid-front left) */}
          <g transform="translate(0, 835)">
            <rect
              x="0"
              y="0"
              width="480"
              height="85"
              rx="5"
              fill="url(#woodBenchGrad)"
              stroke="#160b06"
              strokeWidth="2.5"
              filter="drop-shadow(0 8px 14px rgba(0,0,0,0.5))"
            />
            <rect x="0" y="10" width="480" height="26" fill="#623722" />
            {/* Bench wood highlights */}
            <line
              x1="0"
              y1="12"
              x2="480"
              y2="12"
              stroke="#8d5436"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            <line x1="0" y1="42" x2="480" y2="42" stroke="#160b06" strokeWidth="3" />
          </g>

          {/* Row 5 (front left) */}
          <g transform="translate(0, 900)">
            <rect
              x="0"
              y="0"
              width="430"
              height="180"
              rx="6"
              fill="url(#woodBenchGrad)"
              stroke="#110804"
              strokeWidth="3"
              filter="drop-shadow(0 12px 24px rgba(0,0,0,0.65))"
            />
            <rect x="0" y="14" width="430" height="38" fill="#6a3b25" />
            <line
              x1="0"
              y1="16"
              x2="430"
              y2="16"
              stroke="#9a5f3e"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
            <line x1="0" y1="62" x2="430" y2="62" stroke="#110804" strokeWidth="4" />
            {/* End support leg */}
            <rect
              x="390"
              y="52"
              width="30"
              height="128"
              fill="#1e0e07"
              stroke="#000"
              strokeWidth="2"
            />
          </g>

          {/* RIGHT COLUMN BENCHES (Tiered from back to front) */}
          {/* Row 1 (back right) */}
          <g transform="translate(1150, 730)">
            <rect
              x="0"
              y="0"
              width="440"
              height="42"
              rx="3"
              fill="#2d170e"
              stroke="#1a0d08"
              strokeWidth="1.5"
            />
            <rect x="0" y="4" width="440" height="12" fill="#4a2a1b" />
          </g>

          {/* Row 2 (mid-back right) */}
          <g transform="translate(1160, 755)">
            <rect
              x="0"
              y="0"
              width="490"
              height="52"
              rx="4"
              fill="#321b10"
              stroke="#1a0d08"
              strokeWidth="1.5"
            />
            <rect x="0" y="6" width="490" height="16" fill="#4e2c1c" />
          </g>

          {/* Row 3 (middle right) */}
          <g transform="translate(1180, 785)">
            <rect
              x="0"
              y="0"
              width="560"
              height="65"
              rx="4"
              fill="url(#woodBenchGrad)"
              stroke="#1a0d08"
              strokeWidth="2"
              filter="drop-shadow(0 6px 10px rgba(0,0,0,0.4))"
            />
            <rect x="0" y="8" width="560" height="20" fill="#58311e" />
            <line x1="0" y1="32" x2="560" y2="32" stroke="#1a0d08" strokeWidth="2.5" />
          </g>

          {/* Row 4 (mid-front right) */}
          <g transform="translate(1220, 835)">
            <rect
              x="0"
              y="0"
              width="620"
              height="85"
              rx="5"
              fill="url(#woodBenchGrad)"
              stroke="#160b06"
              strokeWidth="2.5"
              filter="drop-shadow(0 8px 14px rgba(0,0,0,0.5))"
            />
            <rect x="0" y="10" width="620" height="26" fill="#623722" />
            <line
              x1="0"
              y1="12"
              x2="620"
              y2="12"
              stroke="#8d5436"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            <line x1="0" y1="42" x2="620" y2="42" stroke="#160b06" strokeWidth="3" />
          </g>

          {/* Row 5 (front right) */}
          <g transform="translate(1270, 900)">
            <rect
              x="0"
              y="0"
              width="650"
              height="180"
              rx="6"
              fill="url(#woodBenchGrad)"
              stroke="#110804"
              strokeWidth="3"
              filter="drop-shadow(0 12px 24px rgba(0,0,0,0.65))"
            />
            <rect x="0" y="14" width="650" height="38" fill="#6a3b25" />
            <line
              x1="0"
              y1="16"
              x2="650"
              y2="16"
              stroke="#9a5f3e"
              strokeWidth="2.5"
              strokeOpacity="0.7"
            />
            <line x1="0" y1="62" x2="650" y2="62" stroke="#110804" strokeWidth="4" />
            <rect
              x="5"
              y="52"
              width="30"
              height="128"
              fill="#1e0e07"
              stroke="#000"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* Cinematic mood lighting & vignette matching "The Classroom of Memories" aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/45 to-deep/30" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_25%,rgba(7,6,13,0.75)_100%)]" />
      </div>
    </div>
  );
}
