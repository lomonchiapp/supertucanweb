import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // multilínea, soporta saltos de línea simples
  tag: string; // 'noticias' | 'eventos' | 'servicio' | custom
  image: string; // URL pública de Firebase Storage o '' si no tiene
  published: boolean;
  publishedAt: Timestamp | null; // fecha de publicación (puede ser futura para programar)
  createdAt: unknown;
  updatedAt: unknown;
}

export type NewsInput = Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>;

const newsRef = collection(db, 'news');

export async function getNews(): Promise<NewsArticle[]> {
  const q = query(newsRef, orderBy('publishedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<NewsArticle, 'id'>),
  }));
}

export async function getPublishedNews(maxItems?: number): Promise<NewsArticle[]> {
  const constraints = [
    where('published', '==', true),
    orderBy('publishedAt', 'desc'),
    ...(maxItems ? [limit(maxItems)] : []),
  ];
  const q = query(newsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<NewsArticle, 'id'>),
  }));
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const q = query(newsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...(d.data() as Omit<NewsArticle, 'id'>) };
}

export async function createNews(data: NewsInput): Promise<string> {
  const docRef = await addDoc(newsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateNews(id: string, data: Partial<NewsInput>): Promise<void> {
  const docRef = doc(db, 'news', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNews(id: string, imageUrl?: string): Promise<void> {
  if (imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch {
      // ignore if image doesn't exist
    }
  }
  const docRef = doc(db, 'news', id);
  await deleteDoc(docRef);
}

export function newsStoragePath(slug: string, filename: string): string {
  return `news/${slug}/${filename}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
