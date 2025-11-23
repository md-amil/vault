// components/ShareLinkModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../style/global';

interface ShareLinkModalProps {
  visible: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

const CreateLinkModal: React.FC<ShareLinkModalProps> = ({
  visible,
  onClose,
  fileId,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);

  const fileUrl = `https://vault-api-lyk2.onrender.com/files/${fileId}`;

  const copyToClipboard = () => {
    Clipboard.setString(fileUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Link</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#202124" />
            </TouchableOpacity>
          </View>

          {/* File Info */}
          <View style={styles.fileInfoCard}>
            <MaterialCommunityIcons 
              name="file-document-outline" 
              size={40} 
              color={colors.primary} 
            />
            <Text style={styles.fileName} numberOfLines={2}>
              {fileName}
            </Text>
          </View>

          {/* URL Section */}
          <View style={styles.urlSection}>
            <Text style={styles.urlLabel}>File Link</Text>
            <View style={styles.urlContainer}>
              <TextInput
                value={fileUrl}
                editable={false}
                multiline
                style={styles.urlInput}
                selectTextOnFocus
              />
            </View>
          </View>

          {/* Copy Button */}
          <TouchableOpacity
            style={[styles.copyButton, copied && styles.copiedButton]}
            onPress={copyToClipboard}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={copied ? "check" : "content-copy"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.copyButtonText}>
              {copied ? 'Link Copied!' : 'Copy Link'}
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons 
              name="information-outline" 
              size={18} 
              color="#5F6368" 
            />
            <Text style={styles.infoText}>
              Anyone with this link can view and download this file
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  fileInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  fileName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
  },
  urlSection: {
    marginBottom: 20,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5F6368',
    marginBottom: 8,
  },
  urlContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  urlInput: {
    fontSize: 13,
    color: '#202124',
    padding: 0,
    maxHeight: 80,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  copiedButton: {
    backgroundColor: '#34C759',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#5F6368',
    marginLeft: 10,
    lineHeight: 18,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 15,
    color: '#5F6368',
    fontWeight: '500',
  },
});

export default CreateLinkModal;
