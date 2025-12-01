// services/GoogleDriveService.ts
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';

class GoogleDriveService {
  private gdrive: GDrive | null = null;
  private isConfigured = false;

  configure() {
    if (this.isConfigured) return;

    try {
      GoogleSignin.configure({
        scopes: [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive',
        ],
        webClientId: '314739860532-nsnuatbdkl7vqvnvamfd2j35vdcqtvco.apps.googleusercontent.com',
        offlineAccess: true,
      });
      this.isConfigured = true;
      console.log('Google Sign-In configured');
    } catch (error) {
      console.error('Configure error:', error);
    }
  }

  async signIn() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      
      const tokens = await GoogleSignin.getTokens();
      this.gdrive = new GDrive();
      this.gdrive.accessToken = tokens.accessToken;
      
      console.log('Signed in:', userInfo.data.user.email);
      return userInfo;
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available');
      }
      
      throw error;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser !== null;
    } catch (error) {
      console.error('Check signed in error:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getAccessToken(): Promise<string> {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async listFiles() {
    if (!this.gdrive) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gdrive.files.list({
        pageSize: 100,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
      });

      return response.files || [];
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }

  async listFolders(): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder'&spaces=drive&fields=files(id,name,createdTime,modifiedTime)&pageSize=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch folders: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Google Drive folders:', data.files);
      return data.files || [];
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  }

  async listFilesByFolder(folderId: string): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&spaces=drive&fields=files(id,name,mimeType,createdTime,modifiedTime,size)&pageSize=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error fetching files by folder:', error);
      throw error;
    }
  }

  async uploadFile(fileContent: string, fileName: string, mimeType: string = 'application/octet-stream') {
    if (!this.gdrive) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gdrive.files.createFileMultipart(
        fileContent,
        mimeType,
        {
          name: fileName,
          parents: ['root'],
        },
        true // isBase64
      );

      return response;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.gdrive = null;
      this.isConfigured = false;
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}

export default new GoogleDriveService();
