import React from 'react';
import { PrayerKey } from '../types';
import { formatDigits } from '../utils/astronomicalPrayer';

export interface PrayerCardData {
  key: PrayerKey;
  name: string;
  adhanFormatted: string;
  iqamaMinutes: number;
  isPast: boolean;
  isActiveNext: boolean;
  subText?: string;
}

interface PrayerTableProps {
  prayers: PrayerCardData[];
  useArabicDigits: boolean;
  onOpenAdjustments?: () => void;
}

export const PrayerTable: React.FC<PrayerTableProps> = ({
  prayers,
  useArabicDigits,
  onOpenAdjustments,
}) => {
  return (
    <section className="w-full my-1 select-none">
      {/* Table Column Headers: الإقامة (Left) | الآذان (Center) | الصلاة (Right) */}
      <div
        onClick={onOpenAdjustments}
        className={`grid grid-cols-3 items-center text-center px-6 py-1.5 font-amiri text-lg sm:text-xl font-bold text-[#f5d79e] ${
          onOpenAdjustments ? 'cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all group' : ''
        }`}
        title={onOpenAdjustments ? 'انقر لفتح لوحة ضبط أوقات الصلاة والإقامة الموحدة' : undefined}
      >
        <span className="text-left pr-2 flex items-center gap-1.5">
          <span>الإقامة</span>
          {onOpenAdjustments && (
            <span className="text-[10px] text-amber-300/80 font-tajawal font-normal opacity-70 group-hover:opacity-100 transition-opacity">
              ⚙️ ضبط
            </span>
          )}
        </span>
        <span>الآذان</span>
        <span className="text-right pl-2">الصلاة</span>
      </div>

      {/* 5 Capsule Cards */}
      <div className="space-y-2.5 w-full">
        {prayers.map((p) => {
          const rowClasses = [
            'prayer-capsule grid grid-cols-3 items-center px-6 py-2.5 rounded-full border border-white/10 bg-black/35 backdrop-blur-md shadow-md transition-all duration-300',
            p.isActiveNext ? 'active-capsule' : '',
            p.isPast && !p.isActiveNext ? 'opacity-50' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={p.key} id={`row-${p.key.toLowerCase()}`} className={rowClasses}>
              {/* Left: Iqama */}
              <span
                id={`iqama-${p.key.toLowerCase()}`}
                className="font-numbers text-2xl font-bold text-[#f5d79e] text-left tabular-nums"
              >
                {formatDigits(`${p.iqamaMinutes}'`, useArabicDigits)}
              </span>

              {/* Center: Adhan with optional subtext */}
              <div className="flex flex-col items-center justify-center leading-none">
                <span
                  id={`adhan-${p.key.toLowerCase()}`}
                  className="font-numbers text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums"
                >
                  {formatDigits(p.adhanFormatted, useArabicDigits)}
                </span>
                {p.subText && (
                  <span
                    id={`${p.key.toLowerCase()}-sub`}
                    className="font-numbers text-[10px] text-slate-400 font-medium mt-0.5 tabular-nums"
                  >
                    {formatDigits(p.subText, useArabicDigits)}
                  </span>
                )}
              </div>

              {/* Right: Name */}
              <span
                id={`name-${p.key.toLowerCase()}`}
                className="font-amiri text-2xl font-bold text-[#f5d79e] text-right"
              >
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
