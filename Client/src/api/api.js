import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const loginAdmin = async (adminId, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { adminId, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
