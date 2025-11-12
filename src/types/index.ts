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
