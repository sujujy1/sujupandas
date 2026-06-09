import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';
import CaseStudyPage from './pages/CaseStudyPage';
import QuizGamePage from './pages/QuizGamePage';
import FunLearningPage from './pages/FunLearningPage';
import TowerGamePage from './pages/TowerGamePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
        <Route path="/problem/:id/quiz" element={<QuizGamePage />} />
        <Route path="/problem/:id/fun" element={<FunLearningPage />} />
        <Route path="/tower-game" element={<TowerGamePage />} />
        <Route path="/case-study" element={<CaseStudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;