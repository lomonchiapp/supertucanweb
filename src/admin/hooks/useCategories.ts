import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/admin/services/categoryService';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Category, 'id'>),
      }));
      setCategories(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { categories, loading };
}
