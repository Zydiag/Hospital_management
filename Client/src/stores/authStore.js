import { create } from 'zustand';
import axios from 'axios';

const useAuth = create((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  error: null,

  loginAdmin: async (armyNo, password) => {
    try {
      const response = await axios.post('/api/admin/login', { armyNo, password });
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response ? error.response.data.message : 'Login failed',
      });
    }
  },

  logoutAdmin: async () => {
    try {
      await axios.post('/api/admin/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response ? error.response.data.message : 'Logout failed',
      });
    }
  },

  makeAuthRequest: async (method, url, data = null) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access token:', accessToken);
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Response:', response);

      return response.data;
    } catch (error) {
      set({
        error: error.response ? error.response.data.message : 'Request failed',
      });
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get('/api/admin/current', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      set({
        user: response.data.data,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response ? error.response.data.message : 'Failed to fetch user',
      });
    }
  },
}));

export default useAuth;
