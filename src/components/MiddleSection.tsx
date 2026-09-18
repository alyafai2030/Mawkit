import React from 'react';
import { formatDigits } from '../utils/astronomicalPrayer';

interface MiddleSectionProps {
  countdownTime: string;
  countdownLabel: string;
  sunriseTime: string;
  duhaTime: string;
  useArabicDigits: boolean;
  onCountdownClick: () => void;
}

export const MiddleSection: React.FC<MiddleSectionProps> = ({
  countdownTime,
  countdownLabel,
  sunriseTime,
  duhaTime,
  useArabicDigits,
  onCountdownClick,
}) => {
  return (
    <section className="grid grid-cols-3 items-center justify-between my-2 select-none px-2 font-tajawal">
      {/* Left: Next Prayer Countdown */}
      <div
        id="box-countdown-area"
        onClick={onCountdownClick}
        className="flex flex-col items-center justify-center text-center select-none cursor-pointer"
        title="انقر لعرض شاشة الإقامة أثناء الأذان"
      >
        <span
          id="countdown-time"
          className="font-numbers text-3xl sm:text-4xl font-extrabold text-white tracking-wider tabular-nums"
        >
          {formatDigits(countdownTime, useArabicDigits)}
        </span>
        <span
          id="countdown-label"
          className="font-amiri text-base sm:text-lg font-bold text-[#f5d79e] mt-0.5"
        >
          {countdownLabel}
        </span>
      </div>

      {/* Center: 3D Metallic Silver Crescent & Mosque */}
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <defs>
              {/* Silver 3D Gradient for Crescent */}
              <linearGradient id="crescentSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#d1d5db" />
                <stop offset="70%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              {/* Silver Shadow for Mosque */}
              <linearGradient id="mosqueSilver" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#374151" />
              </linearGradient>
            </defs>

            {/* Outer Crescent Moon */}
            <path
              d="M52,10 C28,10 12,30 12,54 C12,78 30,94 54,94 C68,94 80,86 86,76 C60,86 32,70 32,48 C32,28 44,14 62,12 C58,10 55,10 52,10 Z"
              fill="url(#crescentSilver)"
            />

            {/* Mosque Dome nestled inside */}
            <path d="M42,66 C42,48 54,42 58,36 C62,42 74,48 74,66 Z" fill="url(#mosqueSilver)" />
            <rect x="42" y="66" width="32" height="12" fill="url(#mosqueSilver)" />
            {/* Dome Crescent Finial */}
            <circle cx="58" cy="32" r="2.5" fill="#f3f4f6" />
            <path d="M58,34 L58,36" stroke="#f3f4f6" strokeWidth="1" />

            {/* Minaret to the right */}
            <rect x="76" y="38" width="6" height="40" fill="url(#mosqueSilver)" />
            {/* Minaret Balcony */}
            <rect x="74" y="48" width="10" height="3" rx="1" fill="#d1d5db" />
            {/* Minaret Cone Cap */}
            <polygon points="76,38 82,38 79,28" fill="url(#crescentSilver)" />
            {/* Minaret Finial */}
            <circle cx="79" cy="26" r="1.5" fill="#f3f4f6" />

            {/* Arched Doorway in base */}
            <path d="M54,78 C54,72 58,70 60,70 C62,70 66,72 66,78 Z" fill="#1f2937" />
          </svg>
        </div>
      </div>

      {/* Right: Sunrise & Duha */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1 font-amiri text-xl sm:text-2xl font-bold text-[#f5d79e]">
          <span>الشروق</span>
          <span id="time-sunrise" className="font-numbers text-white font-extrabold ml-1">
            {formatDigits(sunriseTime, useArabicDigits)}
          </span>
        </div>
        <span
          id="time-duha"
          className="font-numbers text-xs sm:text-sm font-semibold text-slate-300/90 mt-0.5"
        >
          {formatDigits(duhaTime, useArabicDigits)}
        </span>
      </div>
    </section>
  );
};
