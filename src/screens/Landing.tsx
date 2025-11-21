import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from '../components/GradientButton';
import OutLineButton from '../components/OutLineButton';
import { colors } from '../style/global';

export default function LandingScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="earth" size={40} color="#fff" />
            </View>
          </View>

          {/* Application Name */}
          <Text style={styles.appName}>Welcome to Vault</Text>

          {/* Main Icon with Circle Background */}
          <View style={styles.mainIconContainer}>
            <View style={styles.iconCircleBackground}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="folder-text" size={60} color={colors.primary} />
              </View>
            </View>
          </View>

          {/* Description Text */}
          <Text style={styles.description}>
            Simple way to manage your{'\n'}documents
          </Text>

          {/* Buttons Container */}
          <View style={styles.buttonGroup}>
            <GradientButton 
              title="Login" 
              disabled={false}
              onPress={() => navigation.navigate('Login')} 
            />
            <OutLineButton 
              title="Register" 
              onPress={() => navigation.navigate('Signup')} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    color: '#333',
    marginBottom: 50,
    fontWeight: '600',
  },
  mainIconContainer: {
    marginBottom: 40,
  },
  iconCircleBackground: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.Secondtransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
});
