import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth, database } from '../firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export const signUpWithEmail = async (
  email: string,
  username: string,
  password: string
) => {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (username)
    await updateProfile(credentials.user, { displayName: username });
  await ensureFirestoreUser(credentials.user, 'email');
  return credentials.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  await ensureFirestoreUser(credentials.user, 'email');
  return credentials.user;
};

export const logout = async () => {
  await signOut(auth);
};

async function ensureFirestoreUser(user: User, provider: string) {
  if (!user?.uid) return;
  const ref = doc(database, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      provider,
      createdAt: serverTimestamp(),
    });
  }
}
