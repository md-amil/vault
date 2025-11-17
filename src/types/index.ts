export type Entry = {
  id: string;
  type: 'folder' | 'file';
  name: string;
  uri?: string;
  children?: Entry[];
};

export type Folder = {
  id: string;
  name: string;
  parent: Folder | null;
  children: Folder[];
  files: File[];
  createdAt: string;
  updatedAt: string;
};

export type RootStackParamList = {
  // ... other screens
  FolderDetails: { folder: { id: string; name: string } };
  FileDetails: { 
    file: {
      id: string;
      name: string;
      path?: string;
      size?: number;
      createdAt?: string;
    };
  };
};

export type File = {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string;
  key: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
};
