import { useEffect } from 'react';
import { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../lib/axiosInstance';

export function useFirebaseAuth() {
  const { setAuth, clearAuth, user, isAuthenticated, role, loading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        const tokenResult = await firebaseUser.getIdTokenResult();
        const userRole = (tokenResult.claims.role as string) ?? null;

        setAuth(firebaseUser, idToken, userRole);

        // Sync user to MongoDB
        axiosInstance.post('/api/v1/auth/sync').catch(() => {});
      } else {
        clearAuth();
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (!result.user.emailVerified) {
      await sendEmailVerification(result.user);
    }
    return result;
  };

  const logOut = async () => {
    await signOut(auth);
    clearAuth();
  };

  return { user, isAuthenticated, role, loading, signIn, logOut };
}
