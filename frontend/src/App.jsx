import './styles/globals.css';
import './styles/utilities.css';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import Preloader from './components/Preloader/Preloader';

export default function App() {
  return (
    <AuthProvider>
      <Preloader />
      <AppRouter />
    </AuthProvider>
  );
}
