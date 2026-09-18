import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppSettings,
  PrayerKey,
  PrayerTimes,
} from './types';
import {
  calculateAstronomicalTimes,
  getHijriDate,
  timeToSeconds,
  formatTimeDisplay,
  pad,
  WORLD_COUNTRIES,
} from './utils/astronomicalPrayer';
import { THEMES, ARABESQUE_DATA_URI } from './data/themes';
import { MANAMA_AWQAF_DATA } from './data/manamaAwqafData';
import { audioEngine } from './utils/audioEngine';
import { Header } from './components/Header';
import { ClockSection } from './components/ClockSection';
import { MiddleSection } from './components/MiddleSection';
import { PrayerTable, PrayerCardData } from './components/PrayerTable';
import { IqamaModal } from './components/IqamaModal';
import { BlackScreenOverlay } from './components/BlackScreenOverlay';
import { SettingsModal } from './components/SettingsModal';
import { SingleHtmlModal } from './components/SingleHtmlModal';
import { STANDALONE_HTML_CODE } from './data/standaloneHtmlCode';

const STORAGE_KEY = 'PRAYER_TIMES_APP_SETTINGS_V2';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 0,
  is12h: true,
  dimPastPrayers: true,
  arabicDigits: false,
  countdownActive: true,
  soundActive: true,
  rotateVerses: true,
  blackScreenEnabled: true,
  hijriOffset: 0,
  country: 'BH',
  city: 'المنامة',
  calcMethod: 'auto',
  asrJuristic: 'shafi',
  adhanVoice: 'adhan_daghreeri',
  iqamaVoice: 'iqama_makkah',
  audioVolume: 1.0,
  adhanFajrSpecial: true,
  offsets: { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 },
  iqama: { Fajr: 20, Dhuhr: 20, Asr: 25, Maghrib: 10, Isha: 20 },
};

const VERSES = [
  '﴿ أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ ﴾',
  '﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا ﴾',
  '﴿ وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ ﴾',
  '﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾',
  '﴿ وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ﴾',
  '﴿ حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ ﴾',
  '﴿ قَدْ أَفْلَحَ الْمُؤْمِنُونَ • الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ ﴾',
];

