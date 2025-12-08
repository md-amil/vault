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
  sendOTP: async (mobile: string) => {
    const cleanMobile = mobile.replace(/\+/g, '').trim();
    const response = await api.post('/auth/send-otp', { mobile: cleanMobile });
    console.log(response,'checking resposne ns')
    return
    return response.data;
  },


  register: async ({ name, mobile, email }: {
    name: string;
    mobile: string;
    email: string;
  }) => {
    const cleanMobile = mobile.replace(/\+/g, '').trim();

    const response = await api.post('/auth/register', {
      name: name.trim(),
      mobile: cleanMobile,
      email: email.trim(),
    });

    return response.data;
  },
verifyOTP: async (mobile: string, otp: string) => {
   const cleanMobile = mobile.replace(/\+/g, '').trim();
  const cleanOtp = String(otp).trim();  // ✅ force string

  console.log("Final OTP:", cleanOtp, "Length:", cleanOtp.length, cleanOtp);

  if (!/^\d{6}$/.test(cleanOtp)) {
    throw new Error("OTP must be a 6-digit number");
  }

  try {
 const response = await api.post('/auth/verify-otp', {
  mobile: cleanMobile,
  otp: cleanOtp   
});

    const { access_token } = response.data;

    if (access_token) {
      await setStoredToken(access_token);
    }

    return response.data;
  } catch (error: any) {
    console.log("VERIFY OTP ERROR:", error.response?.data);
    console.log("STATUS:", error.response?.status);
  }
},


  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: async () => {
    await clearStoredToken();
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await getStoredToken();
    return !!token;
  }
};

// Export token management functions for use in interceptors
export { getStoredToken, setStoredToken, clearStoredToken };
