# API Reference

## Base Configuration
- **Host**: `http://localhost:3000` (development)
- **Base URL**: `http://10.0.2.2:3000` (React Native)

## Authentication

### Send OTP
```
POST /auth/send-otp
Content-Type: application/json

{
  "mobile": "8287156812"
}
```

### Verify OTP
```
POST /auth/verify-otp
Content-Type: application/json

{
  "mobile": "8287156812",
  "otp": "567911"
}
```

### Get Profile (Protected)
```
GET /auth/profile
Authorization: Bearer {token}
```

## Users

### Create User (Protected)
```
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "mobile": "+15550001111",
  "name": "Alice"
}
```

### Get All Users (Protected)
```
GET /users
Authorization: Bearer {token}
```

### Get User By ID (Protected)
```
GET /users/{userId}
Authorization: Bearer {token}
```

### Update User (Protected)
```
PATCH /users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Amil Ali Sahil"
}
```

### Deactivate User (Protected)
```
PATCH /users/{userId}/deactivate
Authorization: Bearer {token}
```

### Activate User (Protected)
```
PATCH /users/{userId}/activate
Authorization: Bearer {token}
```

### Delete User (Protected)
```
DELETE /users/{userId}
Authorization: Bearer {token}
```

## Folders

### Create Folder (Protected)
```
POST /folders
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Child Folder",
  "parent": "9413e8f3-3688-477c-a73a-92049838ba3e"
}
```

### Get Folder Tree (Protected)
```
GET /folders
Authorization: Bearer {token}
```

### Get Folder By ID (Protected)
```
GET /folders/{folderId}
Authorization: Bearer {token}
```

### Update Folder (Protected)
```
PATCH /folders/{folderId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Renamed Folder"
}
```

### Delete Folder (Protected)
```
DELETE /folders/{folderId}
Authorization: Bearer {token}
```

## Files

### Upload File (Direct to API)
```
POST /files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form data:
- file: {file}
- name: {fileName}
- folderId: {folderId}
- userId: {userId}
```

### Generate Presigned Upload URL
```
POST /files/presigned-upload
Authorization: Bearer {token}
Content-Type: application/json

{
  "folderId": "{folderId}",
  "fileName": "document.pdf",
  "contentType": "application/pdf",
  "userId": "{userId}",
  "expiresIn": 3600
}
```

### Create File Database Record
```
POST /files
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "document.pdf",
  "folderId": "{folderId}",
  "userId": "{userId}"
}
```

### Get All Files (Protected)
```
GET /files?folderId={folderId}&userId={userId}
Authorization: Bearer {token}
```

### Get Files by Folder
```
GET /files/folder/{folderId}?userId={userId}
Authorization: Bearer {token}
```

### Get Storage Stats
```
GET /files/stats?userId={userId}
Authorization: Bearer {token}
```

### Get File By ID (Protected)
```
GET /files/{fileId}
Authorization: Bearer {token}
```

### Download File (Direct through API)
```
GET /files/{fileId}/download
Authorization: Bearer {token}
```

### Get Presigned Download URL
```
GET /files/{fileId}/presigned-url?expiresIn=3600
Authorization: Bearer {token}
```

### Update File (Protected)
```
PATCH /files/{fileId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "renamed-document.pdf",
  "folderId": "{folderId}"
}
```

### Delete File (Protected)
```
DELETE /files/{fileId}
Authorization: Bearer {token}
```
