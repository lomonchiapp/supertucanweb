import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePublishedNews } from '@/admin/hooks/useNews';
import type { NewsArticle } from '@/admin/services/newsService';

function formatDate(value: NewsArticle['publishedAt'], locale: string): string {
  if (!value) return '';
  return value.toDate().toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function NoticiasSection() {
  const { t, i18n } = useTranslation();
  const { news, loading } = usePublishedNews();
  const [activeTag, setActiveTag] = useState<string>('todos');

  const tags = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => set.add(n.tag));
    return ['todos', ...Array.from(set)];
  }, [news]);

  const filtered = useMemo(
    () => (activeTag === 'todos' ? news : news.filter((n) => n.tag === activeTag)),
    [news, activeTag]
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const tagLabel = (tag: string) => {
    if (tag === 'todos') return t('noticias.filters.all');
    const key = `noticias.tags.${tag}`;
    const translated = t(key);
    return translated === key ? tag.toUpperCase() : translated;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white py-16 lg:py-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(227,6,19,0.18), transparent 60%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[2px] w-10 bg-white/70" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-white/90 font-accent">
              {t('noticias.hero.eyebrow')}
            </span>
            <div className="h-[2px] w-10 bg-white/70" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight uppercase mb-5 leading-[0.95]">
            {t('noticias.hero.title')}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto font-sans leading-relaxed">
            {t('noticias.hero.description')}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Filtros */}
        {tags.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`shrink-0 px-4 py-2 text-xs font-bold tracking-[0.15em] font-accent transition-colors border ${
                  activeTag === tag
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'
                }`}
              >
                {tagLabel(tag).toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
            <h3 className="text-xl font-bold text-neutral-700 uppercase">
              {t('noticias.empty.title')}
            </h3>
            <p className="text-sm text-neutral-500 mt-2">{t('noticias.empty.description')}</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Link
                to={`/noticias/${featured.slug}`}
                className="group block bg-neutral-50 border border-neutral-100 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-neutral-900/10 hover:-translate-y-0.5 transition-all duration-300 mb-10"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-80 bg-neutral-100 overflow-hidden">
                    {featured.image ? (
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span
                        className="bg-[var(--color-primary)] text-white px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] font-accent"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
                      >
                        {tagLabel(featured.tag).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-10 flex flex-col justify-center">
                    <p className="text-xs text-neutral-500 font-accent tracking-[0.15em] font-bold mb-3">
                      {formatDate(featured.publishedAt, i18n.language).toUpperCase()}
                    </p>
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 uppercase tracking-tight leading-[1.05] mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-neutral-600 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                    <div className="inline-flex items-center gap-2 mt-6 text-[11px] font-bold tracking-[0.2em] font-accent text-[var(--color-primary)]">
                      {t('noticias.card.readMore')}
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <NoticiaCard
                    key={article.id}
                    article={article}
                    tagLabel={tagLabel(article.tag)}
                    locale={i18n.language}
                    readMoreText={t('noticias.card.readMore')}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function NoticiaCard({
  article,
  tagLabel,
  locale,
  readMoreText,
}: {
  article: NewsArticle;
  tagLabel: string;
  locale: string;
  readMoreText: string;
}) {
  return (
    <Link
      to={`/noticias/${article.slug}`}
      className="group block bg-white border border-neutral-100 rounded-xl overflow-hidden hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-neutral-900/10 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
        )}
        <div className="absolute top-3 left-3">
          <span
            className="bg-white/95 backdrop-blur-sm text-neutral-900 px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] font-accent"
            style={{ clipPath: 'polygon(0 0, 100% 0, 94% 100%, 0% 100%)' }}
          >
            {tagLabel.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[10px] text-neutral-500 font-accent tracking-[0.2em] font-bold mb-2">
          {formatDate(article.publishedAt, locale).toUpperCase()}
        </p>
        <h3 className="font-display text-xl font-bold text-neutral-900 uppercase tracking-tight leading-tight mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">{article.excerpt}</p>
        <div className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-bold tracking-[0.2em] font-accent text-[var(--color-primary)]">
          {readMoreText}
          <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
