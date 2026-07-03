import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadImage(
  file: string | Buffer,
  options?: {
    folder?: string;
    public_id?: string;
    transformation?: object;
  }
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options?.folder || 'marketbridge',
      public_id: options?.public_id,
      transformation: options?.transformation || { quality: 'auto', fetch_format: 'auto' },
      resource_type: 'image' as const,
    };

    const uploadCallback = (
      error: UploadApiErrorResponse | undefined,
      result: UploadApiResponse | undefined
    ) => {
      if (error || !result) {
        reject(error || new Error('Upload failed'));
        return;
      }

      resolve({
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      });
    };

    if (Buffer.isBuffer(file)) {
      cloudinary.uploader.upload_stream(uploadOptions, uploadCallback).end(file);
    } else {
      cloudinary.uploader.upload(file, uploadOptions, uploadCallback);
    }
  });
}

export async function uploadMultipleImages(
  files: (string | Buffer)[],
  options?: { folder?: string }
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadImage(file, options)));
}

export async function deleteImage(public_id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result?.result === 'ok');
    });
  });
}

export async function deleteMultipleImages(public_ids: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(public_ids, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(true);
    });
  });
}

export function getImageUrl(public_id: string, options?: { width?: number; height?: number; quality?: string }) {
  return cloudinary.url(public_id, {
    secure: true,
    transformation: {
      width: options?.width,
      height: options?.height,
      quality: options?.quality || 'auto',
      fetch_format: 'auto',
      crop: 'fill',
    },
  });
}

export { cloudinary };
