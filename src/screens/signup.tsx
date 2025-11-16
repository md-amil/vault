import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spacer from '../components/Spacer';
import GradientButton from '../components/GradientButton';

export default function SignupScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  // const [loading, setLoading] useState<String>('')

  const isValid = useMemo(() => {
    const nameOk = firstName.trim().length > 0 && lastName.trim().length > 0;
    const phoneOk = /^\d{6,15}$/.test(phone);
    const emailOk = /.+@.+\..+/.test(email);
    return nameOk && phoneOk && emailOk && !!countryCode;
  }, [firstName, lastName, phone, email, countryCode]);

  function onSubmit() {
    if (!isValid) return;
    // Submit logic placeholder
  }

  return (
           <KeyboardAvoidingView 
          
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >

      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        {/* <Text style={styles.title}>Create accoun dfasdt</Text> */}

  <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Register and enjoy our features</Text>
        {/* <Spacer height={10} /> */}

      
          <View style={styles.splitCol}>
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
          </View>
          <View style={styles.splitCol}>
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
          </View>
     
     <View style={styles.splitCol}>
        <Text style={styles.label}>Mobile number</Text>
        <View style={styles.row}> 
          <TextInput
            value={countryCode}
            onChangeText={setCountryCode}
            style={styles.countryCodeInput}
            keyboardType="phone-pad"
            placeholder="+1"
            placeholderTextColor="#A0AEC0"
          />
          <TextInput
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
            style={styles.phoneInput}
            keyboardType="number-pad"
            placeholder="123 456 7890"
          placeholderTextColor="#A0AEC0"
            maxLength={15}
            returnKeyType="next"
          />
        </View>
</View>

 <View style={styles.splitCol}>
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

</View> 
        {/* <TouchableOpacity style={[styles.primaryButton, !isValid && styles.disabledButton]} disabled={!isValid} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </TouchableOpacity> */}

         <GradientButton
                  title="Register Now"
                  onPress={onSubmit}
                  disabled={!isValid || loading} 
                  loading={loading}
                />
                {/* Register Link */}
                 {/* <Spacer height={10} /> */}
                <View style={styles.registerRow}>
                  <Text style={styles.registerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.registerLink}>Login</Text>
                  </TouchableOpacity>
                </View>
                 <Spacer height={70} />
          
      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    // alignItems: 'center',
    backgroundColor:'#F8F9FA',
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 16,
  },
   title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom:-10
  
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 32,
  },
   label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  rowSplit: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  splitCol: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  input: {
   flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  countryCodeInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color:'333',
     backgroundColor: '#fff',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },


    link: {
    color: '#6b5cdb',
    fontWeight: '600',
  },
 
 
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#6b5cdb',
    fontWeight: '600',
  },
});
