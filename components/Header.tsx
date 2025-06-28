
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="text-center p-6 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
        {t('app.title')}
      </h1>
      <p className="mt-2 text-lg text-gray-300">
        {t('app.subtitle')}
      </p>
    </header>
  );
};

export default Header;
