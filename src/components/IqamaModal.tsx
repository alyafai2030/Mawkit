import React from 'react';
import { formatDigits } from '../utils/astronomicalPrayer';

interface IqamaModalProps {
  isOpen: boolean;
  prayerName: string;
  remainingMinutes: number;
  remainingSeconds: number;
  progressPercent: number;
  useArabicDigits: boolean;
  isAudioPlaying: boolean;
  onDismiss: () => void;
  onStopAudio: () => void;
}

export const IqamaModal: React.FC<IqamaModalProps> = ({
  isOpen,
  prayerName,
  remainingMinutes,
  remainingSeconds,
  progressPercent,
  useArabicDigits,
  isAudioPlaying,
  onDismiss,
  onStopAudio,
}) => {
  if (!isOpen) return null;

  const timeStr = `${('0' + remainingMinutes).slice(-2)}:${('0' + remainingSeconds).slice(-2)}`;

  return (
    <div
      id="overlay-iqama"
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border-2 border-[#f5d79e] bg-gradient-to-b from-stone-900/95 to-black/98 shadow-[0_10px_40px_rgba(0,0,0,0.85)] font-tajawal">
        {/* Close 'X' Button at top left */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="إغلاق الشاشة"
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-all cursor-pointer text-base"
        >
          ✕
        </button>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-2xl mb-2 text-amber-300">
          ⏱️
        </div>

        <h2 id="iqama-modal-prayer" className="text-2xl sm:text-3xl font-amiri font-bold text-[#f5d79e] mb-1.5">
          حان الآن موعد أذان {prayerName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-tajawal mb-5">
          « الدُّعَاءُ بَيْنَ الأَذَانِ وَالإِقَامَةِ لَا يُرَدُّ »
        </p>

        <div className="my-4 p-4 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
          <span className="text-xs sm:text-sm text-amber-300 block mb-1 font-tajawal font-medium">
            الوقت المتبقي حتى إقامة الصلاة
          </span>
          <div
            id="iqama-countdown-display"
            className="text-5xl sm:text-7xl font-extrabold font-numbers text-white tracking-widest tabular-nums drop-shadow-md"
          >
            {formatDigits(timeStr, useArabicDigits)}
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/15 mt-3.5">
            <div
              id="iqama-progress-bar"
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-1000"
              style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-98 text-amber-200 border border-amber-400/40 text-sm font-tajawal font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow"
        >
          <span>✕</span>
          <span>الرجوع للشاشة الرئيسية (إغلاق الشاشة)</span>
        </button>

        {isAudioPlaying && (
          <button
            id="btn-stop-audio-iqama"
            type="button"
            onClick={onStopAudio}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-slate-300 hover:text-white border border-white/15 text-xs font-tajawal cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <span>⏹️</span>
            <span>إيقاف صوت الأذان / الإقامة</span>
          </button>
        )}
      </div>
    </div>
  );
};
