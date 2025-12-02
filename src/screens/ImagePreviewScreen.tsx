// ImagePreviewScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { filesAPI } from '../api';
import { RootStackParamList } from '../types';
import { globalStyles } from '../style/global';
type Props = NativeStackScreenProps<RootStackParamList, 'ImagePreview'>;
const { width, height } = Dimensions.get('window');

const ImagePreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { file } = route.params;
  const [loading, setLoading] = useState(false);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Android 13+ (API 33+) uses different permissions
        if (Platform.Version >= 33) {
          // Android 13+ doesn't require storage permissions for downloads to Downloads folder
          return true;
        } else {
          // Android 12 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to download files',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };



const handleDownload = async () => {
  try {
    setLoading(true);

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required');
      return;
    }

    const token = await AsyncStorage.getItem('access_token');
    const downloadUrl = filesAPI.getDownloadUrl(file.id);
    
    // Download to cache first
    const filePath = `${RNFS.CachesDirectoryPath}/${file.name}`;

    const downloadResult = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: filePath,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).promise;

    if (downloadResult.statusCode === 200) {
      // Save to camera roll (automatically visible in gallery)
      await CameraRoll.save(filePath, { type: 'photo' });
      // Clean up cache file
      await RNFS.unlink(filePath);
      Alert.alert('Success', 'Image saved to Gallery');
    } else {
      Alert.alert('Error', 'Download failed');
    }
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', (error as Error).message || 'Failed to download file');
  } finally {
    setLoading(false);
  }
};


  return (
    <View  style={globalStyles.container}>
      {/* Header with Close Button */}
      <View style={[globalStyles.header,styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {file.name}
        </Text>
        <View style={{ width: 28 }} />
      </View>



      {/* Full Screen Image */}


      <ScrollView
              style={globalStyles.scrollView}
            
              showsVerticalScrollIndicator={false}
            >

              <View style={styles.imageContainer}>
     <View style={styles.imageWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Image
            source={{ uri: file.s3Url || file.url }}
            style={styles.image}
            resizeMode="contain"
          />
        </ScrollView>
      </View>
      </View>

      {/* Download Button */}
      <View style={styles.footer}>

          <TouchableOpacity
                  style={globalStyles.primaryButton}
                     onPress={handleDownload}
                  activeOpacity={0.8}
                >
                 
                  {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="download" size={24} color="#fff" />
              <Text style={globalStyles.primaryButtonText}>Download</Text>
            </>
          )}
                </TouchableOpacity>

       
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop:40,
    
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  imageContainer: {
    // flex: 1,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 20, // Just 10px padding on each side
    height: height * 0.7, // Slightly reduced from 0.7 to 0.6 (60% instead of 70%)
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ImagePreviewScreen;
