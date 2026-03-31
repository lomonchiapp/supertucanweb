import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface ColorDoc {
  id: string;
  name: string;
  value: string;
  hex: string;
  order: number;
  images: {
    main: string;
    front: string;
    additional: string[];
  };
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  featured: boolean;
  description: string;
  specs: {
    engine: string;
    maxSpeed: string;
  };
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
  colors: ColorDoc[];
}

export interface ModelInput {
  name: string;
  slug: string;
  categoryId: string;
  featured: boolean;
  description: string;
  specs: {
    engine: string;
    maxSpeed: string;
  };
  order: number;
}

const modelsRef = collection(db, 'models');

async function fetchColors(modelId: string): Promise<ColorDoc[]> {
  const colorsRef = collection(db, 'models', modelId, 'colors');
  const q = query(colorsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ColorDoc, 'id'>),
  }));
}

export async function getModels(): Promise<Model[]> {
  const q = query(modelsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);

  const models = await Promise.all(
    snapshot.docs.map(async (d) => {
      const data = d.data();
      const colors = await fetchColors(d.id);
      return {
        id: d.id,
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        featured: data.featured,
        description: data.description,
        specs: data.specs,
        order: data.order,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        colors,
      } as Model;
    })
  );

  return models;
}

export async function getModel(id: string): Promise<Model | null> {
  const docRef = doc(db, 'models', id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const colors = await fetchColors(id);

  return {
    id: snapshot.id,
    name: data.name,
    slug: data.slug,
    categoryId: data.categoryId,
    featured: data.featured,
    description: data.description,
    specs: data.specs,
    order: data.order,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    colors,
  } as Model;
}

export async function createModel(data: ModelInput): Promise<string> {
  const docRef = await addDoc(modelsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateModel(id: string, data: Partial<ModelInput>): Promise<void> {
  const docRef = doc(db, 'models', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteModel(id: string): Promise<void> {
  // Fetch model to get slug for storage cleanup
  const model = await getModel(id);

  // Delete all colors in subcollection
  const colorsRef = collection(db, 'models', id, 'colors');
  const colorsSnapshot = await getDocs(colorsRef);
  const batch = writeBatch(db);
  colorsSnapshot.docs.forEach((colorDoc) => {
    batch.delete(colorDoc.ref);
  });
  batch.delete(doc(db, 'models', id));
  await batch.commit();

  // Delete storage files for this model
  if (model) {
    try {
      const storageRef = ref(storage, `bikes/${model.slug}`);
      const fileList = await listAll(storageRef);
      await Promise.all(fileList.items.map((item) => deleteObject(item)));
      // Also delete files in subdirectories
      for (const prefix of fileList.prefixes) {
        const subList = await listAll(prefix);
        await Promise.all(subList.items.map((item) => deleteObject(item)));
      }
    } catch {
      // Storage folder may not exist yet
    }
  }
}

export async function reorderModels(orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    const docRef = doc(db, 'models', id);
    batch.update(docRef, { order: index });
  });
  await batch.commit();
}
