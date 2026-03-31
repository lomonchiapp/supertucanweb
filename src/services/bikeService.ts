import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import type { BikeModel, BikeColor, BikeCategory, CategoryInfo } from '@/types/bikes';

async function fetchColorsForModel(modelId: string): Promise<BikeColor[]> {
  const colorsRef = collection(db, 'models', modelId, 'colors');
  const colorsQuery = query(colorsRef, orderBy('order'));
  const colorsSnapshot = await getDocs(colorsQuery);

  return colorsSnapshot.docs.map((colorDoc) => {
    const data = colorDoc.data();
    return {
      name: data.name,
      value: data.value,
      hex: data.hex,
      images: {
        main: data.images.main,
        front: data.images.front,
        additional: data.images.additional ?? [],
      },
    };
  });
}

function mapDocToBikeModel(
  docId: string,
  data: Record<string, unknown>,
  colors: BikeColor[]
): BikeModel {
  return {
    id: docId,
    name: data.name as string,
    slug: data.slug as string,
    category: data.categoryId as BikeCategory,
    colors,
    featured: (data.featured as boolean) ?? false,
    specs: {
      engine: (data.specs as { engine: string; maxSpeed: string }).engine,
      maxSpeed: (data.specs as { engine: string; maxSpeed: string }).maxSpeed,
    },
    description: data.description as string,
  };
}

export async function fetchAllBikes(): Promise<BikeModel[]> {
  const modelsRef = collection(db, 'models');
  const modelsQuery = query(modelsRef, orderBy('order'));
  const modelsSnapshot = await getDocs(modelsQuery);

  const bikes: BikeModel[] = await Promise.all(
    modelsSnapshot.docs.map(async (modelDoc) => {
      const data = modelDoc.data();
      const colors = await fetchColorsForModel(modelDoc.id);
      return mapDocToBikeModel(modelDoc.id, data, colors);
    })
  );

  return bikes;
}

export async function fetchBikesByCategory(categoryId: string): Promise<BikeModel[]> {
  const modelsRef = collection(db, 'models');
  const modelsQuery = query(
    modelsRef,
    where('categoryId', '==', categoryId),
    orderBy('order')
  );
  const modelsSnapshot = await getDocs(modelsQuery);

  const bikes: BikeModel[] = await Promise.all(
    modelsSnapshot.docs.map(async (modelDoc) => {
      const data = modelDoc.data();
      const colors = await fetchColorsForModel(modelDoc.id);
      return mapDocToBikeModel(modelDoc.id, data, colors);
    })
  );

  return bikes;
}

export async function fetchCategories(): Promise<CategoryInfo[]> {
  const categoriesRef = collection(db, 'categories');
  const categoriesQuery = query(categoriesRef, orderBy('order'));
  const categoriesSnapshot = await getDocs(categoriesQuery);

  return categoriesSnapshot.docs.map((catDoc) => {
    const data = catDoc.data();
    return {
      id: catDoc.id as BikeCategory,
      name: data.name as string,
      description: data.description as string,
    };
  });
}

export async function fetchBikeBySlug(slug: string): Promise<BikeModel | undefined> {
  const modelsRef = collection(db, 'models');
  const modelsQuery = query(modelsRef, where('slug', '==', slug));
  const modelsSnapshot = await getDocs(modelsQuery);

  if (modelsSnapshot.empty) {
    return undefined;
  }

  const modelDoc = modelsSnapshot.docs[0];
  const data = modelDoc.data();
  const colors = await fetchColorsForModel(modelDoc.id);

  return mapDocToBikeModel(modelDoc.id, data, colors);
}
