import { Asset } from 'react-native-image-picker';
import api from './index';
import { search } from 'react-native-country-picker-modal/lib/CountryService';

// Files API functions
export const filesAPI = {
  // Upload file directly
  upload: async (fileData: FormData) => {
    try{    
      const response = await api.post('/files/upload', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response?.data;
    }catch(e:any){
      console.log(e?.response?.data)
      throw e;
    }
  },

  getPresignedUploadUrl: async (data: {
    folderId: string;
    fileName: string;
    contentType: string;
    userId: string;
    expiresIn?: number;
  }) => {
    const response = await api.post('/files/presigned-upload', data);
    return response.data;
  },

  create: async (fileData: {
    name: string;
    folderId: string;
    userId: string;
  }) => {
    const response = await api.post('/files', fileData);
    return response.data;
  },

    createDocument: async (fileData: {
    name: string;
    fileId: string;
    remarks: string;
    category: string;
    tag:string|undefined
  }) => {
    const response = await api.post('/file-details', fileData);
    return response.data;
  },
    updateDocument: async (id:string,fileData: {
    name: string;
    fileId: string;
    remarks: string;
    category: string;
    tag:string|undefined;
    
  }) => {
    const response = await api.patch(`/file-details/${id}`, fileData);
    return response.data;
  },


     getFileDetail: async (id:string) => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  getAll: async (folderId?: string) => {
    const params = new URLSearchParams();
    if (folderId) params.append('folderId', folderId);
    // if (userId) params.append('userId', userId);
    const response = await api.get(`/files?${params.toString()}`);
    return response.data;
  },

  getByFolder: async (folderId: string) => {
    const response = await api.get(`/files/folder/${folderId}`);
    return response.data;
  },

  getStats: async (userId: string) => {
    const response = await api.get(`/files/stats?userId=${userId}`);
    return response.data;
  },

  // Get file by ID
  getById: async (fileId: string) => {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  // Download file
  // Download file
  download: async (fileId: string) => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob', // Important for binary data
    });
    return response.data;
  },

  // Get download URL (useful for Linking.openURL)
  getDownloadUrl: (fileId: string) => {
    const baseURL = api.defaults.baseURL || 'https://vault-api-lyk2.onrender.com/api';
    return `${baseURL}/files/${fileId}/download`;
  },


  // Get presigned download URL
  getPresignedDownloadUrl: async (fileId: string, expiresIn?: number) => {
    const params = expiresIn ? `?expiresIn=${expiresIn}` : '';
    const response = await api.get(`/files/${fileId}/presigned-url${params}`);
    return response.data;
  },

  // Update file
  update: async (fileId: string, fileData: { name?: string; folderId?: string }) => {
    const response = await api.patch(`/files/${fileId}`, fileData);
    return response.data;
  },

  // Delete file
  delete: async (fileId: string) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
   search: async (params: {
  category?: string;
  tag?: string;
  search?: string;
  userId?: string;
}) => {
    const response = await api.get(`/files/search`,{params});
    return response.data;
  }
};
