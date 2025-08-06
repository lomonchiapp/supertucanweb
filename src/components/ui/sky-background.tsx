import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function SkyBackground() {
  const baseRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const trackPatternRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animación del fondo base
    if (baseRef.current) {
      gsap.to(baseRef.current, {
        duration: 10,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        css: {
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #ffffff 75%, #f8fafc 100%)'
        }
      });
    }

    // Animación de líneas de velocidad
    if (speedLinesRef.current) {
      const lines = speedLinesRef.current.children;
      
      Array.from(lines).forEach((line, index) => {
        gsap.fromTo(line, 
          { x: -2000, opacity: 0 },
          { 
            x: 2000, 
            opacity: 1,
            duration: 3 + (index * 0.5),
            ease: "power2.out",
            repeat: -1,
            delay: index * 0.3
          }
        );
      });
    }

    // Animación del patrón de pista
    if (trackPatternRef.current) {
      gsap.to(trackPatternRef.current, {
        x: -100,
        duration: 20,
        ease: "none",
        repeat: -1
      });
    }

    // Animación de partículas
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: -50,
          x: 100,
          opacity: 0,
          duration: 4 + (index * 0.5),
          ease: "power2.out",
          repeat: -1,
          delay: index * 0.8
        });
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fondo base racing claro */}
      <div 
        ref={baseRef}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #ffffff 75%, #f8fafc 100%)'
        }}
      />

      {/* Patrón de pista sutil */}
      <div ref={trackPatternRef} className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 2%, transparent 4%),
              linear-gradient(90deg, transparent 20%, rgba(0,0,0,0.05) 22%, transparent 24%),
              linear-gradient(90deg, transparent 40%, rgba(0,0,0,0.1) 42%, transparent 44%),
              linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.05) 62%, transparent 64%),
              linear-gradient(90deg, transparent 80%, rgba(0,0,0,0.1) 82%, transparent 84%)
            `,
            backgroundSize: '200px 100%'
          }}
        />
      </div>

      {/* Líneas de velocidad dinámicas */}
      <div ref={speedLinesRef} className="absolute inset-0">
        {/* Línea 1 - Principal */}
        <div 
          className="absolute"
          style={{
            top: '20%',
            height: '2px',
            width: '800px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.3) 50%, transparent 100%)',
            transform: 'skewX(-45deg)'
          }}
        />
        
        {/* Línea 2 - Secundaria */}
        <div 
          className="absolute"
          style={{
            top: '35%',
            height: '1px',
            width: '600px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.2) 50%, transparent 100%)',
            transform: 'skewX(-45deg)'
          }}
        />
        
        {/* Línea 3 - Acento */}
        <div 
          className="absolute"
          style={{
            top: '50%',
            height: '3px',
            width: '1000px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.2) 50%, transparent 100%)',
            transform: 'skewX(-45deg)'
          }}
        />
        
        {/* Línea 4 - Sutil */}
        <div 
          className="absolute"
          style={{
            top: '65%',
            height: '1px',
            width: '700px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.15) 50%, transparent 100%)',
            transform: 'skewX(-45deg)'
          }}
        />
        
        {/* Línea 5 - Final */}
        <div 
          className="absolute"
          style={{
            top: '80%',
            height: '2px',
            width: '900px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.25) 50%, transparent 100%)',
            transform: 'skewX(-45deg)'
          }}
        />
      </div>

      {/* Partículas de velocidad */}
      <div ref={particlesRef} className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: '4px',
              height: '4px',
              background: index % 3 === 0 ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Gradiente superior para profesionalismo */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(248,250,252,0.8) 0%, transparent 30%, transparent 70%, rgba(248,250,252,0.6) 100%)'
        }}
      />

      {/* Efecto de profundidad con formas geométricas */}
      <div className="absolute inset-0 opacity-10">
        {/* Hexágono 1 */}
        <div 
          className="absolute"
          style={{
            top: '15%',
            right: '20%',
            width: '100px',
            height: '100px',
            background: 'rgba(239,68,68,0.1)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        
        {/* Hexágono 2 */}
        <div 
          className="absolute"
          style={{
            bottom: '25%',
            left: '15%',
            width: '80px',
            height: '80px',
            background: 'rgba(59,130,246,0.1)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animation: 'float 6s ease-in-out infinite reverse'
          }}
        />
        
        {/* Triángulo */}
        <div 
          className="absolute"
          style={{
            top: '60%',
            right: '10%',
            width: '60px',
            height: '60px',
            background: 'rgba(239,68,68,0.08)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            animation: 'float 10s ease-in-out infinite'
          }}
        />
      </div>

      {/* Overlay final para contraste perfecto */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(248,250,252,0.3) 100%)'
        }}
      />
      
      {/* CSS para animaciones adicionales */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}