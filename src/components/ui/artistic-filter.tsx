export function ArtisticFilter() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Gradiente complementario al cielo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-red-400/15"></div>
      
      {/* Overlay de profundidad */}
      <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-gradient-to-t from-blue-900/20 via-transparent to-white/10"></div>
      
      {/* Puntos de luz atmosféricos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-300/12 rounded-full blur-3xl"></div>
      <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-red-300/8 rounded-full blur-3xl"></div>
      
      {/* Efecto de atmósfera */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-blue-200/5"></div>
      
      {/* Vignette suave para enfocar el centro */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(70,130,180,0.1) 80%, rgba(70,130,180,0.2) 100%)'
        }}
      ></div>
    </div>
  );
}