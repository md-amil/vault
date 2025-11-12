import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Entry } from '../types';

type FolderRowProps = {
  item: Entry;
  onOpen: (item: Entry) => void;
};

export default function FolderRow({ item, onOpen }: FolderRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onOpen(item)}>
      <Text style={styles.icon}>{item.type === 'folder' ? '📁' : '📄'}</Text>
      <Text style={styles.rowText}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 32,
    fontSize: 20,
    textAlign: 'center',
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});