export default function App() {
  // Safe load settings from LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          offsets: { ...DEFAULT_SETTINGS.offsets, ...(parsed.offsets || {}) },
          iqama: { ...DEFAULT_SETTINGS.iqama, ...(parsed.iqama || {}) },
        };
      }
    } catch (e) {
      console.warn('Failed to load stored settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Save to LocalStorage on changes
  const updateSettings = useCallback((newPartial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });
  }, []);

  // Time and Tick State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [verseIndex, setVerseIndex] = useState(0);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSingleHtmlOpen, setIsSingleHtmlOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('location');
  const [isIqamaModalOpen, setIsIqamaModalOpen] = useState(false);
  const [isBlackScreenOpen, setIsBlackScreenOpen] = useState(false);
  const [activePrayerForModal, setActivePrayerForModal] = useState<string>('الظهر');
  const [userDismissedPrayerKey, setUserDismissedPrayerKey] = useState<string | null>(null);

  // Test states
  const [isTestingIqama, setIsTestingIqama] = useState(false);
  const [testRemainingSec, setTestRemainingSec] = useState(60);
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound triggering refs
  const lastTriggeredAdhanKeyRef = useRef<string | null>(null);
  const lastTriggeredDateRef = useRef<string>('');

  // 1. Compute Prayer Times for Current Date & Location
  const getTimesForDate = useCallback(
    (date: Date): PrayerTimes => {
      const countryObj =
        WORLD_COUNTRIES.find((c) => c.id === settings.country) || WORLD_COUNTRIES[0];
      const cityObj =
        countryObj.cities.find((city) => city.name === settings.city) || countryObj.cities[0];

      // Official Manama Awqaf priority
      if (settings.country === 'BH' && (!settings.city || settings.city === 'المنامة')) {
        const mm = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const key = `${mm}-${dd}`;
        const raw = MANAMA_AWQAF_DATA[key] || '04:06|05:23|11:34|15:00|17:41|18:57';
        const [fajr, sunrise, dhuhr, asr, maghrib, isha] = raw.split('|');

        const tomorrow = new Date(date.getTime() + 86400000);
        const tkey = `${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
        const traw = MANAMA_AWQAF_DATA[tkey] || raw;
        const tomorrowFajr = traw.split('|')[0];

        // Duha calculation (approx 15 min after sunrise)
        const sunriseSec = timeToSeconds(sunrise);
        const duhaSec = sunriseSec + 15 * 60;
        const duha = `${pad(Math.floor(duhaSec / 3600))}:${pad(Math.floor((duhaSec % 3600) / 60))}`;

        return { fajr, sunrise, duha, dhuhr, asr, maghrib, isha, tomorrowFajr };
      }

      // Universal Astronomical calculation for any city worldwide
      return calculateAstronomicalTimes(
        date,
        cityObj.lat,
        cityObj.lng,
        countryObj.timezone,
        settings.calcMethod,
        settings.asrJuristic
      );
    },
    [settings.country, settings.city, settings.calcMethod, settings.asrJuristic]
  );

  // 2. Main Clock Tick Interval (Runs every 1s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Verse Rotation Interval (Every 25s)
  useEffect(() => {
    if (!settings.rotateVerses) return;
    const vTimer = setInterval(() => {
      setVerseIndex((prev) => (prev + 1) % VERSES.length);
    }, 25000);
    return () => clearInterval(vTimer);
  }, [settings.rotateVerses]);

  // Current Country and City objects
  const currentCountryObj =
    WORLD_COUNTRIES.find((c) => c.id === settings.country) || WORLD_COUNTRIES[0];
  const currentCityName = settings.city || currentCountryObj.cities[0].name;

  // Active theme
  const safeThemeIdx =
    settings.theme >= 0 && settings.theme < THEMES.length ? settings.theme : 0;
  const currentTheme = THEMES[safeThemeIdx];

  // Calculations for current moment
  const curSec =
    currentTime.getHours() * 3600 +
    currentTime.getMinutes() * 60 +
    currentTime.getSeconds();
  const todayKeyStr = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`;
  if (lastTriggeredDateRef.current !== todayKeyStr) {
    lastTriggeredDateRef.current = todayKeyStr;
    lastTriggeredAdhanKeyRef.current = null;
  }

  // Format digital clock
  const clockFmt = formatTimeDisplay(
    currentTime.getHours(),
    currentTime.getMinutes(),
    settings.is12h
  );
  const secondsStr = pad(currentTime.getSeconds());

  // Dates
  const weekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayName = weekdays[currentTime.getDay()];
  const hijriStr = getHijriDate(currentTime, settings.hijriOffset);
  const gregorianStr = `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()}`;

  // Prayer times
  const prayerTimes = getTimesForDate(currentTime);

  // Sunrise and Duha formatted
  const sunriseSec = timeToSeconds(prayerTimes.sunrise);
  const duhaSec = sunriseSec + 15 * 60;
  const sunriseFmt = formatTimeDisplay(
    Math.floor(sunriseSec / 3600),
    Math.floor((sunriseSec % 3600) / 60),
    settings.is12h
  ).timeStr;
  const duhaFmt = formatTimeDisplay(
    Math.floor(duhaSec / 3600),
    Math.floor((duhaSec % 3600) / 60),
    settings.is12h
  ).timeStr;

  // Tomorrow Fajr formatted
  const tomFajrSec = timeToSeconds(prayerTimes.tomorrowFajr);
  const tomorrowFajrFmt = formatTimeDisplay(
    Math.floor(tomFajrSec / 3600),
    Math.floor((tomFajrSec % 3600) / 60),
    settings.is12h
  ).timeStr;

  // 5 Prayers mapping
  const prayerConfigs: { key: PrayerKey; name: string; raw: string }[] = [
    { key: 'Fajr', name: 'الفجر', raw: prayerTimes.fajr },
    {
      key: 'Dhuhr',
      name: currentTime.getDay() === 5 ? 'الجمعة' : 'الظهر',
      raw: prayerTimes.dhuhr,
    },
    { key: 'Asr', name: 'العصر', raw: prayerTimes.asr },
    { key: 'Maghrib', name: 'المغرب', raw: prayerTimes.maghrib },
    { key: 'Isha', name: 'العشاء', raw: prayerTimes.isha },
  ];

  let nextPrayerConfig = prayerConfigs[0];
  let minDiff = Infinity;
  let activeIqamaPrayer: { key: PrayerKey; name: string } | null = null;
  let activeRemainingSec = 0;
  let activeTotalSec = 0;

  const prayersTableData: PrayerCardData[] = prayerConfigs.map((p) => {
    const offset = settings.offsets[p.key] || 0;
    const adhanSec = timeToSeconds(p.raw) + offset * 60;
    const iqamaMin = settings.iqama[p.key] || 20;
    const iqamaSec = adhanSec + iqamaMin * 60;

    const [ah, am] = [Math.floor(adhanSec / 3600), Math.floor((adhanSec % 3600) / 60)];
    const adhanFormatted = formatTimeDisplay(ah, am, settings.is12h).timeStr;

    // Upcoming prayer calculation
    let diff = adhanSec - curSec;
    if (diff < 0) diff += 86400;
    if (diff < minDiff) {
      minDiff = diff;
      nextPrayerConfig = p;
    }

    const isPast = curSec > iqamaSec;

    // Check if right now is between Adhan and Iqama
    if (curSec >= adhanSec && curSec < iqamaSec) {
      activeIqamaPrayer = p;
      activeRemainingSec = iqamaSec - curSec;
      activeTotalSec = iqamaMin * 60;

      // Check if Adhan sound should be triggered (window within 0 to 2s to prevent skips)
      if (
        settings.soundActive &&
        lastTriggeredAdhanKeyRef.current !== p.key &&
        curSec >= adhanSec &&
        curSec <= adhanSec + 2
      ) {
        lastTriggeredAdhanKeyRef.current = p.key;
        audioEngine.playAdhan(
          settings.adhanVoice || 'adhan_daghreeri',
          settings.audioVolume,
          p.key === 'Fajr' && settings.adhanFajrSpecial
        );
      }
    }

    return {
      key: p.key,
      name: p.name,
      adhanFormatted,
      iqamaMinutes: iqamaMin,
      isPast: isPast && settings.dimPastPrayers,
      isActiveNext: false, // will update below
      subText: p.key === 'Fajr' ? tomorrowFajrFmt : undefined,
    };
  });

  // Mark the single next prayer active
  prayersTableData.forEach((p) => {
    if (nextPrayerConfig && p.key === nextPrayerConfig.key) {
      p.isActiveNext = true;
      p.isPast = false;
    }
  });

  // Manage Iqama Modal Display
  useEffect(() => {
    if (isTestingIqama) return;

    if (activeIqamaPrayer) {
      const prayer = activeIqamaPrayer as { key: PrayerKey; name: string };
      setActivePrayerForModal(prayer.name);

      if (settings.countdownActive && userDismissedPrayerKey !== prayer.key) {
        setIsIqamaModalOpen(true);
      }

      // Check if Iqama timer finished
      if (activeRemainingSec <= 0) {
        setIsIqamaModalOpen(false);
        if (settings.soundActive) {
          audioEngine.playIqamaSynthesis(settings.audioVolume);
        }
        if (settings.blackScreenEnabled) {
          setIsBlackScreenOpen(true);
        }
      }
    } else {
      setIsIqamaModalOpen(false);
      setUserDismissedPrayerKey(null);
    }
  }, [
    activeIqamaPrayer,
    activeRemainingSec,
    settings.countdownActive,
    settings.soundActive,
    settings.blackScreenEnabled,
    settings.audioVolume,
    userDismissedPrayerKey,
    isTestingIqama,
  ]);

  // Countdown text in middle section
  let countdownTimeStr = '00:00';
  let countdownLabelStr = 'الصلاة القادمة';

  if (activeIqamaPrayer) {
    const mRem = Math.floor(activeRemainingSec / 60);
    const sRem = activeRemainingSec % 60;
    countdownTimeStr = `${pad(mRem)}:${pad(sRem)}`;
    countdownLabelStr = `المتبقي لإقامة ${(activeIqamaPrayer as { name: string }).name}`;
  } else if (nextPrayerConfig) {
    const hRem = Math.floor(minDiff / 3600);
    const mRem = Math.floor((minDiff % 3600) / 60);
    const sRem = minDiff % 60;
    countdownTimeStr = hRem > 0 ? `${hRem}:${pad(mRem)}` : `${pad(mRem)}:${pad(sRem)}`;
    countdownLabelStr = 'الصلاة القادمة';
  }

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request denied or not allowed:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsIqamaModalOpen(false);
        setIsBlackScreenOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Iqama test handler
  const triggerIqamaTest = () => {
    setIsSettingsOpen(false);
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
      testIntervalRef.current = null;
    }
    setIsTestingIqama(true);
    setTestRemainingSec(60);
    setActivePrayerForModal('الظهر (تجربة العداد)');
    setIsIqamaModalOpen(true);

    testIntervalRef.current = setInterval(() => {
      setTestRemainingSec((prev) => {
        if (prev <= 1) {
          if (testIntervalRef.current) {
            clearInterval(testIntervalRef.current);
            testIntervalRef.current = null;
          }
          setIsTestingIqama(false);
          setIsIqamaModalOpen(false);
          if (settings.blackScreenEnabled) {
            setIsBlackScreenOpen(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDismissIqamaModal = () => {
    if (isTestingIqama) {
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
        testIntervalRef.current = null;
      }
      setIsTestingIqama(false);
    }
    if (activeIqamaPrayer) {
      setUserDismissedPrayerKey((activeIqamaPrayer as { key: PrayerKey }).key);
    }
    setIsIqamaModalOpen(false);
  };

  return (
    <div className="min-h-screen text-white relative antialiased flex flex-col justify-between overflow-x-hidden font-amiri">
      {/* 1. Dynamic Background Layers */}
      <div
        id="app-bg-layer"
        className="fixed inset-0 z-0 transition-all duration-700 pointer-events-none"
        style={{ background: currentTheme.bg }}
      />
      <div
        id="app-pattern-layer"
        className="fixed inset-0 z-0 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: `url("${ARABESQUE_DATA_URI}")`,
          backgroundSize: '80px 80px',
          opacity: currentTheme.opacity,
        }}
      />

      {/* 2. Main Content Container (Refined 100% match to w1.png layout) */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-3 flex-1 flex flex-col justify-between">
        {/* A. Top Bar Header */}
        <Header
          cityName={currentCityName}
          countryName={currentCountryObj.name}
          countryId={settings.country}
          soundActive={settings.soundActive}
          onOpenSettings={(tab) => {
            if (tab) setActiveSettingsTab(tab);
            setIsSettingsOpen(true);
          }}
          onCycleTheme={() => {
            const next = (settings.theme + 1) % THEMES.length;
            updateSettings({ theme: next });
          }}
          onToggleSound={() => {
            const newSound = !settings.soundActive;
            updateSettings({ soundActive: newSound });
            if (!newSound) audioEngine.stopAllAudio();
          }}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* B. Date & Large Digital Clock & Quranic Verse */}
        <ClockSection
          dayName={dayName}
          hijriDate={hijriStr}
          gregorianDate={gregorianStr}
          timeStr={clockFmt.timeStr}
          secondsStr={secondsStr}
          periodStr={clockFmt.period}
          useArabicDigits={settings.arabicDigits}
          currentVerse={VERSES[verseIndex]}
          onNextVerse={() => setVerseIndex((prev) => (prev + 1) % VERSES.length)}
          onOpenHijriSettings={() => {
            setActiveSettingsTab('hijri');
            setIsSettingsOpen(true);
          }}
        />

        {/* C. Middle Row: Countdown | 3D Crescent & Mosque | Sunrise & Duha */}
        <MiddleSection
          countdownTime={countdownTimeStr}
          countdownLabel={countdownLabelStr}
          sunriseTime={sunriseFmt}
          duhaTime={duhaFmt}
          useArabicDigits={settings.arabicDigits}
          onCountdownClick={() => {
            if (activeIqamaPrayer) {
              setUserDismissedPrayerKey(null);
              setIsIqamaModalOpen(true);
            }
          }}
        />

        {/* D. Prayer Times Stadium Capsules Table */}
        <PrayerTable prayers={prayersTableData} useArabicDigits={settings.arabicDigits} />

        {/* E. Subtle Footer */}
        <footer className="w-full flex items-center justify-between text-xs font-amiri text-[#fae084]/80 px-2 pt-2 select-none">
          <span
            id="footer-theme-name"
            className="cursor-pointer hover:underline"
            onClick={() => {
              const next = (settings.theme + 1) % THEMES.length;
              updateSettings({ theme: next });
            }}
          >
            الخلفية: {currentTheme.name} 🎨
          </span>
          <span
            id="footer-location-text"
            className="cursor-pointer hover:underline"
            onClick={() => {
              setActiveSettingsTab('location');
              setIsSettingsOpen(true);
            }}
            title="إعدادات الموقع والدول"
          >
            {currentCountryObj.flag} {currentCountryObj.name} - {currentCityName} ⚙️
          </span>
        </footer>
      </div>

      {/* 3. Iqama Countdown Modal */}
      <IqamaModal
        isOpen={isIqamaModalOpen}
        prayerName={activePrayerForModal}
        remainingMinutes={
          isTestingIqama ? Math.floor(testRemainingSec / 60) : Math.floor(activeRemainingSec / 60)
        }
        remainingSeconds={
          isTestingIqama ? testRemainingSec % 60 : activeRemainingSec % 60
        }
        progressPercent={
          isTestingIqama
            ? (testRemainingSec / 60) * 100
            : activeTotalSec > 0
            ? (activeRemainingSec / activeTotalSec) * 100
            : 0
        }
        useArabicDigits={settings.arabicDigits}
        isAudioPlaying={audioEngine.isPlaying()}
        onDismiss={handleDismissIqamaModal}
        onStopAudio={() => audioEngine.stopAllAudio()}
      />

      {/* 4. Black Screen / Dimmer Overlay during prayer */}
      <BlackScreenOverlay
        isOpen={isBlackScreenOpen}
        prayerName={activePrayerForModal}
        onDismiss={() => setIsBlackScreenOpen(false)}
      />

      {/* 5. Full Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        activeTab={activeSettingsTab}
        onClose={() => setIsSettingsOpen(false)}
        onTabChange={(tab) => setActiveSettingsTab(tab)}
        onUpdateSettings={updateSettings}
        onResetDefaults={() => {
          if (confirm('هل تريد استعادة الإعدادات الافتراضية؟')) {
            try {
              localStorage.removeItem(STORAGE_KEY);
            } catch {}
            setSettings(DEFAULT_SETTINGS);
          }
        }}
        onTriggerIqamaTest={triggerIqamaTest}
        onTriggerBlackScreenTest={() => {
          setIsSettingsOpen(false);
          setActivePrayerForModal('التجربة');
          setIsBlackScreenOpen(true);
        }}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 6. Single HTML Code Modal */}
      <SingleHtmlModal
        isOpen={isSingleHtmlOpen}
        onClose={() => setIsSingleHtmlOpen(false)}
        htmlCode={STANDALONE_HTML_CODE}
      />
    </div>
  );
}
