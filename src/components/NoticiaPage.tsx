import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';
import { getNewsBySlug, getPublishedNews, type NewsArticle } from '@/admin/services/newsService';

function formatDate(value: NewsArticle['publishedAt'], locale: string): string {
  if (!value) return '';
  return value.toDate().toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function NoticiaPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const found = await getNewsBySlug(slug);
      if (cancelled) return;
      if (!found || !found.published) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setArticle(found);
      const all = await getPublishedNews(4);
      if (cancelled) return;
      setRelated(all.filter((a) => a.id !== found.id).slice(0, 3));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <h1 className="font-display text-6xl font-bold text-neutral-900">404</h1>
          <p className="text-neutral-500 text-sm font-sans mt-4">{t('noticias.notFound.message')}</p>
          <Link
            to="/"
            className="mt-8 inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3 text-xs font-bold tracking-[0.2em] font-accent transition-colors"
          >
            {t('noticias.notFound.back')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading || !article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{article.title} · Super Tucán</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.image && <meta property="og:image" content={article.image} />}
      </Helmet>

      <Header />

      <article className="max-w-[800px] mx-auto px-6 lg:px-8 pt-24 lg:pt-32 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-[var(--color-primary)] transition-colors mb-8 font-accent tracking-[0.15em] font-bold"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          {t('noticias.detail.back')}
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span
            className="bg-[var(--color-primary)] text-white px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] font-accent"
            style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)' }}
          >
            {article.tag.toUpperCase()}
          </span>
          <span className="text-xs text-neutral-500 font-accent tracking-[0.15em] font-bold">
            {formatDate(article.publishedAt, i18n.language)}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 uppercase tracking-tight leading-[1.05] mb-6">
          {article.title}
        </h1>

        <p className="text-lg text-neutral-700 leading-relaxed mb-10 max-w-prose">
          {article.excerpt}
        </p>

        {article.image && (
          <div className="relative w-full aspect-[16/9] bg-neutral-100 rounded-xl overflow-hidden mb-10">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose-content max-w-prose space-y-5 text-neutral-800 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base lg:text-lg">
              {p}
            </p>
          ))}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-neutral-50 border-t border-neutral-100 py-14">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-8 bg-[var(--color-primary)]" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[var(--color-primary)] font-accent">
                {t('noticias.detail.relatedEyebrow')}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 tracking-tight uppercase mb-8">
              {t('noticias.detail.relatedTitle')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/noticias/${r.slug}`}
                  className="group bg-white border border-neutral-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative h-40 bg-neutral-100">
                    {r.image && (
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-neutral-500 font-accent tracking-[0.2em] font-bold mb-1.5">
                      {formatDate(r.publishedAt, i18n.language).toUpperCase()}
                    </p>
                    <h3 className="font-display text-lg font-bold text-neutral-900 uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
