import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { File, Folder } from '../types';
import {
  Fab,
  FolderRow,
  GridTile,
  CreateFolderModal,
  FilePickerModal,
  FileOptionsModal,
  EmptyFolder,
  HeaderOptionsMenu,
} from '../components';
import { foldersAPI } from '../api';
import { filesAPI } from '../api';

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState<boolean>(true);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showFilePicker, setShowFilePicker] = useState<boolean>(false);
  const [showFileOptions, setShowFileOptions] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const current = stack.length === 0 ? root : stack[stack.length - 1];

  const displayEntries = useMemo(() => [...(current.children || []), ...(current.files || []),], [current.children, current.files])

  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      setLoading(true);
      const folders = await foldersAPI.getTree();
      console.log(folders)
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

  const toggleDarkMode = () => {
    setShowHeaderMenu(false);
    setIsDarkMode(!isDarkMode);
    // TODO: Implement dark mode theme switching
    Alert.alert(
      'Dark Mode',
      `Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const toggleViewMode = () => {
    setShowHeaderMenu(false);
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const goUp = useCallback(() => {
    if (stack.length > 0) {
      setStack((s) => s.slice(0, s.length - 1));
    }
  }, [stack.length]);

  // Handle back button press
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
      title: current.name,
      headerTitleStyle: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: '600',
      },
      headerLeft: stack.length > 0 ? () => (
        <TouchableOpacity onPress={goUp} style={styles.headerLeftBtn}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
      ) : undefined,
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowHeaderMenu(true)} style={styles.headerRightBtn}>
          <Text style={styles.optionsIcon}>⋮</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, current.name, handleLogout, stack.length, goUp]);

  async function open(item: File | Folder) {
    if ('path' in item) {
      setSelectedFile(item as File);
      setShowFileOptions(true);
      return;
    }
    setLoading(true);
    const files = await filesAPI.getByFolder(item.id)
    console.log({ files })
    setStack((s) => [...s, { ...item, files } as any])
    setLoading(false);
    return;
  }

  const updateChild = (r: Folder, newFolder: Folder, key: 'children' | 'files' = 'children') => {
    return {
      ...r,
      [key]: r[key] ?
        [...r[key], newFolder] : [newFolder],
    };
  }

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
    console.log({ assets })
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
      setShowActions(false);
    }
  }

  async function addFromGallery() {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 0, quality: 0.8 });
      if (res.didCancel) return;
      pushPickedAssets(res.assets);
    } finally {
      setShowFilePicker(false);
      setShowActions(false);
    }
  }

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
      icon: isDarkMode ? '☀️' : '🌙',
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      onPress: toggleDarkMode,
    },
    {
      icon: viewMode === 'grid' ? '🔍' : '🔍',
      label: viewMode === 'grid' ? 'List View' : 'Grid View',
      onPress: toggleViewMode,
    },
    {
      icon: '🚪',
      label: 'Logout',
      onPress: handleLogout,
      isDanger: true,
    },
  ];

  const numColumns = viewMode === 'grid' ? 2 : 1;

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={displayEntries}
          key={viewMode}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => viewMode === 'grid' ? (
            <GridTile item={item} onOpen={open} />
          ) : (
            <FolderRow item={item} onOpen={open} />
          )}
          ItemSeparatorComponent={viewMode === 'list' ? () => <View style={styles.separator} /> : undefined}
          contentContainerStyle={displayEntries.length === 0 ? styles.emptyContainer : (viewMode === 'grid' ? styles.gridContent : undefined)}
          ListEmptyComponent={<EmptyFolder />}
          numColumns={numColumns}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        />
      )}

      <Fab
        showActions={showActions}
        setShowFolderModal={setShowFolderModal}
        setShowFilePicker={setShowFilePicker}
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

      <FileOptionsModal
        visible={showFileOptions}
        file={selectedFile}
        onClose={() => setShowFileOptions(false)}
        options={fileOptions}
      />

      <HeaderOptionsMenu
        visible={showHeaderMenu}
        onClose={() => setShowHeaderMenu(false)}
        options={headerMenuOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  link: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 16,
  },
  headerLeftBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    width: 30,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    // backgroundColor: 'rgba(59, 130, 246, 0.1)',
    minWidth: 40,
    alignItems: 'center',
  },
  optionsIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: -2,
  },
  backButton: {
    color: '#007AFF',
    fontWeight: '400',
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 28,
  },
  separator: {
    height: 0,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  gridContent: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
});