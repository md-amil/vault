import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderOption = {
  icon: string;
  label: string;
  onPress: () => void;
  isDanger?: boolean;
};

type HeaderOptionsMenuProps = {
  visible: boolean;
  onClose: () => void;
  options: HeaderOption[];
};

export default function HeaderOptionsMenu({
  visible,
  onClose,
  options,
}: HeaderOptionsMenuProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionRow,
                index === options.length - 1 && styles.lastOptionRow
              ]}
              onPress={option.onPress}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={[
                styles.optionText,
                option.isDanger && styles.dangerText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    minWidth: 200,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#f3f4f6',
  },
  lastOptionRow: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  dangerText: {
    color: '#dc2626',
  },
});
