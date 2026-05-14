import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import Logo from '../../components/ui/Logo/Logo';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Divider from '../../components/ui/Divider/Divider';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function validateLoginForm(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { user, login, googleLogin } = useAuth();

  // Global Auth Policy: Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleLogin();
    } catch (error) {
      setServerError('Google login failed. Please try again.');
    }
  };

  return (
    <AuthLayout
      logoSlot={<Logo size="lg" />}
      tagline="Welcome back. Chase that fire!"
      formSlot={
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Button
              type="button"
              variant="google"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              Google
            </Button>

            <Divider text="Or sign in with email" />

            {serverError && (
              <p className="login-page__error" role="alert">{serverError}</p>
            )}

            <Input
              id="login-email"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder=""
            />

            <Input
              id="login-password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder=""
              hintElement={
                <a href="/forgot-password" className="login-page__forgot">
                  Forgot password?
                </a>
              }
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </form>
      }
      switchSlot={
        <p className="login-page__switch">
          Don&apos;t have an account?{' '}
          <Link to="/signup">Sign up now!</Link>
        </p>
      }
    />
  );
}
