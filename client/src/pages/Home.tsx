import HeroSection from '@/components/HeroSection';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation('/dashboard');
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    console.log('Learn more about recovery features');
  };

  return (
    <HeroSection 
      onGetStarted={handleGetStarted}
      onLearnMore={handleLearnMore}
    />
  );
}