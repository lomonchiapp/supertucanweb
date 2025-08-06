import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
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
  const { shouldShowLanding } = useCountryStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const previousSection = useRef(activeSection);

  useEffect(() => {
    if (containerRef.current && previousSection.current !== activeSection) {
      // Transición profesional más rápida
      gsap.timeline()
        .to(containerRef.current, {
          opacity: 0,
          scale: 0.98,
          y: -20,
          duration: 0.2,
          ease: "power3.out"
        })
        .set(containerRef.current, {
          scale: 1.02,
          y: 20
        })
        .to(containerRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.25,
          ease: "power3.out"
        });
      
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
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Country Landing - Se muestra si no se ha seleccionado país */}
      <CountryLanding />
      
      {/* App principal - Solo se muestra si no se debe mostrar landing */}
      {!shouldShowLanding() && (
        <>
          <Header />
          
          {/* Loader de transición */}
          {isTransitioning && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          <div 
            ref={containerRef}
            className={`transition-all duration-300 ${isTransitioning ? 'pointer-events-none' : ''}`}
          >
            {renderActiveSection()}
          </div>
          
          {/* Footer siempre visible */}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
