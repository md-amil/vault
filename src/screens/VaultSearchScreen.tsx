import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IFile, Folder } from '../types';
import FilterBottomSheet, { FilterOption } from '../components/FilterBottomSheet';
import { filesAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';

// const { user } = useAuth();
const userId  = 'some-user-id';;


export default function VaultSearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(IFile | Folder)[]>([]);
  const [loading, setLoading] = useState(false);

  // which dropdown is open
  const [activeSheet, setActiveSheet] =
    useState<null | 'Category' | 'Tag' | 'people' | 'modified'>(null);

  const [selectedCategory, setSelectedCategory] = useState<FilterOption | null>(null);

  // dropdown data
  const categoryOptions: FilterOption[] = [
    { id: 'docs',       label: 'Documents',       icon: 'file-document-outline',       iconColor: '#1A73E8' },
    { id: 'sheets',     label: 'Spreadsheets',    icon: 'file-table-box',              iconColor: '#0F9D58' },
    { id: 'slides',     label: 'Presentations',   icon: 'presentation',                iconColor: '#F4B400' },
    { id: 'photos',     label: 'Photos & images', icon: 'image-multiple',              iconColor: '#E8710A' },
    { id: 'forms',      label: 'Forms',           icon: 'file-document-edit-outline',  iconColor: '#A142F4' },
    { id: 'pdfs',       label: 'PDFs',            icon: 'file-pdf-box',                iconColor: '#EA4335' },
    { id: 'videos',     label: 'Videos',          icon: 'video-outline',               iconColor: '#34A853' },
    { id: 'shortcuts',  label: 'Shortcuts',       icon: 'link-variant',                iconColor: '#5F6368' },
  ];
const onSearch = async () => {
  try {
    setLoading(true);

    const params: any = {
      search: query || undefined,                    // text box
      category: selectedCategory?.id || undefined,   // from Category sheet
      tag: null,                                     // TODO: when Tag filter is ready
      userId: userId,
    };

    Object.keys(params).forEach(
      (k) => params[k] === undefined || params[k] === null && delete params[k]
    );

    const data = await filesAPI.search(params);
    
    console.log(data,'checking data')// GET /files/search
    setResults(data || []);
  } catch (e) {
    console.error('Search error', e);
  } finally {
    setLoading(false);
  }
};


  const renderItem = ({ item }: { item: IFile | Folder }) => {
    const isFile = 'path' in item;
    return (
      <TouchableOpacity style={styles.resultItem}>
        <View style={styles.resultIcon}>
          <MaterialCommunityIcons
            name={isFile ? 'file-document-outline' : 'folder'}
            size={22}
            color={isFile ? '#5F6368' : '#1A73E8'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.resultName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {isFile ? 'Document' : 'Folder'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top search header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#202124" />
        </TouchableOpacity>

        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search in Vault"
            placeholderTextColor="#9AA0A6"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={onSearch}
            autoFocus
          />
        </View>
      </View>

      {/* Filter chips row */}
      <View style={styles.filterRow}>
        <FilterChip label="Tag" onPress={() => setActiveSheet('Tag')} />
        <FilterChip
          label={selectedCategory ? selectedCategory.label : 'Category'}
          onPress={() => setActiveSheet('Category')}
        />
        {/* <FilterChip label="People" onPress={() => setActiveSheet('people')} />
        <FilterChip label="Modified" onPress={() => setActiveSheet('modified')} /> */}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.resultsContainer}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !loading && query.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="file-search-outline"
                size={64}
                color="#DADCE0"
              />
              <Text style={styles.emptyTitle}>Search your documents</Text>
              <Text style={styles.emptySubtitle}>
                Type a file or folder name to find it quickly
              </Text>
            </View>
          ) : null
        }
      />

      {/* Category dropdown */}
      <FilterBottomSheet
        visible={activeSheet === 'Category'}
        title="Category"
        options={categoryOptions}
        onClose={() => setActiveSheet(null)}
        onSelect={(option) => {
          setSelectedCategory(option);
          // trigger search/filter here if you want live update
          // onSearch();
        }}
      />
    </SafeAreaView>
  );
}

const FilterChip = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.chip} onPress={onPress}>
    <Text style={styles.chipText}>{label}</Text>
    <MaterialCommunityIcons name="chevron-down" size={16} color="#5F6368" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 6,
    marginRight: 4,
  },
  searchInputWrapper: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    fontSize: 16,
    color: '#202124',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DADCE0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 13,
    color: '#202124',
    marginRight: 4,
  },
  resultsContainer: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#202124',
  },
  resultSubtitle: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 2,
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
    textAlign: 'center',
  },
});
