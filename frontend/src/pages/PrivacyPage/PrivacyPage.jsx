import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell/PageShell';
import Button from '../../components/ui/Button/Button';
import '../TermsPage/TermsPage.css';

export default function PrivacyPage() {
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
          <h1 className="legal-page__title">Privacy Policy</h1>
        </header>
        
        <div className="legal-page__content">
          <h2>The Standard</h2>
          <p>
            Privacy should not require a law degree to understand. We believe your focus is your most valuable asset, and your data deserves the exact same respect. Our policy is simple: we only collect what is strictly necessary to keep your workspace running smoothly.
          </p>

          <h3>What We Collect</h3>
          <p>
            We gather only the essentials required to make the system work for you. This includes your task logs, focus session intervals, the links you save to the Vault, and the check-ins you provide to the Barometer. We do not ask for anything outside the scope of your work.
          </p>

          <h3>How We Use It</h3>
          <p>
            Your information is used entirely to power your experience. It helps the timer run, keeps your priorities organized, and ensures your library is exactly how you left it. We do not sell your study habits, we do not track you across the web, and we do not monetize your attention.
          </p>

          <h3>Security and Storage</h3>
          <p>
            Your data is kept secure and private. We treat your Vault and your Tasks as closed environments. The information you put into the workspace stays in the workspace, protected from outside noise and unauthorized access.
          </p>

          <h3>Your Control</h3>
          <p>
            You own your progress and you own your data. If you ever decide to step away or clear the slate, you have the absolute right to delete your account and your information. When you choose to remove it, it is gone for good.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
