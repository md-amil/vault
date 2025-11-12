import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

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
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>

        <View style={styles.rowSplit}> 
          <View style={styles.splitCol}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              placeholderTextColor="#888"
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
              placeholderTextColor="#888"
              style={styles.input}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
        </View>

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
            returnKeyType="next"
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          placeholder="john@example.com"
          placeholderTextColor="#888"
          autoCapitalize="none"
        />

        <TouchableOpacity style={[styles.primaryButton, !isValid && styles.disabledButton]} disabled={!isValid} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    width: '100%',
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
});
