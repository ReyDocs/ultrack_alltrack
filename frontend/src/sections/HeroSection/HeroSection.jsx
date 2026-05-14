import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import lockIcon from '../../assets/lock-icon.png';
import Button from '../../components/ui/Button/Button';
import './HeroSection.css';

export default function HeroSection() {
  const [canAnimate, setCanAnimate] = useState(() => 
    typeof window !== 'undefined' ? window.hasPreloaderCompleted : false
  );

  useEffect(() => {
    if (canAnimate) return;

    const handlePreloaderComplete = () => setCanAnimate(true);
    window.addEventListener('preloaderComplete', handlePreloaderComplete);

    // Fallback safeguard in case event was missed or preloader skipped
    const fallback = setTimeout(() => setCanAnimate(true), 3500);

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      clearTimeout(fallback);
    };
  }, [canAnimate]);

  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="hero__video-container" aria-hidden="true">
        <video
          className="hero__video"
          src="/background-video.mov"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero__video-overlay" />
      </div>

      <div className={`hero__content ${canAnimate ? 'hero--animate' : ''}`}>
        <h1 id="hero-headline" className="hero__headline">
          <span>Track your grades.</span>
          <span>Build your career.</span>
          <span>Maintain your sanity.</span>
        </h1>
        <p className="hero__subtext">
          ULTrack is a productivity suite for UP students, unifying academics, career prep, and well-being into one operational workspace.
        </p>
        <Button variant="cta" as={Link} to="/login" className="hero__cta">
          LOCK IN
          <img
            src={lockIcon}
            alt=""
            aria-hidden="true"
            className="hero__cta-icon"
          />
        </Button>
      </div>
    </section>
  );
}
