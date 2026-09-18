import React from 'react';

interface CountryFlagProps {
  countryId: string;
  className?: string;
  title?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryId,
  className = 'w-14 h-9',
  title,
}) => {
  const code = (countryId || 'BH').toUpperCase();

  // Common SVG wrapper with realistic satin wave sheen & soft border
  const wrapFlag = (content: React.ReactNode, label: string) => (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.55)] transition-transform duration-300 ${className}`}
      title={title || label}
    >
      <svg
        viewBox="0 0 300 200"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
        aria-label={title || label}
      >
        <defs>
          {/* Subtle silk/fabric lighting gradient */}
          <linearGradient id="flagSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="25%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="75%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {content}
        {/* Fabric sheen overlay */}
        <rect width="300" height="200" fill="url(#flagSheen)" pointerEvents="none" />
      </svg>
    </div>
  );

  // 1. Kingdom of Bahrain (علم مملكة البحرين)
  // Red flag with white serrated band at hoist (5 points representing 5 pillars of Islam)
  if (code === 'BH') {
    return wrapFlag(
      <g>
        <rect width="300" height="200" fill="#dc2626" />
        <polygon
          points="0,0 95,0 150,20 95,40 150,60 95,80 150,100 95,120 150,140 95,160 150,180 95,200 0,200"
          fill="#ffffff"
        />
      </g>,
      'علم مملكة البحرين'
    );
  }

  // 2. Republic of Yemen (علم الجمهورية اليمنية)
  // Horizontal tricolor: Red, White, Black
  if (code === 'YE') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="300" height="66.67" fill="#dc2626" />
        <rect x="0" y="66.67" width="300" height="66.67" fill="#ffffff" />
        <rect x="0" y="133.33" width="300" height="66.67" fill="#18181b" />
      </g>,
      'علم الجمهورية اليمنية'
    );
  }

  // 3. Kingdom of Saudi Arabia (علم المملكة العربية السعودية)
  // Green field with Arabic calligraphy and white sword
  if (code === 'SA') {
    return wrapFlag(
      <g>
        <rect width="300" height="200" fill="#15803d" />
        {/* Shahada stylized Arabic calligraphy representation */}
        <path
          d="M 60,70 Q 75,55 90,70 Q 105,55 120,70 Q 140,50 160,70 Q 180,50 200,70 Q 220,55 240,70"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 70,85 Q 90,75 110,85 Q 135,70 160,85 Q 185,70 210,85 Q 225,75 235,85"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <text
          x="150"
          y="105"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="18"
          fontFamily="'Amiri', serif"
          fontWeight="bold"
        >
          لا إله إلا الله محمد رسول الله
        </text>
        {/* White Arab Scimitar Sword below Shahada */}
        <path
          d="M 235,130 L 75,130 Q 60,132 70,138 L 225,138 Q 235,136 235,130 Z"
          fill="#ffffff"
        />
        {/* Sword Hilt on right */}
        <rect x="230" y="122" width="6" height="24" rx="2" fill="#ffffff" />
        <rect x="236" y="131" width="12" height="6" rx="2" fill="#ffffff" />
        <circle cx="250" cy="134" r="3.5" fill="#ffffff" />
      </g>,
      'علم المملكة العربية السعودية'
    );
  }

  // 4. United Arab Emirates (علم دولة الإمارات العربية المتحدة)
  // Red hoist vertical stripe, green, white, black horizontal stripes
  if (code === 'AE') {
    return wrapFlag(
      <g>
        <rect x="75" y="0" width="225" height="66.67" fill="#16a34a" />
        <rect x="75" y="66.67" width="225" height="66.67" fill="#ffffff" />
        <rect x="75" y="133.33" width="225" height="66.67" fill="#18181b" />
        <rect x="0" y="0" width="75" height="200" fill="#dc2626" />
      </g>,
      'علم دولة الإمارات العربية المتحدة'
    );
  }

  // 5. State of Kuwait (علم دولة الكويت)
  // Green, white, red horizontal stripes, black trapezoid at hoist
  if (code === 'KW') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="300" height="66.67" fill="#16a34a" />
        <rect x="0" y="66.67" width="300" height="66.67" fill="#ffffff" />
        <rect x="0" y="133.33" width="300" height="66.67" fill="#dc2626" />
        <polygon points="0,0 80,66.67 80,133.33 0,200" fill="#18181b" />
      </g>,
      'علم دولة الكويت'
    );
  }

  // 6. State of Qatar (علم دولة قطر)
  // Maroon field with white serrated band at hoist (9 points)
  if (code === 'QA') {
    return wrapFlag(
      <g>
        <rect width="300" height="200" fill="#881337" />
        <polygon
          points="0,0 90,0 130,11 90,22 130,33 90,44 130,55 90,66 130,77 90,88 130,100 90,111 130,122 90,133 130,144 90,155 130,166 90,177 130,189 90,200 0,200"
          fill="#ffffff"
        />
      </g>,
      'علم دولة قطر'
    );
  }

  // 7. Sultanate of Oman (علم سلطنة عمان)
  // White, red, green horizontal stripes with red vertical hoist and white Omani emblem
  if (code === 'OM') {
    return wrapFlag(
      <g>
        <rect x="75" y="0" width="225" height="66.67" fill="#ffffff" />
        <rect x="75" y="66.67" width="225" height="66.67" fill="#dc2626" />
        <rect x="75" y="133.33" width="225" height="66.67" fill="#16a34a" />
        <rect x="0" y="0" width="75" height="200" fill="#dc2626" />
        {/* National Emblem in canton */}
        <circle cx="37" cy="33" r="14" fill="none" stroke="#ffffff" strokeWidth="2.5" />
        <line x1="26" y1="22" x2="48" y2="44" stroke="#ffffff" strokeWidth="2.5" />
        <line x1="48" y1="22" x2="26" y2="44" stroke="#ffffff" strokeWidth="2.5" />
        <rect x="33" y="20" width="8" height="26" rx="2" fill="#ffffff" />
      </g>,
      'علم سلطنة عمان'
    );
  }

  // 8. Arab Republic of Egypt (علم جمهورية مصر العربية)
  // Red, white, black horizontal stripes with Golden Eagle of Saladin
  if (code === 'EG') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="300" height="66.67" fill="#dc2626" />
        <rect x="0" y="66.67" width="300" height="66.67" fill="#ffffff" />
        <rect x="0" y="133.33" width="300" height="66.67" fill="#18181b" />
        {/* Eagle of Saladin in Center */}
        <path
          d="M 150,82 C 144,78 138,82 135,90 C 137,98 142,106 146,112 L 150,114 L 154,112 C 158,106 163,98 165,90 C 162,82 156,78 150,82 Z"
          fill="#ca8a04"
          stroke="#a16207"
          strokeWidth="1"
        />
        <rect x="146" y="94" width="8" height="12" fill="#dc2626" />
      </g>,
      'علم جمهورية مصر العربية'
    );
  }

  // 9. State of Palestine (علم دولة فلسطين)
  // Black, white, green horizontal stripes with red triangle at hoist
  if (code === 'PS') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="300" height="66.67" fill="#18181b" />
        <rect x="0" y="66.67" width="300" height="66.67" fill="#ffffff" />
        <rect x="0" y="133.33" width="300" height="66.67" fill="#16a34a" />
        <polygon points="0,0 120,100 0,200" fill="#dc2626" />
      </g>,
      'علم دولة فلسطين'
    );
  }

  // 10. Republic of Iraq (علم جمهورية العراق)
  // Red, white, black horizontal stripes with "الله أكبر" in green
  if (code === 'IQ') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="300" height="66.67" fill="#dc2626" />
        <rect x="0" y="66.67" width="300" height="66.67" fill="#ffffff" />
        <rect x="0" y="133.33" width="300" height="66.67" fill="#18181b" />
        <text
          x="150"
          y="108"
          textAnchor="middle"
          fill="#16a34a"
          fontSize="22"
          fontFamily="'Amiri', serif"
          fontWeight="bold"
        >
          الله أكبر
        </text>
      </g>,
      'علم جمهورية العراق'
    );
  }

  // 11. Hashemite Kingdom of Jordan (علم المملكة الأردنية الهاشمية)
  // Black, white, green horizontal stripes with red triangle and white 7-pointed star
  if (code === 'JO') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="300" height="66.67" fill="#18181b" />
        <rect x="0" y="66.67" width="300" height="66.67" fill="#ffffff" />
        <rect x="0" y="133.33" width="300" height="66.67" fill="#16a34a" />
        <polygon points="0,0 120,100 0,200" fill="#dc2626" />
        {/* 7-pointed star */}
        <polygon
          points="40,88 42,96 50,96 44,101 46,108 40,104 34,108 36,101 30,96 38,96"
          fill="#ffffff"
        />
      </g>,
      'علم المملكة الأردنية الهاشمية'
    );
  }

  // 12. Kingdom of Morocco (علم المملكة المغربية)
  // Red field with green pentagram star
  if (code === 'MA') {
    return wrapFlag(
      <g>
        <rect width="300" height="200" fill="#dc2626" />
        <polygon
          points="150,45 163,85 205,85 171,110 184,150 150,125 116,150 129,110 95,85 137,85"
          fill="none"
          stroke="#15803d"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </g>,
      'علم المملكة المغربية'
    );
  }

  // 13. Republic of Algeria (علم الجمهورية الجزائرية)
  // Green and white vertical halves with red crescent and star
  if (code === 'DZ') {
    return wrapFlag(
      <g>
        <rect x="0" y="0" width="150" height="200" fill="#15803d" />
        <rect x="150" y="0" width="150" height="200" fill="#ffffff" />
        {/* Red Crescent */}
        <circle cx="150" cy="100" r="45" fill="#dc2626" />
        <circle cx="160" cy="100" r="36" fill="#ffffff" />
        <path d="M 150,55 A 45,45 0 0 0 150,145 Z" fill="#15803d" clipPath="url(#algeriaCut)" />
        {/* Red Star */}
        <polygon
          points="165,85 169,97 182,97 171,104 175,116 165,109 155,116 159,104 148,97 161,97"
          fill="#dc2626"
        />
      </g>,
      'علم الجمهورية الجزائرية'
    );
  }

  // 14. Republic of Tunisia (علم الجمهورية التونسية)
  // Red field with white circle containing red crescent and star
  if (code === 'TN') {
    return wrapFlag(
      <g>
        <rect width="300" height="200" fill="#dc2626" />
        <circle cx="150" cy="100" r="50" fill="#ffffff" />
        <circle cx="150" cy="100" r="35" fill="#dc2626" />
        <circle cx="158" cy="100" r="28" fill="#ffffff" />
        <polygon
          points="160,88 163,97 173,97 165,103 168,112 160,107 152,112 155,103 147,97 157,97"
          fill="#dc2626"
        />
      </g>,
      'علم الجمهورية التونسية'
    );
  }

  // 15. Republic of Turkey (علم الجمهورية التركية)
  // Red field with white crescent and star
  if (code === 'TR') {
    return wrapFlag(
      <g>
        <rect width="300" height="200" fill="#dc2626" />
        <circle cx="120" cy="100" r="48" fill="#ffffff" />
        <circle cx="132" cy="100" r="38" fill="#dc2626" />
        <polygon
          points="180,88 183,97 193,97 185,103 188,112 180,107 172,112 175,103 167,97 177,97"
          fill="#ffffff"
        />
      </g>,
      'علم الجمهورية التركية'
    );
  }

  // Default fallback flag (Elegant Golden Border & Crescent-Star flag)
  return wrapFlag(
    <g>
      <rect width="300" height="200" fill="#0f172a" />
      <rect x="8" y="8" width="284" height="184" fill="none" stroke="#eab308" strokeWidth="4" rx="6" />
      <circle cx="150" cy="100" r="40" fill="#eab308" />
      <circle cx="160" cy="100" r="34" fill="#0f172a" />
      <polygon
        points="175,90 178,98 186,98 180,103 182,111 175,106 168,111 170,103 164,98 172,98"
        fill="#eab308"
      />
    </g>,
    'علم الدولة'
  );
};
