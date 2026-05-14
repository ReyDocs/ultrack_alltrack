import { useEffect, useState } from 'react';
import './Preloader.css';
import preloaderLogo from '../../assets/preloader-logo.png';

if (typeof window !== 'undefined' && window.hasPreloaderCompleted === undefined) {
  window.hasPreloaderCompleted = false;
}

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Artificial minimum delay to let app hydrate and show premium loader securely
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (typeof window !== 'undefined') {
          window.hasPreloaderCompleted = true;
          window.dispatchEvent(new CustomEvent('preloaderComplete'));
        }
      }, 800); // wait for CSS fade-out transition duration
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader ${isFading ? 'preloader--fade-out' : ''}`} aria-hidden="true">
      <div className="preloader__content">
        <img src={preloaderLogo} alt="" className="preloader__logo" />
        <div className="preloader__pulse" />
      </div>
    </div>
  );
}
