import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type GradientButtonProps = {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  colors?: string[];
};

export default function GradientButton({ 
  title = "Button", 
  onPress, 
  disabled = false,
  loading = false,
  colors = ['#667EEA', '#764BA2']
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, disabled && styles.disabledWrapper]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={disabled ? ['#9b7fe0', '#9b7fe0'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 20,
  },
  disabledWrapper: {
    opacity: 0.6,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
