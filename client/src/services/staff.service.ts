import api from "../lib/axios";

export const staffService = {
  getStaff: async (restaurantId: string) => {
    const res = await api.get(`/staff/${restaurantId}`);
    return res.data;
  },

  getAllStaff: async () => {
    const res = await api.get(`/staff`);
    return res.data;
  },

  inviteStaff: async (data: { restaurantId: string; email: string; role: string; permissions: string[] }) => {
    const res = await api.post('/staff/invite', data);
    return res.data;
  },

  acceptInvite: async (data: { token: string; userId: string }) => {
    const res = await api.post('/staff/accept-invite', data);
    return res.data;
  },

  getInviteDetails: async (token: string) => {
    const res = await api.get(`/staff/invite/${token}`);
    return res.data;
  },

  acceptInviteNewUser: async (data: any) => {
    const res = await api.post('/staff/accept-invite-new', data);
    return res.data;
  },

  updateStaff: async (id: string, data: { role?: string; permissions?: string[] }) => {
    const res = await api.put(`/staff/${id}`, data);
    return res.data;
  },

  removeStaff: async (id: string) => {
    const res = await api.delete(`/staff/${id}`);
    return res.data;
  }
};
