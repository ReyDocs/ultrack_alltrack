import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import Logo from '../ui/Logo/Logo';
import Button from '../ui/Button/Button';
import { NAV_LINKS } from '../../constants/nav';
import { useScrollLock } from '../../hooks/useScrollLock';
import { cn } from '../../utils/cn';
import './MobileMenu.css';

export default function MobileMenu({ id, isOpen, onClose }) {
  useScrollLock(isOpen);

  return (
    <>
      <div
        className={cn('mobile-menu__overlay', isOpen && 'mobile-menu__overlay--visible')}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id={id}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={cn('mobile-menu', isOpen && 'mobile-menu--open')}
      >
        <div className="mobile-menu__header">
          <Logo size="sm" />
          <button className="mobile-menu__close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu__link"
              onClick={onClose}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mobile-menu__footer">
          <Button variant="ghost" as={Link} to="/login" onClick={onClose}>
            Login
          </Button>
          <Button variant="primary" as={Link} to="/signup" onClick={onClose}>
            Get Started
          </Button>
        </div>
      </div>
    </>
  );
}
