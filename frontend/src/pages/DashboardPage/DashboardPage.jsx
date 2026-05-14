import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../../components/UserProfile/UserProfile';
import logoutSrc from '../../assets/dashboard/logout.png';
import {
  BudgetTrackerCard,
  BurnoutBarometerCard,
  GWACalculatorCard,
  PomodoroCard,
  ResourceVaultCard,
  ResumeGeneratorCard,
  TodoTimelineCard,
} from './DashboardWidgets';
import './DashboardPage.css';

const sectionSummaries = {
  dashboard: {
    label: 'Today’s overview',
    title: 'Your study, focus, and career hub',
    copy: 'Everything you need to stay on target for assignments, finances, wellbeing, and internship-ready preparation.',
  },
  todos: {
    label: "To do's",
    title: 'Actionable tasks for the week',
    copy: 'Review priority items, manage deadlines, and keep the most urgent subjects visible at a glance.',
  },
  finances: {
    label: 'Finances',
    title: 'Budget health and reserve planning',
    copy: 'Track savings, spending, and reserves so you can stay ahead of allowance decisions.',
  },
  wellbeing: {
    label: 'Well-being',
    title: 'Burnout checks and recovery cues',
    copy: 'Capture how you feel, then use the dashboard to move from stressed to steady with clear next steps.',
  },
  links: {
    label: 'Saved resources',
    title: 'Research and reference vault',
    copy: 'Keep your most valuable study links in one place and find what matters without scrolling through search history.',
  },
  grades: {
    label: 'Grades',
    title: 'Current GPA progress',
    copy: 'Calculate the score needed on your next classes and make each grading period count.',
  },
  career: {
    label: 'Career tools',
    title: 'Resume generation and internship prep',
    copy: 'Generate targeted resume summary bullets, then keep your application materials ready for review.',
  },
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sectionSummary = useMemo(
    () => sectionSummaries[activeSection] ?? sectionSummaries.dashboard,
    [activeSection]
  );

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="dashboard-page">
        <header className="dashboard-page__header">
          <UserProfile className="dashboard-page__profile" subtitle="Glad to have you here!" />
          <button
            type="button"
            className="dashboard-page__action"
            aria-label="Sign out"
            onClick={handleSignOut}
          >
            <img src={logoutSrc} alt="" />
          </button>
        </header>

        {activeSection !== 'dashboard' && (
          <section
            key={activeSection}
            className="dashboard-page__section-summary"
            aria-labelledby="dashboard-section-title"
          >
            <p className="dashboard-page__section-eyebrow">{sectionSummary.label}</p>
            <h2 id="dashboard-section-title" className="dashboard-page__section-title">
              {sectionSummary.title}
            </h2>
            <p className="dashboard-page__section-copy">{sectionSummary.copy}</p>
          </section>
        )}

        <section className="dashboard-grid dashboard-grid--top" aria-label="Career and focus tools">
          <ResumeGeneratorCard highlighted={['dashboard', 'career'].includes(activeSection)} />
          <PomodoroCard highlighted={['dashboard', 'todos'].includes(activeSection)} />
        </section>

        <section className="dashboard-grid dashboard-grid--cards" aria-label="Academic life tools">
          <BudgetTrackerCard highlighted={activeSection === 'finances'} />
          <BurnoutBarometerCard highlighted={activeSection === 'wellbeing'} />
          <GWACalculatorCard highlighted={activeSection === 'grades'} />
        </section>

        <section className="dashboard-grid dashboard-grid--bottom" aria-label="Planning and saved links">
          <TodoTimelineCard highlighted={activeSection === 'todos'} />
          <ResourceVaultCard highlighted={activeSection === 'links'} />
        </section>
      </div>
    </DashboardLayout>
  );
}
