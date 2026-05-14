import './AuthLayout.css';

export default function AuthLayout({ logoSlot, tagline, formSlot, switchSlot }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <div className="auth-layout__logo-wrap">
          {logoSlot}
          {tagline && <p className="auth-layout__tagline">{tagline}</p>}
        </div>

        <div className="auth-layout__form-area">
          {formSlot}
        </div>

        {switchSlot}

        <p className="auth-layout__legal">
          By continuing, you agree to ULTRACK's{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>, and to receive periodic emails
          with updates.
        </p>
      </div>
    </div>
  );
}
