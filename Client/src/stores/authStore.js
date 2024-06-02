import { create } from 'zustand';
import axios from 'axios';

const API = 'http://localhost:3000/api';
const useAuth = create((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  error: null,

  loginAdmin: async (armyNo, password) => {
    try {
      const response = await axios.post(`${API}/admin/login`, { armyNo, password });
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
      console.log('admin login', error);
      set({
        error: error.response ? error.response.data.message : 'Login failed',
      });
      throw new Error(error.response ? error.response.data.message : 'Login failed');
    }
  },

  loginDoctor: async (armyNo, password) => {
    try {
      const response = await axios.post(`${API}/doctor/login`, { armyNo, password });
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
      throw new Error(error.response ? error.response.data.message : 'Login failed');
    }
  },

  refreshToken: async () => {
    console.log('refresh token');
    try {
      const response = await axios.post(`${API}/user/refresh-access-token`, null, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      const newAccessToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      set({ accessToken: newAccessToken, isAuthenticated: true });
      return newAccessToken;
    } catch (error) {
      set({ error: error.response ? error.response.data.message : 'Failed to refresh token' });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      throw new Error(error.response ? error.response.data.message : 'Failed to refresh token');
    }
  },

  makeAuthRequest: async (method, url, data = null) => {
    const state = useAuth.getState();
    try {
      let accessToken = localStorage.getItem('accessToken');
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

      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === 'jwt expired') {
        try {
          const newAccessToken = await state.refreshToken();
          const response = await axios({
            method,
            url,
            data,
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return response.data;
        } catch (refreshError) {
          set({
            error: refreshError.response ? refreshError.response.data.message : 'Request failed',
          });
          throw new Error(
            refreshError.response ? refreshError.response.data.message : 'Request failed'
          );
        }
      } else {
        set({
          error: error.response ? error.response.data.message : 'Request failed',
        });
        throw new Error(error.response ? error.response.data.message : 'Request failed');
      }
    }
  },

  logoutAdmin: async () => {
    try {
      await useAuth.getState().makeAuthRequest('POST', `${API}/admin/logout`);
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
