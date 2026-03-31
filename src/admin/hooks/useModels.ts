import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Model, ColorDoc } from '@/admin/services/modelService';

interface UseModelsReturn {
  models: Model[];
  loading: boolean;
}

async function fetchColorsForModel(modelId: string): Promise<ColorDoc[]> {
  const colorsRef = collection(db, 'models', modelId, 'colors');
  const q = query(colorsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ColorDoc, 'id'>),
  }));
}

export function useModels(): UseModelsReturn {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'models'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const modelsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const colors = await fetchColorsForModel(doc.id);
          return {
            id: doc.id,
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
      setModels(modelsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { models, loading };
}
