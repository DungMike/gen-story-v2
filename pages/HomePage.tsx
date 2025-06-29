'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/providers/I18nProvider';
import Header from '@/components/Header';

const HomePage: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const [wordCount, setWordCount] = useState<number>(3000);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('mystery');

  // Floating particles animation
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: linear-gradient(45deg, #06b6d4, #8b5cf6);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        z-index: 0;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        box-shadow: 0 0 6px #06b6d4;
      `;
      document.body.appendChild(particle);

      const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: 0 },
        { transform: 'translateY(-20px)', opacity: 1 },
        { transform: 'translateY(-100vh)', opacity: 0 }
      ], {
        duration: 8000 + Math.random() * 4000,
        easing: 'linear'
      });

      animation.onfinish = () => particle.remove();
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  const handleStartCreating = () => {
    // Navigate to story creation with selected template
    router.push(`/template/${selectedTemplate}`);
  };

  const templates = [
    { id: 'mystery', name: t('homepage.templates.mystery'), icon: '🔍' },
    { id: 'romance', name: t('homepage.templates.romance'), icon: '💝' },
    { id: 'scifi', name: t('homepage.templates.scifi'), icon: '🚀' },
    { id: 'fantasy', name: t('homepage.templates.fantasy'), icon: '⚔️' },
    { id: 'horror', name: t('homepage.templates.horror'), icon: '👻' },
    { id: 'adventure', name: t('homepage.templates.adventure'), icon: '🗺️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            {t('homepage.hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('homepage.hero.subtitle')}
          </p>
          
          <button
            onClick={handleStartCreating}
            className="group relative inline-flex items-center px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              {t('homepage.hero.cta')}
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-25 animate-ping"></div>
      </section>

      {/* Template Selection Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('homepage.templates.title')}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('homepage.templates.subtitle')}
            </p>
          </div>

          {/* Word Count Slider */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-700/50">
            <div className="max-w-2xl mx-auto">
              <label className="block text-lg font-medium text-gray-200 mb-4 text-center">
                {t('homepage.wordCount.label')}: <span className="text-cyan-400 font-bold">{wordCount.toLocaleString()}</span> {t('homepage.wordCount.words')}
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>1,000</span>
                  <span>5,500</span>
                  <span>10,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedTemplate === template.id
                    ? 'bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-cyan-400 shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {template.name}
                </div>
              </button>
            ))}
          </div>

          {/* Create Story and Dashboard Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={handleStartCreating}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
              </svg>
              {t('homepage.createStory')}
            </button>
            
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center px-6 py-3 text-base font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Xem truyện đã tạo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('homepage.features.title')}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t('homepage.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Story Generation */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('homepage.features.story.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('homepage.features.story.description')}</p>
            </div>

            {/* Feature 2: Voice Conversion */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4-3.207a1 1 0 01-.383-.79V6.207a1 1 0 01.383-.79l4-3.207a1 1 0 01.617-.134zM14 8.586V14a1 1 0 102 0V8.586l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L14 8.586z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('homepage.features.voice.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('homepage.features.voice.description')}</p>
            </div>

            {/* Feature 3: Image Generation */}
            <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('homepage.features.image.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('homepage.features.image.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">{t('homepage.footer.copyright')}</p>
        </div>
      </footer>

      {/* Custom CSS for slider */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
};

export default HomePage; 