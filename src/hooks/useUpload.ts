// hooks/useUpload.ts
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uspqgeozxmfmingjasro.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzcHFnZW96eG1mbWluZ2phc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzMxOTYsImV4cCI6MjA1NjYwOTE5Nn0.MHVHyZ7PP5fbFcSRJm7XHHLgdsDUlEJ6pBusetfXoGo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  },
});

export const BUCKET_NAME = "visa_documents";

// Predefined folder constants for organization
export enum UPLOAD_FOLDERS {
  PASSPORTS = "passports",
}

// Upload function that can be used independently
const uploadImageToSupabase = async (
  file: File,
  folder: UPLOAD_FOLDERS = UPLOAD_FOLDERS.PASSPORTS
): Promise<string> => {
  console.log("🚀 ~ uploadImageToSupabase ~ file:", file);
  console.log("🚀 ~ uploadImageToSupabase ~ folder:", folder);
  // console.log("🚀 ~ SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🚀 ~ BUCKET_NAME:", BUCKET_NAME);

  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}.${fileExt}`; // Include folder in path

  console.log("🚀 ~ fileName:", fileName);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log("🚀 ~ upload data:", data);

  // Use Supabase's getPublicUrl method to get the correct URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  console.log("🚀 ~ publicUrl:", urlData.publicUrl);

  return urlData.publicUrl;
};

// Delete function that can be used independently
const deleteImageFromSupabase = async (fileUrl: string): Promise<void> => {
  // Extract filename from the public URL (including folder path)
  const urlParts = fileUrl.split("/");
  const bucketIndex = urlParts.findIndex((part) => part === BUCKET_NAME);
  const filePath = urlParts.slice(bucketIndex + 1).join("/"); // Get the full path after bucket name

  console.log("🚀 ~ deleteImageFromSupabase ~ filePath:", filePath);

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

export function useUploadImage() {
  return useMutation<string, Error, { file: File; folder?: UPLOAD_FOLDERS }>({
    mutationFn: ({ file, folder = UPLOAD_FOLDERS.PASSPORTS }) =>
      uploadImageToSupabase(file, folder),
    mutationKey: ["upload-image"],
  });
}

export function useDeleteImage() {
  return useMutation<void, Error, string>({
    mutationFn: deleteImageFromSupabase,
    mutationKey: ["delete-image"],
  });
}
