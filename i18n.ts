// Simple i18n utility for non-React files
import { translations } from './lib/i18n';

type Language = 'en' | 'vi';

class SimpleI18n {
  private currentLanguage: Language = 'vi';

  constructor() {
    // Try to get language from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved && (saved === 'en' || saved === 'vi')) {
        this.currentLanguage = saved;
      }
    }
  }

  t = (key: string, options?: { returnObjects?: boolean }): any => {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (options?.returnObjects && Array.isArray(value)) {
      return value;
    }
    
    return value || key;
  };

  changeLanguage = (lng: Language) => {
    this.currentLanguage = lng;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lng);
    }
  };

  get language() {
    return this.currentLanguage;
  }
}

const i18n = new SimpleI18n();

export default i18n; 