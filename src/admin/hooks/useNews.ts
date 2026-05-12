import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsArticle } from '@/admin/services/newsService';

interface UseNewsReturn {
  news: NewsArticle[];
  loading: boolean;
}

// Ordena por publishedAt desc en memoria; evita necesitar índices
// compuestos en Firestore para combinaciones where+orderBy.
function sortByPublishedDesc(a: NewsArticle, b: NewsArticle): number {
  const aTime = a.publishedAt?.toMillis?.() ?? 0;
  const bTime = b.publishedAt?.toMillis?.() ?? 0;
  return bTime - aTime;
}

/** Realtime: todas las noticias (admin) */
export function useNews(): UseNewsReturn {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'news'),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NewsArticle, 'id'>),
        }));
        items.sort(sortByPublishedDesc);
        setNews(items);
        setLoading(false);
      },
      // Silenciar errores (p. ej. permisos) sin dejar loading en true
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { news, loading };
}

/** Realtime: solo noticias publicadas, opcionalmente limitadas */
export function usePublishedNews(maxItems?: number): UseNewsReturn {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'news'),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<NewsArticle, 'id'>),
          }))
          .filter((n) => n.published);
        items.sort(sortByPublishedDesc);
        setNews(maxItems ? items.slice(0, maxItems) : items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [maxItems]);

  return { news, loading };
}
