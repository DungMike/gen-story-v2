import { useTranslation } from 'react-i18next';
import { getStoryTemplates, getStylePrompt } from '../i18nConstants';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: 'vi' | 'en') => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language as 'vi' | 'en';
  };

  const getLocalizedTemplates = () => {
    return getStoryTemplates();
  };

  const getLocalizedStylePrompt = () => {
    return getStylePrompt();
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    getLocalizedTemplates,
    getLocalizedStylePrompt,
    isVietnamese: i18n.language === 'vi',
    isEnglish: i18n.language === 'en'
  };
};

export default useI18n; 