import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Function to delete a client by ID
export const deleteClient = async (clientId: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete client with ID: ${clientId}`);

    // First get the client data to find associated files
    const { data: clientData, error: fetchError } = await supabase
      .from("visa_applications")
      .select("*")
      .eq("id", clientId)
      .single();

    if (fetchError) {
      console.error("Error fetching client data:", fetchError);
      return false;
    }

    // Delete passport files from storage if they exist
    if (clientData.passport_files) {
      const passportFiles = Array.isArray(clientData.passport_files)
        ? clientData.passport_files
        : [];

      for (const file of passportFiles) {
        if (typeof file === "string") {
          console.log(`Deleting passport file: ${file}`);
          const { error: deleteFileError } = await supabase.storage
            .from("visa-documents")
            .remove([file]);

          if (deleteFileError) {
            console.error(
              `Error deleting passport file ${file}:`,
              deleteFileError
            );
          }
        }
      }
    }

    // Delete photo files from storage if they exist
    if (clientData.photo_files) {
      const photoFiles = Array.isArray(clientData.photo_files)
        ? clientData.photo_files
        : [];

      for (const file of photoFiles) {
        if (typeof file === "string") {
          console.log(`Deleting photo file: ${file}`);
          const { error: deleteFileError } = await supabase.storage
            .from("visa-documents")
            .remove([file]);

          if (deleteFileError) {
            console.error(
              `Error deleting photo file ${file}:`,
              deleteFileError
            );
          }
        }
      }
    }

    // After deleting files, delete the client record from the database
    const { error: deleteError } = await supabase
      .from("visa_applications")
      .delete()
      .eq("id", clientId);

    if (deleteError) {
      console.error("Error deleting client:", deleteError);
      toast.error(`Failed to delete client: ${deleteError.message}`);
      return false;
    }

    console.log(`Successfully deleted client with ID: ${clientId}`);
    return true;
  } catch (error) {
    console.error("Unexpected error during client deletion:", error);
    toast.error(
      `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return false;
  }
};

// Function to delete multiple clients
export const bulkDeleteClients = async (
  clientIds: string[]
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!clientIds || clientIds.length === 0) {
      return { success: false, message: "No client IDs provided." };
    }

    console.log(
      `Attempting to delete clients with IDs: ${clientIds.join(", ")}`
    );

    // Loop through each client ID and delete it with its associated files
    let successCount = 0;
    let failCount = 0;

    for (const clientId of clientIds) {
      const deleted = await deleteClient(clientId);
      if (deleted) {
        successCount++;
      } else {
        failCount++;
      }
    }

    if (failCount > 0) {
      const message = `Successfully deleted ${successCount} clients, failed to delete ${failCount} clients.`;
      toast.warning(message);
      return { success: successCount > 0, message };
    }

    const message = `Successfully deleted ${successCount} clients.`;
    toast.success(message);
    return { success: true, message };
  } catch (error) {
    console.error("Unexpected error during bulk client deletion:", error);
    const message = `An unexpected error occurred: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    toast.error(message);
    return { success: false, message };
  }
};

// Function to fetch client documents
export const fetchClientDocuments = async (clientId: string) => {
  try {
    console.log(`Fetching documents for client: ${clientId}`);
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_id", clientId);

    if (error) {
      console.error("Error fetching client documents:", error);
      toast.error(`Error loading documents: ${error.message}`);
      return [];
    }

    console.log(
      `Retrieved ${data?.length || 0} documents for client: ${clientId}`
    );
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching client documents:", error);
    toast.error(
      `Unexpected error loading documents: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return [];
  }
};

