import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import { colors } from '../style/global';

type GradientButtonProps = {
  title?: string;
  onPress?: () => void;
};

export default function OutLineButton({ title = "Button", onPress }: GradientButtonProps) {
  return (
    <TouchableOpacity 
               style={styles.registerButton}
               activeOpacity={0.8}
                onPress={onPress}
             >
               <Text style={styles.registerButtonText}>{title}</Text>
             </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 20,
  },
  registerButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
