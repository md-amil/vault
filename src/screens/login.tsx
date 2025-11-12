import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Alert, ActivityIndicator } from 'react-native';
import { authAPI } from '../api/auth';
// import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phone, setPhone] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isValid = useMemo(() => {
    return Boolean(countryCode) && /^\d{6,15}$/.test(phone) && acceptedTerms;
  }, [countryCode, phone, acceptedTerms]);

  async function onContinue() {
    if (!isValid || loading) return;
    
    try {
      setLoading(true);
      const fullPhoneNumber = `${countryCode}${phone}`;
      
      // Send OTP to the phone number
      const response = await authAPI.sendOTP(fullPhoneNumber);
      console.log(response.data);
      
      // Navigate to OTP screen with phone number
      navigation.navigate('OTP', { phone: fullPhoneNumber, countryCode });
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Mobile number</Text>
      <View style={styles.row}>
        <TextInput
          value={countryCode}
          onChangeText={setCountryCode}
          style={styles.countryCodeInput}
          keyboardType="phone-pad"
          placeholder="+1"
          placeholderTextColor="#888"
        />
        <TextInput
          value={phone}
          onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
          style={styles.phoneInput}
          keyboardType="number-pad"
          placeholder="123 456 7890"
          placeholderTextColor="#888"
          maxLength={15}
        />
      </View>

      <View style={styles.termsRow}>
        <Switch value={acceptedTerms} onValueChange={setAcceptedTerms} />
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, (!isValid || loading) && styles.disabledButton]} 
        disabled={!isValid || loading} 
        onPress={onContinue}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  countryCodeInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  label: {
    width: '100%',
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  termsText: {
    flex: 1,
    color: '#333',
  },
  link: {
    color: '#0a84ff',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
