import { useLocation, Link } from 'react-router-dom';
import './DashboardSidebar.css';
import mascotSrc from '../../assets/dashboard/mascot.png';
import dashboardIcon from '../../assets/dashboard/dashboard.png';
import todosIcon from '../../assets/dashboard/todos.png';
import financesIcon from '../../assets/dashboard/finances.png';
import wellbeingIcon from '../../assets/dashboard/wellbeing.png';
import linksIcon from '../../assets/dashboard/links.png';
import gradesIcon from '../../assets/dashboard/grades.png';
import careerIcon from '../../assets/dashboard/career.png';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: dashboardIcon, href: '/dashboard' },
  { key: 'todos',     label: "To do's",   icon: todosIcon,     href: '/to-dos' },
  { key: 'finances',  label: 'Finances',  icon: financesIcon,  href: '/finances' },
  { key: 'wellbeing', label: 'Well-being', icon: wellbeingIcon, href: '/well-being' },
  { key: 'links',     label: 'Saved links', icon: linksIcon,   href: '/saved-links' },
  { key: 'grades',    label: 'Grades',    icon: gradesIcon,    href: '/grades' },
  { key: 'career',    label: 'Career',    icon: careerIcon,    href: '/career' },
];

export default function DashboardSidebar({ activeItem, onSelect }) {
  const location = useLocation();

  const isActive = (item) => {
    if (activeItem) return activeItem === item.key;
    return location.pathname === item.href;
  };

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
      <div className="dashboard-sidebar__brand" aria-hidden="true">
        <img src={mascotSrc} alt="" />
      </div>

      <nav className="dashboard-sidebar__nav" aria-label="Primary dashboard sections">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            className={`dashboard-sidebar__item${isActive(item) ? ' dashboard-sidebar__item--active' : ''}`}
            aria-current={isActive(item) ? 'page' : undefined}
            onClick={() => onSelect?.(item.key)}
          >
            <span className="dashboard-sidebar__item-icon">
              <img src={item.icon} alt="" />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="dashboard-sidebar__divider" aria-hidden="true" />

      <Link to="/lock-in" className="dashboard-sidebar__lock" aria-label="Lock In — Pomodoro timer">
        <span className="dashboard-sidebar__lock-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M16 11V9a4 4 0 0 0-8 0v2" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="5" y="11" width="14" height="10" rx="3" strokeWidth="2" fill="none" />
            <path d="M12 16v2" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        Lock In
      </Link>
    </aside>
  );
}
