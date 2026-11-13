import { create } from 'zustand';
import api from '../services/api';

const savedUser = localStorage.getItem('modera_user');
const savedToken = localStorage.getItem('modera_token');

export const useAuthStore = create((set, get) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  isAdmin: savedUser ? JSON.parse(savedUser).role === 'ADMIN' : false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      
      localStorage.setItem('modera_token', token);
      localStorage.setItem('modera_user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please verify credentials.';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  register: async ({ firstName, lastName, email, password, phone }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { firstName, lastName, email, password, phone });
      const { user, token } = res.data.data;
      
      localStorage.setItem('modera_token', token);
      localStorage.setItem('modera_user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('modera_token');
    localStorage.removeItem('modera_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null,
    });
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.patch('/auth/profile', data);
      const updatedUser = res.data.data.user;
      localStorage.setItem('modera_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },
}));

