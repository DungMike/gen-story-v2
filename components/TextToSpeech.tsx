import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertTextToSpeech, TTSProgress, downloadAllAudioFiles } from '../services/ttsService';
import LoadingSpinner from './LoadingSpinner';

interface TextToSpeechProps {
  storyText: string;
  onBack: () => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ storyText, onBack }) => {
  const { t } = useTranslation();
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<TTSProgress | null>(null);
  const [audioFiles, setAudioFiles] = useState<Array<{blob: Blob, filename: string, url: string}>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleConvertToSpeech = async () => {
    if (!storyText) {
      setError(t('tts.noStoryToConvert'));
      return;
    }

    setIsConverting(true);
    setError(null);
    setProgress(null);
    setAudioFiles([]);

    try {
      const files = await convertTextToSpeech(storyText, (progressData) => {
        setProgress(progressData);
      });
      
      setAudioFiles(files);
      setProgress({
        current: files.length,
        total: files.length,
        currentChunk: t('tts.completed'),
        status: 'completed'
      });
    } catch (err) {
      console.error('Error converting to speech:', err);
      setError(t('tts.error'));
      setProgress({
        current: 0,
        total: 0,
        currentChunk: t('tts.error'),
        status: 'error'
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadFile = (file: {blob: Blob, filename: string, url: string}) => {
    // Download individual audio file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllFiles = () => {
    downloadAllAudioFiles(audioFiles);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 p-6 md:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t('tts.title')}
              </h1>
              <p className="text-gray-400 mt-2">{t('tts.description')}</p>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              {t('ui.back')}
            </button>
          </div>

          {/* Story Preview */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Story Preview:</h3>
            <div className="text-gray-300 text-sm max-h-32 overflow-y-auto">
              {storyText.substring(0, 500)}...
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Total words: ~{storyText.split(/\s+/).length}
            </p>
          </div>

          {/* Convert Button */}
          {!isConverting && audioFiles.length === 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleConvertToSpeech}
                disabled={!storyText}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {t('tts.generateVoice')}
              </button>
            </div>
          )}

          {/* Progress Display */}
          {isConverting && progress && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <LoadingSpinner />
                  <span className="text-lg font-semibold text-cyan-400">
                    {t('tts.generatingVoice')}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-300">
                  {t('tts.processing', { current: progress.current, total: progress.total })}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {progress.currentChunk}
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Audio Files Display */}
          {audioFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-semibold text-green-400">
                  {t('tts.completed')}
                </span>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-300">
                    {t('tts.downloadFiles')} ({audioFiles.length} files)
                  </h3>
                  <button
                    onClick={handleDownloadAllFiles}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Download All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {audioFiles.map((file, index) => (
                    <div key={index} className="bg-gray-600/50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4-3.207a1 1 0 01-.383-.79V6.207a1 1 0 01.383-.79l4-3.207a1 1 0 01.617-.134zM14 8.586V14a1 1 0 102 0V8.586l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L14 8.586z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Part {index + 1}</span>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Convert Another Story Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setAudioFiles([]);
                    setProgress(null);
                    setError(null);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Convert Another Story
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TextToSpeech; 