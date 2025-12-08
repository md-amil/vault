import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CountryPicker } from 'react-native-country-codes-picker';
import { authAPI } from '../api/auth';
import GradientButton from '../components/GradientButton';
import Spacer from '../components/Spacer';
import { colors, globalStyles } from '../style/global';

// 1) Define a header component for the picker
const CountryHeader = ({ onPress }: { onPress: () => void }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
    }}
  >
    <TouchableOpacity onPress={onPress} style={{ padding: 4, marginRight: 8 }}>
      <MaterialCommunityIcons name="arrow-left" size={22} color="#111827" />
    </TouchableOpacity>
    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
      Select country code
    </Text>
  </View>
);



export default function LoginScreen({ navigation }: { navigation: any }) {
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phone, setPhone] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [receiveNotifications, setReceiveNotifications] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const isValid = useMemo(
    () => Boolean(countryCode) && /^\d{6,15}$/.test(phone) && acceptedTerms,
    [countryCode, phone, acceptedTerms],
  );

  async function onContinue() {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      const fullPhoneNumber = `${countryCode}${phone}`;
      const response = await authAPI.sendOTP(fullPhoneNumber);
      console.log(response, 'OTP response');
      navigation.navigate('OTP', { phone: fullPhoneNumber, countryCode });
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Unable to continue',
        error?.response?.data?.message || 'Could not send OTP. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand / top section */}
         <Spacer height={44} />
        <View style={globalStyles.brandContainer}>
          <View style={globalStyles.logoCircle}>
              <MaterialCommunityIcons name="account-circle-outline" size={28} color="#FFFFFF" />

          </View>
                   <Text style={styles.title}>Login </Text>
         <Text style={styles.subtitle}>
            Enter your mobile number and we’ll send you a one‑time verification code.
          </Text>

        </View>
        <Spacer height={30} />

        {/* Card */}
        <View >

          
          

          {/* <Text style={styles.label}>Mobile number</Text> */}
          <View style={styles.phoneRow}>
            {/* Country code dropdown */}
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.countryCodeLabel}>{countryCode}</Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={18}
                color="#4B5563"
              />
            </TouchableOpacity>

            {/* Phone input */}
            <TextInput
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
              style={styles.phoneInput}
              keyboardType="number-pad"
              placeholder="000 000 0000"
              placeholderTextColor="#A0AEC0"
              maxLength={15}
            />
          </View>
 <Spacer height={40} />

          {/* Terms */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && (
                <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text style={styles.link}>Terms & Conditions</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Notifications */}
           <Spacer height={10} />
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setReceiveNotifications(!receiveNotifications)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, receiveNotifications && styles.checkboxChecked]}
            >
              {receiveNotifications && (
                <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Send me OTP and important account notifications.
            </Text>
          </TouchableOpacity>

          <Spacer height={70} />

          <GradientButton
            title={loading ? 'Sending code…' : 'Continue'}
            onPress={onContinue}
            disabled={!isValid || loading}
            loading={loading}
          />
        </View>
        

        {/* Bottom auth hint */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Vault?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}> Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country code picker */}
<CountryPicker
  lang="en"
  show={showCountryPicker}
  onBackdropPress={() => setShowCountryPicker(false)}
  ListHeaderComponent={() => (
    <CountryHeader onPress={() => setShowCountryPicker(false)} />
  )}
  popularCountries={['us', 'gb', 'in']}
  pickerButtonOnPress={(item) => {
    setCountryCode(item.dial_code);
    setShowCountryPicker(false);
  }}
/>



    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },

  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  brandTagline: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign:'center'
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 20,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 72,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 8,
  },
  countryCodeLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
  },
  link: {
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
});
