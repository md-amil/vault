import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../style/global";

interface FabProps {
  showActions: boolean;
  setShowUploadModal: (show: boolean) => void;
  setShowActions: (show: boolean | ((v: boolean) => boolean)) => void;
}

export default function Fab({ showActions, setShowUploadModal, setShowActions }: FabProps) {
  
  const handlePress = () => {
    setShowActions(false);
    setShowUploadModal(true);
  };

  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 44,
    right: 24,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
  },
});
