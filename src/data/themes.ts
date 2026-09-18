import { ThemeItem } from '../types';

export const ARABESQUE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><g fill="none" stroke="#e0a96d" stroke-width="0.75" opacity="0.6"><path d="M40 0 L48 12 L60 8 L56 20 L68 24 L60 32 L72 40 L60 48 L68 56 L56 60 L60 72 L48 68 L40 80 L32 68 L20 72 L24 60 L12 56 L20 48 L8 40 L20 32 L12 24 L24 20 L20 8 L32 12 Z"/><path d="M0 40 L80 40 M40 0 L40 80 M0 0 L80 80 M80 0 L0 80"/><circle cx="40" cy="40" r="16"/><circle cx="0" cy="0" r="16"/><circle cx="80" cy="0" r="16"/><circle cx="0" cy="80" r="16"/><circle cx="80" cy="80" r="16"/></g></svg>`;

export const ARABESQUE_DATA_URI =
  'data:image/svg+xml;utf8,' + encodeURIComponent(ARABESQUE_SVG);

export const THEMES: ThemeItem[] = [
  {
    id: 0,
    name: 'أحمر خمري أندلسي (الافتراضي)',
    bg: 'radial-gradient(circle at 50% 25%, #85101a 0%, #5c080f 50%, #320306 100%)',
    opacity: 0.22,
    borderPreview: '#991b1b',
  },
  {
    id: 1,
    name: 'كحلي ملكي إسلامي',
    bg: 'radial-gradient(circle at 50% 25%, #133261 0%, #091a38 60%, #030a17 100%)',
    opacity: 0.18,
    borderPreview: '#1e3a8a',
  },
  {
    id: 2,
    name: 'أخضر مسجدي زمردي',
    bg: 'radial-gradient(circle at 50% 25%, #0f4a2f 0%, #08291a 60%, #02120a 100%)',
    opacity: 0.2,
    borderPreview: '#065f46',
  },
  {
    id: 3,
    name: 'رخام أبيض وذهبي',
    bg: 'radial-gradient(circle at 50% 25%, #f7f9fc 0%, #e2e8f0 60%, #cbd5e1 100%)',
    opacity: 0.12,
    borderPreview: '#e2e8f0',
    light: true,
  },
  {
    id: 4,
    name: 'كعبة مشرفة أسود وذهب',
    bg: 'radial-gradient(circle at 50% 25%, #222227 0%, #121216 60%, #050507 100%)',
    opacity: 0.16,
    borderPreview: '#3f3f46',
  },
  {
    id: 5,
    name: 'سماء الغسق الياقوتي',
    bg: 'radial-gradient(circle at 50% 25%, #212254 0%, #111233 60%, #07081c 100%)',
    opacity: 0.18,
    borderPreview: '#312e81',
  },
  {
    id: 6,
    name: 'رمال الصحراء الذهبية',
    bg: 'radial-gradient(circle at 50% 25%, #52391b 0%, #31200b 60%, #170d03 100%)',
    opacity: 0.2,
    borderPreview: '#78350f',
  },
  {
    id: 7,
    name: 'دمشقي عتيق',
    bg: 'radial-gradient(circle at 50% 25%, #42182e 0%, #290b1c 60%, #13040c 100%)',
    opacity: 0.2,
    borderPreview: '#831843',
  },
  {
    id: 8,
    name: 'المسجد النبوي الشريف',
    bg: 'radial-gradient(circle at 50% 25%, #0e423f 0%, #072624 60%, #021312 100%)',
    opacity: 0.22,
    borderPreview: '#115e59',
  },
  {
    id: 9,
    name: 'أسود مريح OLED',
    bg: '#000000',
    opacity: 0.12,
    borderPreview: '#18181b',
  },
  {
    id: 10,
    name: 'فيروزي إسلامي',
    bg: 'radial-gradient(circle at 50% 25%, #0f4f61 0%, #072d38 60%, #02151b 100%)',
    opacity: 0.18,
    borderPreview: '#155e75',
  },
  {
    id: 11,
    name: 'خشب أندلسي منحوت',
    bg: 'radial-gradient(circle at 50% 25%, #3d2718 0%, #26160c 60%, #110905 100%)',
    opacity: 0.2,
    borderPreview: '#7c2d12',
  },
  {
    id: 12,
    name: 'رمادي الحرم المكي',
    bg: 'radial-gradient(circle at 50% 25%, #28303d 0%, #161c24 60%, #090c10 100%)',
    opacity: 0.16,
    borderPreview: '#334155',
  },
  {
    id: 13,
    name: 'عقيق يماني أحمر',
    bg: 'radial-gradient(circle at 50% 25%, #570e0e 0%, #330505 60%, #140101 100%)',
    opacity: 0.22,
    borderPreview: '#991b1b',
  },
  {
    id: 14,
    name: 'زجاج معشق أزرق',
    bg: 'radial-gradient(circle at 50% 25%, #291e57 0%, #140d33 60%, #070417 100%)',
    opacity: 0.18,
    borderPreview: '#4c1d95',
  },
  {
    id: 15,
    name: 'فجر هادئ ندي',
    bg: 'radial-gradient(circle at 50% 25%, #1b4544 0%, #0e2928 60%, #041413 100%)',
    opacity: 0.18,
    borderPreview: '#042f2e',
  },
  {
    id: 16,
    name: 'إسلامي كحلي حديث',
    bg: 'radial-gradient(circle at 50% 25%, #1e2a40 0%, #0e1724 60%, #04080e 100%)',
    opacity: 0.17,
    borderPreview: '#1e293b',
  },
  {
    id: 17,
    name: 'أحمر قرمزي ملكي بحريني',
    bg: 'radial-gradient(circle at 50% 25%, #630c1d 0%, #3d0410 60%, #1c0106 100%)',
    opacity: 0.22,
    borderPreview: '#881337',
  },
];
