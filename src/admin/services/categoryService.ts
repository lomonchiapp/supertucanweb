import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

const categoriesRef = collection(db, 'categories');

export async function getCategories(): Promise<Category[]> {
  const q = query(categoriesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Category, 'id'>),
  }));
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const ref = doc(db, 'categories', id);
  await updateDoc(ref, data);
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(categoriesRef, data);
  return docRef.id;
}

export async function deleteCategory(id: string): Promise<void> {
  const ref = doc(db, 'categories', id);
  await deleteDoc(ref);
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    const ref = doc(db, 'categories', id);
    batch.update(ref, { order: index });
  });
  await batch.commit();
}
