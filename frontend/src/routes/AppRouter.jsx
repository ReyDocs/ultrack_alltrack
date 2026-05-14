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
import AuthCallbackPage from '../pages/AuthCallbackPage/AuthCallbackPage';

/** Protected Route component */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/** Inner component has access to the router context for useLocation */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition key={location.key}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/to-dos" element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
        <Route path="/finances" element={<ProtectedRoute><FinancesPage /></ProtectedRoute>} />
        <Route path="/well-being" element={<ProtectedRoute><WellBeingPage /></ProtectedRoute>} />
        <Route path="/saved-links" element={<ProtectedRoute><LinksPage /></ProtectedRoute>} />
        <Route path="/grades" element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
        <Route path="/lock-in" element={<ProtectedRoute><PomodoroPage /></ProtectedRoute>} />
        <Route path="/career" element={<ProtectedRoute><CareerPage /></ProtectedRoute>} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
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
