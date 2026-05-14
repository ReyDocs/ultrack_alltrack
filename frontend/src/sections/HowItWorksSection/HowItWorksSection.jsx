import { useEffect, useRef } from 'react';
import {
  Mail,
  UserPlus,
  InfinityIcon,
  LayoutDashboard,
} from 'lucide-react';
import { HOW_IT_WORKS } from '../../data/howItWorks';
import './HowItWorksSection.css';

const ICONS = {
  mail: Mail,
  'user-plus': UserPlus,
  infinity: InfinityIcon,
  'layout-dashboard': LayoutDashboard,
};

export default function HowItWorksSection() {
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('how-it-works__step--visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="how-it-works"
      aria-labelledby="how-it-works-heading"
    >
      <div className="how-it-works__inner">
        <h2 id="how-it-works-heading" className="how-it-works__heading">
          How it Works
        </h2>

        <div className="how-it-works__grid">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <div
                key={step.id}
                className="how-it-works__step"
                ref={(el) => (stepRefs.current[i] = el)}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="how-it-works__step-icon" aria-hidden="true">
                  {Icon && <Icon size={18} />}
                </div>
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-desc">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
