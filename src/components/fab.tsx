import { StyleSheet,Text, TouchableOpacity, View } from "react-native";

interface FabProps {
  showActions: boolean;
  setShowFolderModal: (show: boolean) => void;
  setShowFilePicker: (show: boolean) => void;
  setShowActions: (show: boolean|((v: boolean) => boolean)) => void;
}

export default function Fab({ showActions, setShowFolderModal, setShowFilePicker, setShowActions }: FabProps) {

  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
        {showActions && (
          <View style={styles.speedDial}>
            <TouchableOpacity style={styles.speedDialItem} onPress={() => { setShowFolderModal(true); }}>
              <Text style={styles.speedDialText}>New Folder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.speedDialItem} onPress={() => { setShowFilePicker(true); }}>
              <Text style={styles.speedDialText}>Add File</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.fab} onPress={() => setShowActions((v: boolean) => !v)}>
          <Text style={styles.fabIcon}>{showActions ? '×' : '+'}</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        bottom: 32,
        right: 20,
        alignItems: 'flex-end',
      },
      fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      fabIcon: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: '300',
      },
      speedDial: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      speedDialItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
      },
      speedDialText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
      },
});