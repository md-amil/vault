import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/navigation';
import { filesAPI } from '../api';
import Spacer from '../components/Spacer';
import { RootStackParamList } from '../types';
import { globalStyles } from '../style/global';
import GradientButton from '../components/GradientButton';
import OutLineButton from '../components/OutLineButton';
import AddDocumentModal from '../components/AddDocumentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = NativeStackScreenProps<RootStackParamList, 'FileDetails'>;

export default function FileDetailsScreen({ route, navigation }: Props) {
 const { file } = route.params;
  
  // const [file, setFile] = useState<File>(initialFile as File);


  // useEffect(() => {
  //   fetchFileDetails();
  // }, []);

  // const fetchFileDetails = async () => {
  //   try {
  //     setLoading(true);
  //     const fileDetails = await filesAPI.getById(initialFile.id);
  //     console.log('File details:', fileDetails);
  //     setFile(fileDetails);
  //   } catch (error) {
  //     console.error('Error fetching file details:', error);
  //     Alert.alert('Error', 'Failed to load file details');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

 const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = await AsyncStorage.getItem('access_token');
      
      // Get download URL
      const downloadUrl = filesAPI.getDownloadUrl(file.id);
      
      // Add token to URL as query param (if your API supports it)
      const downloadUrlWithAuth = `${downloadUrl}?token=${token}`;
      
      // Open download URL
      const canOpen = await Linking.canOpenURL(downloadUrlWithAuth);
      
      if (canOpen) {
        await Linking.openURL(downloadUrlWithAuth);
        Alert.alert('Success', 'Download started');
      } else {
        // Fallback: use s3Url if available
        if (file.s3Url) {
          await Linking.openURL(file.s3Url);
        } else {
          Alert.alert('Error', 'Cannot open download link');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    } finally {
      setLoading(false);
    }
  };


  const handleShare = () => {
    Alert.alert('Share File', 'Share functionality coming soon');
  };

  const handleCreateLink = () => {
    Alert.alert('Create Link', 'Link creation functionality coming soon');
  };

  const handleMakeCopy = () => {
    Alert.alert('Make a Copy', 'Copy functionality coming soon');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await filesAPI.delete(file.id);
              Alert.alert('Success', 'File deleted successfully');
              
                                   navigation.goBack();


              // navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete file');
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension ? `${extension} Document` : 'Document';
  };


  const resisterPreview = () => {
    console.log('hellow')
  }
  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.Pageheader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>File Details </Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* File Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
  <Text style={styles.infoLabel}>File Name</Text>
  <Text 
    style={styles.infoValue}
    numberOfLines={2}
    ellipsizeMode="tail"
  >
    {file.name}
  </Text>
</View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>File Size</Text>
            <Text style={styles.infoValue}>
              {formatFileSize(file.size || 2457600)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date Created</Text>
            <Text style={styles.infoValue}>
              {formatDate(file.createdAt || new Date().toISOString())}
            </Text>
          </View>

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.infoLabel}>File Type</Text>
            <Text style={styles.infoValue}>{getFileType(file.name)}</Text>
          </View>
        </View>

        <Spacer height={24} />

        {/* Download Button */}

           <GradientButton
                  title={<> <MaterialCommunityIcons name="eye" size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>{" "} Register Product</Text></>}
                  onPress={()=> setShowAddDocumentModal(true)}
                
            />
 
 
        <Spacer height={16} />

        {/* Share File */}
   
        <TouchableOpacity
          style={styles.actionButton}
         
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="share-variant" size={20} color="#6b5cdb" />
          <Text style={styles.actionButtonText}>Share File</Text>
        </TouchableOpacity>

        <Spacer height={12} />

        {/* Create Link */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCreateLink}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="link-variant" size={20} color="#6b5cdb" />
          <Text style={styles.actionButtonText}>Create Link</Text>
        </TouchableOpacity>

        <Spacer height={12} />

        {/* Make a Copy */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMakeCopy}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="content-copy" size={20} color="#6b5cdb" />
          <Text style={styles.actionButtonText}>Make a Copy</Text>
        </TouchableOpacity>

        <Spacer height={12} />
          <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownload}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="download" size={20} color="#6b5cdb" />
          <Text style={styles.actionButtonText}>Downaload Preview</Text>
        </TouchableOpacity>

        <Spacer height={24} />

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete File</Text>
        </TouchableOpacity>

        

        <Spacer height={40} />
      </ScrollView>

         <AddDocumentModal
              visible={showAddDocumentModal}
              onClose={() => setShowAddDocumentModal(false)}
              folders={[]}
              onSave={async (data) => {
                try {
                  setLoading(true);
      
                  // Check if folder exists or needs to be created
                  let folderId = data.folderId;
      
                  // If folderId is "new" or doesn't exist, create the folder
                 
      
                  // Now create/save the document/file with the correct folderId
                  const fileData = {
                    name: data.fileName,
                    folderId: folderId,
                    category: data.category,
                    remarks: data.remarks,
                    userId: 'user123', // TODO: Replace with actual user ID from context
                  };
      
                  // Save document via API
                  await filesAPI.create(fileData);
                  // or await filesAPI.upload(formData); depending on your API
      
                  setShowAddDocumentModal(false);
                  Alert.alert('Success', 'Document saved successfully');
      
                  // Optionally refresh the folder data
                 
                } catch (error: any) {
                  console.error('Save document error:', error);
                  Alert.alert(
                    'Error',
                    error.response?.data?.message || 'Failed to save document details'
                  );
                } finally {
                  setLoading(false);
                }
              }}
            />
    </View>
  );
}

const styles = StyleSheet.create({

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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
   infoValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
    width: '70%', 
    textAlign: 'right',
  },
  infoCard: {
    position:'relative',
  
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9b9bb5',
    fontWeight: '400',
  },

  downloadButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft:20
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6b5cdb',
    backgroundColor: '#fff',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b5cdb',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
