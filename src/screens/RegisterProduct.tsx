import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterProduct'>;

const categories = ['Warranty', 'Manual', 'Invoice', 'Certificate', 'Other'];

export default function RegisterProductScreen({ navigation, route }: Props) {
  const [folderSearch, setFolderSearch] = useState<string>('');
  const [fileName, setFileName] = useState<string>(route.params?.file?.name ?? '');
  const [category, setCategory] = useState<string>('');
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>('');

  function handleSave() {
    // For now, just show a confirmation and go back. In a real app we'd POST this to an API.
    Alert.alert('Saved', 'Document saved securely.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* <TouchableOpacity style={styles.searchBox} activeOpacity={0.8}>
          <TextInput
            placeholder="Search Folder Name"
            placeholderTextColor="#e6edf3"
            value={folderSearch}
            onChangeText={setFolderSearch}
            style={styles.searchInput}
          />
          <View style={styles.searchIconWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </TouchableOpacity> */}
        <TextInput
          placeholder="File Name"
          value={fileName}
          onChangeText={setFileName}
          style={styles.input}
        />

        <TouchableOpacity style={styles.selectBox} onPress={() => setShowCategories(!showCategories)}>
          <Text style={styles.selectText}>{category || 'Select Document Category'}</Text>
          <Text style={styles.selectChevron}>▾</Text>
        </TouchableOpacity>

        {showCategories && (
          <View style={styles.categoriesList}>
            {categories.map((c) => (
              <TouchableOpacity key={c} style={styles.categoryItem} onPress={() => { setCategory(c); setShowCategories(false); }}>
                <Text style={styles.categoryText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.remarksLabel}>Remarks</Text>
        <TextInput
          placeholder="Add remarks..."
          placeholderTextColor="#9aa6b2"
          value={remarks}
          onChangeText={setRemarks}
          style={styles.remarks}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.9}>
          <Text style={styles.saveText}>Save Securely</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
  },
  searchBox: {
    backgroundColor: '#5b6770',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  searchIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f0fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6edf3',
  },
  selectBox: {
    backgroundColor: '#FFF',
    color: '#334155',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectText: {
    color: '#334155',
    fontSize: 16,
  },
  selectChevron: {
    color: '#334155',
    fontSize: 18,
  },
  categoriesList: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6edf3',
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6edf3',
  },
  categoryText: {
    color: '#334155',
  },
  remarksLabel: {
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    marginBottom: 6,
  },
  remarks: {
    backgroundColor: '#fff',
    borderRadius: 6,
    minHeight: 120,
    padding: 12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e6edf3',
    marginBottom: 16,
    color: '#334155',
  },
  saveBtn: {
    backgroundColor: '#1e90ff',
    height: 48,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
