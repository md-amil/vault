import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { authAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

type Params = {
  route: { params?: { phone?: string; countryCode?: string } };
  navigation: any;
};

export default function OTPScreen({ route, navigation }: Params) {
  const phone = route?.params?.phone ?? '';
  const countryCode = route?.params?.countryCode ?? '';
  const { login } = useAuth();

  const [code, setCode] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const isValid = useMemo(() => /^\d{6}$/.test(code), [code]);

  useEffect(() => {
    const t = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  async function onVerify() {
    if (!isValid || loading) return;
    
    try {
      setLoading(true);
      Keyboard.dismiss();
      
      // Verify OTP with the API
      const response = await authAPI.verifyOTP(phone, code);
      
      if (response.access_token) {
        // Successfully verified, update auth state and navigate to Home
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
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <View style={styles.screen}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          Code sent to {countryCode} {phone}
        </Text>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
          keyboardType="number-pad"
          placeholder="••••••"
          placeholderTextColor="#999"
          style={styles.otpInput}
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity 
          style={[styles.primaryButton, (!isValid || loading) && styles.disabledButton]} 
          disabled={!isValid || loading} 
          onPress={onVerify}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          disabled={cooldown > 0 || resending} 
          onPress={onResend} 
          style={styles.resendBtn}
        >
          {resending ? (
            <ActivityIndicator color="#0a84ff" size="small" />
          ) : (
            <Text style={[styles.resendText, (cooldown > 0 || resending) && styles.resendDisabled]}>
              Resend {cooldown > 0 ? `(${cooldown}s)` : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#666',
  },
  otpInput: {
    letterSpacing: 12,
    textAlign: 'center',
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '80%',
  },
  primaryButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  resendBtn: {
    marginTop: 8,
  },
  resendText: {
    color: '#0a84ff',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#999',
  },
});


