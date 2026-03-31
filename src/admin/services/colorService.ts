import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
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

export interface ColorInput {
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

export async function getColors(modelId: string): Promise<ColorDoc[]> {
  const colorsRef = collection(db, 'models', modelId, 'colors');
  const q = query(colorsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ColorDoc, 'id'>),
  }));
}

export async function addColor(modelId: string, data: ColorInput): Promise<string> {
  const colorsRef = collection(db, 'models', modelId, 'colors');
  const docRef = await addDoc(colorsRef, data);
  return docRef.id;
}

export async function updateColor(
  modelId: string,
  colorId: string,
  data: Partial<ColorInput>
): Promise<void> {
  const colorRef = doc(db, 'models', modelId, 'colors', colorId);
  await updateDoc(colorRef, data);
}

export async function deleteColor(modelId: string, colorId: string): Promise<void> {
  // Get the color document to find its value for storage cleanup
  const colorsRef = collection(db, 'models', modelId, 'colors');
  const snapshot = await getDocs(colorsRef);
  const colorDoc = snapshot.docs.find((d) => d.id === colorId);

  // Delete the Firestore document
  const colorRef = doc(db, 'models', modelId, 'colors', colorId);
  await deleteDoc(colorRef);

  // Delete associated storage files
  if (colorDoc) {
    const data = colorDoc.data();
    try {
      // Get parent model to find slug
      const { getDoc } = await import('firebase/firestore');
      const modelRef = doc(db, 'models', modelId);
      const modelSnap = await getDoc(modelRef);
      if (modelSnap.exists()) {
        const modelSlug = modelSnap.data().slug;
        const storagePath = `bikes/${modelSlug}/${data.value}`;
        const storageRef = ref(storage, storagePath);
        const fileList = await listAll(storageRef);
        await Promise.all(fileList.items.map((item) => deleteObject(item)));
      }
    } catch {
      // Storage folder may not exist
    }
  }
}

export async function reorderColors(modelId: string, orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    const colorRef = doc(db, 'models', modelId, 'colors', id);
    batch.update(colorRef, { order: index });
  });
  await batch.commit();
}
