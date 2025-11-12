import api from './index';

export const foldersAPI = {
  create: async (folderData: { name: string; parentId?: string }) => {
    const response = await api.post('/folders', folderData);
    return response.data;
  },

  getTree: async () => {
    const response = await api.get('/folders');
    return response.data;
  },

  getById: async (folderId: string) => {
    const response = await api.get(`/folders/${folderId}`);
    return response.data;
  },

  update: async (folderId: string, folderData: { name: string }) => {
    const response = await api.patch(`/folders/${folderId}`, folderData);
    return response.data;
  },

  delete: async (folderId: string) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  }
};
