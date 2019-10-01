export interface FileMetadata {
  contentLength: number;
  contentType: string;
}

export interface FileObject {
  fileObjectId?: number;
  bucketName: string;
  fileName: string;
  fileKey: string;
  fileMetadata: FileMetadata;
}

export interface CreateFileObject {
  bucketName: string;
  fileName: string;
  fileKey: string;
  fileMetadata: FileMetadata;
}

export interface UpdateFileObject {
  fileObjectId?: number;
  bucketName: string;
  fileName: string;
  fileKey: string;
  fileMetadata: FileMetadata;
}
