import React, { useState } from 'react';
import {
  AppSettings,
  CalcMethodId,
  AsrJuristic,
  PrayerKey,
} from '../types';
import { WORLD_COUNTRIES, getHijriDate } from '../utils/astronomicalPrayer';
import { THEMES, ARABESQUE_DATA_URI } from '../data/themes';
import { audioEngine } from '../utils/audioEngine';
import { CountryFlag } from './CountryFlag';
import {
  X,
  MapPin,
  Volume2,
  Palette,
  Settings,
  Clock,
  Moon,
  Smartphone,
  Play,
  Square,
  Crosshair,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  activeTab: string;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetDefaults: () => void;
  onTriggerIqamaTest: () => void;
  onTriggerBlackScreenTest: () => void;
  onToggleFullscreen: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  activeTab,
  onClose,
  onTabChange,
  onUpdateSettings,
  onResetDefaults,
  onTriggerIqamaTest,
  onTriggerBlackScreenTest,
  onToggleFullscreen,
}) => {
  const [gpsStatus, setGpsStatus] = useState<string>('');
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [isPlayingIqama, setIsPlayingIqama] = useState(false);

  if (!isOpen) return null;

  const currentCountry =
    WORLD_COUNTRIES.find((c) => c.id === settings.country) || WORLD_COUNTRIES[0];
  const cities = currentCountry.cities || [];

  // GPS auto-detection handler
  const handleDetectGPS = () => {
    setGpsStatus('جارٍ تحديد موقعك عبر الأقمار الصناعية...');

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('خدمة تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let closestCountry = WORLD_COUNTRIES[0];
        let closestCity = WORLD_COUNTRIES[0].cities[0];
        let minDistance = Infinity;

        WORLD_COUNTRIES.forEach((c) => {
          c.cities.forEach((city) => {
            const dLat = city.lat - userLat;
            const dLng = city.lng - userLng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            if (dist < minDistance) {
              minDistance = dist;
              closestCountry = c;
              closestCity = city;
            }
          });
        });

        onUpdateSettings({
          country: closestCountry.id,
          city: closestCity.name,
        });

        setGpsStatus(`✓ تم تحديد الموقع: ${closestCity.name}، ${closestCountry.name}`);
        setTimeout(() => setGpsStatus(''), 4000);
      },
      (err) => {
        console.warn('GPS detection failed:', err);
        setGpsStatus('تعذر تحديد الموقع الجغرافي. يرجى اختيار المدينة يدوياً.');
        setTimeout(() => setGpsStatus(''), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handlePreviewAdhan = () => {
    if (isPlayingAdhan) {
      audioEngine.stopAllAudio();
      setIsPlayingAdhan(false);
      return;
    }
    audioEngine.stopAllAudio();
    setIsPlayingIqama(false);
    setIsPlayingAdhan(true);
    audioEngine.playAdhan(
      settings.adhanVoice || 'adhan_daghreeri',
      settings.audioVolume,
      false,
      () => setIsPlayingAdhan(true),
      () => setIsPlayingAdhan(false)
    );
  };

  const handlePreviewIqama = () => {
    if (isPlayingIqama) {
      audioEngine.stopAllAudio();
      setIsPlayingIqama(false);
      return;
    }
    audioEngine.stopAllAudio();
    setIsPlayingAdhan(false);
    setIsPlayingIqama(true);
    audioEngine.playIqamaSynthesis(
      settings.audioVolume,
      () => setIsPlayingIqama(true),
      () => setIsPlayingIqama(false)
    );
  };

  const handleStopSounds = () => {
    audioEngine.stopAllAudio();
    setIsPlayingAdhan(false);
    setIsPlayingIqama(false);
  };

  const tabs = [
    { id: 'location', label: 'الدولة والمدينة', icon: MapPin },
    { id: 'audio', label: 'صوت الأذان والإقامة', icon: Volume2 },
    { id: 'themes', label: 'الثيمات (18)', icon: Palette },
    { id: 'options', label: 'الخيارات العامة', icon: Settings },
    { id: 'adjustments', label: 'ضبط الأوقات والإقامة', icon: Clock },
    { id: 'hijri', label: 'التاريخ الهجري', icon: Moon },
    { id: 'blackscreen', label: 'الشاشة السوداء', icon: Smartphone },
  ];

  return (
    <div
      id="modal-settings"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-amber-400/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-tajawal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-xl font-bold font-amiri text-[#f5d79e]">
              إعدادات تطبيق مواقيت الصلاة والآذان
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-nav-scroll flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-stone-950/80 overflow-x-auto text-xs sm:text-sm font-tajawal whitespace-nowrap min-h-[54px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`tab-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'text-slate-300 hover:bg-white/10 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1 space-y-6 text-sm">
          {/* TAB 1: LOCATION SELECTION */}
          {activeTab === 'location' && (
            <div id="tab-location" className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="font-bold text-amber-300 text-base">تحديد الدولة والمدينة لحساب المواقيت</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    حساب فلكي دقيق بالاعتماد على الهيئات والتقاويم الرسمية المعتمدة
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  جميع دول العالم 🌍
                </span>
              </div>

              {/* Selected Country Banner with Official National Flag */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-black/40 to-amber-500/15 border border-amber-400/30 flex items-center gap-4">
                <div className="w-20 h-13 sm:w-24 sm:h-16 shrink-0 flex items-center justify-center p-1 bg-black/40 rounded-xl border border-white/10 shadow-inner">
                  <CountryFlag countryId={currentCountry.id} className="w-full h-full" title={`علم ${currentCountry.name}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-amber-200/80 font-medium">العلم الوطني للدولة المختارة:</div>
                  <div className="font-amiri font-bold text-lg sm:text-xl text-amber-300 truncate">
                    {currentCountry.flag} {currentCountry.name}
                  </div>
                  <div className="text-xs text-slate-300 font-tajawal mt-0.5">
                    المدينة الحالية: <span className="text-amber-200 font-bold">{settings.city}</span> ({cities.length} مدينة مسجلة)
                  </div>
                </div>
              </div>

              {/* Country & City Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="select-country" className="block font-medium text-slate-200 text-xs">
                    الدولة:
                  </label>
                  <select
                    id="select-country"
                    value={settings.country}
                    onChange={(e) => {
                      const newCountryId = e.target.value;
                      const countryObj = WORLD_COUNTRIES.find((c) => c.id === newCountryId);
                      const firstCity = countryObj?.cities[0]?.name || '';
                      onUpdateSettings({
                        country: newCountryId,
                        city: firstCity,
                      });
                    }}
                    className="w-full bg-stone-800 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 font-tajawal cursor-pointer"
                  >
                    {WORLD_COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="select-city" className="block font-medium text-slate-200 text-xs">
                    المدينة:
                  </label>
                  <select
                    id="select-city"
                    value={settings.city}
                    onChange={(e) => onUpdateSettings({ city: e.target.value })}
                    className="w-full bg-stone-800 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 font-tajawal cursor-pointer"
                  >
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.isOfficialAwqaf ? `${city.name} (تقويم الأوقاف الرسمي Manama-awqaf)` : city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculation Method & Asr Jurisprudence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="select-calc-method" className="block font-medium text-slate-200 text-xs">
                    طريقة الحساب الفلكي:
                  </label>
                  <select
                    id="select-calc-method"
                    value={settings.calcMethod}
                    onChange={(e) => onUpdateSettings({ calcMethod: e.target.value as CalcMethodId })}
                    className="w-full bg-stone-800/80 border border-white/15 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-tajawal cursor-pointer"
                  >
                    <option value="auto">تلقائي (حسب الدولة المحددة)</option>
                    <option value="bahrain">أوقاف مملكة البحرين (Manama-awqaf / تقويم الزبارة الرسمي)</option>
                    <option value="makkah">أم القرى - مكة المكرمة (السعودية والخليج)</option>
                    <option value="egypt">الهيئة العامة المصرية للمساحة</option>
                    <option value="karachi">جامعة العلوم الإسلامية بكراتشي</option>
                    <option value="isna">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
                    <option value="mwl">رابطة العالم الإسلامي</option>
                    <option value="kuwait">وزارة الأوقاف والشؤون الإسلامية بالكويت</option>
                    <option value="qatar">وزارة الأوقاف والشؤون الإسلامية بقطر</option>
                    <option value="tehran">معهد الجيوفيزياء بجامعة طهران</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="select-asr-juristic" className="block font-medium text-slate-200 text-xs">
                    مذهب صلاة العصر:
                  </label>
                  <select
                    id="select-asr-juristic"
                    value={settings.asrJuristic}
                    onChange={(e) => onUpdateSettings({ asrJuristic: e.target.value as AsrJuristic })}
                    className="w-full bg-stone-800/80 border border-white/15 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400 font-tajawal cursor-pointer"
                  >
                    <option value="shafi">الجمهور (الشافعي، المالكي، الحنبلي - مِثل واحد)</option>
                    <option value="hanafi">الحنفي (مِثلين)</option>
                  </select>
                </div>
              </div>

              {/* Current Location Summary Box */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 flex items-center justify-center shadow-sm">
                    <CountryFlag
                      countryId={currentCountry.id}
                      className="w-14 h-9.5 rounded-lg border border-white/20"
                      title={currentCountry.name}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-amber-200/80 font-medium">الموقع الحالي المعتمد:</div>
                    <div className="font-amiri font-bold text-base sm:text-lg text-amber-300">
                      {currentCountry.flag} {settings.city} - {currentCountry.name}
                    </div>
                    {gpsStatus && <p className="text-xs text-amber-400 mt-0.5 font-tajawal">{gpsStatus}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-detect-gps"
                  onClick={handleDetectGPS}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white font-tajawal flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Crosshair className="w-4 h-4 text-amber-300" />
                  <span>تحديد موقعي تلقائياً (GPS)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO & ADHAN VOICES */}
          {activeTab === 'audio' && (
            <div id="tab-audio" className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="font-bold text-amber-300 text-base">أصوات الأذان والإقامة والتنبيهات</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    اختر المؤذن المفضل وصوت التكبيرات والإقامة مع إمكانية المعاينة الفورية
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="audio-master-enable"
                    checked={settings.soundActive}
                    onChange={(e) => onUpdateSettings({ soundActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-amber-300">تفعيل الصوت العام</span>
                </label>
              </div>

              {/* Adhan Voice Selector */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="select-adhan-voice" className="font-bold text-slate-100 flex items-center gap-2">
                    <span>📢</span>
                    <span>صوت أذان الصلوات الخمس:</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                      صوت حقيقي نقي
                    </span>
                  </label>
                  <button
                    type="button"
                    id="btn-preview-adhan"
                    onClick={handlePreviewAdhan}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isPlayingAdhan
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 animate-pulse'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {isPlayingAdhan ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAdhan ? 'إيقاف الأذان' : 'استماع وتجربة'}</span>
                  </button>
                </div>
                <select
                  id="select-adhan-voice"
                  value={settings.adhanVoice}
                  onChange={(e) => {
                    const newVoice = e.target.value;
                    onUpdateSettings({ adhanVoice: newVoice });
                    if (isPlayingAdhan) {
                      audioEngine.stopAllAudio();
                      audioEngine.playAdhan(
                        newVoice,
                        settings.audioVolume,
                        false,
                        () => setIsPlayingAdhan(true),
                        () => setIsPlayingAdhan(false)
                      );
                    }
                  }}
                  className="w-full bg-stone-800 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-400 font-tajawal cursor-pointer"
                >
                  {audioEngine.adhanVoices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.reciter}
                    </option>
                  ))}
                </select>

                {isPlayingAdhan && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms] h-3"></span>
                      <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms] h-2"></span>
                      <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms] h-3"></span>
                      <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:450ms] h-1.5"></span>
                    </span>
                    <span className="font-bold">جاري تشغيل الأذان الحقيقي... اضغط على زر "إيقاف الأذان" لإنهاء الاستماع.</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="opt-adhan-fajr-special"
                      checked={settings.adhanFajrSpecial}
                      onChange={(e) => onUpdateSettings({ adhanFajrSpecial: e.target.checked })}
                      className="w-3.5 h-3.5 accent-amber-500 rounded"
                    />
                    <span>تخصيص أذان الفجر (نداء: الصلاة خير من النوم)</span>
                  </label>
                </div>
              </div>

              {/* Iqama Voice Selector */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="select-iqama-voice" className="font-bold text-slate-100 flex items-center gap-2">
                    <span>⏱️</span>
                    <span>صوت إقامة الصلاة عند انتهاء الوقت:</span>
                  </label>
                  <button
                    type="button"
                    id="btn-preview-iqama"
                    onClick={handlePreviewIqama}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPlayingIqama ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingIqama ? 'إيقاف الإقامة' : 'استماع وتجربة'}</span>
                  </button>
                </div>
                <select
                  id="select-iqama-voice"
                  value={settings.iqamaVoice}
                  onChange={(e) => onUpdateSettings({ iqamaVoice: e.target.value })}
                  className="w-full bg-stone-800 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-400 font-tajawal cursor-pointer"
                >
                  {audioEngine.iqamaVoices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.reciter})
                    </option>
                  ))}
                </select>
              </div>

              {/* Volume Slider and Stop Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200">مستوى الصوت العام:</span>
                    <span id="label-volume-percent" className="font-numbers text-amber-300 font-bold">
                      {Math.round(settings.audioVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    id="input-audio-volume"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.audioVolume}
                    onChange={(e) => onUpdateSettings({ audioVolume: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    id="btn-stop-all-audio"
                    onClick={handleStopSounds}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>إيقاف أي صوت حالي</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 18 THEMES */}
          {activeTab === 'themes' && (
            <div id="tab-themes" className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="font-bold text-amber-300 text-base">الخلفيات والثيمات الإسلامية (18 ثيم)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    اختر الخلفية المناسبة لتطبيقها على الشاشة الرئيسية فوراً
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = (settings.theme + 1) % THEMES.length;
                    onUpdateSettings({ theme: next });
                  }}
                  className="text-xs text-amber-300 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 active:scale-95 transition-all cursor-pointer"
                >
                  الخلفية التالية ◀
                </button>
              </div>

              {/* Grid of 18 Theme Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="themes-grid-container">
                {THEMES.map((t, idx) => {
                  const isSelected = settings.theme === idx;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onUpdateSettings({ theme: idx })}
                      className={`theme-card-preview cursor-pointer p-3 rounded-2xl border text-center transition-all duration-200 shadow-md ${
                        isSelected
                          ? 'ring-2 ring-amber-400 scale-105 border-amber-400'
                          : 'border-white/20 hover:scale-102'
                      }`}
                      style={{ background: t.bg }}
                    >
                      <div
                        className="h-10 rounded-xl mb-2 flex items-center justify-center border border-white/20"
                        style={{
                          backgroundImage: `url("${ARABESQUE_DATA_URI}")`,
                          backgroundSize: '40px 40px',
                          opacity: 0.9,
                        }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow">{idx + 1}</span>
                      </div>
                      <span className="text-xs font-tajawal font-bold block text-white drop-shadow">
                        {t.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GENERAL OPTIONS */}
          {activeTab === 'options' && (
            <div id="tab-options" className="space-y-4">
              <h3 className="font-bold text-amber-300 border-b border-white/10 pb-2">
                خيارات الساعة والتنبيهات
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="opt-12h"
                    checked={settings.is12h}
                    onChange={(e) => onUpdateSettings({ is12h: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>نظام 12 ساعة (5:23 مساء بدلاً من 17:23)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="opt-dimpast"
                    checked={settings.dimPastPrayers}
                    onChange={(e) => onUpdateSettings({ dimPastPrayers: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>تعتيم أوقات الصلوات التي انقضت</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="opt-arabicdigits"
                    checked={settings.arabicDigits}
                    onChange={(e) => onUpdateSettings({ arabicDigits: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>الأرقام العربية المشرقية (١، ٢، ٣)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="opt-countdown"
                    checked={settings.countdownActive}
                    onChange={(e) => onUpdateSettings({ countdownActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>تفعيل شاشة العد التنازلي للإقامة عند الأذان</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="opt-sound"
                    checked={settings.soundActive}
                    onChange={(e) => onUpdateSettings({ soundActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>تفعيل التنبيه الصوتي عند حلول الأذان 🔊</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="opt-rotate-verses"
                    checked={settings.rotateVerses}
                    onChange={(e) => onUpdateSettings({ rotateVerses: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>تدوير الآيات القرآنية تلقائياً كل 25 ثانية</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => audioEngine.playChime(settings.audioVolume)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  تجربة نغمة التنبيه 🔔
                </button>
                <button
                  type="button"
                  onClick={onTriggerIqamaTest}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  تجربة عداد الإقامة ⏱️
                </button>
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-all cursor-pointer"
                >
                  تبديل وضع ملء الشاشة ⛶
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ADJUSTMENTS */}
          {activeTab === 'adjustments' && (
            <div id="tab-adjustments" className="space-y-4">
              <h3 className="font-bold text-amber-300 border-b border-white/10 pb-2">
                تعديل دقائق الأذان والإقامة
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 font-bold text-xs text-slate-400 border-b border-white/10 pb-1">
                  <span>الصلاة</span>
                  <span>تعديل الأذان (دقيقة)</span>
                  <span>وقت انتظار الإقامة (دقيقة)</span>
                </div>

                {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as PrayerKey[]).map((key) => {
                  const names: Record<PrayerKey, string> = {
                    Fajr: 'الفجر',
                    Dhuhr: 'الظهر',
                    Asr: 'العصر',
                    Maghrib: 'المغرب',
                    Isha: 'العشاء',
                  };
                  return (
                    <div key={key} className="grid grid-cols-3 gap-2 items-center bg-white/5 p-2.5 rounded-xl">
                      <span className="font-bold text-amber-200">{names[key]}</span>
                      <input
                        type="number"
                        min="-30"
                        max="30"
                        value={settings.offsets[key]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          onUpdateSettings({
                            offsets: { ...settings.offsets, [key]: val },
                          });
                        }}
                        className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-center w-24 text-white"
                      />
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={settings.iqama[key]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 20;
                          onUpdateSettings({
                            iqama: { ...settings.iqama, [key]: val },
                          });
                        }}
                        className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-center w-24 text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: HIJRI DATE ADJUSTMENT */}
          {activeTab === 'hijri' && (
            <div id="tab-hijri" className="space-y-4">
              <h3 className="font-bold text-amber-300 border-b border-white/10 pb-2">
                تعديل التاريخ الهجري
              </h3>
              <p className="text-xs text-slate-300">
                يمكنك تقديم أو تأخير التاريخ الهجري ليتوافق بدقة مع رؤية الهلال الرسمية في بلدك:
              </p>
              <div className="flex items-center justify-center gap-2.5 py-3">
                {[-2, -1, 0, 1, 2].map((offset) => {
                  const isSelected = settings.hijriOffset === offset;
                  return (
                    <button
                      key={offset}
                      type="button"
                      onClick={() => onUpdateSettings({ hijriOffset: offset })}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {offset === 0 ? 'تلقائي (0)' : `${offset > 0 ? '+' : ''}${offset} يوم`}
                    </button>
                  );
                })}
              </div>
              <div className="text-center font-amiri text-lg text-amber-200">
                التاريخ المحسوب حالياً:{' '}
                <span className="font-bold text-white">
                  {getHijriDate(new Date(), settings.hijriOffset)}
                </span>
              </div>
            </div>
          )}

          {/* TAB 7: BLACK SCREEN */}
          {activeTab === 'blackscreen' && (
            <div id="tab-blackscreen" className="space-y-4">
              <h3 className="font-bold text-amber-300 border-b border-white/10 pb-2">
                الشاشة السوداء وتذكير صامت الهواتف
              </h3>
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  id="opt-blackscreen-enable"
                  checked={settings.blackScreenEnabled}
                  onChange={(e) => onUpdateSettings({ blackScreenEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>تفعيل الشاشة السوداء تلقائياً بعد الإقامة للمحافظة على خشوع المصلين</span>
              </label>

              <button
                type="button"
                onClick={onTriggerBlackScreenTest}
                className="px-5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 font-bold text-xs hover:bg-rose-500/30 cursor-pointer"
              >
                تجربة الشاشة السوداء الآن 📵
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetDefaults}
            className="text-xs text-rose-400 hover:underline cursor-pointer"
          >
            استعادة الإعدادات الافتراضية
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            تم وحفظ
          </button>
        </div>
      </div>
    </div>
  );
};
