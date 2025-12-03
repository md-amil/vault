import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  countryCode: string;
  onPressCountry: () => void;
  phone: string;
  onChangePhone: (val: string) => void;
};

export function PhoneInput({ countryCode, onPressCountry, phone, onChangePhone }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.countryCodeButton}
        onPress={onPressCountry}
        activeOpacity={0.8}
      >
        <Text style={styles.countryCodeLabel}>{countryCode}</Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color="#4B5563" />
      </TouchableOpacity>

      <TextInput
        value={phone}
        onChangeText={(t) => onChangePhone(t.replace(/[^0-9]/g, ''))}
        style={styles.phoneInput}
        keyboardType="number-pad"
        placeholder="000 000 0000"
        placeholderTextColor="#A0AEC0"
        maxLength={15}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
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
});
