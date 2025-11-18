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
  s3Key?: string;
  s3Url?: string;
  mimeType?: string;
  size?: number | string;
  folderId?: string;
  folder?: {
    id: string;
    name: string;
  };
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;

    };
  };
   Home: { 
    refresh?: boolean;
    deletedFileId?: string;
    deletedFolderId?: string;
  } | undefined;
};

export type File = {
   id: string;
  name: string;
  path?: string;
  s3Key?: string;
  s3Url?: string; // Add this
  mimeType?: string;
  size?: number | string;
  folderId?: string;
  folder?: {
    id: string;
    name: string;
  };
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
