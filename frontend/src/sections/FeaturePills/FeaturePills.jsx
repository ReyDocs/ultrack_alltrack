import { FEATURE_PILLS } from '../../data/featurePills';
import './FeaturePills.css';

export default function FeaturePills() {
  return (
    <section className="feature-pills" aria-label="ULTRACK features">
      <div className="feature-pills__track">
        {FEATURE_PILLS.map(({ id, label, Icon }) => (
          <div key={id} className="feature-pills__pill">
            <Icon size={14} className="feature-pills__pill-icon" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
