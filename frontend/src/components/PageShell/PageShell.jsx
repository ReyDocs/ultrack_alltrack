import './PageShell.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../UserProfile/UserProfile';
import logoutSrc from '../../assets/dashboard/logout.png';

/**
 * PageShell — shared header + page content wrapper used by all individual pages.
 * Mirrors the DashboardPage header exactly so pages feel consistent.
 */
export default function PageShell({ children, hideHeader }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <header 
        className="page-shell__header"
        style={hideHeader ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
        aria-hidden={hideHeader ? 'true' : undefined}
      >
        <UserProfile className="page-shell__profile" subtitle="Glad to have you here!" />
        <button
          type="button"
          className="page-shell__logout"
          aria-label="Sign out"
          onClick={handleSignOut}
          tabIndex={hideHeader ? -1 : 0}
        >
          <img src={logoutSrc} alt="" />
        </button>
      </header>

      <main className="page-shell__content">
        {children}
      </main>
    </div>
  );
}
