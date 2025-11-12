import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './index';

// Token management functions
const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const setStoredToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

const clearStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to clear token:', error);
  }
};

// Authentication API functions
export const authAPI = {
  // Send OTP to mobile number
  sendOTP: async (mobile: string) => {
    const response = await api.post('/auth/send-otp', { mobile });
    return response.data;
  },

  // Verify OTP and get token
  verifyOTP: async (mobile: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { mobile, otp });
    const { access_token } = response.data;
    console.log(access_token);
    if (access_token) {
      await setStoredToken(access_token);
    }
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout (clear token)
  logout: async () => {
    await clearStoredToken();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await getStoredToken();
    return !!token;
  }
};

// Export token management functions for use in interceptors
export { getStoredToken, setStoredToken, clearStoredToken };
