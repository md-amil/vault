import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Entry,File, Folder } from '../types';

type GridTileProps = {
  item: File|Folder;
  onOpen: (item: File|Folder) => void;
};

export default function GridTile({ item, onOpen }: GridTileProps) {
  return (
    <TouchableOpacity style={styles.tile} onPress={() => onOpen(item)}>
      <Text style={styles.tileIcon}>{'path' in item ? '📄' :'📁' }</Text>
      <Text style={styles.tileText} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: 12,
    color:'#6B7280',
  },
  tileText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    color: '#374151',
    lineHeight: 20,
  },
});
