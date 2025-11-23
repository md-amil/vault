import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  Share,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { filesAPI } from '../api';
import Spacer from '../components/Spacer';
import { IFile, RootStackParamList } from '../types';
import { colors, globalStyles } from '../style/global';
import GradientButton from '../components/GradientButton';
import OutLineButton from '../components/OutLineButton';
import AddDocumentModal from '../components/AddDocumentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateLinkModal from '../components/CreateLinkModal';

type Props = NativeStackScreenProps<RootStackParamList, 'FileDetails'>;

export default function FileDetailsScreen({ route, navigation }: Props) {
  const { file } = route.params;
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false); // Add this
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      const downloadUrl = filesAPI.getDownloadUrl(file.id);
      const downloadUrlWithAuth = `${downloadUrl}?token=${token}`;
      const canOpen = await Linking.canOpenURL(downloadUrlWithAuth);
      
      if (canOpen) {
        await Linking.openURL(downloadUrlWithAuth);
        Alert.alert('Success', 'Download started');
      } else {
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

  const handleShare = async (file:IFile) => {
     try {
      const result = await Share.share({
        message:'https://vault-api-lyk2.onrender.com/files/'+file.id
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error:any) {
      Alert.alert(error.message);
    }
  //    const supported = await Linking.canOpenURL(file.s3Url!);

  //   if (supported) {
  //     await Linking.openURL(file.s3Url!);
  //   } else {
  //     Alert.alert(`Don't know how to open this URL: ${file.s3Url!}`);
  //   }
  };


  const handleCreateLink = () => {
    setShowLinkModal(true);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={globalStyles.Pageheader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#202124" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>File Details</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#202124" />
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
              {formatFileSize(file?.size || 2457600)}
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
            <Text style={styles.infoValue}>{getFileType(file.name!)}</Text>
          </View>
        </View>

        <Spacer height={24} />

        {/* Register Product Button */}
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => setShowAddDocumentModal(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="file-document-edit-outline" size={20} color="#FFFFFF" />
          <Text style={globalStyles.primaryButtonText}>Register Product</Text>
        </TouchableOpacity>

        <Spacer height={12} />

        {/* Share File */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={()=>handleShare(file as IFile)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="share-variant-outline" size={20} color="#5F6368" />
          <Text style={styles.actionButtonText}>Share File</Text>
        </TouchableOpacity>

        <Spacer height={12} />

        {/* Create Link */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCreateLink}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="link-variant" size={20} color="#5F6368" />
          <Text style={styles.actionButtonText}>Create Link</Text>
        </TouchableOpacity>

        <Spacer height={12} />

        {/* Make a Copy */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMakeCopy}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="content-copy" size={20} color="#5F6368" />
          <Text style={styles.actionButtonText}>Make a Copy</Text>
        </TouchableOpacity>

        <Spacer height={12} />

        {/* Download */}
        <TouchableOpacity
          style={styles.actionButton}
           onPress={() => navigation.navigate('ImagePreview', { file: file })}

          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="download-outline" size={20} color="#5F6368" />
          <Text style={styles.actionButtonText}>Download Preview</Text>
        </TouchableOpacity>

        <Spacer height={24} />

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="delete-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete File</Text>
        </TouchableOpacity>

        <Spacer height={40} />
      </ScrollView>

      <CreateLinkModal
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        fileId={file.id}
        fileName={file.name || 'Untitled'}
      />

      <AddDocumentModal
        visible={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
        fileId={file.id}
        onSave={async (data) => {
          try {
            setLoading(true);
            const fileData = {
              name: data.fileName,
              tag: data.tagName,
              category: data.category,
              remarks: data.remarks,
              fileId: file.id, 
            };

            if(data?.updateId) {
              await filesAPI.updateDocument(data?.updateId, fileData);
            } else {
              await filesAPI.createDocument(fileData);
            }
          
            setShowAddDocumentModal(false);
            Alert.alert('Success', 'Document saved successfully');
            setLoading(false);
            return true;
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  menuButton: {
    padding: 10,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#202124',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#DC3545',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
