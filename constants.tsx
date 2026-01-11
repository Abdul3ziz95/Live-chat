
import { Country } from './types';

export const COUNTRIES: Country[] = [
  { name: 'السودان', code: '249', iso: 'sd', flag: '🇸🇩' },
  { name: 'المملكة العربية السعودية', code: '966', iso: 'sa', flag: '🇸🇦' },
  { name: 'مصر', code: '20', iso: 'eg', flag: '🇪🇬' },
  { name: 'الإمارات العربية المتحدة', code: '971', iso: 'ae', flag: '🇦🇪' },
  { name: 'الكويت', code: '965', iso: 'kw', flag: '🇰🇼' },
  { name: 'قطر', code: '974', iso: 'qa', flag: '🇶🇦' },
  { name: 'البحرين', code: '973', iso: 'bh', flag: '🇧🇭' },
  { name: 'عمان', code: '968', iso: 'om', flag: '🇴🇲' },
  { name: 'الأردن', code: '962', iso: 'jo', flag: '🇯🇴' },
  { name: 'فلسطين', code: '970', iso: 'ps', flag: '🇵🇸' },
  { name: 'العراق', code: '964', iso: 'iq', flag: '🇮🇶' },
  { name: 'لبنان', code: '961', iso: 'lb', flag: '🇱🇧' },
  { name: 'سوريا', code: '963', iso: 'sy', flag: '🇸🇾' },
  { name: 'اليمن', code: '967', iso: 'ye', flag: '🇾🇪' },
  { name: 'المغرب', code: '212', iso: 'ma', flag: '🇲🇦' },
  { name: 'تونس', code: '216', iso: 'tn', flag: '🇹🇳' },
  { name: 'الجزائر', code: '213', iso: 'dz', flag: '🇩🇿' },
  { name: 'ليبيا', code: '218', iso: 'ly', flag: '🇱🇾' },
  { name: 'الولايات المتحدة', code: '1', iso: 'us', flag: '🇺🇸' },
  { name: 'المملكة المتحدة', code: '44', iso: 'gb', flag: '🇬🇧' },
  { name: 'تركيا', code: '90', iso: 'tr', flag: '🇹🇷' },
  { name: 'ألمانيا', code: '49', iso: 'de', flag: '🇩🇪' },
  { name: 'فرنسا', code: '33', iso: 'fr', flag: '🇫🇷' },
  { name: 'إسبانيا', code: '34', iso: 'es', flag: '🇪🇸' },
  { name: 'إيطاليا', code: '39', iso: 'it', flag: '🇮🇹' },
  { name: 'الهند', code: '91', iso: 'in', flag: '🇮🇳' },
  { name: 'باكستان', code: '92', iso: 'pk', flag: '🇵🇰' },
  { name: 'ماليزيا', code: '60', iso: 'my', flag: '🇲🇾' },
  { name: 'إندونيسيا', code: '62', iso: 'id', flag: '🇮🇩' }
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Sudan as per original app
