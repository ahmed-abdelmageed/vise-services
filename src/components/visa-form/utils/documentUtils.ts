
import { UploadedFiles } from "../types";
import { toast } from "sonner";
import { supabase, SUPABASE_API_URL, SUPABASE_ANON_KEY } from "@/integrations/supabase/client";

// Helper function to convert file to data URL for preview and backup
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadDocuments = async (appId: string, uploadedFiles: UploadedFiles) => {
  const uploadResults = {
    passports: [] as any[],
    photos: [] as any[]
  };
  
  for (let i = 0; i < uploadedFiles.passports.length; i++) {
    const passportFile = uploadedFiles.passports[i];
    if (!passportFile) continue;

    try {
      const formData = new FormData();
      formData.append('file', passportFile);
      formData.append('applicationId', appId);
      formData.append('fileType', 'passport');
      formData.append('travelerIndex', i.toString());

      console.log(`Uploading passport for traveler ${i} with application ID ${appId}`);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(`${SUPABASE_API_URL}/functions/v1/upload-visa-documents`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Failed to upload passport:", responseData);
        toast.error(`Error uploading passport for traveller ${i + 1}`);
      } else {
        console.log(`Passport ${i + 1} uploaded successfully:`, responseData);
        uploadResults.passports.push(responseData.fileInfo);
      }
    } catch (error) {
      console.error(`Error uploading passport file for traveller ${i}:`, error);
      toast.error(`Error uploading passport for traveller ${i + 1}`);
    }
  }

  for (let i = 0; i < uploadedFiles.photos.length; i++) {
    const photoFile = uploadedFiles.photos[i];
    if (!photoFile) continue;

    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('applicationId', appId);
      formData.append('fileType', 'photo');
      formData.append('travelerIndex', i.toString());

      console.log(`Uploading photo for traveler ${i} with application ID ${appId}`);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(`${SUPABASE_API_URL}/functions/v1/upload-visa-documents`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Failed to upload photo:", responseData);
        toast.error(`Error uploading photo for traveller ${i + 1}`);
      } else {
        console.log(`Photo ${i + 1} uploaded successfully:`, responseData);
        uploadResults.photos.push(responseData.fileInfo);
      }
    } catch (error) {
      console.error(`Error uploading photo file for traveller ${i}:`, error);
      toast.error(`Error uploading photo for traveller ${i + 1}`);
    }
  }

  return uploadResults;
};
