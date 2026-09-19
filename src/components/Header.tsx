import React from 'react';
import { Volume2, VolumeX, Maximize, Palette, Menu, MapPin } from 'lucide-react';
import { CountryFlag } from './CountryFlag';

interface HeaderProps {
  cityName: string;
  countryName: string;
  countryId: string;
  soundActive: boolean;
  onOpenSettings: (tab?: string) => void;
  onCycleTheme: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cityName,
  countryName,
  countryId,
  soundActive,
  onOpenSettings,
  onCycleTheme,
  onToggleSound,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full flex items-center justify-between pt-3 sm:pt-4 pb-2 mb-1 sm:mb-2 font-tajawal select-none">
      {/* Left: Menu Button & Quick Theme Palette Switcher */}
      <div className="flex items-center gap-2">
        <button
          id="btn-open-menu"
          type="button"
          onClick={() => onOpenSettings()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/25 hover:bg-black/40 border border-white/10 text-amber-200/90 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
          title="قائمة الإعدادات"
        >
          <Menu className="w-6 h-6" />
        </button>

        <button
          id="btn-quick-theme"
          type="button"
          onClick={onCycleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-black/25 hover:bg-black/40 border border-white/10 text-amber-200 text-sm shadow transition-all active:scale-90 cursor-pointer"
          title="تبديل الخلفية سريعاً (18 ثيم)"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Official Coat of Arms / National Emblem & Location Pill */}
      <div className="flex flex-col items-center justify-center py-0.5">
        <div
          onClick={() => onOpenSettings('location')}
          className="cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center"
          title="انقر لتغيير الدولة والمدينة"
        >
          {/* Official National Flag per selected Country */}
          <div className="py-0.5 relative flex items-center justify-center">
            <CountryFlag
              countryId={countryId}
              className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg shadow-md border border-white/20"
              title={countryName}
            />
          </div>

          {/* Active Location Pill Button */}
          <div
            id="btn-header-location"
            className="flex items-center gap-1.5 px-3 py-0.5 mt-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 hover:border-amber-400/50 cursor-pointer transition-all shadow-sm active:scale-95"
            title="تغيير الدولة والمدينة"
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            <span id="header-city-name" className="font-amiri font-bold text-sm sm:text-base text-[#f5d79e] leading-tight">
              {cityName}
            </span>
            <span className="text-xs text-slate-400">،</span>
            <span id="header-country-name" className="font-tajawal text-xs text-slate-300 leading-tight">
              {countryName}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Sound Toggle & Fullscreen Button */}
      <div className="flex items-center gap-1.5">
        <button
          id="btn-quick-sound"
          onClick={onToggleSound}
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 border border-white/10 text-amber-200 text-sm shadow transition-all active:scale-90 cursor-pointer"
          title={soundActive ? 'كتم صوت الأذان والإقامة' : 'تشغيل صوت الأذان والإقامة'}
        >
          {soundActive ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        <button
          id="btn-quick-fullscreen"
          onClick={onToggleFullscreen}
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 border border-white/10 text-amber-200 text-sm shadow transition-all active:scale-90 cursor-pointer"
          title="وضع ملء الشاشة"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
