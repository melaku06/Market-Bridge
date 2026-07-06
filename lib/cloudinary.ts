import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed MIME types for image uploads
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
  folder: string;
}

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: object;
  overwrite?: boolean;
}

/**
 * Validate a file before upload
 */
export function validateImageFile(file: { type: string; size: number }): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${MAX_FILE_SIZE / 1024 / 1024}MB.` };
  }
  return { valid: true };
}

/**
 * Upload a single image to Cloudinary
 */
export async function uploadImage(
  file: string | Buffer,
  options?: UploadOptions
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const folder = options?.folder || 'marketbridge';
    const uploadOptions = {
      folder,
      public_id: options?.public_id,
      transformation: options?.transformation || { quality: 'auto', fetch_format: 'auto' },
      resource_type: 'image' as const,
      overwrite: options?.overwrite ?? true,
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
        resource_type: result.resource_type,
        folder,
      });
    };

    if (Buffer.isBuffer(file)) {
      cloudinary.uploader.upload_stream(uploadOptions, uploadCallback).end(file);
    } else {
      cloudinary.uploader.upload(file, uploadOptions, uploadCallback);
    }
  });
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleImages(
  files: (string | Buffer)[],
  options?: UploadOptions
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadImage(file, options)));
}

/**
 * Delete a single image from Cloudinary by public_id
 */
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

/**
 * Delete multiple images from Cloudinary by public_ids
 */
export async function deleteMultipleImages(public_ids: string[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(public_ids, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(true);
    });
  });
}

/**
 * Generate a responsive image URL with transformations
 */
export function getImageUrl(
  public_id: string,
  options?: { width?: number; height?: number; quality?: string; crop?: string; format?: string }
): string {
  return cloudinary.url(public_id, {
    secure: true,
    transformation: {
      width: options?.width,
      height: options?.height,
      quality: options?.quality || 'auto',
      fetch_format: options?.format || 'auto',
      crop: options?.crop || 'fill',
    },
  });
}

/**
 * Generate a set of responsive image URLs for different viewport sizes
 */
export function getResponsiveImageUrls(public_id: string): {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
} {
  return {
    thumbnail: getImageUrl(public_id, { width: 150, height: 150 }),
    small: getImageUrl(public_id, { width: 400, height: 400 }),
    medium: getImageUrl(public_id, { width: 800, height: 800 }),
    large: getImageUrl(public_id, { width: 1200, height: 1200 }),
    original: getImageUrl(public_id, { quality: 'auto' }),
  };
}

export { cloudinary };
