import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StoryCreatorPage from './pages/StoryCreatorPage';
import VoicePage from './pages/VoicePage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  return (
    <Router>
                <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/template/:templateId" element={<StoryCreatorPage />} />
            <Route path="/voice/:storyId" element={<VoicePage />} />
            <Route path="/image/:storyId" element={<ImageGeneratorPage />} />
          </Routes>
    </Router>
  );
};

export default App;
