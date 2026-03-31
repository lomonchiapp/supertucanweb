import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface Part {
  id: string;
  name: string;
  categoryId: string; // references partsCategories
  description: string;
  price: number;
  originalPrice: number | null;
  discount: number;
  inStock: boolean;
  compatibleModels: string[]; // array of model IDs from 'models' collection
  image: string; // Firebase Storage URL or empty
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface PartCategory {
  id: string;
  name: string;
  icon: string; // SVG path data
  order: number;
}

export type PartInput = Omit<Part, 'id' | 'createdAt' | 'updatedAt'>;

const partsRef = collection(db, 'parts');
const partsCategoriesRef = collection(db, 'partsCategories');

// ---------------------------------------------------------------------------
// Parts
// ---------------------------------------------------------------------------

export async function getParts(): Promise<Part[]> {
  const q = query(partsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Part, 'id'>),
  }));
}

export async function getPartsByCategory(categoryId: string): Promise<Part[]> {
  const q = query(partsRef, where('categoryId', '==', categoryId), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Part, 'id'>),
  }));
}

export async function getPartsByModel(modelId: string): Promise<Part[]> {
  const q = query(partsRef, where('compatibleModels', 'array-contains', modelId), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Part, 'id'>),
  }));
}

export async function createPart(data: PartInput): Promise<string> {
  const docRef = await addDoc(partsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePart(id: string, data: Partial<PartInput>): Promise<void> {
  const docRef = doc(db, 'parts', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePart(id: string): Promise<void> {
  // Fetch the part to check for an image to clean up
  const parts = await getParts();
  const part = parts.find((p) => p.id === id);

  if (part && part.image) {
    try {
      const imageRef = ref(storage, part.image);
      await deleteObject(imageRef);
    } catch {
      // Image may not exist in storage
    }
  }

  const docRef = doc(db, 'parts', id);
  await deleteDoc(docRef);
}

// ---------------------------------------------------------------------------
// Part Categories
// ---------------------------------------------------------------------------

export async function getPartsCategories(): Promise<PartCategory[]> {
  const q = query(partsCategoriesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<PartCategory, 'id'>),
  }));
}

export async function createPartCategory(data: Omit<PartCategory, 'id'>): Promise<string> {
  const docRef = await addDoc(partsCategoriesRef, data);
  return docRef.id;
}

export async function updatePartCategory(
  id: string,
  data: Partial<Omit<PartCategory, 'id'>>
): Promise<void> {
  const docRef = doc(db, 'partsCategories', id);
  await updateDoc(docRef, data);
}

export async function deletePartCategory(id: string): Promise<void> {
  const docRef = doc(db, 'partsCategories', id);
  await deleteDoc(docRef);
}
