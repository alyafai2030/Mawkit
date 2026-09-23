import { Country, CalcMethodId, AsrJuristic, PrayerTimes } from '../types';

// Convert degrees to radians and vice versa
const degToRad = (d: number) => (d * Math.PI) / 180.0;
const radToDeg = (r: number) => (r * 180.0) / Math.PI;

// Normalize hours to [0, 24)
function fixHour(h: number): number {
  let a = h % 24;
  if (a < 0) a += 24;
  return a;
}

// Normalize angle to [0, 360)
function fixAngle(a: number): number {
  let b = a % 360;
  if (b < 0) b += 360;
  return b;
}

// Julian Date calculation
function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

// Sun coordinates
function sunCoordinates(d: number) {
  // Mean anomaly of the sun
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  // Ecliptic longitude of the sun
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));
  // Obliquity of the ecliptic
  const e = 23.439 - 0.00000036 * d;

  // Declination of the sun
  const sinD = Math.sin(degToRad(e)) * Math.sin(degToRad(L));
  const dec = radToDeg(Math.asin(sinD));

  // Right ascension of the sun
  const cosD = Math.cos(degToRad(dec));
  let ra = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L))));
  ra = fixHour(ra / 15);

  // Equation of time (hours)
  const eqt = q / 15 - ra;

  return { dec, eqt, cosD, sinD };
}

// Calculate mid-day (Dhuhr)
function calculateDhuhr(timezone: number, longitude: number, eqt: number): number {
  return fixHour(12 + timezone - longitude / 15 - eqt);
}

// Compute hour angle for a given solar altitude angle
function hourAngle(altitudeAngle: number, latitude: number, dec: number): number | null {
  const latR = degToRad(latitude);
  const decR = degToRad(dec);
  const altR = degToRad(altitudeAngle);

  const cosH = (Math.sin(altR) - Math.sin(latR) * Math.sin(decR)) / (Math.cos(latR) * Math.cos(decR));

  if (cosH < -1 || cosH > 1) {
    return null; // Sun never reaches this altitude (polar days/nights)
  }
  return radToDeg(Math.acos(cosH)) / 15; // in hours
}

// Compute Asr hour angle given shadow multiplier (1 for Shafi, 2 for Hanafi)
function asrHourAngle(shadowMultiplier: number, latitude: number, dec: number): number | null {
  const latR = degToRad(latitude);
  const decR = degToRad(dec);
  const noonAltitude = Math.abs(latR - decR);
  const asrAltitude = radToDeg(Math.atan(1 / (shadowMultiplier + Math.tan(noonAltitude))));
  return hourAngle(asrAltitude, latitude, dec);
}

// Decimal hours to "HH:MM"
export function hoursToTimeStr(h: number): string {
  const fixed = fixHour(h);
  const hours = Math.floor(fixed);
  const minutes = Math.floor((fixed - hours) * 60 + 0.5);
  if (minutes === 60) {
    return `${pad(hours + 1)}:00`;
  }
  return `${pad(hours)}:${pad(minutes)}`;
}

export function pad(n: number): string {
  return ('0' + n).slice(-2);
}

// Calculation parameters per method
interface MethodParams {
  fajrAngle: number;
  ishaAngle: number;
  ishaIntervalMinutes?: number;
}

const CALC_METHODS: Record<string, MethodParams> = {
  bahrain: { fajrAngle: 18.0, ishaAngle: 17.7 },
  'bh.manama.awqaf': { fajrAngle: 18.0, ishaAngle: 17.7 },
  makkah: { fajrAngle: 18.5, ishaAngle: 0, ishaIntervalMinutes: 90 },
  egypt: { fajrAngle: 19.5, ishaAngle: 17.5 },
  karachi: { fajrAngle: 18.0, ishaAngle: 18.0 },
  isna: { fajrAngle: 15.0, ishaAngle: 15.0 },
  mwl: { fajrAngle: 18.0, ishaAngle: 17.0 },
  kuwait: { fajrAngle: 18.0, ishaAngle: 17.5 },
  qatar: { fajrAngle: 18.0, ishaAngle: 0, ishaIntervalMinutes: 90 },
  tehran: { fajrAngle: 17.7, ishaAngle: 14.0 },
};

