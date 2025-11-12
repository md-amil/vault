import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


export type FileType = 'folder' | 'document' | 'image' | 'video' | 'pdf' | 'other';

export interface DriveItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null; // null means root level
  size?: number; // in bytes
  mimeType?: string;
  url?: string; // for files
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isStarred: boolean;
  isTrashed: boolean;
  sharedWith?: string[]; // user IDs
  thumbnailUrl?: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

interface UploadProgress {
  [fileId: string]: number; // 0-100
}

interface DriveState {
  // Data
  items: Record<string, DriveItem>; // Map by ID for O(1) lookup
  currentFolderId: string | null;
  breadcrumbs: BreadcrumbItem[];
  selectedItems: Set<string>;
  
  // UI States
  isLoading: boolean;
  isRefreshing: boolean;
  uploadProgress: UploadProgress;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  
  // Filters
  filter: 'all' | 'starred' | 'recent' | 'shared' | 'trash';
  
  // Cache & Sync
  lastFetchTime: Record<string, number>; // folder ID -> timestamp
  hasMore: Record<string, boolean>; // pagination
  pageTokens: Record<string, string>; // for API pagination
  
  // Error handling
  error: string | null;
}

interface DriveActions {
  // Navigation
  navigateToFolder: (folderId: string | null) => void;
  goBack: () => void;
  
  // Data fetching (these call APIs)
  fetchFolderContents: (folderId: string | null, forceRefresh?: boolean) => Promise<void>;
  fetchItemDetails: (itemId: string) => Promise<void>;
  searchItems: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  
  // CRUD operations
  createFolder: (name: string, parentId: string | null) => Promise<void>;
  uploadFile: (file: any, parentId: string | null) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<void>;
  moveItem: (itemId: string, newParentId: string | null) => Promise<void>;
  deleteItem: (itemId: string, permanent?: boolean) => Promise<void>;
  restoreItem: (itemId: string) => Promise<void>;
  toggleStar: (itemId: string) => Promise<void>;
  
  // Selection
  toggleSelectItem: (itemId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // UI Actions
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: 'name' | 'date' | 'size') => void;
  setFilter: (filter: DriveState['filter']) => void;
  clearError: () => void;
  
  // Utility
  getItemsByParent: (parentId: string | null) => DriveItem[];
  getItem: (itemId: string) => DriveItem | undefined;
  isItemCached: (folderId: string | null) => boolean;
}

// ============================================
// API FUNCTIONS (Mock - Replace with real API)
// ============================================

class DriveAPI {
  private static baseUrl = 'https://api.yourdrive.com';
  
  static async getFolderContents(
    folderId: string | null, 
    pageToken?: string
  ): Promise<{ items: DriveItem[]; nextPageToken?: string }> {
    // Replace with actual API call
    const response = await fetch(
      `${this.baseUrl}/items?parentId=${folderId || 'root'}&pageToken=${pageToken || ''}`
    );
    return response.json();
  }
  
