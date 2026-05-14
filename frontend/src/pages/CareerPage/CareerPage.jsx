import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import './CareerPage.css';

function ChatbaseEmbed() {
  const mounted = useRef(false);
  const [activeSession, setActiveSession] = useState('inline'); // 'inline' | 'floating'

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Chatbase inline embed initialization
    (function () {
      if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) window.chatbase.q = [];
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === 'q') return target.q;
            return (...args) => target(prop, ...args);
          },
        });
      }

      const onLoad = function () {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.id = 'gk_nbUnOPDeM_9641dkTf';
        script.domain = 'www.chatbase.co';
        document.body.appendChild(script);
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad);
      }
    })();

    // Comprehensive cleanup function for true route isolation
    return () => {
      const script = document.getElementById('gk_nbUnOPDeM_9641dkTf');
      if (script) {
        script.remove();
      }

      const bubbleButton = document.getElementById('chatbase-bubble-button');
      if (bubbleButton) bubbleButton.remove();

      const bubbleWindow = document.getElementById('chatbase-bubble-window');
      if (bubbleWindow) bubbleWindow.remove();

      document.querySelectorAll('[id^="chatbase-"]').forEach(el => el.remove());

      delete window.chatbase;
      mounted.current = false;
    };
  }, []);

  // Orchestrator: Detect interactions with the floating bubble to trigger session handoff
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('#chatbase-bubble-button') || e.target.closest('#chatbase-bubble-window')) {
        setActiveSession((prev) => {
          // If inline is active, transfer to floating
          if (prev === 'inline') return 'floating';
          // If floating is active and user clicks the close button on it, revert to inline
          // We assume clicking the button again minimizes it
          if (e.target.closest('#chatbase-bubble-button')) return 'inline';
          return 'floating';
        });
      }
    };

    // Use capture phase to ensure we intercept before any third-party event stopping
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  // Orchestrator: Suspend floating bubble when inline becomes active
  useEffect(() => {
    if (activeSession === 'inline' && window.chatbase && typeof window.chatbase === 'function') {
      try {
        window.chatbase('close');
      } catch (e) {
        // Safely ignore if chatbase API is not yet fully hydrated
      }
    }
  }, [activeSession]);

  return (
    <div 
      className="career-chatbase" 
      aria-label="ULTRACKER CV Generator chatbot workspace"
      onClick={() => {
        if (activeSession !== 'inline') {
          setActiveSession('inline');
        }
      }}
      style={{
        position: 'relative',
        cursor: activeSession === 'floating' ? 'pointer' : 'default',
        transition: 'background-color var(--dur-hover) var(--ease-out)'
      }}
    >
      {activeSession === 'inline' ? (
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/gk_nbUnOPDeM_9641dkTf"
          title="ULTRACKER CV GENERATOR"
          className="career-chatbase__iframe"
          allow="microphone *"
          frameBorder="0"
        />
      ) : (
        <div 
          className="career-chatbase__suspended"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '13.5px',
            fontWeight: 'var(--font-weight-medium)',
            letterSpacing: '0.01em',
            background: 'transparent'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Session active in floating widget. Click to resume here.</span>
        </div>
      )}
    </div>
  );
}

export default function CareerPage() {
  return (
    <DashboardLayout>
      <PageShell>
        <div className="career-page">
          {/* Left: hero copy */}
          <div className="career-copy">
            <h2 className="career-copy__heading">
              Create a professional<br />
              <span className="career-copy__heading--muted">CV with ease.</span>
            </h2>
            <p className="career-copy__body">
              Share your details, and I'll help turn them into a clean, well-structured resume that highlights
              your strengths, experience, education, and skills. Whether you're applying for your first job or
              updating your current CV, I can make it look polished, professional, and ready to impress.
            </p>
          </div>

          {/* Right: Chatbase embed panel */}
          <ChatbaseEmbed />
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
