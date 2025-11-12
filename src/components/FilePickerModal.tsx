import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FilePickerModalProps = {
  visible: boolean;
  onCancel: () => void;
  onCamera: () => void;
  onGallery: () => void;
};

export default function FilePickerModal({
  visible,
  onCancel,
  onCamera,
  onGallery,
}: FilePickerModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onCancel}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>Add File</Text>
          <TouchableOpacity style={styles.optionRow} onPress={onCamera}>
            <Text style={styles.rowText}>Use Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} onPress={onGallery}>
            <Text style={styles.rowText}>Choose from Gallery</Text>
          </TouchableOpacity>
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
  optionRow: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});
