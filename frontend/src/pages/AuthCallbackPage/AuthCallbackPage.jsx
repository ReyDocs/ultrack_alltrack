import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for error in URL immediately
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setError(params.get('error_description') || params.get('error'));
    }
  }, []);

  useEffect(() => {
    // If the global AuthContext has a user (even a fallback one),
    // we are good to go.
    if (user) {
      console.log('User detected in callback, redirecting...');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'white', background: '#0F172A', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#F87171' }}>Authentication Failed</h2>
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
      <div className="spinner" style={{ 
        border: '4px solid rgba(255,255,255,0.1)', 
        borderTop: '4px solid white', 
        borderRadius: '50%', 
        width: '40px', 
        height: '40px', 
        animation: 'spin 1s linear infinite', 
        marginBottom: '20px' 
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <h2>Completing authentication...</h2>
      <p style={{ opacity: 0.6 }}>Please wait while we set up your session.</p>
    </div>
  );
}
