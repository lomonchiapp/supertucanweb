import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function SkyBackground() {
  const speedLinesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!speedLinesRef.current) return;
    const lines = speedLinesRef.current.children;

    Array.from(lines).forEach((line, i) => {
      gsap.fromTo(
        line,
        { x: '-120%', opacity: 0 },
        {
          x: '120%',
          opacity: 0.6,
          duration: 2.5 + i * 0.7,
          ease: 'power1.in',
          repeat: -1,
          delay: i * 0.5,
        }
      );
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base: fondo negro carbono */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 30% 50%, #1a1a1a 0%, #0a0a0a 60%, #050505 100%)
          `,
        }}
      />

      {/* Textura carbon fiber sutil */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )
          `,
          backgroundSize: '8px 8px',
        }}
      />

      {/* Grid de pista sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Speed lines animadas */}
      <div ref={speedLinesRef} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            top: '15%',
            height: '1px',
            width: '60%',
            background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4) 40%, rgba(220,38,38,0.6) 50%, transparent)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '40%',
            height: '2px',
            width: '45%',
            background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.2) 40%, rgba(220,38,38,0.35) 50%, transparent)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '65%',
            height: '1px',
            width: '55%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.15) 50%, transparent)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '82%',
            height: '1px',
            width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.15) 40%, rgba(220,38,38,0.25) 50%, transparent)',
          }}
        />
      </div>

      {/* Glow rojo diagonal - acento dramático */}
      <div
        className="absolute"
        style={{
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '140%',
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.06) 0%, transparent 70%)',
          transform: 'rotate(-15deg)',
        }}
      />

      {/* Línea diagonal decorativa */}
      <div
        className="absolute top-0 bottom-0 opacity-[0.06]"
        style={{
          left: '55%',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(220,38,38,0.8) 30%, rgba(220,38,38,0.8) 70%, transparent 100%)',
          transform: 'skewX(-12deg)',
        }}
      />

      {/* Vignette para profundidad */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}
