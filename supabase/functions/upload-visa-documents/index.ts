
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the Google Cloud credentials
    const googleCloudCredentials = Deno.env.get("GOOGLE_CLOUD_CREDENTIALS");
    if (!googleCloudCredentials) {
      return new Response(
        JSON.stringify({
          error: "Google Cloud credentials not configured",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse Google Cloud credentials
    let credentials;
    try {
      credentials = JSON.parse(googleCloudCredentials);
      console.log("Successfully parsed Google Cloud credentials");
    } catch (error) {
      console.error("Error parsing Google Cloud credentials:", error);
      return new Response(
        JSON.stringify({
          error: "Invalid Google Cloud credentials format",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Check if request is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({
          error: "Request must be multipart/form-data",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const applicationId = formData.get("applicationId") as string;
    const fileType = formData.get("fileType") as string;
    const travelerIndex = formData.get("travelerIndex") as string;

    console.log(`Processing upload: applicationId=${applicationId}, fileType=${fileType}, travelerIndex=${travelerIndex}, fileName=${file?.name}, fileSize=${file?.size}`);

    if (!file || !applicationId || !fileType) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: file, applicationId, or fileType",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const fileExt = file.name.split(".").pop();
    const fileName = `${applicationId}/${fileType}_${travelerIndex}_${timestamp}.${fileExt}`;
    const bucketName = "gvs-client-files"; // Updated bucket name

    // Convert file to arrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    
    // Upload file to Google Cloud Storage
    try {
      // Determine content type
      const contentType = file.type || `application/${fileExt}`;
      
      console.log(`Uploading file to GCS: ${fileName} (${file.size} bytes) with content type: ${contentType}`);
      
      // Prepare the upload URL with query parameters
      const storageEndpoint = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o`;
      const uploadUrl = `${storageEndpoint}?uploadType=media&name=${encodeURIComponent(fileName)}`;
      
      // Upload the file to Google Cloud Storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          "Authorization": `Bearer ${credentials.access_token}`,
        },
        body: fileBytes,
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { text: errorText };
        }
        console.error("GCS upload error response:", errorData);
        throw new Error(`Google Cloud Storage upload error: ${JSON.stringify(errorData)}`);
      }
      
      const uploadResultData = await uploadResponse.json();
      console.log("GCS upload successful:", uploadResultData);
      
      // Create the public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      
      console.log(`Successfully uploaded file to Google Cloud Storage: ${publicUrl}`);
      
      // Create the file info object
      const fileInfo = {
        path: fileName,
        url: publicUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        bucket: bucketName,
        uploaded_at: new Date().toISOString(),
      };

      console.log("File info:", fileInfo);

      // Retrieve the current visa application
      const { data: appData, error: appError } = await supabase
        .from("visa_applications")
        .select(fileType === "passport" ? "passport_files" : "photo_files")
        .eq("id", applicationId)
        .single();

      if (appError) {
        console.error("Error retrieving application:", appError);
        return new Response(
          JSON.stringify({
            error: `Failed to retrieve application: ${appError.message}`,
            fileInfo,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      // Prepare the update object with existing files plus new one
      let updateObj = {};
      if (fileType === "passport") {
        const currentFiles = appData.passport_files || [];
        updateObj = { passport_files: [...currentFiles, fileInfo] };
      } else {
        const currentFiles = appData.photo_files || [];
        updateObj = { photo_files: [...currentFiles, fileInfo] };
      }

      // Update the database
      const { error: updateError } = await supabase
        .from("visa_applications")
        .update(updateObj)
        .eq("id", applicationId);

      if (updateError) {
        console.error("Error updating application:", updateError);
        return new Response(
          JSON.stringify({
            error: `Failed to update application with file info: ${updateError.message}`,
            fileInfo,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `File uploaded successfully to Google Cloud Storage`,
          fileInfo,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Google Cloud Storage upload error:", error);
      return new Response(
        JSON.stringify({
          error: `Failed to upload file to Google Cloud Storage: ${error.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: `Unexpected error: ${error.message}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
