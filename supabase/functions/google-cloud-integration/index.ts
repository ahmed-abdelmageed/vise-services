
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Define the structure of our request body
interface GoogleCloudRequest {
  action: "analyze" | "translate" | "store";
  file?: string; // Base64 encoded file or URL
  text?: string; // Text to translate
  sourceLanguage?: string;
  targetLanguage?: string;
  fileName?: string;
  folder?: string; // Optional folder path for storage
  isPublic?: boolean; // Whether to attempt to make the file publicly accessible
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Verify request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        }
      );
    }

    // Get the Google Cloud credentials from environment variables
    const googleCloudCredentials = Deno.env.get("GOOGLE_CLOUD_CREDENTIALS");
    
    if (!googleCloudCredentials) {
      console.error("Google Cloud credentials not configured");
      return new Response(
        JSON.stringify({ error: "Google Cloud credentials not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse credentials 
    let credentials;
    try {
      credentials = JSON.parse(googleCloudCredentials);
      console.log("Successfully parsed Google Cloud credentials");
    } catch (error) {
      console.error("Error parsing Google Cloud credentials:", error);
      return new Response(
        JSON.stringify({ error: "Invalid Google Cloud credentials format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Ensure we have a project_id for GCS operations
    if (!credentials.project_id) {
      console.log("No project_id found in credentials, attempting to extract from token or service account email...");
      try {
        // Try to extract project_id from token audience (aud) field
        if (credentials.access_token) {
          const tokenParts = credentials.access_token.split('.');
          if (tokenParts.length === 3) {
            try {
              // Decode the JWT payload (middle part)
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload && payload.aud) {
                // The aud field might be the project ID or URL containing it
                let projectId;
                if (Array.isArray(payload.aud)) {
                  projectId = payload.aud[0];
                } else {
                  projectId = payload.aud;
                }
                
                // Extract project ID from URL pattern or use as is
                const projectUrlMatch = projectId.match(/([^/]+)\.googleapis\.com/);
                credentials.project_id = projectUrlMatch ? projectUrlMatch[1] : projectId;
                console.log("Extracted project_id from token:", credentials.project_id);
              }
            } catch (decodeError) {
              console.error("Failed to decode token payload:", decodeError);
            }
          }
        }
      } catch (tokenError) {
        console.error("Error extracting project_id from token:", tokenError);
      }
      
      // If still no project_id, try alternative approaches or fallback values
      if (!credentials.project_id && credentials.client_email) {
        // Try to extract from service account email (e.g. service@project-id.iam.gserviceaccount.com)
        const emailMatch = credentials.client_email.match(/^[^@]+@([^.]+)\./);
        if (emailMatch && emailMatch[1]) {
          credentials.project_id = emailMatch[1];
          console.log("Extracted project_id from client_email:", credentials.project_id);
        }
      }
      
      // Final fallback - use a hardcoded project ID if available in environment
      if (!credentials.project_id) {
        const fallbackProjectId = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID");
        if (fallbackProjectId) {
          credentials.project_id = fallbackProjectId;
          console.log("Using fallback project_id from environment variable");
        } else {
          // If we still don't have a project ID, try a static value as last resort
          credentials.project_id = "visa-system-391206"; // This is a last resort fallback
          console.log("Using hardcoded fallback project_id:", credentials.project_id);
        }
      }
    }

    // Verify we have a project ID by this point
    if (!credentials.project_id) {
      console.error("Could not determine Google Cloud project ID from any available source");
      return new Response(
        JSON.stringify({ 
          error: "Project ID is required for Google Cloud Storage operations",
          details: "Could not extract project ID from credentials or token" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse request body
    let requestData: GoogleCloudRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { action } = requestData;

    // Log the incoming request (without the full file data to avoid huge logs)
    console.log(`Processing ${action} request:`, {
      action,
      fileName: requestData.fileName,
      folder: requestData.folder,
      isPublic: requestData.isPublic,
      filePresent: requestData.file ? "Yes (base64 data)" : "No",
      fileLength: requestData.file ? requestData.file.length : 0,
      projectId: credentials.project_id // Log the project ID being used
    });

    // Handle different actions
    let googleCloudResponse;

    switch (action) {
      case "analyze":
        // Implement document analysis using Vision API
        const { file, fileName } = requestData;
        if (!file) {
          return new Response(
            JSON.stringify({ error: "No file provided for analysis" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        // Here we'd normally call the Vision API, but for now we'll simulate a response
        googleCloudResponse = {
          success: true,
          message: "Document analysis completed",
          fileName,
          results: {
            textDetection: "Sample detected text",
            documentClassification: "Passport",
            confidence: 0.95,
          },
          // In a real implementation, this would include actual Vision API results
        };
        break;
        
      case "translate":
        // Translation API implementation
        const { text, sourceLanguage, targetLanguage } = requestData;
        
        if (!text || !targetLanguage) {
          return new Response(
            JSON.stringify({ error: "Missing text or target language for translation" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }
        
        try {
          console.log(`Translating text from ${sourceLanguage || 'auto'} to ${targetLanguage}`);
          
          // Call Google Translate API
          const apiEndpoint = "https://translation.googleapis.com/language/translate/v2";
          const params = new URLSearchParams({
            q: text,
            target: targetLanguage,
            format: "text",
          });
          
          // Add source language if specified
          if (sourceLanguage) {
            params.append("source", sourceLanguage);
          }
          
          // Make request to Google Cloud Translation API
          const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${credentials.access_token}`,
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Translation API error: ${JSON.stringify(errorData)}`);
          }
          
          const translationResponse = await response.json();
          
          googleCloudResponse = {
            success: true,
            message: "Translation completed successfully",
            originalText: text,
            translatedText: translationResponse.data.translations[0].translatedText,
            detectedSourceLanguage: translationResponse.data.translations[0].detectedSourceLanguage,
            targetLanguage: targetLanguage,
          };
        } catch (error) {
          console.error("Error in translation:", error);
          return new Response(
            JSON.stringify({ 
              error: "Translation failed", 
              details: error.message 
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
        break;
        
      case "store":
        // Store file using Google Cloud Storage
        const fileData = requestData.file;
        const fileNameStore = requestData.fileName;
        const folder = requestData.folder || "visa_documents";
        const isPublic = false; // Force this to false since we can't make public files due to org policy
        
        if (!fileData || !fileNameStore) {
          console.error("Missing file data or file name for storage");
          return new Response(
            JSON.stringify({ error: "Missing file data or file name for storage" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        try {
          // Parse the base64 file data
          let base64Data;
          let fileType = "application/octet-stream"; // Default content type
          
          try {
            // Check if the file data is a proper base64 data URL
            if (fileData.startsWith('data:')) {
              const matches = fileData.match(/^data:([^;]+);base64,(.+)$/);
              if (matches && matches.length === 3) {
                fileType = matches[1];
                base64Data = matches[2];
              } else {
                throw new Error("Invalid base64 data URL format");
              }
            } else {
              // Assume it's already a base64 string without the data URL prefix
              base64Data = fileData;
            }
            
            if (!base64Data) {
              throw new Error("Could not extract base64 data");
            }
          } catch (error) {
            console.error("Error parsing base64 data:", error);
            return new Response(
              JSON.stringify({ error: "Invalid file data format", details: error.message }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
              }
            );
          }
          
          // Convert base64 to binary
          const byteString = atob(base64Data);
          const byteArray = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
          }
          
          // Generate a unique storage key
          const timestamp = new Date().getTime();
          const fileExt = fileNameStore.split('.').pop() || 'file';
          const uniqueId = crypto.randomUUID();
          const storageKey = `${folder}/${uniqueId}_${timestamp}.${fileExt}`;
          
          // Set up the bucket name - ALWAYS use 'gvs-client-files'
          const bucketName = "gvs-client-files";
          
          console.log(`Uploading file ${fileNameStore} (${formatFileSize(byteArray.length)}) to bucket: ${bucketName}, path: ${storageKey}, content-type: ${fileType}, project: ${credentials.project_id}, isPublic: ${isPublic}`);
          
          // For uploads to a non-public bucket, we need to use the storage.objects.insert method
          // with proper authentication
          
          // Upload to Google Cloud Storage using the Storage API
          const storageEndpoint = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o`;
          
          // Prepare the upload URL with query parameters
          const uploadUrl = `${storageEndpoint}?uploadType=media&name=${encodeURIComponent(storageKey)}`;
          
          // Prepare headers with authentication
          const headers = {
            "Content-Type": fileType,
            "Authorization": `Bearer ${credentials.access_token}`,
            "X-Goog-Project-Id": credentials.project_id, // Also add project ID in header
          };
          
          // Upload the file to Google Cloud Storage
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers,
            body: byteArray,
          });
          
          // Detailed logging of the response status and headers
          console.log(`GCS API response status: ${uploadResponse.status}`);
          console.log("GCS API response headers:", Object.fromEntries([...uploadResponse.headers.entries()]));
          
          if (!uploadResponse.ok) {
            let errorText = await uploadResponse.text();
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { text: errorText };
            }
            
            console.error(`GCS API error (${uploadResponse.status}):`, errorData);
            throw new Error(`Google Cloud Storage upload error: ${errorText}`);
          }
          
          const uploadResultData = await uploadResponse.json();
          console.log("GCS upload success, received metadata:", uploadResultData);
          
          // Since we can't make the object public due to organization policies,
          // we'll generate a signed URL or use a private reference
          // For now, we'll just return the storage path
          const storageUrl = `gs://${bucketName}/${storageKey}`;
          console.log(`Created storage path: ${storageUrl}`);
          
          googleCloudResponse = {
            success: true,
            message: "File successfully stored in Google Cloud Storage (private)",
            fileName: fileNameStore,
            storageKey: storageKey,
            storageUrl: storageUrl, // This is a storage path, not a public URL
            bucket: bucketName,
            isPublic: false, // Always false due to org policy
            metadata: uploadResultData
          };
          
          console.log(`Successfully uploaded file to Google Cloud Storage: ${storageUrl}`);
        } catch (error) {
          console.error("Error storing file in Google Cloud Storage:", error);
          return new Response(
            JSON.stringify({ 
              error: "Failed to store file in Google Cloud Storage", 
              details: error.message,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action specified" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
    }

    console.log(`Successfully processed ${action} request`);

    // Return the response
    return new Response(
      JSON.stringify(googleCloudResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error in Google Cloud Integration function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Format file size for logging
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
}
