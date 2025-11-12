import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function EmptyFolder() {
  return <Text style={styles.emptyText}>Empty folder</Text>;
}

const styles = StyleSheet.create({
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
