import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell/PageShell';
import Button from '../../components/ui/Button/Button';
import './TermsPage.css';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <PageShell hideHeader>
      <div className="legal-page">
        <header className="legal-page__header">
          <Button variant="ghost" onClick={() => navigate(-1)} className="legal-page__back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </Button>
          <h1 className="legal-page__title">Terms of Use</h1>
        </header>
        
        <div className="legal-page__content">
          <p className="legal-page__lead">
            We help you clear the noise, find your rhythm, and take decisive action.
          </p>
          <p>
            This is a workspace for navigating your studies with absolute clarity. Your workload is divided into intentional spaces, each with its own scope and flow. That might mean a Tasks module that tells you exactly what to do next, or a Barometer that reminds you to breathe. You simply step into the right zone, and we keep your progress organized and in motion.
          </p>

          <h2>Terms of Service</h2>
          <h3>The Agreement</h3>
          <p>
            We designed this workspace to clear the noise, not add to it. By using this platform, you agree to a few straightforward ground rules. No heavy legal jargon—just a mutual understanding of how this space works.
          </p>

          <h3>Your Work, Your Vault</h3>
          <p>
            Everything you log, track, and save belongs to you. Your tasks, focus data, and saved resources are your own intellectual property. Our role is strictly to organize and protect your information, never to own or exploit it.
          </p>

          <h3>Respecting the Space</h3>
          <p>
            This environment is built to help you focus. We ask that you use the tools as intended—to build momentum and manage your workload. Do not attempt to disrupt the platform's architecture, reverse-engineer its systems, or use it for anything outside its intended purpose.
          </p>

          <h3>Our Commitment</h3>
          <p>
            We aim to keep your workspace running smoothly and securely. However, digital tools occasionally require maintenance or updates. While we cannot guarantee absolute, uninterrupted perfection, we promise to handle any downtime swiftly and cleanly.
          </p>

          <h3>The Bottom Line</h3>
          <p>
            We provide the framework; you provide the effort. While we equip you with the tools to master your academic life, the actual execution remains in your hands. We are not liable for missed deadlines or grades—we are simply the engine to help drive your focus.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
