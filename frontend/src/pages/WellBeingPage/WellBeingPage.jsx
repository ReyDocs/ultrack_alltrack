import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import burnoutGood from '../../assets/dashboard/burnout-good.png';
import burnoutMedjo from '../../assets/dashboard/burnout-medjo.png';
import burnoutEhh from '../../assets/dashboard/burnout-ehh.png';
import './WellBeingPage.css';

const moodData = {
  good: {
    img: burnoutGood,
    label: 'Goods pa — I feel great',
    accent: '#4ade80',
    heading: 'Goods pa',
    headingColor: '#4ade80',
    quotes: [
      "Pressure makes diamonds, but you're allowed to take a water break first!",
      "You're building something great, but even architects need a coffee break.",
      "The momentum is yours. Ride the wave, but don't forget to breathe.",
      "You're on fire today, just don't let it burn you out. Pace yourself.",
      "Strong progress so far. Keep the rhythm, but keep your water closer.",
      "You're doing excellent. Keep moving forward, one solid step at a time.",
    ],
  },
  medjo: {
    img: burnoutMedjo,
    label: 'Medjo kaya pa — hanging in there',
    accent: '#ff525b',
    heading: 'Medjo kaya pa',
    headingColor: '#ff525b',
    quotes: [
      "Hang in there — every tough session builds resilience. Take it one task at a time.",
      "The climb is steep, but your footing is solid. Focus only on the next step.",
      "It feels heavy right now, but you are built for this. Keep a steady pace.",
      "You're in the thick of it. Block out the noise and just handle the next item.",
      "Progress isn't always easy. Deep breaths, and tackle one thing at a time.",
      "The middle is always the hardest. Small, consistent steps will get you through.",
    ],
  },
  ehh: {
    img: burnoutEhh,
    label: 'Ehhh... — not great today',
    accent: '#a8a8a8',
    heading: 'Ehhh...',
    headingColor: '#a8a8a8',
    quotes: [
      "It's okay to pause. Rest is part of the process. Be kind to yourself today.",
      "You cannot pour from an empty cup. Step away and let yourself recharge.",
      "The work will still be there tomorrow. Your well-being needs attention right now.",
      "Stepping back is not giving up. It is the smartest thing you can do today.",
      "Close the tabs and clear your mind. You have done enough for the moment.",
      "Even the sharpest tools need to be set down. Give yourself permission to log off.",
    ],
  },
};

const moodKeys = ['good', 'medjo', 'ehh'];

export default function WellBeingPage() {
  const [selected, setSelected] = useState('good');
  const [currentQuote, setCurrentQuote] = useState(moodData.good.quotes[0]);
  const [isFading, setIsFading] = useState(false);

  const current = moodData[selected];

  const handleSelect = (key) => {
    setIsFading(true);
    
    setTimeout(() => {
      setSelected(key);
      const pool = moodData[key].quotes;
      
      let nextQuote = pool[Math.floor(Math.random() * pool.length)];
      if (key === selected && nextQuote === currentQuote && pool.length > 1) {
        nextQuote = pool[(pool.indexOf(currentQuote) + 1) % pool.length];
      }
      
      setCurrentQuote(nextQuote);
      setIsFading(false);
    }, 200);
  };

  return (
    <DashboardLayout>
      <PageShell>
        <div className="wellbeing-page">
          {/* Page title */}
          <h2 className="wellbeing-page__title">Burnout Barometer</h2>
          <hr className="wellbeing-page__divider" />

          {/* Mood selector tiles */}
          <div className="wellbeing-moods" role="group" aria-label="How are you feeling?">
            {moodKeys.map((key) => {
              const mood = moodData[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={`wellbeing-mood${selected === key ? ' wellbeing-mood--active' : ''}`}
                  style={{ '--burnout-accent': mood.accent }}
                  onClick={() => handleSelect(key)}
                  aria-pressed={selected === key}
                  aria-label={mood.label}
                >
                  <img src={mood.img} alt="" aria-hidden="true" className="wellbeing-mood__img" />
                </button>
              );
            })}
          </div>

          {/* Response section */}
          <div className="wellbeing-response" aria-live="polite">
            <p className="wellbeing-response__heading" style={{ color: current.headingColor }}>
              {current.heading}
            </p>
            <p 
              className="wellbeing-response__message" 
              style={{ 
                opacity: isFading ? 0 : 1, 
                transition: 'opacity 0.2s ease-in-out',
                willChange: 'opacity'
              }}
            >
              {currentQuote}
            </p>
          </div>

          {/* Video Embed */}
          <div className="wellbeing-video-container">
            <iframe
              src="https://www.youtube.com/embed/YWyjAYEav0k"
              title="Why Mental Health is Critical for Academic Success | Lauren Parker | TEDxLSSC"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
