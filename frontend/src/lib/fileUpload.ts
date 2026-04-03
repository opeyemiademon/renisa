/**
 * File Upload Utility
 * Handles file conversion and base64 encoding
 */

/**
 * Convert File to base64 string
 * @param file - File object to convert
 * @returns Base64 encoded string with data URI
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert multiple Files to base64 strings
 * @param files - Array of File objects
 * @returns Array of base64 encoded strings
 */
export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];
  
  const promises = files.map(file => fileToBase64(file));
  return Promise.all(promises);
};

/**
 * Convert base64 string to File object
 * @param base64 - Base64 string with data URI
 * @param filename - Filename for the File object
 * @returns File object
 */
export const base64ToFile = (base64: string, filename: string = 'file'): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default 5MB)
 * @returns Validation result
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file only.' };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File exceeds ${maxSizeMB}MB limit. File size is ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
    };
  }

  return { valid: true };
};

export default {
  fileToBase64,
  filesToBase64,
  base64ToFile,
  validateImageFile,
};
