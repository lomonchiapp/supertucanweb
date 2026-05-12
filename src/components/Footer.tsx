import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '@/store/navigationStore';

export function Footer() {
  const { t } = useTranslation();
  const { setActiveSection, setSelectedCategory } = useNavigationStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleProductClick = (category: string) => {
    setSelectedCategory(category);
    setActiveSection('modelos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (section: 'dealers' | 'partes' | 'marca') => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 2500);
  };

  return (
    <footer className="relative bg-neutral-950 text-neutral-300 overflow-hidden">
      {/* Diagonal pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(255,255,255,0.5) 14px, rgba(255,255,255,0.5) 15px)',
        }}
      />
      {/* Red accent strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

      {/* Newsletter */}
      <div className="relative border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10 lg:py-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                {t('footer.newsletter.eyebrow')}
              </span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl font-bold uppercase text-white leading-tight">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-sm text-neutral-400 mt-2 max-w-md">
              {t('footer.newsletter.description')}
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.placeholder')}
              className="flex-1 bg-white/[0.04] border border-white/10 focus:border-[var(--color-primary)] text-white placeholder:text-neutral-500 px-5 py-3.5 text-sm outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={submitted}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:bg-emerald-600 text-white px-7 py-3.5 text-xs font-bold tracking-[0.18em] font-accent transition-all duration-300 flex items-center justify-center gap-2"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0% 100%)' }}
            >
              {submitted ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('footer.newsletter.subscribed')}
                </>
              ) : (
                <>
                  {t('footer.newsletter.subscribe')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main columns */}
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <img
              src="/logo-full-white.png"
              alt="Super Tucán"
              className="h-14 w-auto mb-5"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-white.png';
              }}
            />
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mb-6">
              {t('footer.brand.description')}
            </p>

            {/* Contacto rápido */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.25 1.13a11 11 0 005.5 5.5l1.13-2.25a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
                <div>
                  <a href="tel:+18092468383" className="block text-white font-bold hover:text-[var(--color-primary)] transition-colors">
                    +1 809 246 8383
                  </a>
                  <a href="tel:+18092466630" className="block text-white font-bold hover:text-[var(--color-primary)] transition-colors">
                    +1 809 246 6630
                  </a>
                  <div className="text-xs text-neutral-500 mt-1">{t('footer.brand.hours')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <a href="mailto:info@orientalramirez.com" className="text-white hover:text-[var(--color-primary)] transition-colors">
                    info@orientalramirez.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-sm text-neutral-400">
                  {t('footer.brand.address')}
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <FooterCol title={t('footer.columns.products')} className="lg:col-span-2">
            <FooterLink onClick={() => handleProductClick('motocicleta')}>{t('footer.products.motocicleta')}</FooterLink>
            <FooterLink onClick={() => handleProductClick('passola')}>{t('footer.products.passola')}</FooterLink>
            <FooterLink onClick={() => handleProductClick('sport')}>{t('footer.products.sport')}</FooterLink>
            <FooterLink onClick={() => handleProductClick('atv')}>{t('footer.products.atv')} <span className="text-[10px] text-neutral-500 ml-1">{t('footer.products.atvSoon')}</span></FooterLink>
          </FooterCol>

          {/* Servicios */}
          <FooterCol title={t('footer.columns.services')} className="lg:col-span-2">
            <FooterLink onClick={() => handleServiceClick('dealers')}>{t('footer.services.findDealer')}</FooterLink>
            <FooterLink onClick={() => handleServiceClick('partes')}>{t('footer.services.genuineParts')}</FooterLink>
            <FooterLink onClick={() => handleServiceClick('partes')}>{t('footer.services.maintenance')}</FooterLink>
            <FooterLink href="#">{t('footer.services.financing')}</FooterLink>
            <FooterLink href="#">{t('footer.services.warranty')}</FooterLink>
          </FooterCol>

          {/* Empresa */}
          <FooterCol title={t('footer.columns.company')} className="lg:col-span-2">
            <FooterLink onClick={() => handleServiceClick('marca')}>{t('footer.company.about')}</FooterLink>
            <FooterLink href="#">{t('footer.company.history')}</FooterLink>
            <FooterLink href="#">{t('footer.company.careers')}</FooterLink>
            <FooterLink href="#">{t('footer.company.press')}</FooterLink>
            <FooterLink href="#">{t('footer.company.sustainability')}</FooterLink>
          </FooterCol>

          {/* Soporte */}
          <FooterCol title={t('footer.columns.support')} className="lg:col-span-2">
            <FooterLink href="#">{t('footer.support.helpCenter')}</FooterLink>
            <FooterLink href="#">{t('footer.support.manuals')}</FooterLink>
            <FooterLink href="#">{t('footer.support.warranties')}</FooterLink>
            <FooterLink href="#">{t('footer.support.privacy')}</FooterLink>
            <FooterLink href="#">{t('footer.support.terms')}</FooterLink>
          </FooterCol>
        </div>
      </div>

      {/* Social + bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-5">
          <div className="text-xs text-neutral-500 tracking-wide text-center lg:text-left">
            © {new Date().getFullYear()} {t('footer.copyright')}
          </div>

          <div className="flex items-center gap-2">
            {(
              [
                { name: 'facebook', url: 'https://facebook.com/supertucan' },
                { name: 'instagram', url: 'https://instagram.com/supertucan' },
                { name: 'youtube', url: 'https://youtube.com/@supertucan' },
                { name: 'tiktok', url: 'https://tiktok.com/@supertucan' },
              ] as const
            ).map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[var(--color-primary)] text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label={social.name}
              >
                <SocialIcon name={social.name} />
              </a>
            ))}
          </div>

          <div className="text-[10px] text-neutral-500 tracking-[0.2em] font-accent">
            {t('footer.poweredBy')} <span className="text-[var(--color-primary)] font-bold">SUPER TUCÁN MOTORS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────── */

function FooterCol({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="text-[11px] font-bold tracking-[0.25em] text-white mb-5 font-accent">
        {title.toUpperCase()}
      </h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    'group inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer';
  if (onClick) {
    return (
      <li>
        <button onClick={onClick} className={className}>
          <span className="w-0 group-hover:w-2 h-[2px] bg-[var(--color-primary)] mr-0 group-hover:mr-2 transition-all duration-300" />
          {children}
        </button>
      </li>
    );
  }
  return (
    <li>
      <a href={href || '#'} className={className}>
        <span className="w-0 group-hover:w-2 h-[2px] bg-[var(--color-primary)] mr-0 group-hover:mr-2 transition-all duration-300" />
        {children}
      </a>
    </li>
  );
}

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    facebook:
      'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    instagram:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    youtube:
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    tiktok:
      'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.81a8.16 8.16 0 0 0 4.77 1.52V6.89a4.85 4.85 0 0 1-1.84-.2z',
  };
  return paths[name] ? (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  ) : null;
}
