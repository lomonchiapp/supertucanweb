import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dealersData } from '@/data/dealers';

interface FinancingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinancingDialog({ isOpen, onClose }: FinancingDialogProps) {
  const { t } = useTranslation();

  // Cierra con ESC y bloquea scroll del body
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const message = t('financing.whatsappMessage');

  return (
    <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full lg:w-auto lg:min-w-[640px] lg:max-w-3xl max-h-[92vh] lg:max-h-[88vh] bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-[slideUp_0.35s_ease-out]">
        {/* Header */}
        <div className="relative bg-neutral-900 px-5 lg:px-7 py-4 lg:py-5 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-[2px] w-6 bg-[var(--color-primary)]" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                  {t('financing.eyebrow')}
                </span>
              </div>
              <h2 className="font-display text-xl lg:text-2xl font-bold text-white tracking-wide uppercase">
                {t('financing.title')}
              </h2>
              <p className="text-neutral-400 text-[12px] lg:text-sm mt-1.5 leading-relaxed">
                {t('financing.description')}
              </p>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
              aria-label={t('common.close')}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body: lista de dealers */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-7 py-5 bg-neutral-50">
          <div className="space-y-3">
            {dealersData.map((dealer) => {
              const waUrl = `https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(message)}`;
              const telUrl = `tel:+${dealer.whatsapp}`;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${dealer.coordinates.lat},${dealer.coordinates.lng}`;
              return (
                <div
                  key={dealer.id}
                  className={`bg-white rounded-xl border ${
                    dealer.featured ? 'border-[var(--color-primary)]/40' : 'border-neutral-200'
                  } p-4 lg:p-5`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-base lg:text-lg font-bold text-neutral-900 uppercase tracking-tight leading-tight">
                        {dealer.name}
                      </h3>
                      <p className="text-xs lg:text-sm text-neutral-600 mt-1">{dealer.address}</p>
                    </div>
                    {dealer.featured && (
                      <span
                        className="shrink-0 bg-[var(--color-primary)] text-white text-[9px] px-2 py-0.5 font-bold tracking-[0.15em] font-accent"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}
                      >
                        {t('financing.principal')}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {dealer.phone}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {dealer.hours}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-3 py-2 text-[11px] font-bold tracking-[0.15em] font-accent transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.69 5.553l-.999 3.648 3.798-.9zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.017-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      {t('financing.cta.whatsapp')}
                    </a>
                    <a
                      href={telUrl}
                      className="inline-flex items-center justify-center gap-1.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 px-3 py-2 text-[11px] font-bold tracking-[0.15em] font-accent transition-colors"
                      aria-label={t('financing.cta.call')}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="hidden sm:inline">{t('financing.cta.call')}</span>
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 px-3 py-2 text-[11px] font-bold tracking-[0.15em] font-accent transition-colors"
                      aria-label={t('financing.cta.map')}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="hidden sm:inline">{t('financing.cta.map')}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-neutral-500 mt-5 text-center">
            {t('financing.note')}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
