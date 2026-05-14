import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import TodosPage from '../pages/TodosPage/TodosPage';
import FinancesPage from '../pages/FinancesPage/FinancesPage';
import WellBeingPage from '../pages/WellBeingPage/WellBeingPage';
import LinksPage from '../pages/LinksPage/LinksPage';
import GradesPage from '../pages/GradesPage/GradesPage';
import PomodoroPage from '../pages/PomodoroPage/PomodoroPage';
import CareerPage from '../pages/CareerPage/CareerPage';
import TermsPage from '../pages/TermsPage/TermsPage';
import PrivacyPage from '../pages/PrivacyPage/PrivacyPage';
import PageTransition from '../components/PageTransition/PageTransition';

/** Inner component has access to the router context for useLocation */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.key}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/to-dos" element={<TodosPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="/well-being" element={<WellBeingPage />} />
        <Route path="/saved-links" element={<LinksPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/lock-in" element={<PomodoroPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
