import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { File, Folder } from '../types';

import {
  Fab,
  CreateFolderModal,
  FilePickerModal,
  FileOptionsModal,
  HeaderOptionsMenu,
} from '../components';
import { foldersAPI, filesAPI } from '../api';
import { colors, globalStyles } from '../style/global';
import LinearGradient from 'react-native-linear-gradient';
import UploadOptionsModal from '../components/UploadOptionsModal';
import AddDocumentModal from '../components/AddDocumentModal';


export default function HomeScreen({ navigation }: { navigation: any }) {
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


  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [showFileOptions, setShowFileOptions] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(false);
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
      console.log(folders, 'checking folder')
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  async function open(item: File | Folder) {
    console.log(item, 'checking item')

    if ('path' in item) {
      setSelectedFile(item as File);
      setShowFileOptions(true);
     
       navigation.navigate('FileDetails', { 
      file: item as File 
    });
    return;
    }
    setLoading(true);
    const files = await filesAPI.getByFolder(item.id);
 console.log(files, 'checking files')
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
      setShowUploadModal(false)
      setShowActions(false);
    }
  }

  async function addFromGallery() {
    try {
      const res = await launchImageLibrary({ 
        mediaType: 'mixed', // Supports both photos and videos
        selectionLimit: 0, 
        quality: 0.8 
      });
      if (res.didCancel) return;
      pushPickedAssets(res.assets);
    } finally {
        setShowFolderModal(false)
      setShowUploadModal(false);
      setShowActions(false);
    }
  }

  async function addFromDocuments() {
    // For now, show a message that document picking requires additional setup
    Alert.alert(
      'Documents Feature',
      'To pick PDF and ZIP files, we recommend:\n\n1. Use the Gallery option for images\n2. For PDFs/ZIPs, you can:\n   - Take a photo of the document\n   - Or we can add a compatible document picker library',
      [
        { text: 'Use Gallery', onPress: () => addFromGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }

  const getItemSubtitle = (item: File | Folder) => {
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

  const renderFolderCard = ({ item }: { item: File | Folder }) => (
    <TouchableOpacity style={styles.folderCard} onPress={() => open(item)} activeOpacity={0.7}>
       <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.folderIcon}
      >
       {getItemSubtitle(item) ==='File' ?  <MaterialCommunityIcons name="file" size={26} color="#fff" />:<MaterialCommunityIcons name="folder" size={26} color="#fff" /> } 
      </LinearGradient> 
      
      <View style={styles.folderInfo}>
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.folderSubtitle}>{getItemSubtitle(item)} </Text>
      </View>
    </TouchableOpacity>
  );


  const fileOptions = [
    {
      icon: '📝',
      label: 'Register Product',
      onPress: () => { setShowFileOptions(false); navigation.navigate('RegisterProduct', { file: selectedFile }); },
    },
    {
      icon: '📤',
      label: 'Share',
      onPress: () => setShowFileOptions(false),
    },
    {
      icon: '🔗',
      label: 'Create Link',
      onPress: () => setShowFileOptions(false),
    },
    {
      icon: '📋',
      label: 'Make a Copy',
      onPress: () => setShowFileOptions(false),
    },
    {
      icon: '⬇️',
      label: 'Download/Preview',
      onPress: () => setShowFileOptions(false),
    },
    {
      icon: '🗑️',
      label: 'Delete',
      onPress: () => setShowFileOptions(false),
      isDanger: true,
    },
  ];

  const headerMenuOptions = [
    {
      icon: '🚪',
      label: 'Logout',
      onPress: handleLogout,
      isDanger: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={globalStyles.Pageheader}>
        <Text style={styles.headerTitle}>My File Vault</Text>
        <TouchableOpacity onPress={() => setShowActions(true)} style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <Text style={styles.userName}>John Doe</Text>
      </View>

      {/* Folder List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b5cdb" />
          {/* <Text style={styles.loadingText}>Loading...</Text> */}
        </View>
      ) : (
        <FlatList
          data={displayEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderFolderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No folders or files yet</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      {/* <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setShowActions(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity> */}

      {/* <Fab
        showActions={showActions}
        setShowFolderModal={setShowFolderModal}
        setShowFilePicker={setShowFilePicker}
        setShowActions={setShowActions}
      /> */}

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
          setShowFolderModal(true)
        }}
        onGallery={addFromGallery}
        onDocuments={addFromDocuments}
        onICloud={() => {
          setShowUploadModal(false);
          Alert.alert('iCloud', 'iCloud integration coming soon');
        }}
        onGoogleCloud={() => {
          setShowUploadModal(false);
          Alert.alert('Google Cloud', 'Google Cloud integration coming soon');
        }}
      />

      {/* Add Document Modal */}
   

      {/* <FileOptionsModal
        visible={showFileOptions}
        file={selectedFile}
        onClose={() => setShowFileOptions(false)}
        options={fileOptions}
      />

      <HeaderOptionsMenu
        visible={showHeaderMenu}
        onClose={() => setShowHeaderMenu(false)}
        options={headerMenuOptions}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerTitle: {

    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    padding: 4,
  },
    thumbnail: {
    width: '100%',
    height: '100%',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    // backgroundColor: '#fff',
    // borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#e8e4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.secondary,
  },
  userName: {
    fontSize: 16,
    color: colors.title,
    fontWeight: '400',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,


  },
  folderIcon: {
    width: 46,
    height: 46,
    /* Vector */

    borderRadius: 9,

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: -2,
  },
  folderSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '400',

  },
  loadingContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200
  },
  loadingText: {
    fontSize: 16,
    color: '#6b5cdb',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
