import React, { useState } from 'react';
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ImagePreviewWithDownload = ({ file }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      const downloadUrl = filesAPI.getDownloadUrl(file.id);
      const fileUri = FileSystem.documentDirectory + file.name;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const result = await downloadResumable.downloadAsync();
      
      if (result) {
        Alert.alert('Success', 'File downloaded successfully');
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Thumbnail - Click to open full screen */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: file.thumbnailUrl || file.s3Url }}
          style={styles.thumbnail}
        />
      </TouchableOpacity>

      {/* Full Screen Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Full Screen Image */}
          <Image
            source={{ uri: file.s3Url }}
            style={styles.fullImage}
            resizeMode="contain"
          />

          {/* Download Button */}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={24} color="#fff" />
                <Text style={styles.downloadText}>Download</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImagePreviewWithDownload;
