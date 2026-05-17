import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    addLog("Callback page mounted.");
    addLog(`URL Search: ${window.location.search}`);
    addLog(`URL Hash: ${window.location.hash}`);

    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const err = params.get('error') || hashParams.get('error');
    const errDesc = params.get('error_description') || hashParams.get('error_description');

    if (err) {
      setError(errDesc || err);
      addLog(`Error found in URL: ${errDesc || err}`);
    }
  }, []);

  useEffect(() => {
    if (user) {
      addLog('User detected in AuthContext! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    } else {
      addLog('AuthContext user is currently null. Waiting...');
    }
  }, [user, navigate]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        addLog("Manually checking Supabase session...");
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          addLog(`Supabase getSession Error: ${sessionError.message}`);
          setError(sessionError.message);
        } else if (data.session) {
          addLog(`Session found for: ${data.session.user?.email}`);
        } else {
          addLog("No session found in Supabase local storage.");
        }
      } catch (err) {
        addLog(`Unexpected exception: ${err.message}`);
        setError(err.message);
      }
    };
    checkSession();
  }, []);

  return (
    <div style={{ padding: '30px', color: 'white', background: '#0F172A', minHeight: '100vh', fontFamily: 'monospace', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '20px' }}>Auth Callback Diagnostics</h2>
      
      {error && (
        <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', borderRadius: '8px', marginBottom: '20px', color: '#FCA5A5' }}>
          <strong>Critical Error:</strong> {error}
        </div>
      )}
      
      <div style={{ background: '#1E293B', padding: '20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6' }}>
        <h3 style={{ color: '#94A3B8', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '10px' }}>Execution Logs</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.includes('Error') ? '#F87171' : log.includes('Redirecting') ? '#4ADE80' : '#E2E8F0' }}>
            &gt; {log}
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/login')} 
        style={{ padding: '12px 24px', background: '#6366F1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Return to Login
      </button>
    </div>
  );
}
