export type PrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  duha: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tomorrowFajr: string;
}

export interface PrayerItem {
  key: PrayerKey;
  name: string;
  rawTime: string; // e.g. "04:06"
  rowId: string;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
  isOfficialAwqaf?: boolean;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  timezone: number;
  defaultMethod: string;
  cities: City[];
}

export type CalcMethodId =
  | 'auto'
  | 'bahrain'
  | 'bh.manama.awqaf'
  | 'makkah'
  | 'egypt'
  | 'karachi'
  | 'isna'
  | 'mwl'
  | 'kuwait'
  | 'qatar'
  | 'tehran';

export type AsrJuristic = 'shafi' | 'hanafi';

export interface VoiceOption {
  id: string;
  name: string;
  reciter: string;
  url?: string;
  isRealAudio?: boolean;
}

export interface ThemeItem {
  id: number;
  name: string;
  bg: string;
  opacity: number;
  borderPreview: string;
  light?: boolean;
}

export interface AppOffsets {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export interface AppIqamaMinutes {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export interface AppSettings {
  theme: number;
  is12h: boolean;
  dimPastPrayers: boolean;
  arabicDigits: boolean;
  countdownActive: boolean;
  soundActive: boolean;
  rotateVerses: boolean;
  blackScreenEnabled: boolean;
  hijriOffset: number;
  country: string;
  city: string;
  calcMethod: CalcMethodId;
  asrJuristic: AsrJuristic;
  adhanVoice: string;
  iqamaVoice: string;
  audioVolume: number; // 0.0 to 1.0
  adhanFajrSpecial: boolean;
  offsets: AppOffsets;
  iqama: AppIqamaMinutes;
}
