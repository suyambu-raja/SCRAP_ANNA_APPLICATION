import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { commissionReminderService } from '@/services/commissionReminderService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    localStorage.setItem('sa_token', token);
    localStorage.setItem('sa_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.id) {
      commissionReminderService.clearAllForUser(currentUser.id);
    }
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem('sa_user', JSON.stringify(user));
    set({ user });
  },

  setLoading: (isLoading) => set({ isLoading }),

  hydrate: () => {
    const token = localStorage.getItem('sa_token');
    const userStr = localStorage.getItem('sa_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));

/* Convenience selectors */
export const useUserRole = (): UserRole | null => useAuthStore((s) => s.user?.role ?? null);
export const useIsAuthenticated = (): boolean => useAuthStore((s) => s.isAuthenticated);
