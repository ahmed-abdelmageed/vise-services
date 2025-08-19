
export type Language = 'ar' | 'en';

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export interface Translations {
  [key: string]: string;
}

export interface TranslationDictionary {
  en: Translations;
  ar: Translations;
}
