import api from './index';

// Users API functions
export const usersAPI = {
  // Create user
  create: async (userData: { mobile: string; name: string }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Get all users
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID
  getById: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  update: async (userId: string, userData: { name?: string }) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Deactivate user
  deactivate: async (userId: string) => {
    const response = await api.patch(`/users/${userId}/deactivate`);
    return response.data;
  },

  // Activate user
  activate: async (userId: string) => {
    const response = await api.patch(`/users/${userId}/activate`);
    return response.data;
  },

  // Delete user
  delete: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }
};
