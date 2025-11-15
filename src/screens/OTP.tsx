import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ScrollView 
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../components/GradientButton';
import Spacer from '../components/Spacer';
import { authAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { globalStyles,colors } from '../style/global';

type Params = {
  route: { params?: { phone?: string; countryCode?: string } };
  navigation: any;
};

export default function OTPScreen({ route, navigation }: Params) {
  const phone = route?.params?.phone ?? '';
  const countryCode = route?.params?.countryCode ?? '';
  const { login } = useAuth();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const code = otp.join('');
  const isValid = useMemo(() => /^\d{6}$/.test(code), [code]);

  useEffect(() => {
    const t = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

 const handleOtpChange = (text: string, index: number) => {
  // Make sure we're working with an array
  if (!Array.isArray(otp)) {
    console.error('OTP is not an array');
    setOtp(['', '', '', '', '', '']);
    return;
  }

  const newOtp = [...otp];
  newOtp[index] = text;
  setOtp(newOtp);

  // Auto-focus next input
  if (text && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  async function onVerify() {
    if (!isValid || loading) return;
    
    try {
      setLoading(true);
      Keyboard.dismiss();
      
      const response = await authAPI.verifyOTP(phone, code);
      
      if (response.access_token) {
        login();
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Invalid OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (cooldown > 0 || resending) return;
    
    try {
      setResending(true);
      await authAPI.sendOTP(phone);
      setCooldown(30);
      Alert.alert('Success', 'OTP has been resent to your phone number.');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
    
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={globalStyles.title}>Verify OTP</Text>
          <Text style={globalStyles.subtitle}>
            Enter the OTP sent to your mobile number
          </Text>

          <Spacer height={70} />

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpBox}
                textAlign="center"
                autoFocus={index === 0}
              />
            ))}
          </View>

          <Spacer height={42} />

          {/* Action Links */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.actionLink}>Change Number</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              disabled={cooldown > 0 || resending} 
              onPress={onResend}
            >
              <Text style={[
                styles.actionLink, 
                (cooldown > 0 || resending) && styles.actionDisabled
              ]}>
                Resend OTP {cooldown > 0 ? `(${cooldown}s)` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          <Spacer height={40} />

          {/* Verify Button */}
          <GradientButton
            title="Verify"
            onPress={onVerify}
            disabled={!isValid}
            loading={loading}
          />

          <Spacer height={42} />

          {/* Bottom Resend Text */}
          <View style={styles.bottomTextRow}>
            <Text style={styles.bottomText}>Didn't get the code? </Text>
            <TouchableOpacity 
              disabled={cooldown > 0 || resending} 
              onPress={onResend}
            >
              <Text style={[
                styles.bottomLink,
                (cooldown > 0 || resending) && styles.actionDisabled
              ]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLink: {
    fontSize: 14,
    color: '#6b5cdb',
    fontWeight: '600',
  },
  actionDisabled: {
    color: '#999',
  },
  bottomTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#718096',
  },
  bottomLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
