import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo/Logo';
import Button from '../ui/Button/Button';
import MobileMenu from '../MobileMenu/MobileMenu';
import { NAV_LINKS } from '../../constants/nav';
import { cn } from '../../utils/cn';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={cn('navbar', scrolled && 'navbar--scrolled')} role="banner">
        <div className="navbar__inner">
          <Logo size="sm" />

          <nav className="navbar__nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="navbar__link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="navbar__actions">
            <Button variant="ghost" as={Link} to="/login" size="sm">
              Login
            </Button>
            <Button variant="outlined" as={Link} to="/signup" size="sm">
              Get Started
            </Button>
          </div>

          <button
            id="navbar-hamburger"
            className={cn('navbar__hamburger', menuOpen && 'navbar__hamburger--open')}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        </div>
      </header>

      <MobileMenu
        id="mobile-menu"
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
