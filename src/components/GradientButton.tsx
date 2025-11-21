import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../style/global';

type GradientButtonProps = {
  title?: string | React.ReactNode;
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
  colors: buttonColors = [colors.primary, colors.primary]
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, disabled && styles.disabledWrapper]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={disabled ? [colors.Secondtransparent, colors.Secondtransparent] : buttonColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, styles.disabledWrapper]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          typeof title === 'string' ? (
            <Text style={styles.text}>{title}</Text>
          ) : (
            title
          )
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#1A73E8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledWrapper: {
    // opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
