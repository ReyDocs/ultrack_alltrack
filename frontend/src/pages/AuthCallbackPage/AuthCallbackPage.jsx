import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import * as authApi from '../../api/auth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState('Checking session...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // If the global AuthContext already has the user (synced via onAuthStateChange),
    // we can proceed to dashboard immediately.
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error')) {
          throw new Error(params.get('error_description') || 'Authentication failed');
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          setStatus('No session found. Redirecting...');
          setTimeout(() => navigate('/login', { replace: true }), 1500);
          return;
        }

        setStatus('Syncing profile...');
        
        // We wait for a bit to let the AuthContext's onAuthStateChange listener 
        // pick up the session. If it doesn't happen in 5 seconds, we show an error.
        const timeout = setTimeout(() => {
          if (!user) {
            setError('Profile hydration timed out. Please try logging in again.');
          }
        }, 5000);

        return () => clearTimeout(timeout);

      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message);
      }
    };

    handleCallback();
  }, [navigate, user]);

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#F87171' }}>Authentication Error</h2>
        <p style={{ maxWidth: '400px', margin: '20px 0', opacity: 0.8 }}>{error}</p>
        <button 
          onClick={() => navigate('/login', { replace: true })} 
          style={{ padding: '12px 24px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid white', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <h2>{status}</h2>
      <p style={{ opacity: 0.6 }}>Please wait while we finish setting up your workspace.</p>
    </div>
  );
}
