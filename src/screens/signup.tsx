import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CountryPicker } from 'react-native-country-codes-picker';
import Spacer from '../components/Spacer';
import GradientButton from '../components/GradientButton';
import { colors, globalStyles } from '../style/global';

export default function SignupScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const isValid = useMemo(() => {
    const nameOk = firstName.trim().length > 0 && lastName.trim().length > 0;
    const phoneOk = /^\d{6,15}$/.test(phone);
    const emailOk = /.+@.+\..+/.test(email);
    return nameOk && phoneOk && emailOk && !!countryCode;
  }, [firstName, lastName, phone, email, countryCode]);

  function onSubmit() {
    if (!isValid || loading) return;

    // TODO: submit signup
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

          <Spacer height={44} />
                <View style={globalStyles.brandContainer}>
                  <View style={globalStyles.logoCircle}>
<MaterialCommunityIcons name="shield-account-outline" size={28} color="#FFFFFF" />
                  </View>
                           <Text style={styles.title}>Register </Text>
                 <Text style={styles.subtitle}>
                    Create your Vault account to securely store and access your documents.
                  </Text>
        
                </View>
                <Spacer height={10} />
       
    

        {/* Card form */}
        <View >
         
          
              <Text style={styles.label}>First name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor="#A0AEC0"
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
        <Spacer height={13} />
           
              <Text style={styles.label}>Last name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor="#A0AEC0"
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
         
    

          <Spacer height={13} />

          <Text style={styles.label}>Mobile number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.countryCodeLabel}>{countryCode}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#4B5563" />
            </TouchableOpacity>

            <TextInput
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
              style={styles.phoneInput}
              keyboardType="number-pad"
              placeholder="000 000 0000"
              placeholderTextColor="#A0AEC0"
              maxLength={15}
              returnKeyType="next"
            />
          </View>

          <Spacer height={10} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholder="john@example.com"
            placeholderTextColor="#A0AEC0"
            autoCapitalize="none"
          />

     <Spacer height={12} />
          <View style={{ marginTop: 24 }}>
            <GradientButton
              title={loading ? 'Creating account…' : 'Register now'}
              onPress={onSubmit}
              disabled={!isValid || loading}
              loading={loading}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}> Login</Text>
          </TouchableOpacity>
        </View>

        <Spacer height={24} />
      </ScrollView>

      {/* Same country code picker modal as login */}
      <CountryPicker
        lang="en"
        show={showCountryPicker}
        onBackdropPress={() => setShowCountryPicker(false)}
        ListHeaderComponent={() => (
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
            <TouchableOpacity
              onPress={() => setShowCountryPicker(false)}
              style={{ padding: 4, marginRight: 8 }}
            >
              <MaterialCommunityIcons name="arrow-left" size={22} color="#111827" />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
              Select country code
            </Text>
          </View>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign:'center'
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
  rowSplit: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  splitCol: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 6,
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
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
  footerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
