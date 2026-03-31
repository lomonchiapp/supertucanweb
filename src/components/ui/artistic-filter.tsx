export function ArtisticFilter() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Glow sutil en zona de la moto */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: 'rgba(220,38,38,0.03)' }}
      />
      {/* Glow sutil en esquina inferior */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ background: 'rgba(220,38,38,0.02)' }}
      />
    </div>
  );
}
