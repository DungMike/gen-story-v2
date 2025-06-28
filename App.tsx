import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StoryFormData, ChapterContent } from './types';
import { getStoryTemplates } from './i18nConstants';
import { generateStoryStream } from './services/geminiService';
import { MODELS } from './constant/model-ai';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ChapterCard from './components/ChapterCard';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const storyTemplates = useMemo(() => getStoryTemplates(), [i18n.language]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(storyTemplates[0]?.id || '');
  const [selectedModel, setSelectedModel] = useState<string>(MODELS.GEMINI_2_5_FLASH_001);
  
  const selectedTemplate = useMemo(() => {
    return storyTemplates.find(t => t.id === selectedTemplateId) || storyTemplates[0];
  }, [selectedTemplateId, storyTemplates]);
  
  console.log("🚀 ~ selectedTemplate ~ storyTemplates:", storyTemplates)
  // Default chapter data with sample values
  const getDefaultChapterData = useCallback(() => {
    const data: Record<string, string> = {};
    selectedTemplate?.fields.forEach(field => {
      if (field.options && field.options.length > 0) {
        // Use first option as default for select fields
        data[field.id] = field.options[0];
      } else {
        // Use placeholder for text/textarea fields
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

  // Prevent form submission when pressing Enter in input fields
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      // Only update the current field, don't submit form
      (e.target as HTMLInputElement).blur(); // Remove focus from input
    }
  }, []);

  // Copy story to clipboard
  const handleCopyStory = useCallback(async () => {
    if (generatedStory.length > 0) {
      const storyText = generatedStory[0].content;
      try {
        await navigator.clipboard.writeText(storyText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy story:', err);
      }
    }
  }, [generatedStory]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplateId = e.target.value;
    setSelectedTemplateId(newTemplateId);
    const newTemplate = storyTemplates.find(t => t.id === newTemplateId)!;
    const newChapterData: Record<string, string> = {};
    newTemplate.fields.forEach(field => {
      newChapterData[field.id] = field.placeholder || '';
    });
    setFormData(prev => ({ ...prev, chapters: newChapterData }));
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
      // The UI will render the story in a single container, streaming the content live.
      // The geminiService is updated to inject chapter titles directly into the stream.
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
        
        // Auto-scroll to show the latest content as it streams in.
        storyOutputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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
        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 p-6 md:p-8 space-y-8">
          
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
                    className="w-full md:w-1/2 bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" 
                    min="500"
                    step="100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Character & Setting */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-cyan-400 pl-4">{t('form.sections.characterSetting')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="mainCharacterName" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.mainCharacterName')}</label>
                    <input type="text" name="mainCharacterName" id="mainCharacterName" value={formData.mainCharacterName} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                 <div>
                    <label htmlFor="mainCharacterDesc" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.mainCharacterDesc')}</label>
                    <input type="text" name="mainCharacterDesc" id="mainCharacterDesc" value={formData.mainCharacterDesc} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                 <div>
                    <label htmlFor="setting" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.setting')}</label>
                    <input type="text" name="setting" id="setting" value={formData.setting} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                 <div>
                    <label htmlFor="settingDesc" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.settingDesc')}</label>
                    <input type="text" name="settingDesc" id="settingDesc" value={formData.settingDesc} onChange={handleInputChange} onKeyDown={handleKeyDown} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
            </div>
          </div>
          
          {/* Section 3: Story Structure */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-cyan-400 pl-4">{t('form.sections.structureDetails')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.storyStructure')}</label>
                <select id="template" name="template" value={selectedTemplateId} onChange={handleTemplateChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  {storyTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">{t('form.fields.aiModel')}</label>
                <select 
                  id="model" 
                  name="model" 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)} 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {Object.entries(MODELS).map(([key, value]) => (
                    <option key={key} value={value}>{t(`models.${value}`)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {Object.entries(selectedTemplate?.chapters || {}).map(([chapterNum, chapterTitle]) => {
                const chapterFields = selectedTemplate?.fields.filter(field => field.chapter === parseInt(chapterNum)) || [];
                if (chapterFields.length === 0) return null;
                
                return (
                  <div key={chapterNum} className="p-4 border border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-lg text-purple-300 mb-3">{chapterTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chapterFields.map(field => (
                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <label htmlFor={field.id} className="block text-sm font-medium text-gray-400 mb-1">
                            {field.label}
                          </label>
                          <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                          
                          {field.type === 'select' ? (
                            <div className="space-y-2">
                              <select
                                name={field.id}
                                id={field.id}
                                value={formData.chapters[field.id] || ''}
                                onChange={handleChapterInputChange}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              >
                                <option value="">{t('ui.selectOrCustom')}</option>
                                {field.options?.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                name={field.id}
                                placeholder={t('ui.customInputPlaceholder')}
                                value={formData.chapters[field.id] || ''}
                                onChange={handleChapterInputChange}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              />
                            </div>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              name={field.id}
                              id={field.id}
                              value={formData.chapters[field.id] || ''}
                              onChange={handleChapterInputChange}
                              placeholder={field.placeholder}
                              rows={3}
                              className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                              className="w-full bg-gray-700/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                  <span>{t('form.buttons.generating')}</span>
                </div>
              ) : (
                t('form.buttons.generate')
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Story Output */}
        {generatedStory.length > 0 && (
          <div ref={storyOutputRef} className="mt-12 space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t('app.yourStory')}
              </h2>
              {/* Copy Button - Only show when story generation is complete */}
              
            </div>
            {generatedStory.map((chapter, index) => (
              <ChapterCard key={index} chapter={chapter} index={index} />
            ))}
          </div>
        )}
        {!isLoading && generatedStory[0]?.content && (
                <button
                  onClick={handleCopyStory}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    copySuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white'
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{t('form.buttons.copied')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{t('form.buttons.copyStory')}</span>
                    </>
                  )}
                </button>
              )}
      </main>
    </div>
  );
};

export default App;
