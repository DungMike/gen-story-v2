import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { StoryFormData, ChapterContent } from '../types';
import { getStoryTemplates } from '../i18nConstants';
import { generateStoryStream } from '../services/geminiService';
import { saveStoryToLocalStorage, StoredStory } from '../services/ttsService';
import { MODELS } from '../constant/model-ai';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ChapterCard from '../components/ChapterCard';

const StoryCreatorPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  
  const storyTemplates = useMemo(() => getStoryTemplates(), [i18n.language]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId || storyTemplates[0]?.id || '');
  const [selectedModel, setSelectedModel] = useState<string>(MODELS.GEMINI_2_5_FLASH_001);
  
  const selectedTemplate = useMemo(() => {
    return storyTemplates.find(t => t.id === selectedTemplateId) || storyTemplates[0];
  }, [selectedTemplateId, storyTemplates]);

  // Update selected template when URL changes
  useEffect(() => {
    if (templateId && templateId !== selectedTemplateId) {
      setSelectedTemplateId(templateId);
    }
  }, [templateId, selectedTemplateId]);

  // Default chapter data with sample values
  const getDefaultChapterData = useCallback(() => {
    const data: Record<string, string> = {};
    selectedTemplate?.fields.forEach(field => {
      if (field.options && field.options.length > 0) {
        data[field.id] = field.options[0];
      } else {
        data[field.id] = field.placeholder || '';
      }
    });
    return data;
  }, [selectedTemplate]);

  const initialChapterData = useMemo(() => {
    return getDefaultChapterData();
  }, [getDefaultChapterData]);

  const [formData, setFormData] = useState<StoryFormData>({
    topic: i18n.language === 'vi' ? 'Án mạng tâm linh ở một thị trấn hẻo lánh' : 'Spiritual murder case in a remote town',
    narrativeStyle: i18n.language === 'vi' ? 'Hồi hộp, kịch tính, có yếu tố trinh thám và bí ẩn' : 'Suspenseful, dramatic, with detective and mystery elements',
    mainCharacterName: i18n.language === 'vi' ? 'Thám tử Kiên' : 'Detective Alex',
    mainCharacterDesc: i18n.language === 'vi' ? 'một thám tử tư dày dặn kinh nghiệm nhưng hoài nghi về thế giới siêu nhiên' : 'an experienced private detective who is skeptical about the supernatural world',
    setting: i18n.language === 'vi' ? 'Thị trấn Sương Mù' : 'Foggy Town',
    settingDesc: i18n.language === 'vi' ? 'Một thị trấn nhỏ, hẻo lánh nằm sâu trong vùng núi cao, quanh năm bao phủ bởi sương mù dày đặc và những lời đồn đại ma quái' : 'A small, remote town deep in the high mountains, year-round covered by thick fog and haunted by ghostly rumors',
    chapters: initialChapterData,
    wordCount: 3000,
  });

  const [generatedStory, setGeneratedStory] = useState<ChapterContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const storyOutputRef = useRef<HTMLDivElement>(null);

  // Update form data when language or template changes
  useEffect(() => {
    const newChapterData = getDefaultChapterData();
    
    setFormData(prev => ({
      ...prev,
      chapters: newChapterData
    }));
  }, [i18n.language, selectedTemplate, getDefaultChapterData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberInput = (e.target as HTMLInputElement).type === 'number';

    setFormData(prev => ({ 
        ...prev, 
        [name]: isNumberInput ? parseInt(value, 10) || 0 : value 
    }));
  }, []);

  const handleChapterInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [name]: value,
      },
    }));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  }, []);

  const handleCopyStory = useCallback(async () => {
    if (generatedStory.length > 0) {
      const storyText = generatedStory[0].content;
      try {
        await navigator.clipboard.writeText(storyText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy story:', err);
      }
    }
  }, [generatedStory]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplateId = e.target.value;
    setSelectedTemplateId(newTemplateId);
    // Update URL when template changes
    navigate(`/template/${newTemplateId}`);
    const newTemplate = storyTemplates.find(t => t.id === newTemplateId)!;
    const newChapterData: Record<string, string> = {};
    newTemplate.fields.forEach(field => {
      newChapterData[field.id] = field.placeholder || '';
    });
    setFormData(prev => ({ ...prev, chapters: newChapterData }));
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToVoice = () => {
    if (generatedStory[0]?.content) {
      // Save story to localStorage before navigating and get the UUID
      const storyId = saveStoryToLocalStorage(generatedStory[0].content, selectedTemplate?.name);
      // Navigate to voice page with story ID as URL param
      navigate(`/voice/${storyId}`);
    }
  };

  const handleGoToImage = () => {
    if (generatedStory[0]?.content) {
      // Save story to localStorage before navigating and get the UUID
      const storyId = saveStoryToLocalStorage(generatedStory[0].content, selectedTemplate?.name);
      // Navigate to image page with story ID as URL param
      navigate(`/image/${storyId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setGeneratedStory([]);

    setTimeout(() => {
      storyOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const storyContainer: ChapterContent = { title: t('app.yourStory'), content: "" };
      setGeneratedStory([storyContainer]);
      
      const stream = generateStoryStream(formData, selectedTemplate, selectedModel);
      
      for await (const chunk of stream) {
        setGeneratedStory(prev => {
          const newStory = [...prev];
          if (newStory.length > 0) {
            newStory[0].content += chunk;
          }
          return newStory;
        });
        
        storyOutputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }

      // Save story to localStorage when generation is complete
      if (storyContainer.content) {
        saveStoryToLocalStorage(storyContainer.content, selectedTemplate?.name);
      }

    } catch (err) {
      console.error(err);
      setError(t('app.generateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('creator.navigation.backToHome')}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 p-6 md:p-8 space-y-8">
          
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              {t('creator.title')}
            </h1>
            <p className="text-gray-400">{t('creator.description')}</p>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-purple-400 pl-4">{t('creator.template.title')}</h2>
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-2">{t('creator.template.select')}</label>
              <select
                id="template"
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {storyTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Section 1: Core Idea */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-cyan-400 pl-4">{t('form.sections.coreIdea')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.mainTopic')}</label>
                <input type="text" name="topic" id="topic" value={formData.topic} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div>
                <label htmlFor="wordCount" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.wordCount')}</label>
                <input 
                    type="number" 
                    name="wordCount" 
                    id="wordCount" 
                    value={formData.wordCount} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown}
                    min="500" 
                    max="50000" 
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" 
                />
              </div>
            </div>
            <div>
              <label htmlFor="narrativeStyle" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.narrativeStyle')}</label>
              <textarea name="narrativeStyle" id="narrativeStyle" value={formData.narrativeStyle} onChange={handleInputChange} onKeyDown={handleKeyDown} rows={2} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>

          {/* Section 2: Characters */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-green-400 pl-4">{t('form.sections.characters')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mainCharacterName" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.mainCharacterName')}</label>
                <input type="text" name="mainCharacterName" id="mainCharacterName" value={formData.mainCharacterName} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label htmlFor="mainCharacterDesc" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.mainCharacterDesc')}</label>
                <textarea name="mainCharacterDesc" id="mainCharacterDesc" value={formData.mainCharacterDesc} onChange={handleInputChange} onKeyDown={handleKeyDown} rows={2} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
            </div>
          </div>

          {/* Section 3: Setting */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-yellow-400 pl-4">{t('form.sections.setting')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="setting" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.setting')}</label>
                <input type="text" name="setting" id="setting" value={formData.setting} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label htmlFor="settingDesc" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.settingDesc')}</label>
                <textarea name="settingDesc" id="settingDesc" value={formData.settingDesc} onChange={handleInputChange} onKeyDown={handleKeyDown} rows={2} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
          </div>

          {/* Section 4: Chapter Details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-purple-400 pl-4">{t('form.sections.chapterDetails')}</h2>
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">{selectedTemplate?.name}</h3>
              {selectedTemplate?.fields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                  </label>
                  {field.description && (
                    <p className="text-xs text-gray-400 mb-2">{field.description}</p>
                  )}
                  {field.type === 'select' && field.options ? (
                    <select
                      name={field.id}
                      id={field.id}
                      value={formData.chapters[field.id] || ''}
                      onChange={handleChapterInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-gray-600/50 border border-gray-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {field.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      name={field.id}
                      id={field.id}
                      value={formData.chapters[field.id] || ''}
                      onChange={handleChapterInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-gray-600/50 border border-gray-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.id}
                      id={field.id}
                      value={formData.chapters[field.id] || ''}
                      onChange={handleChapterInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-600/50 border border-gray-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-blue-400 pl-4">{t('form.sections.model')}</h2>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">{t('form.fields.model')}</label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {Object.entries(MODELS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {t(`models.${value}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                  <span>{t('app.generating')}</span>
                </div>
              ) : (
                t('app.generateStory')
              )}
            </button>
          </div>
        </form>

        {/* Generated Story Section */}
        {(generatedStory.length > 0 || error) && (
          <div ref={storyOutputRef} className="mt-8 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 p-6 md:p-8">
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200 mb-6">
                {error}
              </div>
            )}
            
            {generatedStory.length > 0 && (
              <div className="space-y-6">
                {generatedStory.map((chapter, index) => (
                  <ChapterCard 
                    key={index} 
                    chapter={chapter} 
                    onCopy={() => handleCopyStory}
                    copySuccess={copySuccess}
                  />
                ))}

                {/* Action buttons */}
                {generatedStory[0]?.content && !isLoading && (
                  <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-gray-700">
                    <button
                      onClick={handleGoToVoice}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4-3.207a1 1 0 01-.383-.79V6.207a1 1 0 01.383-.79l4-3.207a1 1 0 01.617-.134zM14 8.586V14a1 1 0 102 0V8.586l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L14 8.586z" clipRule="evenodd" />
                      </svg>
                      <span>{t('creator.actions.convertToVoice')}</span>
                    </button>
                    
                    <button
                      onClick={handleGoToImage}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{t('creator.actions.generateImages')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StoryCreatorPage; 