import { create } from "zustand";
import { Entry, File, Folder } from '../types';
import { filesAPI, foldersAPI } from "../api";
import { Asset } from "react-native-image-picker";

type Store = {
    root: Folder,
    stack: Folder[]
    getCurrent: () => Folder
    setStack: (folder: Folder[] | ((s: Folder[]) => Folder[])) => void
    resetStack: () => void
    setRoot: (folder: Folder | ((r: Folder) => Folder)) => void
    addFolder: (name: string) => void
    addFile: (file: Asset) => Promise<void>

}

const rootFolder = {
    id: 'root',
    name: 'Home',
    parent: null,
    children: [],
    files: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

const updateChild = (r: Folder, newFolder: Folder, key: 'children' | 'files' = 'children') => {
    return {
        ...r,
        [key]: r[key] ?
            [...r[key], newFolder] : [newFolder],
    };
}

export const useFileStore = create<Store>((set, get) => ({
    root: rootFolder,
    stack: [],
    getCurrent: () => {
        const { stack, root } = get()
        return stack.length === 0 ? root : stack[stack.length - 1]
    },
    setStack: (folders) => {
        set((state) => ({ stack: typeof folders === 'function' ? folders(state.stack) : folders }));
    },
    resetStack: () => set(() => ({ stack: [] })),
    setRoot: (folder) => {
        set((state) => ({ root: typeof folder === 'function' ? folder(state.root) : folder }))
    },
    addFolder: async (n: string) => {
        const name = n.trim();
        if (!name) return;
        try {
            const newFolder = await foldersAPI.create({
                name,
                parentId: get().getCurrent().id === 'root' ? undefined : get().getCurrent().id
            });
            if (get().stack.length === 0) {
                get().setRoot((r) => updateChild(r, newFolder)); // Changed from setRoot to get().setRoot
            } else {
                get().setStack((s) => s.map((folder, index) => {
                    if (index !== s.length - 1) return folder;
                    return updateChild(folder, newFolder);
                }));
            }
        } catch (error) {
            console.error('Error adding folder:', error);
        }
    },

    addFile: async (file: Asset) => {
        try {
            const fileName = file.fileName || file.uri?.split('/')?.pop() || `Image_${Date.now()}.jpg`;
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.type || 'image/jpeg',
                name: fileName,
                path: file.uri,
            });

            formData.append('name', fileName);
            formData.append('folderId', get().getCurrent().id);

            const uploadedFile = await filesAPI.upload(formData);
            if (get().stack.length === 0) {
                return get().setRoot((r) => updateChild(r, uploadedFile, 'files'));
            }
            get().setStack((s) => s.map((folder, index) => {
                if (index !== s.length - 1) return folder;
                return updateChild(folder, uploadedFile, 'files');
            }));
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
            // Alert.alert('Error', 'Failed to upload file', [{ text: 'OK' }]);
        }
    }
}))


