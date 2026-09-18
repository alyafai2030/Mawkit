import React from 'react';

interface BlackScreenOverlayProps {
  isOpen: boolean;
  prayerName: string;
  onDismiss: () => void;
}

export const BlackScreenOverlay: React.FC<BlackScreenOverlayProps> = ({
  isOpen,
  prayerName,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="overlay-blackscreen"
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-center p-6 cursor-pointer select-none"
      onClick={onDismiss}
    >
      <div className="space-y-6 max-w-lg">
        <div className="text-7xl sm:text-8xl animate-pulse">📵</div>
        <h2 className="text-2xl sm:text-3xl font-bold font-tajawal text-rose-400">
          الرجاء إغلاق الهواتف أو وضعها على الصامت
        </h2>
        <p className="text-2xl sm:text-3xl font-amiri text-amber-200 font-semibold">
          « اسْتَوُوا وَاعْتَدِلُوا، يَرْحَمُكُمُ اللهُ »
        </p>
        <p id="blackscreen-subtext" className="text-sm text-slate-400 font-tajawal">
          صلاة {prayerName} قائمة الآن - انقر في أي مكان لإلغاء الشاشة
        </p>
      </div>
    </div>
  );
};
