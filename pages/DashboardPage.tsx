import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getStoriesFromLocalStorage, deleteStoryFromLocalStorage, StoredStory } from '../services/ttsService';
import Header from '../components/Header';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<StoredStory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    setLoading(true);
    try {
      const loadedStories = getStoriesFromLocalStorage();
      setStories(loadedStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = (storyId: string) => {
    const success = deleteStoryFromLocalStorage(storyId);
    if (success) {
      setStories(stories.filter(s => s.id !== storyId));
      setShowDeleteConfirm(null);
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
      }
    }
  };

  const handleViewStory = (story: StoredStory) => {
    setSelectedStory(story);
  };

  const handleGoToVoice = (storyId: string) => {
    navigate(`/voice/${storyId}`);
  };

  const handleGoToImage = (storyId: string) => {
    navigate(`/image/${storyId}`);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWordCount = (content: string) => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                {t('dashboard.title')}
              </h1>
              <p className="text-gray-400">{t('dashboard.description')}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{t('dashboard.createFirst')}</span>
            </button>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>{t('dashboard.totalStories')}: <span className="text-purple-400 font-semibold">{stories.length}</span></span>
              <button
                onClick={loadStories}
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{t('dashboard.refresh')}</span>
              </button>
            </div>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">{t('dashboard.noStories')}</h2>
            <p className="text-gray-500 mb-6">{t('dashboard.noStoriesDesc')}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              {t('dashboard.createFirst')}
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stories List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Danh sách truyện</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className={`bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border cursor-pointer transition-all duration-300 ${
                      selectedStory?.id === story.id
                        ? 'border-purple-400 bg-purple-900/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handleViewStory(story)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-200 text-sm leading-tight">
                        {story.title || `Truyện ${story.id.slice(0, 8)}`}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(story.id);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Thể loại: {story.templateName || 'Unknown'}</div>
                      <div>Ngày tạo: {formatDate(story.timestamp)}</div>
                      <div>Số từ: {getWordCount(story.content)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Story Detail */}
            <div className="lg:col-span-2">
              {selectedStory ? (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-200 mb-2">
                        {selectedStory.title || `Truyện ${selectedStory.id.slice(0, 8)}`}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Thể loại: {selectedStory.templateName}</span>
                        <span>•</span>
                        <span>{getWordCount(selectedStory.content)} từ</span>
                        <span>•</span>
                        <span>{formatDate(selectedStory.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={() => handleGoToVoice(selectedStory.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.79l-4-3.207a1 1 0 01-.383-.79V6.207a1 1 0 01.383-.79l4-3.207a1 1 0 01.617-.134zM14 8.586V14a1 1 0 102 0V8.586l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L14 8.586z" clipRule="evenodd" />
                      </svg>
                      <span>Chuyển thành giọng nói</span>
                    </button>
                    
                    <button
                      onClick={() => handleGoToImage(selectedStory.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Tạo ảnh minh họa</span>
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(selectedStory.content);
                          // Show success message (could add toast notification here)
                        } catch (err) {
                          console.error('Failed to copy:', err);
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Sao chép</span>
                    </button>
                  </div>

                  {/* Story content */}
                  <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {selectedStory.content}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-12 border border-gray-700 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Chọn một truyện để xem</h3>
                  <p className="text-gray-500">Nhấp vào một truyện trong danh sách để xem chi tiết</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Xác nhận xóa</h3>
              <p className="text-gray-400 mb-6">
                Bạn có chắc chắn muốn xóa truyện này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDeleteStory(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage; 