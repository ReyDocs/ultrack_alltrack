import PageLayout from '../../layouts/PageLayout/PageLayout';
import HeroSection from '../../sections/HeroSection/HeroSection';
import DashboardPreview from '../../sections/DashboardPreview/DashboardPreview';
import FeaturePills from '../../sections/FeaturePills/FeaturePills';
import HowItWorksSection from '../../sections/HowItWorksSection/HowItWorksSection';
import CTABanner from '../../sections/CTABanner/CTABanner';

export default function LandingPage() {
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
