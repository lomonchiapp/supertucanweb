import { useState, useEffect } from 'react';
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Model, ColorDoc } from '@/admin/services/modelService';

interface UseModelReturn {
  model: Model | null;
  loading: boolean;
}

export function useModel(id: string | undefined): UseModelReturn {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setModel(null);
      setLoading(false);
      return;
    }

    let modelData: Record<string, unknown> | null = null;
    let colorsData: ColorDoc[] = [];
    let modelLoaded = false;
    let colorsLoaded = false;

    function buildModel() {
      if (modelLoaded && colorsLoaded && modelData) {
        setModel({
          id: id!,
          name: modelData.name as string,
          slug: modelData.slug as string,
          categoryId: modelData.categoryId as string,
          featured: modelData.featured as boolean,
          description: modelData.description as string,
          specs: modelData.specs as { engine: string; maxSpeed: string },
          order: modelData.order as number,
          createdAt: modelData.createdAt,
          updatedAt: modelData.updatedAt,
          colors: colorsData,
        });
        setLoading(false);
      }
    }

    const modelRef = doc(db, 'models', id);
    const unsubModel = onSnapshot(modelRef, (snapshot) => {
      if (snapshot.exists()) {
        modelData = snapshot.data() as Record<string, unknown>;
      } else {
        modelData = null;
        setModel(null);
        setLoading(false);
      }
      modelLoaded = true;
      buildModel();
    });

    const colorsRef = collection(db, 'models', id, 'colors');
    const colorsQuery = query(colorsRef, orderBy('order', 'asc'));
    const unsubColors = onSnapshot(colorsQuery, (snapshot) => {
      colorsData = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ColorDoc, 'id'>),
      }));
      colorsLoaded = true;
      buildModel();
    });

    return () => {
      unsubModel();
      unsubColors();
    };
  }, [id]);

  return { model, loading };
}
