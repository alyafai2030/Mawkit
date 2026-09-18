import React from 'react';
import { formatDigits } from '../utils/astronomicalPrayer';

interface ClockSectionProps {
  dayName: string;
  hijriDate: string;
  gregorianDate: string;
  timeStr: string;
  secondsStr: string;
  periodStr: string;
  useArabicDigits: boolean;
  currentVerse: string;
  onNextVerse: () => void;
  onOpenHijriSettings: () => void;
}

export const ClockSection: React.FC<ClockSectionProps> = ({
  dayName,
  hijriDate,
  gregorianDate,
  timeStr,
  secondsStr,
  periodStr,
  useArabicDigits,
  currentVerse,
  onNextVerse,
  onOpenHijriSettings,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      {/* Date Display (Hijri & Gregorian) - Tightly grouped */}
      <section className="flex flex-col items-center justify-center text-center select-none mb-0">
        {/* Line 1: Day of week + Hijri Date */}
        <div
          id="display-hijri-date"
          onClick={onOpenHijriSettings}
          className="font-amiri text-xl sm:text-2xl tracking-wide text-[#fdf2d8] font-normal drop-shadow-sm cursor-pointer hover:underline leading-snug"
          title="انقر لتعديل التاريخ الهجري"
        >
          {dayName} {formatDigits(hijriDate, useArabicDigits)}
        </div>
        {/* Line 2: Gregorian Date */}
        <div
          id="display-gregorian-date"
          className="font-amiri text-base sm:text-lg tracking-wider text-[#fae084]/90 font-normal leading-tight mt-0"
        >
          {formatDigits(gregorianDate, useArabicDigits)}
        </div>
      </section>

      {/* Digital Clock (Huge Central Time with Seconds & Period to the right) - Snug under Date */}
      <section className="flex items-center justify-center select-none -mt-1 sm:-mt-0.5 mb-1">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* Large Hours and Minutes */}
          <span
            id="clock-main-time"
            className="font-numbers text-7xl sm:text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] leading-none -mt-1 sm:-mt-0.5"
          >
            {formatDigits(timeStr, useArabicDigits)}
          </span>
          {/* Stacked Seconds and AM/PM (مساء / صباحا) */}
          <div className="flex flex-col items-start justify-center text-left pt-0.5">
            <span
              id="clock-seconds"
              className="font-numbers text-3xl sm:text-4xl font-extrabold text-white leading-none"
            >
              {formatDigits(secondsStr, useArabicDigits)}
            </span>
            {periodStr && (
              <span
                id="clock-period"
                className="font-amiri text-base sm:text-lg font-bold text-[#f5d79e] leading-tight mt-0.5"
              >
                {periodStr}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Quranic Verse (Calligraphy with Islamic Ornaments) */}
      <section
        className="flex items-center justify-center mt-1 mb-1.5 sm:my-2 text-center select-none cursor-pointer"
        id="box-quran-verse"
        onClick={onNextVerse}
        title="انقر لعرض آية أخرى"
      >
        <p
          id="quran-verse-text"
          className="font-amiri text-xl sm:text-2xl font-normal text-[#f5d79e] leading-relaxed drop-shadow-sm transition-all duration-300"
        >
          {currentVerse}
        </p>
      </section>
    </div>
  );
};
