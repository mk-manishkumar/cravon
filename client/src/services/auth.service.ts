import api from '../lib/axios';

export const authService = {
  login: async (credentials: Record<string, string>) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: Record<string, string>) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};
