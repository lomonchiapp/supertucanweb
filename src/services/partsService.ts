import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export interface PublicPart {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  originalPrice: number | null;
  discount: number;
  inStock: boolean;
  compatibleModels: string[];
  image: string;
}

export interface PublicPartCategory {
  id: string;
  name: string;
  icon: string;
}

export async function fetchParts(): Promise<PublicPart[]> {
  const ref = collection(db, 'parts');
  const q = query(ref, orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PublicPart));
}

export async function fetchPartsByCategory(categoryId: string): Promise<PublicPart[]> {
  const ref = collection(db, 'parts');
  const q = query(ref, where('categoryId', '==', categoryId), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PublicPart));
}

export async function fetchPartsByModel(modelId: string): Promise<PublicPart[]> {
  const ref = collection(db, 'parts');
  const q = query(ref, where('compatibleModels', 'array-contains', modelId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PublicPart));
}

export async function fetchPartsCategories(): Promise<PublicPartCategory[]> {
  const ref = collection(db, 'partsCategories');
  const q = query(ref, orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PublicPartCategory));
}
