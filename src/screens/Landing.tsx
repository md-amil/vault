import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.screen}>
      <Image
        source={{ uri: 'https://via.placeholder.com/120x120?text=Logo' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Vault</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.secondaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#0a84ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0a84ff',
    fontSize: 16,
    fontWeight: '600',
  },
});


