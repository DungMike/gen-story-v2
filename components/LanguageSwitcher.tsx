'use client';

import React from 'react';
import { useI18n } from '@/providers/I18nProvider';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300 border border-gray-600 hover:border-gray-500"
    >
      <span className="text-sm font-medium">
        {language === 'vi' ? '🇻🇳' : '🇺🇸'}
      </span>
      <span className="text-sm font-medium uppercase">
        {language}
      </span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    </button>
  );
};

export default LanguageSwitcher; 