export const fetchApplicationFiles = async (clientId: string) => {
  try {
    console.log(`Fetching application files for client: ${clientId}`);
    const { data, error } = await supabase
      .from("visa_applications")
      .select("passport_files, photo_files, id_files, salary_proof, created_at")
      .eq("id", clientId)
      .single();

    if (error) {
      console.error("Error fetching application files:", error);
      toast.error(`Error loading files: ${error.message}`);
      return {
        passportFiles: [],
        photoFiles: [],
        idFiles: [],
        salaryProofs: [],
      };
    }

    const createdAt = data?.created_at || new Date().toISOString();

    // Process passport files
    const passportFiles = [];
    if (data?.passport_files && Array.isArray(data.passport_files)) {
      for (let i = 0; i < data.passport_files.length; i++) {
        const file = data.passport_files[i];
        if (typeof file === "string") {
          passportFiles.push({
            url: file,
            name: `passport_${i + 1}`,
            uploaded_at: createdAt,
          });
        }
      }
    }

    // Process photo files
    const photoFiles = [];
    if (data?.photo_files && Array.isArray(data.photo_files)) {
      for (let i = 0; i < data.photo_files.length; i++) {
        const file = data.photo_files[i];
        if (typeof file === "string") {
          photoFiles.push({
            url: file,
            name: `photo_${i + 1}`,
            uploaded_at: createdAt,
          });
        }
      }
    }

    // Process ID files
    const idFiles = [];
    if (data?.id_files && Array.isArray(data.id_files)) {
      for (let i = 0; i < data.id_files.length; i++) {
        const file = data.id_files[i];
        if (typeof file === "string") {
          idFiles.push({
            url: file,
            name: `id_${i + 1}`,
            uploaded_at: createdAt,
          });
        }
      }
    }

    // Process salary proofs
    const salaryProofs = [];
    if (data?.salary_proof && Array.isArray(data.salary_proof)) {
      for (let i = 0; i < data.salary_proof.length; i++) {
        const file = data.salary_proof[i];
        if (typeof file === "string") {
          salaryProofs.push({
            url: file,
            name: `salary_proof_${i + 1}`,
            uploaded_at: createdAt,
          });
        }
      }
    }

    console.log(
      `Retrieved ${passportFiles.length} passport files and ${photoFiles.length} photo files`
    );
    return { passportFiles, photoFiles, idFiles, salaryProofs };
  } catch (error) {
    console.error("Unexpected error fetching application files:", error);
    toast.error(
      `Unexpected error loading files: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return { passportFiles: [], photoFiles: [], idFiles: [], salaryProofs: [] };
  }
};

export const bulkUpdateClientStatus = async (
  clientIds: string[],
  newStatus: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!clientIds || clientIds.length === 0) {
      return { success: false, message: "No client IDs provided." };
    }

    console.log(
      `Attempting to update status for clients with IDs: ${clientIds.join(
        ", "
      )}`
    );

    const { error } = await supabase
      .from("visa_applications")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .in("id", clientIds);

    if (error) {
      console.error("Error updating client status:", error);
      toast.error(`Failed to update client status: ${error.message}`);
      return {
        success: false,
        message: `Failed to update client status: ${error.message}`,
      };
    }

    console.log(
      `Successfully updated status for clients with IDs: ${clientIds.join(
        ", "
      )}`
    );
    return { success: true, message: "Client status updated successfully." };
  } catch (error) {
    console.error("Unexpected error during bulk status update:", error);
    const message = `An unexpected error occurred: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    toast.error(message);
    return { success: false, message };
  }
};

// Function to delete a file from a client's passport_files or photo_files array
export const deleteFile = async (
  clientId: string,
  fileUrl: string,
  fileType: "passport_files" | "photo_files"
): Promise<boolean> => {
  try {
    console.log(
      `Attempting to delete ${fileType} for client ${clientId}: ${fileUrl}`
    );

    // First, get the current file array
    const { data, error: fetchError } = await supabase
      .from("visa_applications")
      .select(fileType)
      .eq("id", clientId)
      .single();

    if (fetchError) {
      console.error(`Error fetching ${fileType}:`, fetchError);
      return false;
    }

    if (!data || !data[fileType] || !Array.isArray(data[fileType])) {
      console.error(`No ${fileType} found for client ${clientId}`);
      return false;
    }

    // Filter out the file to delete
    const currentFiles = data[fileType] as string[];
    const updatedFiles = currentFiles.filter((file) => file !== fileUrl);

    // If the file wasn't found in the array, return false
    if (currentFiles.length === updatedFiles.length) {
      console.error(
        `File ${fileUrl} not found in ${fileType} for client ${clientId}`
      );
      return false;
    }

    // Update the database with the new file array
    const updatePayload = {
      [fileType]: updatedFiles,
      updated_at: new Date().toISOString(),
    };
    const { error: updateError } = await supabase
      .from("visa_applications")
      .update(updatePayload)
      .eq("id", clientId);

    if (updateError) {
      console.error(`Error updating ${fileType}:`, updateError);
      return false;
    }

    // Now delete the actual file from storage
    // Extract the file path from the URL
    let filePath = fileUrl;
    const storageUrl =
      "https://uspqgeozxmfmingjasro.supabase.co/storage/v1/object/public/visa-documents/";
    if (fileUrl.startsWith(storageUrl)) {
      filePath = fileUrl.substring(storageUrl.length);
    }

    const { error: storageError } = await supabase.storage
      .from("visa-documents")
      .remove([filePath]);

    if (storageError) {
      console.error(
        `Error deleting file from storage: ${filePath}`,
        storageError
      );
      // We'll still return true since the database was updated successfully
      console.warn(
        `File entry removed from database but file may still exist in storage: ${filePath}`
      );
    }

    console.log(
      `Successfully deleted ${fileType} for client ${clientId}: ${fileUrl}`
    );
    return true;
  } catch (error) {
    console.error(`Error deleting ${fileType}:`, error);
    return false;
  }
};

// New function to download a document from the given URL
export const downloadDocument = async (
  url: string,
  fileName: string
): Promise<boolean> => {
  try {
    console.log(`Attempting to download document: ${fileName} from ${url}`);

    // Create an anchor element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");

    // Append to the document body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error(`Error downloading document ${fileName}:`, error);
    toast.error(`Failed to download ${fileName}`);
    return false;
  }
};

// Function to handle document preview
export const previewDocument = (url: string): void => {
  window.open(url, "_blank");
};
