import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  idToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  setAuth: (user: User, idToken: string, role: string | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  isAuthenticated: false,
  role: null,
  loading: true,
  setAuth: (user, idToken, role) =>
    set({ user, idToken, isAuthenticated: true, role, loading: false }),
  clearAuth: () =>
    set({ user: null, idToken: null, isAuthenticated: false, role: null, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
