import React from 'react';

interface CountryEmblemProps {
  countryId: string;
  className?: string;
  title?: string;
}

export const CountryEmblem: React.FC<CountryEmblemProps> = ({
  countryId,
  className = 'w-12 h-12',
  title,
}) => {
  const code = (countryId || 'BH').toUpperCase();

  // Bahrain Official Coat of Arms (Exact match to uploaded tr.png.png)
  // Royal Crown on top with 5 golden spikes & black arches + red jewels,
  // Red shield with 5 serrated white points (chief dancetty),
  // and flowing red & white mantling acanthus leaves on both sides.
  if (code === 'BH') {
    return (
      <svg
        viewBox="0 0 400 450"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار مملكة البحرين'}
      >
        <defs>
          <filter id="bhShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.35" />
          </filter>
          <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="redMantle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        <g filter="url(#bhShadow)">
          {/* === MANTLING / SCROLLWORK (Left & Right acanthus foliage in Red and White) === */}
          {/* Left Mantling outer red foliage */}
          <path
            d="M 145,130 C 110,120 75,135 60,165 C 45,195 55,230 75,245 C 50,240 38,260 42,285 C 46,310 70,325 90,320 C 65,335 65,365 85,385 C 105,405 135,400 155,380 C 130,410 145,435 170,440 C 185,443 200,430 195,410 C 190,385 170,360 170,340 C 145,340 120,310 125,275 C 105,270 95,245 105,225 C 120,200 145,210 155,190 Z"
            fill="url(#redMantle)"
            stroke="#1c1917"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Left Mantling inner white curl highlights */}
          <path
            d="M 130,135 C 100,140 80,165 85,190 C 95,175 115,160 140,165 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 85,200 C 65,220 70,245 95,250 C 90,230 100,215 125,210 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 80,260 C 60,285 75,310 100,310 C 90,290 105,275 120,270 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 95,330 C 85,360 110,380 135,370 C 125,350 135,335 150,330 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 140,395 C 150,420 175,425 185,405 C 175,390 165,375 160,360 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Right Mantling outer red foliage (Mirrored) */}
          <path
            d="M 255,130 C 290,120 325,135 340,165 C 355,195 345,230 325,245 C 350,240 362,260 358,285 C 354,310 330,325 310,320 C 335,335 335,365 315,385 C 295,405 265,400 245,380 C 270,410 255,435 230,440 C 215,443 200,430 205,410 C 210,385 230,360 230,340 C 255,340 280,310 275,275 C 295,270 305,245 295,225 C 280,200 255,210 245,190 Z"
            fill="url(#redMantle)"
            stroke="#1c1917"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Right Mantling inner white curl highlights */}
          <path
            d="M 270,135 C 300,140 320,165 315,190 C 305,175 285,160 260,165 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 315,200 C 335,220 330,245 305,250 C 310,230 300,215 275,210 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 320,260 C 340,285 325,310 300,310 C 310,290 295,275 280,270 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 305,330 C 315,360 290,380 265,370 C 275,350 265,335 250,330 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 260,395 C 250,420 225,425 215,405 C 225,390 235,375 240,360 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* === THE SHIELD (Gules with Argent Chief Dancetty) === */}
          {/* Shield Outline & Red Base */}
          <path
            d="M 105,125 L 295,125 C 295,235 275,310 200,360 C 125,310 105,235 105,125 Z"
            fill="#dc2626"
            stroke="#1c1917"
            strokeWidth="4"
          />

          {/* Shield White Chief with 5 Serrated Downward Points */}
          <path
            d="M 105,125 L 295,125 L 295,210 L 276,170 L 257,210 L 238,170 L 219,210 L 200,170 L 181,210 L 162,170 L 143,210 L 124,170 L 105,210 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Shield Inner Highlights / Dimension */}
          <path
            d="M 112,130 L 288,130 C 288,230 270,300 200,348 C 130,300 112,230 112,130 Z"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />

          {/* === THE ROYAL CROWN OF BAHRAIN === */}
          {/* Black arched lining behind golden crown spikes */}
          <polygon
            points="145,102 165,48 178,80 200,45 222,80 235,48 255,102"
            fill="#18181b"
          />
          {/* Golden Crown Points / Spikes */}
          <polygon
            points="140,105 152,45 168,78 184,40 200,75 216,40 232,78 248,45 260,105"
            fill="url(#goldCrown)"
            stroke="#1c1917"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Crown Circlet Band Base */}
          <rect
            x="142"
            y="98"
            width="116"
            height="22"
            rx="4"
            fill="url(#goldCrown)"
            stroke="#1c1917"
            strokeWidth="3.5"
          />
          {/* Jewels / Rubies on Circlet */}
          <circle cx="155" cy="109" r="4.5" fill="#dc2626" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="178" cy="109" r="4.5" fill="#dc2626" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="200" cy="109" r="5" fill="#dc2626" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="222" cy="109" r="4.5" fill="#dc2626" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="245" cy="109" r="4.5" fill="#dc2626" stroke="#1c1917" strokeWidth="1.5" />

          {/* Pearls on crown tips */}
          <circle cx="152" cy="45" r="3.5" fill="#ffffff" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="184" cy="40" r="3.5" fill="#ffffff" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="216" cy="40" r="3.5" fill="#ffffff" stroke="#1c1917" strokeWidth="1.5" />
          <circle cx="248" cy="45" r="3.5" fill="#ffffff" stroke="#1c1917" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  // Republic of Yemen Official Coat of Arms (شعار الجمهورية اليمنية)
  // Golden Republican Eagle with spread wings,
  // Chest shield bearing historical Marib Dam and the Green Coffee Branch with red berries,
  // Flanked by two crossed Yemeni National Flags (Red, White, Black),
  // Holding a golden scroll with "الجمهورية اليمنية".
  if (code === 'YE') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار الجمهورية اليمنية'}
      >
        <defs>
          <linearGradient id="yeGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="yeWingShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        <g>
          {/* === TWO CROSSED YEMENI FLAGS ON SIDES === */}
          {/* Left Flagpole */}
          <line x1="80" y1="90" x2="230" y2="340" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" />
          <circle cx="80" cy="90" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          {/* Left Flag Drapery */}
          <path
            d="M 80,95 Q 115,115 140,95 Q 165,80 185,110 L 175,170 Q 155,140 130,155 Q 105,175 70,155 Z"
            fill="#dc2626"
            stroke="#1c1917"
            strokeWidth="1.5"
          />
          <path
            d="M 70,155 Q 105,175 130,155 Q 155,140 175,170 L 165,225 Q 145,195 120,210 Q 95,230 60,210 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="1.5"
          />
          <path
            d="M 60,210 Q 95,230 120,210 Q 145,195 165,225 L 155,270 Q 135,245 110,260 Q 85,275 50,255 Z"
            fill="#18181b"
            stroke="#1c1917"
            strokeWidth="1.5"
          />

          {/* Right Flagpole */}
          <line x1="320" y1="90" x2="170" y2="340" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" />
          <circle cx="320" cy="90" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          {/* Right Flag Drapery */}
          <path
            d="M 320,95 Q 285,115 260,95 Q 235,80 215,110 L 225,170 Q 245,140 270,155 Q 295,175 330,155 Z"
            fill="#dc2626"
            stroke="#1c1917"
            strokeWidth="1.5"
          />
          <path
            d="M 330,155 Q 295,175 270,155 Q 245,140 225,170 L 235,225 Q 255,195 280,210 Q 305,230 340,210 Z"
            fill="#ffffff"
            stroke="#1c1917"
            strokeWidth="1.5"
          />
          <path
            d="M 340,210 Q 305,230 280,210 Q 255,195 235,225 L 245,270 Q 265,245 290,260 Q 315,275 350,255 Z"
            fill="#18181b"
            stroke="#1c1917"
            strokeWidth="1.5"
          />

          {/* === GOLDEN REPUBLICAN EAGLE (العقاب الذهبي) === */}
          {/* Outer Spread Wings Left */}
          <path
            d="M 200,160 C 170,120 120,70 65,85 C 50,90 40,110 50,135 C 70,180 90,225 140,270 C 160,285 175,290 190,280 Z"
            fill="url(#yeGold)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          {/* Left Wing Feathers Layer 1 */}
          <path
            d="M 50,135 Q 80,110 110,130 Q 80,150 65,170 Q 100,150 125,170 Q 95,195 85,215 Q 120,195 140,220"
            fill="none"
            stroke="#b45309"
            strokeWidth="3"
          />
          {/* Outer Spread Wings Right */}
          <path
            d="M 200,160 C 230,120 280,70 335,85 C 350,90 360,110 350,135 C 330,180 310,225 260,270 C 240,285 225,290 210,280 Z"
            fill="url(#yeGold)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          {/* Right Wing Feathers Layer 1 */}
          <path
            d="M 350,135 Q 320,110 290,130 Q 320,150 335,170 Q 300,150 275,170 Q 305,195 315,215 Q 280,195 260,220"
            fill="none"
            stroke="#b45309"
            strokeWidth="3"
          />

          {/* Tail Feathers at bottom */}
          <path
            d="M 170,290 L 160,335 L 180,345 L 200,350 L 220,345 L 240,335 L 230,290 Z"
            fill="url(#yeWingShade)"
            stroke="#78350f"
            strokeWidth="2"
          />

          {/* Eagle Head & Neck (Looking Dexter / Right) */}
          <path
            d="M 188,140 C 185,115 190,90 205,80 C 218,70 235,72 245,82 C 242,90 238,98 232,102 C 242,100 248,105 244,112 C 235,122 220,135 212,140 Z"
            fill="url(#yeGold)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          {/* Eagle Beak */}
          <path
            d="M 235,80 Q 252,86 248,96 Q 240,94 234,92 Z"
            fill="#f59e0b"
            stroke="#78350f"
            strokeWidth="1.5"
          />
          {/* Eagle Eye */}
          <circle cx="218" cy="85" r="3.5" fill="#18181b" />
          <circle cx="219" cy="84" r="1.2" fill="#ffffff" />

          {/* === THE BREAST SHIELD (Marib Dam & Coffee Plant) === */}
          <path
            d="M 152,140 L 248,140 C 248,220 225,255 200,270 C 175,255 152,220 152,140 Z"
            fill="#f8fafc"
            stroke="#ca8a04"
            strokeWidth="4"
          />

          {/* Lower Half: Marib Dam (Masonry stone & Water) */}
          <clipPath id="shieldClip">
            <path d="M 152,140 L 248,140 C 248,220 225,255 200,270 C 175,255 152,220 152,140 Z" />
          </clipPath>
          <g clipPath="url(#shieldClip)">
            {/* Blue Water behind Dam */}
            <rect x="150" y="195" width="100" height="80" fill="#0284c7" />
            {/* Water Waves */}
            <path
              d="M 150,225 Q 175,220 200,225 Q 225,230 250,225"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="2"
            />
            {/* Ancient Marib Stone Dam Masonry */}
            <path
              d="M 152,230 L 180,215 L 220,215 L 248,230 L 248,270 L 152,270 Z"
              fill="#78716c"
              stroke="#44403c"
              strokeWidth="2"
            />
            {/* Dam Sluice / Wall Stones */}
            <line x1="175" y1="215" x2="175" y2="260" stroke="#44403c" strokeWidth="2" />
            <line x1="200" y1="215" x2="200" y2="265" stroke="#44403c" strokeWidth="2" />
            <line x1="225" y1="215" x2="225" y2="260" stroke="#44403c" strokeWidth="2" />
            <line x1="160" y1="240" x2="240" y2="240" stroke="#44403c" strokeWidth="1.5" />

            {/* Upper Half: Coffee Plant (غصن شجرة البن) */}
            {/* Central Stem */}
            <path d="M 200,210 Q 198,175 200,150" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            {/* Green Coffee Leaves */}
            <path d="M 200,165 Q 185,155 178,165 Q 190,175 200,170" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
            <path d="M 200,165 Q 215,155 222,165 Q 210,175 200,170" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
            <path d="M 200,185 Q 182,175 175,188 Q 190,195 200,190" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
            <path d="M 200,185 Q 218,175 225,188 Q 210,195 200,190" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
            {/* Red Coffee Cherries (ثمار البن الحمراء) */}
            <circle cx="196" cy="178" r="3.2" fill="#dc2626" />
            <circle cx="204" cy="178" r="3.2" fill="#dc2626" />
            <circle cx="197" cy="195" r="3.2" fill="#dc2626" />
            <circle cx="203" cy="195" r="3.2" fill="#dc2626" />
          </g>

          {/* Golden Shield Border highlight */}
          <path
            d="M 152,140 L 248,140 C 248,220 225,255 200,270 C 175,255 152,220 152,140 Z"
            fill="none"
            stroke="url(#yeGold)"
            strokeWidth="3"
          />

          {/* === TALONS & BANNER / SCROLL === */}
          {/* Talons grasping the scroll */}
          <path d="M 168,285 L 165,302 L 175,302 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <path d="M 232,285 L 235,302 L 225,302 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />

          {/* Banner Ribbon (الجمهورية اليمنية) */}
          <path
            d="M 110,310 Q 200,295 290,310 L 285,335 Q 200,320 115,335 Z"
            fill="url(#yeGold)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          {/* Banner Fold Ends */}
          <path d="M 110,310 L 95,325 L 115,335 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
          <path d="M 290,310 L 305,325 L 285,335 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />

          {/* Inscription text "الجمهورية اليمنية" */}
          <text
            x="200"
            y="323"
            textAnchor="middle"
            fontFamily="'Amiri', 'Tajawal', sans-serif"
            fontWeight="bold"
            fontSize="12.5"
            fill="#78350f"
          >
            الجمهورية اليمنية
          </text>
        </g>
      </svg>
    );
  }

  // Kingdom of Saudi Arabia Official Emblem (شعار المملكة العربية السعودية)
  // Two crossed scimitar swords beneath a lush Date Palm Tree in gold and green.
  if (code === 'SA') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار المملكة العربية السعودية'}
      >
        <defs>
          <linearGradient id="saGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="saGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>

        <g>
          {/* Palm Tree (نخلة باسقة) */}
          {/* Trunk */}
          <path
            d="M 194,115 C 190,170 186,210 184,240 L 216,240 C 214,210 210,170 206,115 Z"
            fill="url(#saGold)"
            stroke="#854d0e"
            strokeWidth="2"
          />
          {/* Trunk segments */}
          <line x1="190" y1="145" x2="210" y2="145" stroke="#854d0e" strokeWidth="2" />
          <line x1="188" y1="170" x2="212" y2="170" stroke="#854d0e" strokeWidth="2" />
          <line x1="186" y1="195" x2="214" y2="195" stroke="#854d0e" strokeWidth="2" />
          <line x1="185" y1="220" x2="215" y2="220" stroke="#854d0e" strokeWidth="2" />

          {/* Palm Fronds (جريد النخل) */}
          <path d="M 200,115 Q 160,70 120,80 Q 155,95 195,115" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <path d="M 200,115 Q 240,70 280,80 Q 245,95 205,115" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <path d="M 200,115 Q 150,90 100,115 Q 150,120 195,120" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <path d="M 200,115 Q 250,90 300,115 Q 250,120 205,120" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <path d="M 200,115 Q 160,120 115,150 Q 160,135 198,125" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <path d="M 200,115 Q 240,120 285,150 Q 240,135 202,125" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <path d="M 200,115 Q 190,55 200,45 Q 210,55 200,115" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />

          {/* Two Crossed Curved Scimitars (سيفان عربيان منحنيان متقاطعان) */}
          {/* Sword 1 (From bottom-left to top-right) */}
          <path
            d="M 100,320 Q 180,290 285,220 C 275,235 255,260 200,285 Q 150,305 100,320 Z"
            fill="#f8fafc"
            stroke="#854d0e"
            strokeWidth="2.5"
          />
          {/* Sword 1 Hilt & Guard */}
          <rect x="85" y="315" width="25" height="8" rx="2" transform="rotate(-30 95 320)" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <circle cx="85" cy="330" r="5" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />

          {/* Sword 2 (From bottom-right to top-left) */}
          <path
            d="M 300,320 Q 220,290 115,220 C 125,235 145,260 200,285 Q 250,305 300,320 Z"
            fill="#f8fafc"
            stroke="#854d0e"
            strokeWidth="2.5"
          />
          {/* Sword 2 Hilt & Guard */}
          <rect x="290" y="315" width="25" height="8" rx="2" transform="rotate(30 305 320)" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
          <circle cx="315" cy="330" r="5" fill="url(#saGold)" stroke="#854d0e" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  // United Arab Emirates Official Emblem (شعار الإمارات العربية المتحدة)
  // Falcon of Quraish with UAE flag disc surrounded by 7 stars and scroll.
  if (code === 'AE') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار دولة الإمارات العربية المتحدة'}
      >
        <defs>
          <linearGradient id="aeGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        <g>
          {/* Falcon Wings */}
          <path
            d="M 200,160 C 160,110 100,70 50,110 C 70,180 110,240 170,270 L 200,280 L 230,270 C 290,240 330,180 350,110 C 300,70 240,110 200,160 Z"
            fill="url(#aeGold)"
            stroke="#78350f"
            strokeWidth="3"
          />
          {/* Falcon Head */}
          <path
            d="M 190,130 C 185,100 195,75 210,75 C 225,75 230,95 220,115 Z"
            fill="url(#aeGold)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          <path d="M 220,85 Q 235,90 225,100 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="206" cy="85" r="3" fill="#18181b" />

          {/* Circular Disc with Flag & 7 Stars */}
          <circle cx="200" cy="195" r="50" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
          <clipPath id="aeFlagClip">
            <circle cx="200" cy="195" r="42" />
          </clipPath>
          <g clipPath="url(#aeFlagClip)">
            <rect x="150" y="150" width="30" height="90" fill="#dc2626" />
            <rect x="180" y="150" width="70" height="30" fill="#16a34a" />
            <rect x="180" y="180" width="70" height="30" fill="#ffffff" />
            <rect x="180" y="210" width="70" height="30" fill="#18181b" />
          </g>
          {/* Stars around rim */}
          <circle cx="200" cy="148" r="2.5" fill="#ca8a04" />
          <circle cx="235" cy="162" r="2.5" fill="#ca8a04" />
          <circle cx="248" cy="195" r="2.5" fill="#ca8a04" />
          <circle cx="235" cy="228" r="2.5" fill="#ca8a04" />
          <circle cx="165" cy="228" r="2.5" fill="#ca8a04" />
          <circle cx="152" cy="195" r="2.5" fill="#ca8a04" />
          <circle cx="165" cy="162" r="2.5" fill="#ca8a04" />

          {/* Banner Scroll */}
          <path d="M 120,310 Q 200,295 280,310 L 275,335 Q 200,320 125,335 Z" fill="url(#aeGold)" stroke="#78350f" strokeWidth="2" />
          <text x="200" y="322" textAnchor="middle" fontFamily="'Amiri', sans-serif" fontWeight="bold" fontSize="12" fill="#78350f">
            الإمارات العربية المتحدة
          </text>
        </g>
      </svg>
    );
  }

  // State of Kuwait Official Emblem (شعار دولة الكويت)
  // Falcon framing a circle with traditional Dhow (Boom), sea waves, and Kuwait flag shield.
  if (code === 'KW') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار دولة الكويت'}
      >
        <defs>
          <linearGradient id="kwGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        <g>
          {/* Falcon with Outstretched Wings */}
          <path
            d="M 200,140 C 150,80 90,60 50,90 C 65,160 100,240 170,275 L 200,285 L 230,275 C 300,240 335,160 350,90 C 310,60 250,80 200,140 Z"
            fill="url(#kwGold)"
            stroke="#78350f"
            strokeWidth="3"
          />
          {/* Central Blue Disc (Sea and Sky) */}
          <circle cx="200" cy="180" r="55" fill="#38bdf8" stroke="#fef08a" strokeWidth="4" />
          <clipPath id="kwDiscClip">
            <circle cx="200" cy="180" r="53" />
          </clipPath>
          <g clipPath="url(#kwDiscClip)">
            {/* White Clouds */}
            <ellipse cx="170" cy="150" rx="20" ry="8" fill="#ffffff" opacity="0.8" />
            <ellipse cx="220" cy="155" rx="25" ry="9" fill="#ffffff" opacity="0.8" />
            {/* Ocean Waves */}
            <rect x="140" y="190" width="120" height="50" fill="#0284c7" />
            <path d="M 140,195 Q 170,185 200,195 Q 230,205 260,195" fill="none" stroke="#e0f2fe" strokeWidth="2" />
            {/* Traditional Boom Sailing Ship */}
            <path d="M 175,195 L 225,195 L 215,210 L 185,210 Z" fill="#78350f" />
            {/* White Sails */}
            <polygon points="195,160 195,192 175,192" fill="#ffffff" stroke="#1c1917" strokeWidth="1" />
            <polygon points="200,150 200,192 225,192" fill="#ffffff" stroke="#1c1917" strokeWidth="1" />
          </g>

          {/* Kuwait Flag Shield on Chest */}
          <path
            d="M 180,260 L 220,260 C 220,300 200,315 200,315 C 200,315 180,300 180,260 Z"
            fill="#ffffff"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          <clipPath id="kwShieldClip">
            <path d="M 180,260 L 220,260 C 220,300 200,315 200,315 C 200,315 180,300 180,260 Z" />
          </clipPath>
          <g clipPath="url(#kwShieldClip)">
            <rect x="175" y="260" width="50" height="15" fill="#16a34a" />
            <rect x="175" y="275" width="50" height="15" fill="#ffffff" />
            <rect x="175" y="290" width="50" height="30" fill="#dc2626" />
            <polygon points="175,260 195,282 175,305" fill="#18181b" />
          </g>
        </g>
      </svg>
    );
  }

  // State of Qatar Official Emblem (شعار دولة قطر)
  // Two crossed curved swords in maroon, traditional dhow, and two palm trees on island.
  if (code === 'QA') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار دولة قطر'}
      >
        <g>
          {/* Outer Maroon Disc with Serrated Border */}
          <circle cx="200" cy="200" r="140" fill="#881337" stroke="#ffffff" strokeWidth="4" />
          {/* Inner Golden / Sand Circle */}
          <circle cx="200" cy="200" r="115" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
          {/* Ocean Waves */}
          <path d="M 90,230 Q 145,210 200,230 Q 255,250 310,230 L 310,280 L 90,280 Z" fill="#0284c7" opacity="0.3" />
          {/* Island with 2 Palm Trees */}
          <ellipse cx="160" cy="205" rx="35" ry="12" fill="#d97706" />
          {/* Palm 1 */}
          <path d="M 155,160 L 155,205" stroke="#78350f" strokeWidth="3" />
          <path d="M 155,160 Q 135,145 125,155" fill="none" stroke="#15803d" strokeWidth="3" />
          <path d="M 155,160 Q 175,145 185,155" fill="none" stroke="#15803d" strokeWidth="3" />
          {/* Dhow Boat */}
          <path d="M 215,200 L 255,200 L 248,215 L 222,215 Z" fill="#78350f" />
          <polygon points="235,165 235,198 215,198" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
          <polygon points="238,155 238,198 255,198" fill="#ffffff" stroke="#18181b" strokeWidth="1" />

          {/* Two Crossed Curved Swords in Maroon */}
          <path
            d="M 120,310 Q 190,280 280,240 C 270,255 250,275 200,295 Q 160,310 120,310 Z"
            fill="#881337"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path
            d="M 280,310 Q 210,280 120,240 C 130,255 150,275 200,295 Q 240,310 280,310 Z"
            fill="#881337"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </g>
      </svg>
    );
  }

  // Sultanate of Oman Official Emblem (شعار سلطنة عمان)
  // Iconic Omani Khanjar in scabbard over two crossed curved swords in gold.
  if (code === 'OM') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار سلطنة عمان'}
      >
        <defs>
          <linearGradient id="omGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>
        <g>
          {/* Two Crossed Swords in Sheaths */}
          <line x1="90" y1="100" x2="310" y2="320" stroke="url(#omGold)" strokeWidth="12" strokeLinecap="round" />
          <line x1="310" y1="100" x2="90" y2="320" stroke="url(#omGold)" strokeWidth="12" strokeLinecap="round" />
          {/* Sword Pommels */}
          <circle cx="90" cy="100" r="12" fill="#dc2626" stroke="url(#omGold)" strokeWidth="3" />
          <circle cx="310" cy="100" r="12" fill="#dc2626" stroke="url(#omGold)" strokeWidth="3" />

          {/* Central Khanjar in Scabbard */}
          {/* Handle / Hilt */}
          <path
            d="M 180,85 L 220,85 L 210,140 L 190,140 Z"
            fill="url(#omGold)"
            stroke="#78350f"
            strokeWidth="3"
          />
          {/* Scabbard / Sheath (Curved L-shape characteristic of Omani Khanjar) */}
          <path
            d="M 185,140 L 215,140 L 218,220 Q 220,290 270,305 L 260,325 Q 190,310 182,220 Z"
            fill="#f8fafc"
            stroke="url(#omGold)"
            strokeWidth="6"
          />
          {/* Ornate Rings and Belts */}
          <circle cx="185" cy="180" r="10" fill="none" stroke="url(#omGold)" strokeWidth="4" />
          <circle cx="215" cy="180" r="10" fill="none" stroke="url(#omGold)" strokeWidth="4" />
          <rect x="180" y="165" width="40" height="30" rx="4" fill="url(#omGold)" stroke="#78350f" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // Arab Republic of Egypt Official Emblem (شعار جمهورية مصر العربية)
  // Eagle of Saladin in gold with the Egyptian tricolor shield and banner.
  if (code === 'EG') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار جمهورية مصر العربية'}
      >
        <defs>
          <linearGradient id="egGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>
        <g>
          {/* Eagle of Saladin Body & Wings */}
          <path
            d="M 200,110 C 160,80 110,85 70,125 C 80,185 110,260 170,285 L 200,295 L 230,285 C 290,260 320,185 330,125 C 290,85 240,80 200,110 Z"
            fill="url(#egGold)"
            stroke="#78350f"
            strokeWidth="3"
          />
          {/* Eagle Head facing right */}
          <path
            d="M 195,100 C 190,75 200,55 215,55 C 230,55 235,75 225,95 Z"
            fill="url(#egGold)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          <path d="M 225,65 Q 240,70 230,80 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="212" cy="65" r="3" fill="#18181b" />

          {/* Egyptian Tricolor Shield on Chest */}
          <path
            d="M 165,150 L 235,150 C 235,230 215,260 200,270 C 185,260 165,230 165,150 Z"
            fill="#ffffff"
            stroke="url(#egGold)"
            strokeWidth="4"
          />
          <clipPath id="egShieldClip">
            <path d="M 165,150 L 235,150 C 235,230 215,260 200,270 C 185,260 165,230 165,150 Z" />
          </clipPath>
          <g clipPath="url(#egShieldClip)">
            <rect x="160" y="145" width="80" height="40" fill="#dc2626" />
            <rect x="160" y="185" width="80" height="40" fill="#ffffff" />
            <rect x="160" y="225" width="80" height="50" fill="#18181b" />
          </g>

          {/* Banner Scroll in Talons */}
          <path d="M 120,310 Q 200,295 280,310 L 275,335 Q 200,320 125,335 Z" fill="url(#egGold)" stroke="#78350f" strokeWidth="2" />
          <text x="200" y="322" textAnchor="middle" fontFamily="'Amiri', sans-serif" fontWeight="bold" fontSize="12" fill="#78350f">
            جمهورية مصر العربية
          </text>
        </g>
      </svg>
    );
  }

  // State of Palestine Official Emblem (شعار دولة فلسطين)
  if (code === 'PS') {
    return (
      <svg
        viewBox="0 0 400 400"
        className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
        aria-label={title || 'شعار دولة فلسطين'}
      >
        <defs>
          <linearGradient id="psGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>
        <g>
          {/* Eagle of Saladin */}
          <path
            d="M 200,110 C 160,80 110,85 70,125 C 80,185 110,260 170,285 L 200,295 L 230,285 C 290,260 320,185 330,125 C 290,85 240,80 200,110 Z"
            fill="url(#psGold)"
            stroke="#78350f"
            strokeWidth="3"
          />
          <path d="M 195,100 C 190,75 200,55 215,55 C 230,55 235,75 225,95 Z" fill="url(#psGold)" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="212" cy="65" r="3" fill="#18181b" />

          {/* Palestinian Flag Shield */}
          <path
            d="M 165,150 L 235,150 C 235,230 215,260 200,270 C 185,260 165,230 165,150 Z"
            fill="#ffffff"
            stroke="url(#psGold)"
            strokeWidth="4"
          />
          <clipPath id="psShieldClip">
            <path d="M 165,150 L 235,150 C 235,230 215,260 200,270 C 185,260 165,230 165,150 Z" />
          </clipPath>
          <g clipPath="url(#psShieldClip)">
            <rect x="160" y="145" width="80" height="40" fill="#18181b" />
            <rect x="160" y="185" width="80" height="40" fill="#ffffff" />
            <rect x="160" y="225" width="80" height="50" fill="#16a34a" />
            <polygon points="165,145 205,195 165,245" fill="#dc2626" />
          </g>

          <path d="M 140,310 Q 200,295 260,310 L 255,335 Q 200,320 145,335 Z" fill="url(#psGold)" stroke="#78350f" strokeWidth="2" />
          <text x="200" y="322" textAnchor="middle" fontFamily="'Amiri', sans-serif" fontWeight="bold" fontSize="14" fill="#78350f">
            فلسطين
          </text>
        </g>
      </svg>
    );
  }

  // Universal Islamic Geometric Golden Arch & Crescent Crest for any other country
  return (
    <svg
      viewBox="0 0 100 100"
      className={`object-contain select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${className}`}
      aria-label={title || 'شعار الدولة'}
    >
      <defs>
        <linearGradient id="univGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#univGold)" strokeWidth="2.5" strokeDasharray="6 3" />
      <path
        d="M50,14 C68,14 78,24 78,46 C78,72 50,86 50,86 C50,86 22,72 22,46 C22,24 32,14 50,14 Z"
        fill="#0f172a"
        stroke="url(#univGold)"
        strokeWidth="2.5"
      />
      <path
        d="M 50,25 C 60,25 66,32 66,45 C 66,62 50,72 50,72 C 50,72 34,62 34,45 C 34,32 40,25 50,25 Z"
        fill="url(#univGold)"
        opacity="0.25"
      />
      {/* 8-pointed Islamic Star */}
      <polygon points="50,30 54,42 66,42 56,50 60,62 50,54 40,62 44,50 34,42 46,42" fill="url(#univGold)" />
      <circle cx="50" cy="46" r="4" fill="#ffffff" />
    </svg>
  );
};
