
import React from 'react';
import { useI18n } from '@/providers/I18nProvider';
import { ChapterContent } from '../types';

interface ChapterCardProps {
  chapter: ChapterContent;
  index: number;
  onCopy?: () => void;
  copySuccess?: boolean;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index, onCopy, copySuccess }) => {
  const { t } = useI18n();

  const handleCopy = async () => {
    if (chapter.content) {
      try {
        await navigator.clipboard.writeText(chapter.content);
        if (onCopy) onCopy();
      } catch (err) {
        console.error('Failed to copy story:', err);
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 mb-8 p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
          {chapter.title}
        </h3>
        {onCopy && chapter.content && (
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              copySuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white'
            }`}
          >
            {copySuccess ? t('form.buttons.copied') : t('form.buttons.copyStory')}
          </button>
        )}
      </div>
      <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
        {chapter.content}
      </div>
    </div>
  );
};

export default ChapterCard;
