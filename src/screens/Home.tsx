import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { Folder, IFile } from '../types';
import { Image } from 'react-native';
import { pick, types } from '@react-native-documents/picker'

import {
  Fab,
  CreateFolderModal,
  FilePickerModal,
} from '../components';
import { foldersAPI, filesAPI } from '../api';
import { colors, globalStyles } from '../style/global';
import UploadOptionsModal from '../components/UploadOptionsModal';
import { useFocusEffect } from '@react-navigation/native';
import GoogleDriveService from '../service/GoogleDriveService';

export default function HomeScreen({ navigation, route }: { navigation: any, route: any }) {
  const { logout } = useAuth();
  const [root, setRoot] = useState<Folder>({
    id: 'root',
    name: 'Home',
    parent: null,
    children: [],
    files: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [stack, setStack] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [showFileOptions, setShowFileOptions] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(false);
  const [picking, setIsPicking] = useState(false)
  const current = stack.length === 0 ? root : stack[stack.length - 1];

  const displayEntries = useMemo(() => [...(current.children || []), ...(current.files || [])], [current.children, current.files]);

  useEffect(() => {
    fetchFolderData();
  }, []);


  const fetchFolderData = async () => {
    try {
      setLoading(true);
      const folders = await foldersAPI.getTree();
      const rootFolder: Folder = {
        id: 'root',
        name: 'Home',
        parent: null,
        children: folders,
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRoot(rootFolder);
    } catch (error) {
      console.error('Error fetching folder data:', error);
      Alert.alert('Error', 'Failed to load folders', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowHeaderMenu(false);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Landing');
          }
        }
      ]
    );
  };

  const goUp = useCallback(() => {
    if (stack.length > 0) {
      setStack((s) => s.slice(0, s.length - 1));
    }
  }, [stack.length]);

  useEffect(() => {
    const backAction = () => {
      if (stack.length > 0) {
        goUp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [stack.length, goUp]);

  useFocusEffect(
    useCallback(() => {
      const refreshCurrentFolder = async () => {
        if (stack.length > 0) {
          try {
            const currentFolder = stack[stack.length - 1];
            const files = await filesAPI.getByFolder(currentFolder.id);

            setStack((s) =>
              s.map((folder, index) => {
                if (index !== s.length - 1) return folder;
                return { ...folder, files };
              })
            );
          } catch (error) {
            console.error('Error refreshing folder:', error);
          }
        } else {
          fetchFolderData();
        }
      };

      refreshCurrentFolder();
    }, [stack.length])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  async function open(item: IFile | Folder) {
    if ('path' in item) {
      setSelectedFile(item as IFile);
      setShowFileOptions(true);
      navigation.navigate('FileDetails', {
        file: item as IFile
      });
      return;
    }
    setLoading(true);
    const files = await filesAPI.getByFolder(item.id);
    setStack((s) => [...s, { ...item, files } as any]);
    setLoading(false);
  }

  const updateChild = (r: Folder, newFolder: Folder, key: 'children' | 'files' = 'children') => {
    return {
      ...r,
      [key]: r[key] ? [...r[key], newFolder] : [newFolder],
    };
  };

  async function createFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      const newFolder = await foldersAPI.create({
        name,
        parentId: current.id === 'root' ? undefined : current.id
      });
      if (stack.length === 0) {
        setRoot((r) => updateChild(r, newFolder));
      } else {
        setStack((s) => s.map((folder, index) => {
          if (index !== s.length - 1) return folder;
          return updateChild(folder, newFolder);
        }));
      }
      setNewFolderName('');
      setShowFolderModal(false);
      setShowActions(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create folder', [{ text: 'OK' }]);
    }
  }

  function pushPickedAssets(assets?: Asset[] | null) {
    if (!assets || assets.length === 0) return;
    assets.forEach(async (a, idx) => {
      try {
        const fileName = a.fileName || a.uri?.split('/')?.pop() || `Image_${Date.now()}_${idx}.jpg`;
        const formData = new FormData();
        formData.append('file', {
          uri: a.uri,
          type: a.type || 'image/jpeg',
          name: fileName,
          path: a.uri,
        });
        formData.append('name', fileName);
        formData.append('folderId', current.id);

        const uploadedFile = await filesAPI.upload(formData);
        if (stack.length === 0) {
          return setRoot((r) => updateChild(r, uploadedFile, 'files'));
        }
        setStack((s) => s.map((folder, index) => {
          if (index !== s.length - 1) return folder;
          return updateChild(folder, uploadedFile, 'files');
        }));
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Error', 'Failed to upload file', [{ text: 'OK' }]);
      }
    });
  }

  async function addFromCamera() {
    try {
      const res = await launchCamera({ mediaType: 'photo', saveToPhotos: true, quality: 0.8 });
      if (res.didCancel) return;
      pushPickedAssets(res.assets);
    } finally {
      setShowFilePicker(false);
      setShowUploadModal(false);
      setShowActions(false);
    }
  }

  async function addFromGallery() {
    try {
      const res = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 0,
        quality: 0.8
      });
      if (res.didCancel) return;
      pushPickedAssets(res.assets);
    } finally {
      setShowFolderModal(false);
      setShowUploadModal(false);
      setShowActions(false);
    }
  }

  

  
  async function addFromDocuments() {
    if (picking) return console.log("already progress"); // Prevent multiple calls
    setIsPicking(true);
      setShowUploadModal(false);

    try {
      const result = await pick({
        type: [types.pdf, types.images, types.csv, types.docx],
        allowMultiSelection: false, // Set to true if you want multiple files
      });


      const file = result[0];
      const fileName = file.name || file.uri.split('/').pop() || 'file';
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/octet-stream',
        name: fileName,
      } as any);

      formData.append('name', fileName);
      formData.append('folderId', current.id);

      const uploadedFile = await filesAPI.upload(formData);
      if (stack.length === 0) {
        return setRoot((r) => updateChild(r, uploadedFile, 'files'));
      }
      setStack((s) => s.map((folder, index) => {
        if (index !== s.length - 1) return folder;
        return updateChild(folder, uploadedFile, 'files');
      }));
      console.log('Upload successful:', uploadedFile);
    } catch (err: any) {

      if (err.message === 'User canceled document picker') {
        console.log('User cancelled file selection');
      } else {
        console.error('Upload error:', err);
      }
      console.log(err)
      Alert.alert("error", "Error while uploading")
    } finally {
      setIsPicking(false);
      setShowFolderModal(false);
      setShowActions(false);
      setShowFilePicker(false);
      setShowActions(false);

    }
  }

  const uploadGoogleDriveFileToVault = async (fileData: any) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: `data:${fileData.mimeType};base64,${fileData.data}`,
      type: fileData.mimeType,
      name: fileData.name,
    } as any);
    formData.append('name', fileData.name);
    formData.append('folderId', current.id);

    const uploadedFile = await filesAPI.upload(formData);

    if (stack.length === 0) {
      setRoot((r) => updateChild(r, uploadedFile, 'files'));
    } else {
      setStack((s) =>
        s.map((folder, index) => {
          if (index !== s.length - 1) return folder;
          return updateChild(folder, uploadedFile, 'files');
        })
      );
    }

    Alert.alert('Success', `${fileData.name} imported from Google Drive!`);
  } catch (error) {
    console.error('Google Drive upload error:', error);
    Alert.alert('Error', 'Failed to upload Google Drive file');
  }
};


  
  const getItemSubtitle = (item: IFile | Folder) => {
    if ('path' in item) {
      return 'File';
    }
    const folder = item as Folder;
    const folderCount = folder.children?.length || 0;
    const fileCount = folder.files?.length || 0;

    if (folderCount > 0 && fileCount > 0) {
      return `${folderCount} Folder${folderCount > 1 ? 's' : ''}, ${fileCount} Document${fileCount > 1 ? 's' : ''}`;
    } else if (folderCount > 0) {
      return `${folderCount} Folder${folderCount > 1 ? 's' : ''}`;
    } else {
      return `${fileCount} Document${fileCount > 1 ? 's' : ''}`;
    }
  };

  const renderFolderCardGrid = ({ item }: { item: IFile | Folder }) => {
    if ('path' in item) {
      return (
        <View style={styles.fileCard}>
          <TouchableOpacity
            style={styles.previewContainer}
            onPress={() => open(item)}
            activeOpacity={0.7}
          >
            {item.s3Url || item.path ? (
              <Image
                source={{ uri: item.s3Url || item.path }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderThumbnail}>
                <MaterialCommunityIcons name="file-document-outline" size={40} color="#8E8E93" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => open(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.folderCardGrid}
        onPress={() => open(item)}
        activeOpacity={0.7}
      >
        <View style={styles.folderIconContainer}>
          <MaterialCommunityIcons name="folder" size={32} color="#FFFFFF" />
        </View>

        <View style={styles.folderInfo}>
          <Text style={[styles.folderName, styles.centerText]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.folderSubtitle, styles.centerText]} numberOfLines={1}>
            {getItemSubtitle(item)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFolderCard = ({ item }: { item: IFile | Folder }) => (
    <TouchableOpacity style={styles.folderCard} onPress={() => open(item)} activeOpacity={0.7}>
      <View style={styles.folderIcon}>
        {getItemSubtitle(item) === 'File' ?
          <MaterialCommunityIcons name="file-document-outline" size={26} color="#FFFFFF" /> :
          <MaterialCommunityIcons name="folder" size={26} color="#FFFFFF" />
        }
      </View>

      <View style={styles.folderInfo}>
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.folderSubtitle}>{getItemSubtitle(item)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={globalStyles.Pageheader}>
        <View style={styles.backButtonContainer}>
          {stack.length > 0 && (
            <TouchableOpacity
              onPress={goUp}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>
            {stack.length > 0 ? current.name : 'My Documents'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowViewMenu(!showViewMenu)}
          style={styles.addButton}
        >
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        {showViewMenu && (
          <View style={styles.viewMenuDropdown}>
            <TouchableOpacity
              style={styles.viewMenuItem}
              onPress={() => {
                setViewMode('grid');
                setShowViewMenu(false);
              }}
            >
              <MaterialCommunityIcons name="view-grid" size={20} color="#007AFF" />
              <Text style={styles.viewMenuText}>Grid View</Text>
              {viewMode === 'grid' && <MaterialCommunityIcons name="check" size={20} color="#007AFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewMenuItem}
              onPress={() => {
                setViewMode('list');
                setShowViewMenu(false);
              }}
            >
              <MaterialCommunityIcons name="view-list" size={20} color="#007AFF" />
              <Text style={styles.viewMenuText}>List View</Text>
              {viewMode === 'list' && <MaterialCommunityIcons name="check" size={20} color="#007AFF" />}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {stack.length === 0 && (
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <Text style={styles.userName}>John Doe</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        viewMode === 'grid' ?
          <FlatList
            data={displayEntries}
            key="grid"
            keyExtractor={(item) => item.id}
            renderItem={renderFolderCardGrid}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="folder-open-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyText}>No folders or files yet</Text>
                <Text style={styles.emptySubtext}>Tap + to get started</Text>
              </View>
            }
          /> :
          <FlatList
            key="list"
            data={displayEntries}
            keyExtractor={(item) => item.id}
            renderItem={renderFolderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="folder-open-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyText}>No folders or files yet</Text>
                <Text style={styles.emptySubtext}>Tap + to get started</Text>
              </View>
            }
          />
      )}



      <Fab
        showActions={showActions}
        setShowUploadModal={setShowUploadModal}
        setShowActions={setShowActions}
      />

      <CreateFolderModal
        visible={showFolderModal}
        folderName={newFolderName}
        onChangeName={setNewFolderName}
        onCancel={() => setShowFolderModal(false)}
        onCreate={createFolder}
      />

      <FilePickerModal
        visible={showFilePicker}
        onCancel={() => setShowFilePicker(false)}
        onCamera={addFromCamera}
        onGallery={addFromGallery}
      />

      <UploadOptionsModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onCamera={addFromCamera}
        onNewFolder={() => {
          setShowFolderModal(true);
        }}
        onGallery={addFromGallery}
        onDocuments={addFromDocuments}
        onICloud={() => {
          setShowUploadModal(false);
          Alert.alert('iCloud', 'iCloud integration coming soon');
        }}
navigation={navigation}
  onGoogleDriveUpload={uploadGoogleDriveFileToVault} 


      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },

  addButton: {
    padding: 12,
    borderRadius: 8,
  },

  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F3F4',
  },

  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  backButton: {
    padding: 10,
    marginRight: 4,
    borderRadius: 8,
  },

  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    marginTop: 15,
    // backgroundColor: '#FFFFFF',
    // marginBottom: 8,
  },

  centerText: {
    textAlign: 'center'
  },

  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F1F3F4',
    overflow: 'hidden',
  },

  folderCardGrid: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: '1.5%',
    alignItems: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  fileCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    // height:100,
    margin: '1.5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
  },

  previewText: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 8,
    textAlign: 'center',
  },

  detailsButton: {
    position: 'absolute',
    backgroundColor: colors.primary,
    paddingVertical: 5,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  viewMenuDropdown: {
    position: 'absolute',
    top: 68,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },

  viewMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderRadius: 4,
  },

  viewMenuText: {
    flex: 1,
    fontSize: 14,
    color: '#202124',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#064392ff',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  userName: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
  },

  gridContainer: {
    paddingHorizontal: 14,
    paddingTop: 16,

    paddingBottom: 100,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 100,
  },

  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  folderIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  folderInfo: {
    flex: 1,
  },

  folderName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
  },

  folderSubtitle: {
    fontSize: 13,
    color: '#5F6368',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#5F6368',
    fontWeight: '500',
    marginTop: 20,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#80868B',
    marginTop: 8,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
