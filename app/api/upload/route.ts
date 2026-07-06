import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/require-auth';
import { uploadImage, deleteImage, validateImageFile, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/lib/cloudinary';
import { createMediaAsset, deleteMediaAsset, getMediaAssetByPublicId } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'marketbridge';
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const validation = validateImageFile({ type: file.type, size: file.size });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Convert file to base64 string for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const folderPath = `${folder}/${type}`;
    const result = await uploadImage(base64, { folder: folderPath });

    // Store metadata in PostgreSQL
    const mediaAsset = await createMediaAsset({
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resource_type: result.resource_type,
      folder: result.folder,
      type: type as any,
      uploader: { connect: { id: user!.id } },
    });

    return NextResponse.json({
      success: true,
      image: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        folder: result.folder,
        type,
      },
      asset: mediaAsset,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json({ error: 'No public_id provided' }, { status: 400 });
    }

    // Check if the media asset exists and belongs to the user (or user is admin)
    const mediaAsset = await getMediaAssetByPublicId(public_id);
    if (mediaAsset && mediaAsset.uploaded_by && mediaAsset.uploaded_by !== user!.id && user!.role !== 'admin') {
      return NextResponse.json({ error: 'You do not have permission to delete this image' }, { status: 403 });
    }

    // Delete from Cloudinary
    const cloudinaryResult = await deleteImage(public_id);

    // Delete from database
    if (mediaAsset) {
      await deleteMediaAsset(public_id);
    }

    return NextResponse.json({ success: cloudinaryResult });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
