import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { filesAPI } from '../api';
import {  IFile } from '../types';
import { colors, globalStyles } from '../style/global';
import { Fab } from '../components';

interface FolderDetailsScreenProps {
  route: {
    params: {
      folder: {
        id: string;
        name: string;
      };
    };
  };
  navigation: any;
}

export default function FolderDetailsScreen({ route, navigation }: FolderDetailsScreenProps) {
  const { folder } = route.params;
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
   const [showActions, setShowActions] = useState<boolean>(false);
     const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const fetchedFiles = await filesAPI.getByFolder(folder.id);
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      Alert.alert('Error', 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDetails = (file: IFile) => {
    navigation.navigate('FileDetails', { file });
  };

  const renderFileCard = ({ item }: { item: IFile }) => (
    <View style={styles.fileCard}>
      {/* File Preview/Thumbnail */}
      <View style={styles.previewContainer}>
        {item.thumbnailUrl ? (
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <MaterialCommunityIcons name="file-document" size={40} color={colors.primary} />
            <Text style={styles.previewText}>File Preview</Text>
            <Text style={styles.previewText}>Thumbnail</Text>
          </View>
        )}
      </View>

      {/* File Details Button */}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => handleFileDetails(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.detailsButtonText}>File Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Custom Header */}
      <View style={globalStyles.Pageheader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Folder Details</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          {/* <Text style={styles.loadingText}>Loading...</Text> */}
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={renderFileCard}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="folder-open" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No files in this folder</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      
            <Fab
              showActions={showActions}
              setShowUploadModal={setShowUploadModal}
              setShowActions={setShowActions}
            />
      {/* <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
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
  menuButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  fileCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E8E4F8',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E4F8',
  },
  previewText: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  detailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },

  loadingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4d8f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d8f',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
