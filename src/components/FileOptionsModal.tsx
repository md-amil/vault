import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entry } from '../types';

type FileOption = {
  icon: string;
  label: string;
  onPress: () => void;
  isDanger?: boolean;
};

type FileOptionsModalProps = {
  visible: boolean;
  file: Entry | null;
  onClose: () => void;
  options: FileOption[];
};

export default function FileOptionsModal({
  visible,
  file,
  onClose,
  options,
}: FileOptionsModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>File Options</Text>
          <Text style={styles.fileName}>{file?.name}</Text>
          
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.fileOptionRow}
              onPress={option.onPress}
            >
              <Text style={styles.fileOptionIcon}>{option.icon}</Text>
              <Text style={[
                styles.fileOptionText,
                option.isDanger && styles.deleteText
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  fileName: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  fileOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderColor: '#f9fafb',
  },
  fileOptionIcon: {
    fontSize: 22,
    marginRight: 10,
    width: 28,
    textAlign: 'center',
  },
  fileOptionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    letterSpacing: 0.2,
  },
  deleteText: {
    color: '#dc2626',
  },
});
