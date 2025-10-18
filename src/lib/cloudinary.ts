import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using CLOUDINARY_URL environment variable
// Format: cloudinary://api_key:api_secret@cloud_name
cloudinary.config({
  secure: true,
  // Parse the CLOUDINARY_URL if it exists
  ...(process.env.CLOUDINARY_URL && {
    cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
    api_key: process.env.CLOUDINARY_URL.split('://')[1].split(':')[0],
    api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0]
  })
});

export default cloudinary;

// Helper function to upload file to Cloudinary
export async function uploadToCloudinary(file: File, folder: string = 'vizzarjobs/cvs') {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64 string
    const base64String = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder,
      resource_type: 'raw', // For PDF files
      public_id: `cv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      overwrite: false,
      invalidate: true
    });
    
    return {
      success: true,
      publicId: result.public_id,
      secureUrl: result.secure_url,
      originalName: file.name,
      size: file.size,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

// Helper function to delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

// Helper function to get secure URL
export function getCloudinaryUrl(publicId: string, options: any = {}) {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    secure: true,
    ...options
  });
}
