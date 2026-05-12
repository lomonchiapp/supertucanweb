import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { ModelosSection } from '@/components/ModelosSection';
import { MarcaSection } from '@/components/MarcaSection';
import { DealersSection } from '@/components/DealersSection';
import { PartesSection } from '@/components/PartesSection';
import { Footer } from '@/components/Footer';
import { CountryLanding } from '@/components/CountryLanding';
import { useNavigationStore } from '@/store/navigationStore';
import { useCountryStore } from '@/store/countryStore';

function App() {
  const { activeSection, isTransitioning } = useNavigationStore();
  const { hasSelectedCountry, lastSelectionDate } = useCountryStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const previousSection = useRef(activeSection);

  // Derive showLanding from reactive store values
  const showLanding = (() => {
    if (!hasSelectedCountry) return true;
    if (!lastSelectionDate) return true;
    const daysSince = (Date.now() - new Date(lastSelectionDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 30;
  })();

  // Scroll to top and animate on section change
  useEffect(() => {
    if (previousSection.current !== activeSection) {
      window.scrollTo({ top: 0 });

      if (containerRef.current) {
        gsap
          .timeline()
          .set(containerRef.current, { opacity: 0, y: 12 })
          .to(containerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out',
          });
      }

      previousSection.current = activeSection;
    }
  }, [activeSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'modelos':
        return <ModelosSection />;
      case 'marca':
        return <MarcaSection />;
      case 'dealers':
        return <DealersSection />;
      case 'partes':
        return <PartesSection />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 relative">
      {showLanding && <CountryLanding />}

      {!showLanding && (
        <>
          <Header />

          {isTransitioning && (
            <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
          )}

          <main
            ref={containerRef}
            className={isTransitioning ? 'pointer-events-none' : ''}
          >
            {renderActiveSection()}
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
