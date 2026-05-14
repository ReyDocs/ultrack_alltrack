import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [debugMsg, setDebugMsg] = useState(null);

  useEffect(() => {
    if (window.location.search.includes('error=')) {
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const fallbackTimer = setTimeout(() => {
      if (!user) {
        setDebugMsg("Callback timeout: User profile failed to hydrate. Check backend logs for /api/v1/users/me 500 errors.");
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [user, navigate]);

  if (debugMsg) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh' }}>
        <h2>Authentication Debug</h2>
        <p style={{ color: '#F87171' }}>{debugMsg}</p>
        <button onClick={() => navigate('/login')} style={{ marginTop: '20px', padding: '10px 20px' }}>Return to Login</button>
      </div>
    );
  }

  return null;
}
