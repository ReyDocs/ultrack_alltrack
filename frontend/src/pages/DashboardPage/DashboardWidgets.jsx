import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import burnoutGood from '../../assets/dashboard/burnout-good.png';
import burnoutMedjo from '../../assets/dashboard/burnout-medjo.png';
import burnoutEhh from '../../assets/dashboard/burnout-ehh.png';

export function ResumeGeneratorCard({ highlighted }) {
  const navigate = useNavigate();

  return (
    <DashboardCard highlighted={highlighted} className="widget-resume">
      <div className="wcard__eyebrow">START YOUR CAREER</div>
      <h3 className="wcard__title">Internship Resume Generator</h3>
      <p className="wcard__desc">
        Fill in course, org roles, projects, skills and the AI rewrites vague entries into strong,
        action-verb bullet points tailored to Philippine internship postings.
      </p>
      <div className="wcard__footer wcard__footer--end">
        <button className="wcard__btn" onClick={() => navigate('/career')}>
          GENERATE
        </button>
      </div>
    </DashboardCard>
  );
}

export function PomodoroCard({ highlighted }) {
  const navigate = useNavigate();

  return (
    <DashboardCard highlighted={highlighted} className="widget-pomodoro">
      <div className="wcard__eyebrow">LOCK IN</div>
      <h3 className="wcard__title">Pomodoro</h3>
      <p className="wcard__desc">
        Set your rhythm. Make time for your best work.
      </p>
      <div className="wcard__divider" />
      <div className="wcard__footer wcard__footer--split">
        <div className="wcard__stat" style={{ visibility: 'hidden' }} aria-hidden="true">
          <span className="wcard__stat-label">LOCKED IN</span>
          <span className="wcard__stat-value">4 MIN</span>
        </div>
        <button className="wcard__btn" onClick={() => navigate('/lock-in')}>
          FOCUS
        </button>
      </div>
    </DashboardCard>
  );
}

export function BudgetTrackerCard({ highlighted }) {
  const navigate = useNavigate();

  return (
    <DashboardCard highlighted={highlighted} className="widget-budget">
      <div className="wcard__eyebrow">FISCAL HEALTH</div>
      <h3 className="wcard__title">Budget Tracker</h3>
      <p className="wcard__desc">Allowance first. Track your budget and transpo costs estimates</p>
      <div className="wcard__divider" />
      <div className="wcard__footer wcard__footer--split">
        <div className="wcard__stat" style={{ visibility: 'hidden' }} aria-hidden="true">
          <span className="wcard__stat-label">SAVED</span>
          <span className="wcard__stat-value">₱500</span>
        </div>
        <button className="wcard__btn" onClick={() => navigate('/finances')}>
          SAVE
        </button>
      </div>
    </DashboardCard>
  );
}

export function BurnoutBarometerCard({ highlighted }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('medjo');

  const options = [
    {
      key: 'good',
      img: burnoutGood,
      label: 'Goods lang — I feel great',
      accent: '#4ade80',           /* green — matches tile icon */
    },
    {
      key: 'medjo',
      img: burnoutMedjo,
      label: 'Medjo kaya pa — hanging in there',
      accent: '#ff525b',           /* warm red — matches tile icon */
    },
    {
      key: 'ehh',
      img: burnoutEhh,
      label: 'Ehh... — not great today',
      accent: '#a8a8a8',           /* muted gray — matches tile */
    },
  ];

  return (
    <DashboardCard highlighted={highlighted} className="widget-burnout">
      <div className="wcard__top-row">
        <div className="wcard__eyebrow wcard__eyebrow--inline">WELL - BEING</div>
        <button
          className="wcard__badge-btn"
          onClick={() => navigate('/well-being')}
          aria-label="Learn more about the Burnout Barometer"
        >
          LEARN MORE
        </button>
      </div>
      <h3 className="wcard__title">Burnout Barometer</h3>
      <p className="wcard__desc">
        Daily 3-question check-in. Detects stress patterns over time and nudges rest before burnout hits.
      </p>
      <div
        className="wcard__burnout-grid"
        role="group"
        aria-label="How are you feeling today?"
      >
        {options.map((opt) => (
          <button
            key={opt.key}
            className={`wcard__burnout-btn${selected === opt.key ? ' wcard__burnout-btn--active' : ''}`}
            style={{ '--burnout-accent': opt.accent }}
            onClick={() => setSelected(opt.key)}
            aria-pressed={selected === opt.key}
            aria-label={opt.label}
            type="button"
          >
            <img src={opt.img} alt="" aria-hidden="true" />
          </button>
        ))}
      </div>
    </DashboardCard>
  );
}

export function GWACalculatorCard({ highlighted }) {
  const navigate = useNavigate();

  return (
    <DashboardCard highlighted={highlighted} className="widget-gwa">
      <div className="wcard__eyebrow">GRADES SO FAR</div>
      <h3 className="wcard__title">UP - GWA</h3>
      <p className="wcard__desc">
        Uses the official UP 1.0–5.0 grading scale. Simulates what grades you need to hit your target GWA.
      </p>
      <div className="wcard__divider" />
      <div className="wcard__footer wcard__footer--split">
        <div className="wcard__stat" style={{ visibility: 'hidden' }} aria-hidden="true">
          <span className="wcard__stat-label">CURRENT</span>
          <span className="wcard__stat-value">1.75</span>
        </div>
        <button className="wcard__btn wcard__btn--natural" onClick={() => navigate('/grades')}>
          Calculate
        </button>
      </div>
    </DashboardCard>
  );
}

export function TodoTimelineCard({ highlighted }) {
  const navigate = useNavigate();

  return (
    <DashboardCard highlighted={highlighted} className="widget-todo">
      <div className="wcard__eyebrow">STRATEGIC TIMELINE</div>
      <h3 className="wcard__title">To Do!</h3>
      <p className="wcard__desc" style={{ flexGrow: 1, marginBottom: '20px' }}>
        Clear the noise. Know exactly what to do next.
      </p>
      <button className="wcard__btn wcard__btn--full" onClick={() => navigate('/to-dos')}>
        Add to list
      </button>
    </DashboardCard>
  );
}

export function ResourceVaultCard({ highlighted }) {
  const navigate = useNavigate();

  return (
    <DashboardCard highlighted={highlighted} className="widget-resources">
      <div className="wcard__eyebrow">SAVED LINKS</div>
      <h3 className="wcard__title">Resource Vault</h3>
      <p className="wcard__desc" style={{ flexGrow: 1, marginBottom: '20px' }}>
        Keep what matters. Every link, right where you need it.
      </p>
      <button className="wcard__btn wcard__btn--full" onClick={() => navigate('/saved-links')}>
        Open Links
      </button>
    </DashboardCard>
  );
}