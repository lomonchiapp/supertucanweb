import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Part, PartCategory } from '@/admin/services/partsService';

interface UsePartsReturn {
  parts: Part[];
  loading: boolean;
}

interface UsePartsCategoriesReturn {
  categories: PartCategory[];
  loading: boolean;
}

export function useParts(): UsePartsReturn {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'parts'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Part, 'id'>),
      }));
      setParts(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { parts, loading };
}

export function usePartsCategories(): UsePartsCategoriesReturn {
  const [categories, setCategories] = useState<PartCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'partsCategories'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PartCategory, 'id'>),
      }));
      setCategories(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { categories, loading };
}
