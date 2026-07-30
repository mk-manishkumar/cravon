import api from '../lib/axios';

export const authService = {
  // Customer
  login: async (credentials: Record<string, string>) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: Record<string, string>) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Restaurant Partner
  loginRestaurant: async (credentials: Record<string, string>) => {
    const response = await api.post('/auth/restaurant/login', credentials);
    return response.data;
  },
  registerRestaurant: async (userData: Record<string, string>) => {
    const response = await api.post('/auth/restaurant/register', userData);
    return response.data;
  },
  verifyRestaurantOtp: async (data: { email: string, otp: string }) => {
    const response = await api.post('/auth/restaurant/verify-otp', data);
    return response.data;
  },
  resendRestaurantOtp: async (data: { email: string }) => {
    const response = await api.post('/auth/restaurant/resend-otp', data);
    return response.data;
  },

  // Admin
  loginAdmin: async (credentials: Record<string, string>) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  // Session
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};
