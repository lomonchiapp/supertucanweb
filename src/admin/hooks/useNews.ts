import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsArticle } from '@/admin/services/newsService';

interface UseNewsReturn {
  news: NewsArticle[];
  loading: boolean;
}

/** Realtime: todas las noticias (admin) */
export function useNews(): UseNewsReturn {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNews(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NewsArticle, 'id'>),
        }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { news, loading };
}

/** Realtime: solo noticias publicadas, opcionalmente limitadas */
export function usePublishedNews(maxItems?: number): UseNewsReturn {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const constraints = [
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
      ...(maxItems ? [limit(maxItems)] : []),
    ];
    const q = query(collection(db, 'news'), ...constraints);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNews(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NewsArticle, 'id'>),
        }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [maxItems]);

  return { news, loading };
}
