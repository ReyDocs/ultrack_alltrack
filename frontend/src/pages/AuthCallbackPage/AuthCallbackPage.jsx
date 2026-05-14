import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [debugMsg, setDebugMsg] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Explicitly get the session to ensure OAuth callback is processed
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login', { replace: true });
          return;
        }

        if (session?.user) {
          // Session is available, wait for AuthContext to process it
          const checkUser = () => {
            if (user) {
              navigate('/dashboard', { replace: true });
            } else {
              setTimeout(checkUser, 100);
            }
          };
          checkUser();
        } else {
          // No session, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
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

  return (
    <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh' }}>
      <h2>Processing authentication...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
}
