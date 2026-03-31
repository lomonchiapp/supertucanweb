import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function getStoragePath(
  modelSlug: string,
  colorValue: string,
  filename: string
): string {
  return `bikes/${modelSlug}/${colorValue}/${filename}`;
}

export async function uploadImage(
  modelSlug: string,
  colorValue: string,
  file: File,
  filename: string
): Promise<string> {
  const path = getStoragePath(modelSlug, colorValue, filename);
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
