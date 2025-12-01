import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  BackHandler,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GoogleDriveService from '../service/GoogleDriveService';

export default function GoogleDriveBrowserScreen({ navigation, route }: any) {
  const [items, setItems] = useState<any[]>([]); // ✅ Changed from folders to items
  const [loading, setLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [breadcrumb, setBreadcrumb] = useState<any[]>([
    { id: 'root', name: 'My Drive' }
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    GoogleDriveService.configure();
    loadFolderContents(currentFolderId);
  }, [currentFolderId]);

  useEffect(() => {
    const backAction = () => {
      if (breadcrumb.length > 1) {
        const newBreadcrumb = breadcrumb.slice(0, -1);
        setBreadcrumb(newBreadcrumb);
        setCurrentFolderId(newBreadcrumb[newBreadcrumb.length - 1].id);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [breadcrumb]);

  const loadFolderContents = async (folderId: string) => {
    try {
      setLoading(true);
      console.log('Loading folder:', folderId);

      let allItems = [];
      if (folderId === 'root') {
        // ✅ Root shows ALL folders + files
        allItems = await GoogleDriveService.listFolders();
        const rootFiles = await GoogleDriveService.listFilesByFolder('root');
        allItems = [...allItems, ...rootFiles];
      } else {
        // ✅ Folders show folders + files
        allItems = await GoogleDriveService.listFilesByFolder(folderId);
      }

      // ✅ Sort: Folders first, then files alphabetically
      allItems.sort((a, b) => {
        if (a.mimeType === 'application/vnd.google-apps.folder' && b.mimeType !== 'application/vnd.google-apps.folder') return -1;
        if (b.mimeType === 'application/vnd.google-apps.folder' && a.mimeType !== 'application/vnd.google-apps.folder') return 1;
        return a.name.localeCompare(b.name);
      });

      setItems(allItems);
      console.log(`✅ Loaded ${allItems.length} items (${allItems.filter(i => i.mimeType === 'application/vnd.google-apps.folder').length} folders)`);
    } catch (error: any) {
      console.error('Error loading folder:', error.message);
      Alert.alert('Error', error.message || 'Failed to load Google Drive files');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

 const handleSelectItem = async (item: any) => {
  if (item.mimeType === 'application/vnd.google-apps.folder') {
    setBreadcrumb([...breadcrumb, { id: item.id, name: item.name }]);
    setCurrentFolderId(item.id);
  } else {
    try {
      // Download file content from Google Drive service as base64
      const fileData = await GoogleDriveService.downloadFile(item.id);

      // Pass downloaded data to the upload callback from navigation params
      if (route.params?.onUploadToVault) {
        await route.params.onUploadToVault({
          name: item.name,
          mimeType: fileData.mimeType,
          size: item.size,
          data: fileData.data,
          driveFile: item,
        });
      } else {
        // Fallback if no upload callback specified
        route.params?.onSelectFile?.(item);
      }

      // Go back after upload
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to download or upload selected file');
      console.error('File select error:', error);
    }
  }
};


  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') return 'folder';
    if (mimeType?.includes('image')) return 'image';
    if (mimeType?.includes('pdf')) return 'file-pdf-box';
    if (mimeType?.includes('document') || mimeType?.includes('word')) return 'file-document';
    if (mimeType?.includes('sheet') || mimeType?.includes('spreadsheet')) return 'microsoft-excel';
    if (mimeType?.includes('presentation') || mimeType?.includes('slide')) return 'file-presentation-box';
    if (mimeType?.includes('video')) return 'play-box-outline';
    if (mimeType?.includes('audio')) return 'music';
    return 'file-document-outline';
  };

  const getThumbnailUrl = (item: any) => {
    if (item.mimeType === 'application/vnd.google-apps.folder') return null;

    console.log(`🔍 Thumbnail for ${item.name}:`, {
      mimeType: item.mimeType,
      thumbnailLink: !!item.thumbnailLink,
      iconLink: !!item.iconLink
    });

    // Priority 1: Official thumbnailLink
    if (item.thumbnailLink) {
      return item.thumbnailLink.replace(/=s\d+-w\d+/, '=s400');
    }

    // Priority 2: Images - Direct viewer
    if (item.mimeType?.startsWith('image/')) {
      return `https://drive.google.com/uc?export=view&id=${item.id}`;
    }

    // Priority 3: iconLink resized
    if (item.iconLink) {
      return item.iconLink.replace(/=s\d+(-r)?/, '=s128');
    }

    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const renderGridItem = ({ item }: { item: any }) => {
    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
    const icon = getFileIcon(item.mimeType);
    const thumbnailUrl = getThumbnailUrl(item);

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleSelectItem(item)}
        activeOpacity={0.7}
      >
        <View style={styles.gridThumbnailContainer}>
            <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
     
          {thumbnailUrl && !isFolder ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.gridThumbnail}
              resizeMode="cover"
              onError={(e) => console.log('Grid img error:', item.name)}
            />
          ) : isFolder ? (
            <View >
              <MaterialCommunityIcons name="folder" size={44} color="#42454aff" />
            </View>
          ) : (
            <View style={styles.fileGridIcon}>
              <MaterialCommunityIcons name={icon} size={36} color="#5f6368" />
            </View>
          )}
        </View>
           {!isFolder && item.size && <Text style={styles.gridSize}>{formatFileSize(item.size)}</Text>}
      </TouchableOpacity>
    );
  };

  const renderListItem = ({ item }: { item: any }) => {
    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
    const icon = getFileIcon(item.mimeType);
    const thumbnailUrl = getThumbnailUrl(item);

    return (
      <TouchableOpacity style={styles.listItem} onPress={() => handleSelectItem(item)} activeOpacity={0.6}>
        <View style={styles.listIconContainer}>
          {thumbnailUrl && !isFolder ? (
            <Image source={{ uri: thumbnailUrl }} style={styles.listThumbnail} resizeMode="cover" />
          ) : isFolder ? (
            <View style={styles.folderListIcon}>
              <MaterialCommunityIcons name="folder" size={28} color="#42454aff" />
            </View>
          ) : (
            <View style={styles.fileListIcon}>
              <MaterialCommunityIcons name={icon} size={24} color="#5f6368" />
            </View>
          )}
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.listMeta}>
            {item.modifiedTime && <Text style={styles.listDate}>{new Date(item.modifiedTime).toLocaleDateString()}</Text>}
            {item.size && !isFolder && <Text style={styles.listSize}>{formatFileSize(item.size)}</Text>}
          </View>
        </View>
        {isFolder && <MaterialCommunityIcons name="chevron-right" size={20} color="#5f6368" />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header - Google Drive style */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a73e8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google Drive</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            <MaterialCommunityIcons 
              name={viewMode === 'grid' ? 'format-list-bulleted' : 'grid'} 
              size={24} 
              color="#5f6368" 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Breadcrumb */}
      {breadcrumb.length > 1 && (
        <View style={styles.breadcrumb}>
          <FlatList
            horizontal
            data={breadcrumb}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  const newBreadcrumb = breadcrumb.slice(0, index + 1);
                  setBreadcrumb(newBreadcrumb);
                  setCurrentFolderId(newBreadcrumb[newBreadcrumb.length - 1].id);
                }}
                style={styles.breadcrumbItem}
              >
                <Text style={[styles.breadcrumbText, index === breadcrumb.length - 1 && styles.breadcrumbActive]}>
                  {item.name}
                </Text>
                {index < breadcrumb.length - 1 && <MaterialCommunityIcons name="chevron-right" size={16} color="#5f6368" />}
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1a73e8" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="folder-open" size={64} color="#bdc1c6" />
          <Text style={styles.emptyTitle}>This folder is empty</Text>
          <Text style={styles.emptySubtitle}>No files or folders</Text>
        </View>
      ) : viewMode === 'grid' ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafbfc' },
  
  // Header - Perfect Google Drive match
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8eaed',
  },
  headerLeft: { padding: 4 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
    marginLeft: 8,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { padding: 8 },

  // Breadcrumb
  breadcrumb: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8eaed',
  },
  breadcrumbItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 4 
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#1a73e8',
    marginRight: 4,
  },
  breadcrumbActive: {
    color: '#202124',
    fontWeight: '500',
  },

  // Grid View - Google Drive exact match
  gridContainer: { padding: 16 },
  gridItem: {
    flex: 1,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  gridThumbnailContainer: {
    width: 120,
    // height: 100,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gridThumbnail: { width: 80, height: 80 },
  folderGridIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#e8f0fe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileGridIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 4,
    // marginTop:-50
  },
  gridSize: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },

  // List View - Google Drive exact match
  listContainer: { padding: 8 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginVertical: 1,
    borderRadius: 8,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listThumbnail: { width: 48, height: 48, borderRadius: 8 },
  folderListIcon: {
    backgroundColor: '#e8f0fe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileListIcon: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: { flex: 1 },
  listName: { fontSize: 15, fontWeight: '500', color: '#202124', marginBottom: 2 },
  listMeta: { flexDirection: 'row' },
  listDate: { fontSize: 13, color: '#5f6368', marginRight: 8 },
  listSize: { fontSize: 13, color: '#5f6368' },

  // States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbfc',
  },
  loadingText: { marginTop: 16, fontSize: 16, color: '#5f6368' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#202124', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#5f6368', marginTop: 4 },
});
