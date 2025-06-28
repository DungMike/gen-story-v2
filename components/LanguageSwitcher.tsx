import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-300">{t('ui.languageSelector')}:</span>
      <div className="flex space-x-1">
        <button
          onClick={() => changeLanguage('vi')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            i18n.language === 'vi'
              ? 'bg-cyan-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          VI
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            i18n.language === 'en'
              ? 'bg-cyan-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 