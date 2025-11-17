import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spacer from './Spacer';

interface UploadOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onNewFolder: () => void;
  onGallery: () => void;
  onDocuments: () => void;
  onICloud: () => void;
  onGoogleCloud: () => void;
}

const { width } = Dimensions.get('window');
const containerPadding = 24; // padding from content container
const gap = 16; // gap between cards
const cardWidth = (width - 40 - (containerPadding * 2) - gap) / 2; // Properly 
export default function UploadOptionsModal({
  visible,
  onClose,
  onCamera,
  onNewFolder,
  onGallery,
  onDocuments,
  onICloud,
  onGoogleCloud,
}: UploadOptionsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload File </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Upload Document</Text>
            <Text style={styles.subtitle}>
              Add your files to organize them better
            </Text>
            <Spacer height={20} />

            {/* Options Grid */}
            <View style={styles.grid}>
              {/* Camera */}
              <TouchableOpacity
                style={styles.card}
                onPress={onCamera}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="camera" size={40} color="#6b5cdb" />
                </View>
                <Text style={styles.cardLabel}>Camera</Text>
              </TouchableOpacity>

              {/* New File */}
              <TouchableOpacity
                style={styles.card}
                onPress={onNewFolder}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="folder-plus" size={40} color="#6b5cdb" />
                </View>
                <Text style={styles.cardLabel}>New Folder</Text>
              </TouchableOpacity>

              {/* Gallery */}
              <TouchableOpacity
                style={styles.card}
                onPress={onGallery}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="image" size={40} color="#6b5cdb" />
                </View>
                <Text style={styles.cardLabel}>Gallery</Text>
              </TouchableOpacity>

              {/* Documents (PDF, Images, ZIP) */}
              <TouchableOpacity
                style={styles.card}
                onPress={onDocuments}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="file-document" size={40} color="#6b5cdb" />
                </View>
                <Text style={styles.cardLabel}>Documents</Text>
              </TouchableOpacity>

              {/* iCloud */}
              <TouchableOpacity
                style={styles.card}
                onPress={onICloud}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="cloud-download" size={40} color="#6b5cdb" />
                </View>
                <Text style={styles.cardLabel}>iCloud</Text>
              </TouchableOpacity>

              {/* Google Cloud */}
              <TouchableOpacity
                style={styles.card}
                onPress={onGoogleCloud}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="google-drive" size={40} color="#6b5cdb" />
                </View>
                <Text style={styles.cardLabel}>Google Cloud</Text>
              </TouchableOpacity>

              {/* Cancel */}
            
            </View>
              <Spacer height={30} />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
                >
                <MaterialCommunityIcons name="close" size={24} color="#ff4d8f" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

             {/* <Spacer height={50} /> */}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
     cancelButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff4d8f',
    backgroundColor: '#fff',
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d8f',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 20,
    maxHeight: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: cardWidth,
    aspectRatio: 1,
    backgroundColor: '#f8f9fb',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cancelCard: {
    borderWidth: 2,
    borderColor: '#ff4d8f',
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#e8e4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelIcon: {
    backgroundColor: '#ffe8f1',
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  cancelLabel: {
    color: '#ff4d8f',
  },
});
