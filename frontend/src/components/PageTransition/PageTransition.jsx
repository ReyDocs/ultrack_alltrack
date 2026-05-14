import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * PageTransition — wraps route content so every navigation
 * triggers a subtle opacity + translateY entrance.
 *
 * Uses location.key as the React key: each navigation generates
 * a new key, which unmounts/remounts this element and restarts
 * the CSS animation without any JS animation library.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.key} className="page-transition">
      {children}
    </div>
  );
}