// Calculate prayer times for any date, location, and method
export function calculateAstronomicalTimes(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  methodId: CalcMethodId = 'auto',
  asrJuristic: AsrJuristic = 'shafi'
): PrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const d = jd - 2451545.0; // days since J2000.0

  const { dec, eqt } = sunCoordinates(d);

  let methodKey = methodId;
  if (methodKey === 'auto') {
    methodKey = 'bahrain';
  }
  const params = CALC_METHODS[methodKey] || CALC_METHODS.bahrain;

  // Midday
  const dhuhrH = calculateDhuhr(timezone, longitude, eqt);

  // Sunrise and Sunset (Sun center at -0.833° for refraction and sun diameter)
  const sunRiseSetH = hourAngle(-0.833, latitude, dec) ?? 6;
  const sunriseH = dhuhrH - sunRiseSetH;
  const sunsetH = dhuhrH + sunRiseSetH;
  const maghribH = sunsetH;

  // Fajr
  const fajrHAngle = hourAngle(-params.fajrAngle, latitude, dec) ?? 1.5;
  const fajrH = dhuhrH - fajrHAngle;

  // Isha
  let ishaH: number;
  if (params.ishaIntervalMinutes) {
    ishaH = maghribH + params.ishaIntervalMinutes / 60;
  } else {
    const ishaHAngle = hourAngle(-params.ishaAngle, latitude, dec) ?? 1.5;
    ishaH = dhuhrH + ishaHAngle;
  }

  // Asr
  const shadowMul = asrJuristic === 'hanafi' ? 2 : 1;
  const asrHAngle = asrHourAngle(shadowMul, latitude, dec) ?? 3;
  const asrH = dhuhrH + asrHAngle;

  // Duha (approx 15-20 min after sunrise)
  const duhaH = sunriseH + 15 / 60;

  // Tomorrow's Fajr
  const tomorrow = new Date(date.getTime() + 86400000);
  const jdTom = getJulianDate(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
  const dTom = jdTom - 2451545.0;
  const sunTom = sunCoordinates(dTom);
  const dhuhrTomH = calculateDhuhr(timezone, longitude, sunTom.eqt);
  const fajrTomHAngle = hourAngle(-params.fajrAngle, latitude, sunTom.dec) ?? 1.5;
  const tomorrowFajrH = dhuhrTomH - fajrTomHAngle;

  return {
    fajr: hoursToTimeStr(fajrH),
    sunrise: hoursToTimeStr(sunriseH),
    duha: hoursToTimeStr(duhaH),
    dhuhr: hoursToTimeStr(dhuhrH),
    asr: hoursToTimeStr(asrH),
    maghrib: hoursToTimeStr(maghribH),
    isha: hoursToTimeStr(ishaH),
    tomorrowFajr: hoursToTimeStr(tomorrowFajrH),
  };
}

// Hijri calculation algorithm (Kuwaiti algorithm) with safe offset handling
export function getHijriDate(date: Date, offsetDays: number = 0): string {
  const adjusted = new Date(date.getTime() + offsetDays * 86400000);
  const day = adjusted.getDate();
  const month = adjusted.getMonth() + 1;
  const year = adjusted.getFullYear();

  let jd: number;
  if (year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day > 14)) {
    jd =
      Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
      Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
      Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
      day -
      32075;
  } else {
    jd =
      367 * year -
      Math.floor((7 * (year + 5001 + Math.floor((month - 9) / 7))) / 4) +
      Math.floor((275 * month) / 9) +
      day +
      1729777;
  }

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) +
    Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 =
    l1 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  let hm = Math.floor((24 * l2) / 709);
  let hd = l2 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;

  if (hd < 1) {
    hd = 30;
    hm--;
  }
  if (hd > 30) {
    hd = 1;
    hm++;
  }
  if (hm < 1) hm = 12;
  if (hm > 12) hm = 1;

  const islamicMonths = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  return `${hd} ${islamicMonths[hm - 1]} ${hy} هـ`;
}

