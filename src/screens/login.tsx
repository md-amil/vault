import React, { useMemo, useState, } from 'react';
import { ScrollView, StyleSheet,KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Switch, Alert, ActivityIndicator, Platform } from 'react-native';
import { authAPI } from '../api/auth';
// import { useAuth } from '../contexts/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../components/GradientButton';
import Spacer from '../components/Spacer';
import { colors } from '../style/global';


export default function LoginScreen({ navigation }: { navigation: any }) {
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phone, setPhone] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [receiveNotifications, setReceiveNotifications] = useState<boolean>(false);

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
      console.log(response, 'checking response');
      
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
       <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
       <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
        
      </View> */}

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your mobile number</Text>
        <Spacer height={30} />

        {/* Mobile Number Input */}
        <Text style={styles.label}>Mobile Number </Text>
        <View style={styles.phoneContainer}>
          {/* Country Code Picker */}
          {/* <TouchableOpacity style={styles.countryCodeButton}> 
            <Text style={styles.countryCodeText}>IN {countryCode}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>  */}

          {/* Phone Input */}
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
        />
        
        </View>

<Spacer height={20} />
        {/* Terms Checkbox */}
       
        <TouchableOpacity 
          style={styles.checkboxRow} 
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && (
              <MaterialCommunityIcons name="check" size={16} color="#fff" />
            )}
          </View>
          {/* <Switch value={acceptedTerms} onValueChange={setAcceptedTerms} /> */}
          <Text style={styles.checkboxText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>


        {/* Notifications Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxRow} 
          onPress={() => setReceiveNotifications(!receiveNotifications)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, receiveNotifications && styles.checkboxChecked]}>
            {receiveNotifications && (
              <MaterialCommunityIcons name="check" size={16} color="#fff" />
            )}
          </View>
          <Text style={styles.checkboxText}>Agree to receive OTP notifications</Text>
        </TouchableOpacity>

        {/* Login Button */}
     <Spacer height={30} />
   <GradientButton
          title="Login"
          onPress={onContinue}
         disabled={!isValid || loading} 
          loading={loading}
        />
        {/* Register Link */}
         <Spacer height={50} />
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
          {/* <Text>sdf alsdfa</Text>
           <TouchableOpacity onPress={() => navigation.navigate('OTP')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity> */}
        </View>
         <Spacer height={70} />
      </ScrollView>
    </View>
   
      {/* <Text style={styles.title}>Login </Text>
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
      </View> */}

      {/* <View style={styles.termsRow}>
        <Switch value={acceptedTerms} onValueChange={setAcceptedTerms} />
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View> */}

      {/* <TouchableOpacity 
        style={[styles.primaryButton, (!isValid || loading) && styles.disabledButton]} 
        disabled={!isValid || loading} 
        onPress={onContinue}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Continue</Text>
        )}
      </TouchableOpacity> */}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: colors.background
  },

  backButton: {
    padding: 8,
  },

  shareButton: {
    padding: 8,
  },
  scrollContent: {
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
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    gap: 4,
  },
  countryCodeText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  link: {
    color: colors.primary,
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
    color: colors.primary,
    fontWeight: '600',
  },
  screen: {
    // flexGrow: 1,
    // alignItems: 'center',
    // paddingTop: 24,
    // paddingHorizontal: 24,
    // gap: 16,
  },
  // title: {
  //   fontSize: 24,
  //   fontWeight: '700',
  //   marginTop: 8,
  // },
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
    backgroundColor:'#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  // phoneInput: {
  //   flex: 1,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 10,
  //   paddingHorizontal: 12,
  //   paddingVertical: 12,
  //   fontSize: 16,
  // },

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
 

});
