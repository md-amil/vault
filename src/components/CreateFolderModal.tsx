import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type CreateFolderModalProps = {
  visible: boolean;
  folderName: string;
  onChangeName: (name: string) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export default function CreateFolderModal({
  visible,
  folderName,
  onChangeName,
  onCancel,
  onCreate,
}: CreateFolderModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onCancel}>
        <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>New Folder</Text>
          <TextInput
            value={folderName}
            onChangeText={onChangeName}
            placeholder="Folder name"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.link}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCreate}>
              <Text style={styles.link}>Create</Text>
            </TouchableOpacity>
          </View>
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
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#111827',
    fontWeight: '500',
  },
  modalActions: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  link: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 16,
  },
});
