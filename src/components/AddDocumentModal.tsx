import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientButton from './GradientButton';
import Spacer from './Spacer';
import { filesAPI } from '../api';

interface fileDetailSchema {
  id:string
}

interface AddDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
updateId?:string;
    tagName?: string; // Add this for new folder creation
    fileName: string;
    category: string;
    remarks: string;
  }) => void;
  fileId: string;
}

const { width, height } = Dimensions.get('window');

export default function AddDocumentModal({
  visible,
  onClose,
  onSave,
  fileId,
}: AddDocumentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tagName, setTagName] = useState<string>('');
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [fileDetail, setFileDetail] = useState<fileDetailSchema>()

  const categories = ['Invoice', 'Manual', 'Warranty'];



 const handleSave = () => {
  if (!fileName || !category) {


    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }
  
  // If no folder selected but search query exists, mark for new folder creation
 
  
  console.log(searchQuery,'checking')
  const checkinSave = onSave({
    updateId:fileDetail?.id,
    tagName, // Pass folder name if creating new
    fileName,
    category,
    remarks,
  });
  
  console.log(checkinSave._j,'checking save or not')
  // Reset form
  if(checkinSave._j) {
 setSearchQuery('');
  setTagName('');
  setFileName('');
  setCategory('');
  setRemarks('');
  }

 
};

const getFileDetail = async() => {
  try {
    const data = await filesAPI.getFileDetail(fileId);
    console.log(data, fileId,'checking data ')
     setFileDetail(data?.fileDetail)
   const fileDetailData = data?.fileDetail
   
    if(data?.fileDetail?.id) {
      setTagName(fileDetailData?.tag);
      setFileName(fileDetailData?.name);
      setCategory(fileDetailData?.tag);
      setRemarks(fileDetailData?.remarks);
    }

              
  }catch(error) {

 console.error('Save document error:', error);
                  Alert.alert(
                    'Error',
                    error.response?.data?.message || 'Failed to save document details'
                  );
  }finally {

  }

}

useEffect(()=> {
  console.log(fileId)
  if(fileId) {
    getFileDetail()
  }

},[0])


  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Document Details</Text>
          <TouchableOpacity style={styles.userIcon}>
            <MaterialCommunityIcons name="account" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Search Folder */}
            <View style={styles.inputGroup}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Add Tag Name"
                  placeholderTextColor="#A0AEC0"
                  value={tagName}
                  onChangeText={setTagName}
                  onFocus={() => setShowFolderDropdown(true)}
                />
                {/* <MaterialCommunityIcons
                  name="information-outline"
                  size={20}
                  color="#6b5cdb"
                  style={styles.infoIcon}
                /> */}
              </View>

              {/* Folder Dropdown */}
              {/* {showFolderDropdown && searchQuery && filteredFolders.length > 0 && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownHeaderContainer}>
                    <Text style={styles.dropdownHeaderLabel}>Wash</Text>
                  </View>
                  {filteredFolders.map((folder) => (
                    <TouchableOpacity
                      key={folder.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSearchQuery(folder.name);
                        setShowFolderDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {folder.name} {folder.count ? `(${folder.count})` : ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.dropdownAddNew}
                    onPress={() => {
                      setShowFolderDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownAddNewText}>
                      + Add "{searchQuery}" as new
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
            </View>

            <Spacer height={20} />

            {/* File Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>File Name</Text>
              <TextInput
                style={styles.input}
                placeholder="File Name"
                placeholderTextColor="#A0AEC0"
                value={fileName}
                onChangeText={setFileName}
              />
            </View>

            <Spacer height={20} />

            {/* Document Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Document Category</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={category ? styles.dropdownButtonText : styles.dropdownButtonPlaceholder}>
                  {category || 'Select Document Category'}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.dropdown}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.dropdownAddNew}
                    onPress={() => {
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownAddNewText}>
                      + Add New Category
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Spacer height={20} />

            {/* Remarks */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Reading within the dropdown menu. And this is more example text"
                placeholderTextColor="#A0AEC0"
                value={remarks}
                onChangeText={setRemarks}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Spacer height={30} />

            {/* Save Button */}
            <GradientButton
              title={fileDetail?.id ?'Update':'Save Securely'}
              onPress={handleSave}
              disabled={  !fileName || !category}
            />

            <Spacer height={40} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
  userIcon: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    width: '100%',
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
  },
  infoIcon: {
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#F7FAFC',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F7FAFC',
  },
  dropdownButtonText: {
    fontSize: 15,
    color: '#000',
  },
  dropdownButtonPlaceholder: {
    fontSize: 15,
    color: '#A0AEC0',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownHeaderLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownAddNew: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownAddNewText: {
    fontSize: 14,
    color: '#6b5cdb',
    fontWeight: '600',
  },
});