  static async getItemDetails(itemId: string): Promise<DriveItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}`);
    return response.json();
  }
  
  static async searchItems(query: string): Promise<DriveItem[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.items;
  }
  
  static async createFolder(name: string, parentId: string | null): Promise<DriveItem> {
    const response = await fetch(`${this.baseUrl}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId: parentId || 'root' })
    });
    return response.json();
  }
  
  static async uploadFile(
    file: any, 
    parentId: string | null,
    onProgress?: (progress: number) => void
  ): Promise<DriveItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', parentId || 'root');
    
    // Use XMLHttpRequest for upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      
      xhr.open('POST', `${this.baseUrl}/upload`);
      xhr.send(formData);
    });
  }
  
  static async renameItem(itemId: string, newName: string): Promise<DriveItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    return response.json();
  }
  
  static async moveItem(itemId: string, newParentId: string | null): Promise<DriveItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId: newParentId || 'root' })
    });
    return response.json();
  }
  
  static async deleteItem(itemId: string, permanent: boolean): Promise<void> {
    await fetch(`${this.baseUrl}/items/${itemId}?permanent=${permanent}`, {
      method: 'DELETE'
    });
  }
  
  static async restoreItem(itemId: string): Promise<DriveItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}/restore`, {
      method: 'POST'
    });
    return response.json();
  }
  
  static async toggleStar(itemId: string, isStarred: boolean): Promise<DriveItem> {
    const response = await fetch(`${this.baseUrl}/items/${itemId}/star`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isStarred })
    });
    return response.json();
  }
}

// ============================================
// ZUSTAND STORE
// ============================================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDriveStore = create<DriveState & DriveActions>()(
  immer((set, get) => ({
    // Initial State
    items: {},
    currentFolderId: null,
    breadcrumbs: [{ id: 'root', name: 'My Drive' }],
    selectedItems: new Set(),
    isLoading: false,
    isRefreshing: false,
    uploadProgress: {},
    searchQuery: '',
    viewMode: 'list',
    sortBy: 'name',
    sortOrder: 'asc',
    filter: 'all',
    lastFetchTime: {},
    hasMore: {},
    pageTokens: {},
    error: null,

    // ============================================
    // NAVIGATION ACTIONS
    // ============================================
    
    navigateToFolder: (folderId) => {
      const state = get();
      set((draft) => {
        draft.currentFolderId = folderId;
        draft.selectedItems.clear();
        draft.searchQuery = '';
        
        // Update breadcrumbs
        if (folderId === null) {
          draft.breadcrumbs = [{ id: 'root', name: 'My Drive' }];
        } else {
          const item = state.items[folderId];
          if (item) {
            // Build breadcrumb trail
            const trail: BreadcrumbItem[] = [{ id: 'root', name: 'My Drive' }];
            let current = item;
            const ancestors: BreadcrumbItem[] = [];
            
            while (current && current.parentId) {
              ancestors.unshift({ id: current.id, name: current.name });
              current = state.items[current.parentId];
            }
            
            ancestors.push({ id: item.id, name: item.name });
            draft.breadcrumbs = [...trail, ...ancestors];
          }
        }
      });
      
      // Fetch contents if needed
      get().fetchFolderContents(folderId);
    },
    
    goBack: () => {
      const { breadcrumbs } = get();
      if (breadcrumbs.length > 1) {
        const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
        get().navigateToFolder(parentBreadcrumb.id === 'root' ? null : parentBreadcrumb.id);
      }
    },

    // ============================================
    // DATA FETCHING ACTIONS
    // ============================================
    
    fetchFolderContents: async (folderId, forceRefresh = false) => {
      const state = get();
      const cacheKey = folderId || 'root';
      const lastFetch = state.lastFetchTime[cacheKey] || 0;
      const isCached = Date.now() - lastFetch < CACHE_DURATION;
      
      // Skip if cached and not forcing refresh
      if (isCached && !forceRefresh) {
        return;
      }
      
      set((draft) => {
        draft.isLoading = true;
        draft.error = null;
      });
      
      try {
        const { items, nextPageToken } = await DriveAPI.getFolderContents(folderId);
        
        set((draft) => {
          // Add items to store
          items.forEach((item) => {
            draft.items[item.id] = item;
          });
          
          // Update cache metadata
          draft.lastFetchTime[cacheKey] = Date.now();
          draft.hasMore[cacheKey] = !!nextPageToken;
          if (nextPageToken) {
            draft.pageTokens[cacheKey] = nextPageToken;
          }
          draft.isLoading = false;
          draft.isRefreshing = false;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to fetch items';
          draft.isLoading = false;
          draft.isRefreshing = false;
        });
      }
    },
    
    fetchItemDetails: async (itemId) => {
      try {
        const item = await DriveAPI.getItemDetails(itemId);
        set((draft) => {
          draft.items[item.id] = item;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to fetch item details';
        });
      }
    },
    
    searchItems: async (query) => {
      set((draft) => {
        draft.searchQuery = query;
        draft.isLoading = true;
        draft.error = null;
      });
      
      if (!query.trim()) {
        set((draft) => {
          draft.isLoading = false;
        });
        return;
      }
      
      try {
        const items = await DriveAPI.searchItems(query);
        set((draft) => {
          items.forEach((item) => {
            draft.items[item.id] = item;
          });
          draft.isLoading = false;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Search failed';
          draft.isLoading = false;
        });
      }
    },
    
    loadMore: async () => {
      const { currentFolderId, pageTokens, hasMore } = get();
      const cacheKey = currentFolderId || 'root';
      
      if (!hasMore[cacheKey]) return;
      
      try {
        const { items, nextPageToken } = await DriveAPI.getFolderContents(
          currentFolderId,
          pageTokens[cacheKey]
        );
        
        set((draft) => {
          items.forEach((item) => {
            draft.items[item.id] = item;
          });
          
          draft.hasMore[cacheKey] = !!nextPageToken;
          if (nextPageToken) {
            draft.pageTokens[cacheKey] = nextPageToken;
          }
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to load more';
        });
      }
    },

    // ============================================
    // CRUD OPERATIONS
    // ============================================
    
    createFolder: async (name, parentId) => {
      set((draft) => {
        draft.isLoading = true;
        draft.error = null;
      });
      
      try {
        const newFolder = await DriveAPI.createFolder(name, parentId);
        set((draft) => {
          draft.items[newFolder.id] = newFolder;
          draft.isLoading = false;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to create folder';
          draft.isLoading = false;
        });
      }
    },
    
    uploadFile: async (file, parentId) => {
      const tempId = `temp-${Date.now()}`;
      
      set((draft) => {
        draft.uploadProgress[tempId] = 0;
      });
      
      try {
        const uploadedFile = await DriveAPI.uploadFile(file, parentId, (progress) => {
          set((draft) => {
            draft.uploadProgress[tempId] = progress;
          });
        });
        
        set((draft) => {
          draft.items[uploadedFile.id] = uploadedFile;
          delete draft.uploadProgress[tempId];
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Upload failed';
          delete draft.uploadProgress[tempId];
        });
      }
    },
    
    renameItem: async (itemId, newName) => {
      try {
        const updatedItem = await DriveAPI.renameItem(itemId, newName);
        set((draft) => {
          draft.items[itemId] = updatedItem;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to rename';
        });
      }
    },
    
    moveItem: async (itemId, newParentId) => {
      try {
        const updatedItem = await DriveAPI.moveItem(itemId, newParentId);
        set((draft) => {
          draft.items[itemId] = updatedItem;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to move item';
        });
      }
    },
    
    deleteItem: async (itemId, permanent = false) => {
      try {
        await DriveAPI.deleteItem(itemId, permanent);
        set((draft) => {
          if (permanent) {
            delete draft.items[itemId];
          } else {
            if (draft.items[itemId]) {
              draft.items[itemId].isTrashed = true;
            }
          }
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to delete';
        });
      }
    },
    
    restoreItem: async (itemId) => {
      try {
        const restoredItem = await DriveAPI.restoreItem(itemId);
        set((draft) => {
          draft.items[itemId] = restoredItem;
        });
      } catch (error) {
        set((draft) => {
          draft.error = error instanceof Error ? error.message : 'Failed to restore';
        });
      }
    },
    
    toggleStar: async (itemId) => {
      const currentItem = get().items[itemId];
      if (!currentItem) return;
      
      // Optimistic update
      set((draft) => {
        draft.items[itemId].isStarred = !draft.items[itemId].isStarred;
      });
      
      try {
        const updatedItem = await DriveAPI.toggleStar(itemId, !currentItem.isStarred);
        set((draft) => {
          draft.items[itemId] = updatedItem;
        });
      } catch (error) {
        // Revert on error
        set((draft) => {
          draft.items[itemId].isStarred = currentItem.isStarred;
          draft.error = error instanceof Error ? error.message : 'Failed to update star';
        });
      }
    },

    // ============================================
    // SELECTION ACTIONS
    // ============================================
    
    toggleSelectItem: (itemId) => {
      set((draft) => {
        if (draft.selectedItems.has(itemId)) {
          draft.selectedItems.delete(itemId);
        } else {
          draft.selectedItems.add(itemId);
        }
      });
    },
    
    selectAll: () => {
      const items = get().getItemsByParent(get().currentFolderId);
      set((draft) => {
        items.forEach((item) => draft.selectedItems.add(item.id));
      });
    },
    
    clearSelection: () => {
      set((draft) => {
        draft.selectedItems.clear();
      });
    },

    // ============================================
    // UI ACTIONS
    // ============================================
    
    setViewMode: (mode) => {
      set((draft) => {
        draft.viewMode = mode;
      });
    },
    
    setSortBy: (sortBy) => {
      set((draft) => {
        if (draft.sortBy === sortBy) {
          draft.sortOrder = draft.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          draft.sortBy = sortBy;
          draft.sortOrder = 'asc';
        }
      });
    },
    
    setFilter: (filter) => {
      set((draft) => {
        draft.filter = filter;
        draft.selectedItems.clear();
      });
    },
    
    clearError: () => {
      set((draft) => {
        draft.error = null;
      });
    },

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    getItemsByParent: (parentId) => {
      const { items, filter, searchQuery, sortBy, sortOrder } = get();
      
      let filtered = Object.values(items).filter((item) => {
        // Parent filter
        if (searchQuery) {
          // Search across all items
          return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          if (item.parentId !== parentId) return false;
        }
        
        // Additional filters
        switch (filter) {
          case 'starred':
            return item.isStarred && !item.isTrashed;
          case 'trash':
            return item.isTrashed;
          case 'shared':
            return item.sharedWith && item.sharedWith.length > 0 && !item.isTrashed;
          case 'recent':
            // Last 7 days
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            return new Date(item.updatedAt).getTime() > weekAgo && !item.isTrashed;
          default:
            return !item.isTrashed;
        }
      });
      
      // Sort
      filtered.sort((a, b) => {
        let comparison = 0;
        
        // Folders first
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'date':
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
          case 'size':
            comparison = (a.size || 0) - (b.size || 0);
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      return filtered;
    },
    
    getItem: (itemId) => {
      return get().items[itemId];
    },
    
    isItemCached: (folderId) => {
      const { lastFetchTime } = get();
      const cacheKey = folderId || 'root';
      const lastFetch = lastFetchTime[cacheKey] || 0;
      return Date.now() - lastFetch < CACHE_DURATION;
    },
  }))
);

// ============================================
// SELECTORS (for optimized re-renders)
// ============================================

export const selectCurrentItems = (state: DriveState & DriveActions) =>
  state.getItemsByParent(state.currentFolderId);

export const selectSelectedItems = (state: DriveState & DriveActions) =>
  Array.from(state.selectedItems).map((id) => state.items[id]).filter(Boolean);

export const selectIsUploading = (state: DriveState & DriveActions) =>
  Object.keys(state.uploadProgress).length > 0;