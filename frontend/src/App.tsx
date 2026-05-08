import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import GalleryPage from './pages/GalleryPage';
import AdminLayout from './pages/admin/AdminLayout';
import QuestionManager from './pages/admin/QuestionManager';
import PersonalityManager from './pages/admin/PersonalityManager';
import StatsPage from './pages/admin/StatsPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<QuestionManager />} />
            <Route path="questions" element={<QuestionManager />} />
            <Route path="personalities" element={<PersonalityManager />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
