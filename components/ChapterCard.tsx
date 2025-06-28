
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChapterContent } from '../types';

interface ChapterCardProps {
  chapter: ChapterContent;
  index: number;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 mb-8 p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
        {chapter.title}
      </h3>
      <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
        {chapter.content}
      </div>
    </div>
  );
};

export default ChapterCard;
