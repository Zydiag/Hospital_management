import { create } from 'zustand';
import axios from 'axios';

const API = 'http://localhost:3000/api';
const useAuth = create((set, get) => ({
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated:
    localStorage.getItem('accessToken') !== 'undefined' &&
    localStorage.getItem('accessToken') !== null &&
    localStorage.getItem('accessToken') !== '',
  error: null,

  loginAdmin: async (armyNo, password) => {
    try {
      const response = await axios.post(`${API}/admin/login`, { armyNo, password });
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
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
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      console.log(error);
      set({
        error: error.response ? error.response.data.message : 'Login failed',
      });
      throw new Error(error.response ? error.response.data.message : 'Login failed');
    }
  },

  refreshToken: async () => {
    const { accessToken } = get();
    try {
      const response = await axios.post(`${API}/user/refresh-access-token`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
      // console.log('earlier token 🫀', accessToken);
      const newAccessToken = response.data.data.accessToken;
      // console.log('response from refresh token function:  🫀', newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
      set({ accessToken: newAccessToken, isAuthenticated: true });
      return newAccessToken;
    } catch (error) {
      console.log(error);
      set({ error: error.response ? error.response.data.message : 'Failed to refresh token' });
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      throw new Error(error.response ? error.response.data.message : 'Failed to refresh token');
    }
  },

  makeAuthRequest: async (method, url, data = null) => {
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
      console.log(error);
      if (error.response.data.message === 'jwt expired') {
        try {
          const newAccessToken = await useAuth.getState().refreshToken();
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
          console.log(refreshError);
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
      await get().makeAuthRequest('POST', `${API}/admin/logout`);
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
