import { signInWithEmailAndPassword, signOut as firebaseSignOut, UserCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}
