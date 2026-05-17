import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [debugMsg, setDebugMsg] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL
        if (window.location.search.includes('error=')) {
          console.error('OAuth error in URL');
          navigate('/login', { replace: true });
          return;
        }

        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login', { replace: true });
          return;
        }

        if (session?.user) {
          console.log('Session found, redirecting to dashboard');
          // Clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/dashboard', { replace: true });
        } else {
          console.log('No session found, redirecting to login');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        setDebugMsg(`Error: ${err.message}`);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (debugMsg) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh' }}>
        <h2>Authentication Error</h2>
        <p style={{ color: '#F87171' }}>{debugMsg}</p>
        <button onClick={() => navigate('/login')} style={{ marginTop: '20px', padding: '10px 20px' }}>Return to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh' }}>
      <h2>Completing authentication...</h2>
      <p>Please wait while we finish logging you in.</p>
    </div>
  );
}
