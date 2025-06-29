import React, { useState, useEffect } from 'react';
import { useI18n } from '@/providers/I18nProvider';
import { useParams, useRouter } from 'next/navigation';
import { getStoryByIdFromLocalStorage } from '../services/ttsService';
import Header from '../components/Header';
import { generateMasterPrompt, generateImagePrompt, generateImage, sanitizePromptForSafety } from '../services/generateImageService';

interface StorySegment {
  id: number;
  content: string;
  wordCount: number;
  summary: string;
  imagePrompt: string;
  imageUrl?: string;
}

const ImageGeneratorPage: React.FC = () => {
  const { t } = useI18n();
  const params = useParams();
  const storyId = params?.storyId as string;
  const router = useRouter();
  const [masterPrompt, setMasterPrompt] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [wordsPerSegment, setWordsPerSegment] = useState<number>(1000);
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<number>(0);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isGeneratingMaster, setIsGeneratingMaster] = useState<boolean>(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState<boolean>(false);
  const [autoGenerateProgress, setAutoGenerateProgress] = useState<{ current: number; total: number; currentSegment: string }>({ current: 0, total: 0, currentSegment: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStory = async () => {
      // Get story text by ID from localStorage
      if (storyId) {
        const story = getStoryByIdFromLocalStorage(storyId);
        if (story) {
          setStoryText(story.content);
          generateSegments(story.content, wordsPerSegment);
          
          // Generate master prompt for consistency
          try {
            setIsGeneratingMaster(true);
            const generatedMasterPrompt = await generateMasterPrompt(story.content);
            setMasterPrompt(generatedMasterPrompt);
          } catch (error) {
            console.error('Error generating master prompt:', error);
            // Continue without master prompt if it fails
          } finally {
            setIsGeneratingMaster(false);
          }
        } else {
          // Story not found, redirect to home
          router.push('/');
        }
      } else {
        // No story ID provided, redirect to home
        router.push('/');
      }
    };

    initializeStory();
  }, [storyId, router]);

  const generateSegments = (text: string, wordsPerSeg: number) => {
    const words = text.trim().split(/\s+/);
    const newSegments: StorySegment[] = [];
    
    for (let i = 0; i < words.length; i += wordsPerSeg) {
      const segmentWords = words.slice(i, i + wordsPerSeg);
      const segmentContent = segmentWords.join(' ');
      
      newSegments.push({
        id: Math.floor(i / wordsPerSeg) + 1,
        content: segmentContent,
        wordCount: segmentWords.length,
        summary: '',
        imagePrompt: ''
      });
    }
    
    setSegments(newSegments);
    if (newSegments.length > 0) {
      setSelectedSegment(0);
    }
  };

  const handleWordsPerSegmentChange = (newWordsPerSegment: number) => {
    setWordsPerSegment(newWordsPerSegment);
    if (storyText) {
      generateSegments(storyText, newWordsPerSegment);
    }
  };

  const handleSummaryChange = (segmentIndex: number, summary: string) => {
    const updatedSegments = [...segments];
    updatedSegments[segmentIndex] = { ...updatedSegments[segmentIndex], summary };
    setSegments(updatedSegments);
  };

  const handleImagePromptChange = (segmentIndex: number, prompt: string) => {
    const updatedSegments = [...segments];
    updatedSegments[segmentIndex] = { ...updatedSegments[segmentIndex], imagePrompt: prompt };
    setSegments(updatedSegments);
  };

  const generateSuggestedPrompt = async (segmentIndex: number) => {
    if (!segments[segmentIndex].content) return;
    
    setIsGeneratingPrompt(true);
    setError(null);
    
    try {
      const content = segments[segmentIndex].content;
      let basePrompt = await generateImagePrompt(content);
      
      // Combine with master prompt for consistency
      let finalPrompt = basePrompt;
      if (masterPrompt.trim()) {
        finalPrompt = `${basePrompt}. ${masterPrompt}`;
      }
      
      handleImagePromptChange(segmentIndex, finalPrompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setError(t('imageGen.error.promptGeneration'));
    } finally {
      setIsGeneratingPrompt(false);
    }
  };



  const handleGenerateImage = async (segmentIndex: number) => {
    if (!segments[segmentIndex].imagePrompt) {
      setError(t('imageGen.error.noPrompt'));
      return;
    }
    
    setIsGeneratingImage(true);
    setError(null);
    
    try {
      let prompt = segments[segmentIndex].imagePrompt;
      
      try {
        // Try to generate image with original prompt
        const imageBytes = await generateImage(prompt);
        
        if (imageBytes && imageBytes.length > 0) {
          // Convert base64 to blob URL for the first generated image
          const imageUrl = `data:image/jpeg;base64,${imageBytes[0]}`;
          
          const updatedSegments = [...segments];
          updatedSegments[segmentIndex] = { ...updatedSegments[segmentIndex], imageUrl };
          setSegments(updatedSegments);
        } else {
          throw new Error('No image generated');
        }
      } catch (imageError: any) {
        // If image generation fails due to safety, try to sanitize and retry
        if (imageError.message.includes('blocked') || imageError.message.includes('SAFETY')) {
          console.log('Prompt blocked, attempting to sanitize...');
          
          try {
            const sanitizedPrompt = await sanitizePromptForSafety(prompt);
            console.log('Sanitized prompt:', sanitizedPrompt);
            
            // Update the prompt in the segment
            handleImagePromptChange(segmentIndex, sanitizedPrompt);
            
            // Try again with sanitized prompt
            const imageBytes = await generateImage(sanitizedPrompt);
            
            if (imageBytes && imageBytes.length > 0) {
              const imageUrl = `data:image/jpeg;base64,${imageBytes[0]}`;
              
              const updatedSegments = [...segments];
              updatedSegments[segmentIndex] = { ...updatedSegments[segmentIndex], imageUrl };
              setSegments(updatedSegments);
            } else {
              throw new Error('No image generated after sanitization');
            }
          } catch (sanitizeError) {
            console.error('Failed to sanitize and regenerate:', sanitizeError);
            setError(t('imageGen.error.imageGeneration') + ' - ' + (imageError.message || 'Unknown error'));
          }
        } else {
          throw imageError;
        }
      }
      
    } catch (error: any) {
      console.error('Error generating image:', error);
      setError(t('imageGen.error.imageGeneration') + ' - ' + (error.message || 'Unknown error'));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAutoGenerateAll = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmAutoGenerate = async () => {
    setShowConfirmDialog(false);
    setIsAutoGenerating(true);
    setError(null);
    
    const segmentsToGenerate = segments.filter((_, index) => !segments[index].imageUrl);
    const totalSegments = segmentsToGenerate.length;
    
    if (totalSegments === 0) {
      setError(t('imageGen.error.allImagesGenerated'));
      setIsAutoGenerating(false);
      return;
    }

    setAutoGenerateProgress({ current: 0, total: totalSegments, currentSegment: '' });

    // Keep track of current segments state locally to ensure consistency
    let currentSegments = [...segments];
    let processedCount = 0;

    for (let i = 0; i < currentSegments.length; i++) {
      if (currentSegments[i].imageUrl) {
        continue; // Skip already generated images
      }

      try {
        processedCount++;
        setAutoGenerateProgress(prev => ({
          ...prev,
          current: processedCount,
          currentSegment: `${t('imageGen.segments.segment')} ${currentSegments[i].id}`
        }));

        // Generate prompt if not exists
        let currentPrompt = currentSegments[i].imagePrompt;
        if (!currentPrompt) {
          const content = currentSegments[i].content;
          let basePrompt = await generateImagePrompt(content);
          
          if (masterPrompt.trim()) {
            basePrompt = `${basePrompt}. ${masterPrompt}`;
          }
          
          currentPrompt = basePrompt;
          currentSegments[i] = { ...currentSegments[i], imagePrompt: currentPrompt };
          handleImagePromptChange(i, currentPrompt);
          
          // Wait a bit for state to update
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Generate image
        if (currentPrompt) {
          try {
            const imageBytes = await generateImage(currentPrompt);
            
            if (imageBytes && imageBytes.length > 0) {
              const imageUrl = `data:image/jpeg;base64,${imageBytes[0]}`;
              
              currentSegments[i] = { ...currentSegments[i], imageUrl };
              setSegments([...currentSegments]);
            }
          } catch (imageError: any) {
            // Try to sanitize if blocked
            if (imageError.message.includes('blocked') || imageError.message.includes('SAFETY')) {
              try {
                const sanitizedPrompt = await sanitizePromptForSafety(currentPrompt);
                currentSegments[i] = { ...currentSegments[i], imagePrompt: sanitizedPrompt };
                handleImagePromptChange(i, sanitizedPrompt);
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const imageBytes = await generateImage(sanitizedPrompt);
                
                if (imageBytes && imageBytes.length > 0) {
                  const imageUrl = `data:image/jpeg;base64,${imageBytes[0]}`;
                  
                  currentSegments[i] = { ...currentSegments[i], imageUrl };
                  setSegments([...currentSegments]);
                }
              } catch (sanitizeError) {
                console.error(`Failed to generate image for segment ${i + 1}:`, sanitizeError);
              }
            }
          }
        }

        // Wait between requests to avoid rate limiting (5 seconds)
        if (processedCount < totalSegments) {
          setAutoGenerateProgress(prev => ({
            ...prev,
            currentSegment: t('imageGen.autoGenerate.waitingNext')
          }));
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

      } catch (error) {
        console.error(`Error processing segment ${i + 1}:`, error);
        // Continue with next segment even if current one fails
      }
    }

    setIsAutoGenerating(false);
    setAutoGenerateProgress({ current: 0, total: 0, currentSegment: '' });
  };

  const handleCancelAutoGenerate = () => {
    setShowConfirmDialog(false);
  };

  const handleDownloadAllImages = () => {
    const imagesWithUrl = segments.filter(segment => segment.imageUrl);
    
    if (imagesWithUrl.length === 0) {
      setError(t('imageGen.error.noImagesToDownload'));
      return;
    }

    imagesWithUrl.forEach((segment, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = segment.imageUrl!;
        link.download = `story_image_segment_${segment.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // Delay each download by 500ms to avoid browser blocking
    });
  };

  const handleGoToVoice = () => {
    if (storyId) {
      router.push(`/voice/${storyId}`);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {/* Navigation */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('imageGen.navigation.backToHome')}</span>
          </button>
          
          <button
            onClick={handleGoToVoice}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4-3.207a1 1 0 01-.383-.79V6.207a1 1 0 01.383-.79l4-3.207a1 1 0 01.617-.134zM14 8.586V14a1 1 0 102 0V8.586l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L14 8.586z" clipRule="evenodd" />
            </svg>
            <span>{t('imageGen.navigation.goToVoice')}</span>
          </button>

          {/* Download All Images Button */}
          {segments.some(segment => segment.imageUrl) && (
            <button
              onClick={handleDownloadAllImages}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('imageGen.downloadAll')}</span>
              <span className="text-xs bg-blue-800 px-2 py-1 rounded">
                {segments.filter(segment => segment.imageUrl).length}
              </span>
            </button>
          )}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 p-6 md:p-8 space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              {t('imageGen.title')}
            </h1>
            <p className="text-gray-400">{t('imageGen.description')}</p>
          </div>

          {/* Settings */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">{t('imageGen.settings.title')}</h3>
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm text-gray-400">{t('imageGen.settings.wordsPerSegment')}:</label>
              <input
                type="number"
                value={wordsPerSegment}
                onChange={(e) => handleWordsPerSegmentChange(parseInt(e.target.value) || 1000)}
                min="100"
                max="5000"
                step="100"
                className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white w-24"
              />
              <span className="text-sm text-gray-400">
                {t('imageGen.settings.totalSegments')}: <span className="font-semibold text-cyan-400">{segments.length}</span>
              </span>
            </div>
            
            {/* Master Prompt Status */}
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">{t('imageGen.settings.masterPrompt')}:</h4>
              {isGeneratingMaster ? (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                  <span>{t('imageGen.settings.generatingMasterPrompt')}</span>
                </div>
              ) : masterPrompt ? (
                <div className="bg-gray-800/50 rounded p-2 text-xs text-gray-300 max-h-20 overflow-y-auto">
                  {masterPrompt}
                </div>
              ) : (
                <div className="text-xs text-gray-500">{t('imageGen.settings.noMasterPrompt')}</div>
              )}
            </div>

            {/* Auto Generate All Button */}
            <div className="border-t border-gray-600 pt-4">
              <button
                onClick={handleAutoGenerateAll}
                disabled={isAutoGenerating || isGeneratingImage || isGeneratingPrompt || segments.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
              >
                {isAutoGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{t('imageGen.autoGenerate.generating')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{t('imageGen.autoGenerate.title')}</span>
                  </>
                )}
              </button>
              
              {/* Auto Generate Progress */}
              {isAutoGenerating && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{t('imageGen.autoGenerate.progress')}</span>
                    <span>{autoGenerateProgress.current}/{autoGenerateProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: autoGenerateProgress.total > 0 
                          ? `${(autoGenerateProgress.current / autoGenerateProgress.total) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  {autoGenerateProgress.currentSegment && (
                    <div className="text-xs text-gray-400">
                      {t('imageGen.autoGenerate.currentSegment')}: {autoGenerateProgress.currentSegment}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Segments List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">{t('imageGen.segments.title')} ({segments.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {segments.map((segment, index) => (
                  <button
                    key={segment.id}
                    onClick={() => setSelectedSegment(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      selectedSegment === index
                        ? 'bg-purple-600/30 border-purple-500 text-white'
                        : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t('imageGen.segments.segment')} {segment.id}</span>
                      {segment.imageUrl && (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {segment.wordCount} {t('imageGen.segments.words')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-2">
              {segments.length > 0 && (
                <div className="space-y-6">
                  {/* Segment Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                      {t('imageGen.content.title')} {segments[selectedSegment]?.id}
                    </h3>
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 max-h-64 overflow-y-auto">
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                        {segments[selectedSegment]?.content}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">{t('imageGen.summary.title')}</h3>
                    <textarea
                      value={segments[selectedSegment]?.summary || ''}
                      onChange={(e) => handleSummaryChange(selectedSegment, e.target.value)}
                      placeholder={t('imageGen.summary.placeholder')}
                      className="w-full bg-gray-700/30 border border-gray-600 rounded-lg p-3 text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Image Prompt */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-400">{t('imageGen.prompt.title')}</h3>
                      <button
                        onClick={() => generateSuggestedPrompt(selectedSegment)}
                        disabled={isGeneratingPrompt}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                      >
                        {isGeneratingPrompt ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                        <span>{t('imageGen.prompt.suggest')}</span>
                      </button>
                    </div>
                    <textarea
                      value={segments[selectedSegment]?.imagePrompt || ''}
                      onChange={(e) => handleImagePromptChange(selectedSegment, e.target.value)}
                      placeholder={t('imageGen.prompt.placeholder')}
                      className="w-full bg-gray-700/30 border border-gray-600 rounded-lg p-3 text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Generate Image Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleGenerateImage(selectedSegment)}
                      disabled={isGeneratingImage || !segments[selectedSegment]?.imagePrompt}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      {isGeneratingImage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span>{t('imageGen.generate')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-pink-400 mb-4">{t('imageGen.preview.title')}</h3>
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                {segments[selectedSegment]?.imageUrl ? (
                  <div className="space-y-3">
                    <img
                      src={segments[selectedSegment].imageUrl}
                      alt={`Segment ${segments[selectedSegment].id}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = segments[selectedSegment].imageUrl!;
                        link.download = `story_image_segment_${segments[selectedSegment].id}.jpg`;
                        link.click();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{t('imageGen.download')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">{t('imageGen.preview.noImage')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-600 p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{t('imageGen.confirm.title')}</h3>
                  <p className="text-sm text-gray-400">{t('imageGen.confirm.subtitle')}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-300 text-sm">
                  {t('imageGen.confirm.message') || 'This will generate images for'} {segments.filter((_, index) => !segments[index].imageUrl).length} {t('imageGen.confirm.segments') || 'segments'}.
                </p>
                
                <div className="bg-gray-700/50 rounded-lg p-3 text-xs text-gray-400">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-blue-400">{t('imageGen.confirm.note')}</span>
                  </div>
                  <ul className="space-y-1 ml-6">
                    <li>• {t('imageGen.confirm.notePoint1')}</li>
                    <li>• {t('imageGen.confirm.notePoint2')}</li>
                    <li>• {t('imageGen.confirm.notePoint3')}</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelAutoGenerate}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors"
                >
                  {t('ui.cancel')}
                </button>
                <button
                  onClick={handleConfirmAutoGenerate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t('imageGen.confirm.proceed')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageGeneratorPage; 