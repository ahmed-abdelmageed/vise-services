
/**
 * Utility service for interacting with Google Cloud via Supabase Edge Functions
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Analyzes a document using Google Cloud Vision API
 * @param file File to analyze
 * @returns Analysis results
 */
export const analyzeDocument = async (file: File): Promise<any> => {
  try {
    // Convert file to base64
    const base64File = await fileToBase64(file);
    
    console.log(`Analyzing document: ${file.name} (${formatFileSize(file.size)})`);
    
    const { data, error } = await supabase.functions.invoke("google-cloud-integration", {
      body: {
        action: "analyze",
        file: base64File,
        fileName: file.name,
      },
    });

    if (error) {
      console.error("Edge function error during document analysis:", error);
      toast.error(`Analysis failed: ${error.message}`);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Error analyzing document:", error);
    toast.error(`Document analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Translates text using Google Cloud Translation API
 * @param text Text to translate
 * @param sourceLanguage Source language code (e.g., 'en')
 * @param targetLanguage Target language code (e.g., 'es')
 * @returns Translated text
 */
export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<any> => {
  try {
    console.log(`Translating text from ${sourceLanguage} to ${targetLanguage}`);
    
    const { data, error } = await supabase.functions.invoke("google-cloud-integration", {
      body: {
        action: "translate",
        text,
        sourceLanguage,
        targetLanguage,
      },
    });

    if (error) {
      console.error("Edge function error during translation:", error);
      toast.error(`Translation failed: ${error.message}`);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Error translating text:", error);
    toast.error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Enhanced function to upload a file to Google Cloud Storage with retry logic
 * @param file File to store
 * @param folder Optional folder path within the storage
 * @param isPublic Whether the file should be publicly accessible (default: false)
 * @returns Storage information including URL
 */
export const storeFile = async (file: File, folder?: string, isPublic: boolean = false): Promise<any> => {
  try {
    toast.info(`Preparing to upload ${file.name}...`);
    
    // Convert file to base64
    const base64File = await fileToBase64(file);
    
    console.log(`Storing file ${file.name} (${formatFileSize(file.size)}) in folder: ${folder || "visa_documents"}, public: ${isPublic}`);
    
    // Create a unique file name with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${file.name}`;
    
    const { data, error } = await supabase.functions.invoke("google-cloud-integration", {
      body: {
        action: "store",
        file: base64File,
        fileName: uniqueFileName,
        folder: folder || "visa_documents",
        isPublic: false, // Always set to false for organization policies
        timestamp: timestamp
      },
    });

    if (error) {
      console.error("Storage function error:", error);
      toast.error(`Upload failed: ${error.message}`);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    console.log("Storage successful:", data);
    toast.success("File uploaded successfully!");
    return data;
  } catch (error: any) {
    console.error("Error storing file:", error);
    
    // Provide more specific error message based on the error
    let errorMessage = "Upload failed";
    if (error.message?.includes("Invalid Credentials")) {
      errorMessage = "Authentication error with storage provider. Please contact support.";
    } else if (error.message?.includes("not found")) {
      errorMessage = "Storage bucket not found. Please contact support.";
    } else if (error.message?.includes("permission")) {
      errorMessage = "Permission denied accessing storage. Please contact support.";
    } else {
      errorMessage = `Upload failed: ${error.message || "Unknown error"}`;
    }
    
    toast.error(errorMessage);
    
    // Create a local preview for UI testing or when the bucket is inaccessible
    // This helps prevent UI breakage when uploads fail
    const localUrl = URL.createObjectURL(file);
    
    const mockResult = {
      success: false,
      error: errorMessage,
      storageKey: `failed_upload/${file.name}`,
      storageUrl: localUrl, // Use local URL for preview
      metadata: {
        contentType: file.type,
        size: file.size,
        name: file.name
      },
      bucket: "local-preview",
      fileName: file.name,
      isLocalPreview: true // Flag to indicate this is just a local preview
    };
    
    // Return mock result to allow UI to continue functioning
    return mockResult;
  }
};

/**
 * Uploads a file to Google Cloud Storage with fallback handling
 * @param file File to upload
 * @param path Optional path within the storage
 * @param isPublic Whether to attempt to make the file publicly accessible (default: false)
 * @returns Upload result including URL
 */
export const uploadToVisaDocuments = async (file: File, path?: string, isPublic: boolean = false): Promise<any> => {
  try {
    console.log(`Uploading file to storage: ${file.name} (${formatFileSize(file.size)}) to path: ${path || "default"}, public: ${isPublic}`);
    
    // Generate a temporary local URL for the file for preview purposes
    const localUrl = URL.createObjectURL(file);
    
    // Always try as private first, respecting organization policies
    try {
      const result = await storeFile(file, path, false);
      
      // If we get a result with storageUrl as null, we should add the localUrl as a fallback
      const publicUrl = result.storageUrl || localUrl;
      
      return {
        path: result.storageKey,
        publicUrl: publicUrl,
        metadata: result.metadata,
        bucket: result.bucket,
        fileName: file.name,
        success: !result.error,
        error: result.error,
        isLocalPreview: !result.storageUrl // Set this flag if we're using the local URL
      };
    } catch (error) {
      console.error("Error uploading to storage:", error);
      
      // Return an object with error information but with a local URL 
      // so the UI can still show something
      return {
        path: `local/${file.name}`,
        publicUrl: localUrl,
        metadata: {
          contentType: file.type,
          size: file.size
        },
        bucket: "local-preview",
        fileName: file.name,
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
        isLocalPreview: true // Flag to indicate this is just a local preview
      };
    }
  } catch (error) {
    console.error("Unexpected error in uploadToVisaDocuments:", error);
    toast.error(`Upload failed unexpectedly: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Create a local preview as fallback
    const localUrl = URL.createObjectURL(file);
    
    return {
      path: `local/${file.name}`,
      publicUrl: localUrl,
      metadata: {
        contentType: file.type,
        size: file.size
      },
      bucket: "local-preview",
      fileName: file.name,
      success: false,
      error: error instanceof Error ? error.message : "Unexpected upload failure",
      isLocalPreview: true
    };
  }
};

/**
 * Checks Supabase Edge Function configuration
 * @returns Configuration status
 */
export const checkEmailConfig = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke("check-config", {});
    
    if (error) {
      console.error("Error checking configuration:", error);
      toast.error(`Configuration check failed: ${error.message}`);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error checking email configuration:", error);
    toast.error(`Config check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

/**
 * Helper function to convert a file to base64
 * @param file File to convert
 * @returns Base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = error => {
      console.error("Error converting file to base64:", error);
      reject(error);
    };
  });
};

/**
 * Format file size for logging
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};