// Convert numbers to Eastern Arabic Digits if enabled
export function formatDigits(val: string | number, useArabicDigits: boolean): string {
  const str = String(val);
  if (!useArabicDigits) return str;
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (d) => arDigits[Number(d)]);
}

// Convert seconds from midnight to string representation
export function timeToSeconds(str: string): number {
  if (!str || !str.includes(':')) return 0;
  const [h, m] = str.split(':').map(Number);
  return (h || 0) * 3600 + (m || 0) * 60;
}

// Format 12-hour or 24-hour time
export function formatTimeDisplay(
  hour24: number,
  min: number,
  is12h: boolean
): { timeStr: string; period: string } {
  if (!is12h) {
    return {
      timeStr: `${pad(hour24)}:${pad(min)}`,
      period: '',
    };
  }
  const period = hour24 >= 12 ? 'مساء' : 'صباحا';
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  return {
    timeStr: `${h12}:${pad(min)}`,
    period,
  };
}

// Comprehensive list of World Countries and Cities
export const WORLD_COUNTRIES: Country[] = [
  {
    id: 'BH',
    name: 'مملكة البحرين',
    flag: '🇧🇭',
    timezone: 3,
    defaultMethod: 'bh.manama.awqaf',
    cities: [
      { name: 'المنامة', lat: 26.2285, lng: 50.586, isOfficialAwqaf: true },
      { name: 'المحرق', lat: 26.2572, lng: 50.6119, isOfficialAwqaf: true },
      { name: 'الرفاع', lat: 26.13, lng: 50.555, isOfficialAwqaf: true },
      { name: 'مدينة حمد', lat: 26.1153, lng: 50.5069, isOfficialAwqaf: true },
      { name: 'مدينة عيسى', lat: 26.1736, lng: 50.5478, isOfficialAwqaf: true },
      { name: 'سترة', lat: 26.155, lng: 50.62, isOfficialAwqaf: true },
      { name: 'البديع', lat: 26.2167, lng: 50.45, isOfficialAwqaf: true },
      { name: 'عالي', lat: 26.1517, lng: 50.5283, isOfficialAwqaf: true },
    ],
  },
  {
    id: 'YE',
    name: 'الجمهورية اليمنية',
    flag: '🇾🇪',
    timezone: 3,
    defaultMethod: 'makkah',
    cities: [
      { name: 'عدن', lat: 12.7855, lng: 45.0187 },
      { name: 'صنعاء', lat: 15.3694, lng: 44.191 },
      { name: 'يافع', lat: 13.8821, lng: 45.2289 },
      { name: 'المكلاء', lat: 14.5425, lng: 49.1242 },
      { name: 'سقطرى', lat: 12.65, lng: 54.02 },
      { name: 'الغيظة', lat: 16.2079, lng: 52.176 },
      { name: 'تعز', lat: 13.5795, lng: 44.0209 },
      { name: 'الحديدة', lat: 14.7978, lng: 42.9545 },
      { name: 'إب', lat: 13.9667, lng: 44.1833 },
      { name: 'ذمار', lat: 14.5427, lng: 44.4051 },
      { name: 'سيئون', lat: 15.9333, lng: 48.7833 },
    ],
  },
  {
    id: 'SA',
    name: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    timezone: 3,
    defaultMethod: 'makkah',
    cities: [
      { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579, isOfficialAwqaf: true },
      { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, isOfficialAwqaf: true },
      { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
      { name: 'جدة', lat: 21.5433, lng: 39.1728 },
      { name: 'الدمام', lat: 26.4207, lng: 50.0888 },
      { name: 'الخبر', lat: 26.2172, lng: 50.1971 },
      { name: 'تبوك', lat: 28.3835, lng: 36.5662 },
      { name: 'أبها', lat: 18.2164, lng: 42.5053 },
      { name: 'بريدة', lat: 26.326, lng: 43.975 },
    ],
  },
  {
    id: 'AE',
    name: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    timezone: 4,
    defaultMethod: 'makkah',
    cities: [
      { name: 'أبوظبي', lat: 24.4539, lng: 54.3773 },
      { name: 'دبي', lat: 25.2048, lng: 55.2708 },
      { name: 'الشارقة', lat: 25.3463, lng: 55.4209 },
      { name: 'عجمان', lat: 25.4052, lng: 55.5136 },
      { name: 'رأس الخيمة', lat: 25.7895, lng: 55.9432 },
      { name: 'الفجيرة', lat: 25.1288, lng: 56.3265 },
      { name: 'العين', lat: 24.2075, lng: 55.7447 },
    ],
  },
  {
    id: 'KW',
    name: 'دولة الكويت',
    flag: '🇰🇼',
    timezone: 3,
    defaultMethod: 'kuwait',
    cities: [
      { name: 'مدينة الكويت', lat: 29.3759, lng: 47.9774 },
      { name: 'حولي', lat: 29.3328, lng: 48.0282 },
      { name: 'السالمية', lat: 29.3342, lng: 48.0761 },
      { name: 'الأحمدي', lat: 29.0769, lng: 48.0839 },
      { name: 'الجهراء', lat: 29.3375, lng: 47.6581 },
    ],
  },
  {
    id: 'QA',
    name: 'دولة قطر',
    flag: '🇶🇦',
    timezone: 3,
    defaultMethod: 'qatar',
    cities: [
      { name: 'الدوحة', lat: 25.2854, lng: 51.531 },
      { name: 'الريان', lat: 25.2919, lng: 51.4244 },
      { name: 'الوكرة', lat: 25.1768, lng: 51.6048 },
      { name: 'الخور', lat: 25.6839, lng: 51.5058 },
      { name: 'أم صلال', lat: 25.4131, lng: 51.405 },
    ],
  },
  {
    id: 'OM',
    name: 'سلطنة عمان',
    flag: '🇴🇲',
    timezone: 4,
    defaultMethod: 'mwl',
    cities: [
      { name: 'مسقط', lat: 23.588, lng: 58.3829 },
      { name: 'صلالة', lat: 17.0151, lng: 54.0924 },
      { name: 'صحار', lat: 24.3644, lng: 56.7468 },
      { name: 'نزوى', lat: 22.9333, lng: 57.5333 },
      { name: 'صور', lat: 22.5667, lng: 59.5289 },
    ],
  },
  {
    id: 'EG',
    name: 'جمهورية مصر العربية',
    flag: '🇪🇬',
    timezone: 2,
    defaultMethod: 'egypt',
    cities: [
      { name: 'القاهرة', lat: 30.0444, lng: 31.2357 },
      { name: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
      { name: 'الجيزة', lat: 30.0131, lng: 31.2089 },
      { name: 'بورسعيد', lat: 31.2653, lng: 32.3019 },
      { name: 'الأقصر', lat: 25.6872, lng: 32.6396 },
      { name: 'أسوان', lat: 24.0889, lng: 32.8998 },
    ],
  },
  {
    id: 'JO',
    name: 'المملكة الأردنية الهاشمية',
    flag: '🇯🇴',
    timezone: 3,
    defaultMethod: 'mwl',
    cities: [
      { name: 'عمان', lat: 31.9454, lng: 35.9284 },
      { name: 'الزرقاء', lat: 32.0728, lng: 36.088 },
      { name: 'إربد', lat: 32.5568, lng: 35.8469 },
      { name: 'العقبة', lat: 29.5321, lng: 35.0063 },
    ],
  },
  {
    id: 'PS',
    name: 'دولة فلسطين',
    flag: '🇵🇸',
    timezone: 2,
    defaultMethod: 'mwl',
    cities: [
      { name: 'القدس الشريف', lat: 31.7683, lng: 35.2137 },
      { name: 'غزة', lat: 31.5017, lng: 34.4668 },
      { name: 'رام الله', lat: 31.9038, lng: 35.2034 },
      { name: 'نابلس', lat: 32.2211, lng: 35.2544 },
      { name: 'الخليل', lat: 31.5294, lng: 35.0938 },
    ],
  },
  {
    id: 'IQ',
    name: 'جمهورية العراق',
    flag: '🇮🇶',
    timezone: 3,
    defaultMethod: 'mwl',
    cities: [
      { name: 'بغداد', lat: 33.3152, lng: 44.3661 },
      { name: 'البصرة', lat: 30.5081, lng: 47.7835 },
      { name: 'أربيل', lat: 36.1911, lng: 44.0092 },
      { name: 'النجف الأشرف', lat: 32.0006, lng: 44.3315 },
      { name: 'كربلاء', lat: 32.616, lng: 44.0249 },
      { name: 'الموصل', lat: 36.34, lng: 43.13 },
    ],
  },
  {
    id: 'MA',
    name: 'المملكة المغربية',
    flag: '🇲🇦',
    timezone: 1,
    defaultMethod: 'mwl',
    cities: [
      { name: 'الرباط', lat: 34.0209, lng: -6.8416 },
      { name: 'الدار البيضاء', lat: 33.5731, lng: -7.5898 },
      { name: 'مراكش', lat: 31.6295, lng: -7.9811 },
      { name: 'فاس', lat: 34.0181, lng: -5.0078 },
      { name: 'طنجة', lat: 35.7595, lng: -5.834 },
    ],
  },
  {
    id: 'DZ',
    name: 'الجمهورية الجزائرية',
    flag: '🇩🇿',
    timezone: 1,
    defaultMethod: 'mwl',
    cities: [
      { name: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588 },
      { name: 'وهران', lat: 35.6987, lng: -0.6349 },
      { name: 'قسنطينة', lat: 36.365, lng: 6.6147 },
    ],
  },
  {
    id: 'TN',
    name: 'الجمهورية التونسية',
    flag: '🇹🇳',
    timezone: 1,
    defaultMethod: 'mwl',
    cities: [
      { name: 'تونس العاصمة', lat: 36.8065, lng: 10.1815 },
      { name: 'صفاقس', lat: 34.7406, lng: 10.7603 },
      { name: 'سوسة', lat: 35.8256, lng: 10.6369 },
      { name: 'القيروان', lat: 35.6781, lng: 10.0963 },
    ],
  },
  {
    id: 'TR',
    name: 'الجمهورية التركية',
    flag: '🇹🇷',
    timezone: 3,
    defaultMethod: 'mwl',
    cities: [
      { name: 'إسطنبول', lat: 41.0082, lng: 28.9784 },
      { name: 'أنقرة', lat: 39.9334, lng: 32.8597 },
      { name: 'إزمير', lat: 38.4192, lng: 27.1287 },
      { name: 'قونية', lat: 37.8714, lng: 32.4846 },
    ],
  },
  {
    id: 'GB',
    name: 'المملكة المتحدة',
    flag: '🇬🇧',
    timezone: 0,
    defaultMethod: 'isna',
    cities: [
      { name: 'لندن', lat: 51.5074, lng: -0.1278 },
      { name: 'برمنغهام', lat: 52.4862, lng: -1.8904 },
      { name: 'مانشستر', lat: 53.4808, lng: -2.2426 },
    ],
  },
  {
    id: 'US',
    name: 'الولايات المتحدة الأمريكية',
    flag: '🇺🇸',
    timezone: -5,
    defaultMethod: 'isna',
    cities: [
      { name: 'نيويورك', lat: 40.7128, lng: -74.006 },
      { name: 'شيكاغو', lat: 41.8781, lng: -87.6298 },
      { name: 'لوس أنجلوس', lat: 34.0522, lng: -118.2437 },
      { name: 'هيوستن', lat: 29.7604, lng: -95.3698 },
      { name: 'واشنطن العاصمة', lat: 38.9072, lng: -77.0369 },
    ],
  },
];
