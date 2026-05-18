import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import HeroSection from '../../sections/HeroSection/HeroSection';
import DashboardPreview from '../../sections/DashboardPreview/DashboardPreview';
import FeaturePills from '../../sections/FeaturePills/FeaturePills';
import HowItWorksSection from '../../sections/HowItWorksSection/HowItWorksSection';
import CTABanner from '../../sections/CTABanner/CTABanner';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('[AuthDebug] LandingPage rendering, user:', !!user, 'loading:', loading);

  useEffect(() => {
    if (user) {
      console.log('[AuthDebug] LandingPage detecting user, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Optionally, if you want to avoid flashing the landing page while redirecting
  // you could return null if user is true, but since hydration takes a moment, 
  // letting it render briefly is fine.
  
  return (
    <PageLayout>
      <HeroSection />
      <DashboardPreview />
      <FeaturePills />
      <HowItWorksSection />
      <CTABanner />
    </PageLayout>
  );
}
