import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  login: async (adminId, password) => {
    try {
      const response = await axios.post('/api/auth/login', { adminId, password });
      const { accessToken, refreshToken } = response.data;
      set({ accessToken, refreshToken });
      set({ user: response.data.user });
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null, accessToken: null, refreshToken: null });
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
  refreshAccessToken: async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token', {
        token: useAuthStore.getState().refreshToken,
      });
      const { accessToken } = response.data;
      set({ accessToken });
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
