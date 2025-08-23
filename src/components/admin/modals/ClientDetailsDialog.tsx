import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "../StatusBadge";
import { VisaApplication, ClientInvoice } from "@/types/crm";
import {
  Edit,
  ExternalLink,
  Loader,
  FileIcon,
  Image as ImageIcon,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  fetchClientDocuments,
  fetchApplicationFiles,
  downloadDocument,
  deleteFile,
} from "@/utils/clientOperations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageViewerModal from "../../common/ImageViewerModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: VisaApplication | null;
  invoices: ClientInvoice[];
  onEditClient: (clientId: string) => void;
  onDataChanged?: () => Promise<void>;
}

type ClientDocument = {
  id: string;
  document_name: string;
  document_type: string;
  public_url: string;
  uploaded_at: string;
  storage_path?: string;
};

type FileData = {
  url: string;
  name: string;
  uploaded_at: string;
  storage_path?: string;
};

export const ClientDetailsDialog = ({
  open,
  onOpenChange,
  selectedCustomer,
  invoices,
  onEditClient,
  onDataChanged,
}: ClientDetailsDialogProps) => {
  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([]);
  console.log("🚀 ~ ClientDetailsDialog ~ clientDocuments:", clientDocuments)
  const [applicationFiles, setApplicationFiles] = useState<{
    passportFiles: FileData[];
    photoFiles: FileData[];
  }>({ passportFiles: [], photoFiles: [] });
  const [documentsFetching, setDocumentsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    path?: string;
    type: "document" | "passport" | "photo";
  } | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageViewerFile, setImageViewerFile] = useState<{
    url: string;
    name: string;
    type?: 'image' | 'pdf';
  } | null>(null);
  console.log("🚀 ~ ClientDetailsDialog ~ imageViewerFile:", imageViewerFile)

  useEffect(() => {
    if (open && selectedCustomer) {
      fetchData(selectedCustomer.id);
    }
  }, [open, selectedCustomer]);

  const fetchData = async (clientId: string) => {
    try {
      setDocumentsFetching(true);

      // Fetch regular documents
      const documents = await fetchClientDocuments(clientId);
      if (Array.isArray(documents)) {
        setClientDocuments(documents);
      } else {
        setClientDocuments([]);
      }

      // Fetch uploaded application files (passport and photos)
      const files = await fetchApplicationFiles(clientId);
      console.log("Application files fetched:", files);
      if (files) {
        // Make sure we're setting the state with the correct type
        setApplicationFiles({
          passportFiles: Array.isArray(files.passportFiles)
            ? files.passportFiles
            : [],
          photoFiles: Array.isArray(files.photoFiles) ? files.photoFiles : [],
        });
      } else {
        setApplicationFiles({ passportFiles: [], photoFiles: [] });
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Failed to load client data");
    } finally {
      setDocumentsFetching(false);
    }
  };

  // Function to validate and format URLs
  const getValidUrl = (url: string) => {
    if (!url) return "#";

    // Check if the URL is already using the Supabase storage URL format
    if (
      url.includes("storage.googleapis.com") ||
      url.includes("uspqgeozxmfmingjasro.supabase.co") ||
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    // If it's a relative path, construct the full Supabase storage URL
    return `${
      supabase.storage.from("visa-documents").getPublicUrl(url).data.publicUrl
    }`;
  };

  // Handle document preview
  const handlePreviewDocument = (url: string, fileName?: string) => {
    try {
      const validUrl = getValidUrl(url);
      console.log("🚀 ~ handlePreviewDocument ~ validUrl:", validUrl)
      
      // Get file extension from URL or fileName
      const getFileExtension = (str: string) => {
        const match = str.match(/\.([^.?]+)(\?|$)/);
        return match ? match[1].toLowerCase() : '';
      };
      
      const fileExtension = getFileExtension(validUrl);
      console.log("🚀 ~ handlePreviewDocument ~ fileExtension:", fileExtension);
      
      const isImageFile = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension);
      const isPdfFile = fileExtension === 'pdf';
      
      console.log("🚀 ~ handlePreviewDocument ~ isImageFile:", isImageFile, "isPdfFile:", isPdfFile);
      
      setImageViewerFile({
        url: validUrl,
        name: "Document",
        type: isPdfFile ? 'pdf' : isImageFile ? 'image' : 'pdf' // Default to PDF for unknown types
      });
      setImageViewerOpen(true);
    } catch (error) {
      console.error("Error previewing document:", error);
      toast.error("Unable to preview document");
    }
  };

  // Handle document download
  const handleDownloadDocument = (url: string, fileName: string) => {
    try {
      downloadDocument(getValidUrl(url), fileName);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Unable to download document");
    }
  };

  // Handle file delete initiation
  const handleDeleteClick = (fileInfo: {
    url: string;
    name: string;
    path?: string;
    type: "document" | "passport" | "photo";
  }) => {
    setSelectedFile(fileInfo);
    setDeleteDialogOpen(true);
  };

  // Handle file deletion
  const confirmDeleteFile = async () => {
    if (!selectedFile || !selectedCustomer) return;

    setDeletingFile(true);
    try {
      let success = false;
      const filePath = selectedFile.path || selectedFile.url;

      if (selectedFile.type === "document") {
        // Delete from client_documents table
        const { error } = await supabase
          .from("client_documents")
          .delete()
          .eq("public_url", selectedFile.url);

        if (error) throw error;
        success = true;
      } else {
        // For passport and photo files, we need to update the visa_applications JSON arrays
        success = await deleteFile(
          selectedCustomer.id,
          selectedFile.url,
          selectedFile.type === "passport" ? "passport_files" : "photo_files"
        );
      }

      if (success) {
        toast.success(`Successfully deleted ${selectedFile.name}`);
        // Refresh document data
        await fetchData(selectedCustomer.id);
        // Refresh parent data if needed
        if (onDataChanged) {
          await onDataChanged();
        }
      } else {
        toast.error(`Failed to delete ${selectedFile.name}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(
        `Error deleting file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDeletingFile(false);
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    }
  };

  if (!selectedCustomer) {
    return null;
  }

  const hasFiles =
    clientDocuments.length > 0 ||
    applicationFiles.passportFiles.length > 0 ||
    applicationFiles.photoFiles.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">
              Client Details
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <TabsTrigger value="details">Client Details</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger
                value="documents"
                className="relative"
                disabled={documentsFetching}
              >
                Documents
                {hasFiles && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {clientDocuments.length +
                      applicationFiles.passportFiles.length +
                      applicationFiles.photoFiles.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* === Client Details Tab === */}
            <TabsContent value="details" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-16 w-16 bg-primary/10 text-primary">
                  <AvatarFallback className="text-lg">
                    {`${selectedCustomer.first_name?.[0] || ""}${
                      selectedCustomer.last_name?.[0] || ""
                    }`}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-semibold">{`${
                    selectedCustomer.first_name || ""
                  } ${selectedCustomer.last_name || ""}`}</h3>
                  <p className="text-muted-foreground">
                    {selectedCustomer.email}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedCustomer.phone || "No phone provided"}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-3">Application Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    ["Reference ID:", selectedCustomer.reference_id || "N/A"],
                    [
                      "Status:",
                      <StatusBadge
                        status={selectedCustomer.status || "Pending"}
                      />,
                    ],
                    ["Service Type:", selectedCustomer.service_type],
                    ["Country:", selectedCustomer.country],
                    ["Visa Type:", selectedCustomer.visa_type || "Standard"],
                    [
                      "Travel Date:",
                      selectedCustomer.travel_date
                        ? format(
                            new Date(selectedCustomer.travel_date),
                            "MMM d, yyyy"
                          )
                        : "Not specified",
                    ],
                    [
                      "Travelers:",
                      `${selectedCustomer.adults || 1} Adults, ${
                        selectedCustomer.children || 0
                      } Children`,
                    ],
                    [
                      "Total Price:",
                      selectedCustomer.total_price
                        ? `﷼${selectedCustomer.total_price}`
                        : "N/A",
                    ],
                    [
                      "Created:",
                      selectedCustomer.created_at
                        ? format(
                            new Date(selectedCustomer.created_at),
                            "MMM d, yyyy"
                          )
                        : "N/A",
                    ],
                  ].map(([label, value], index) => (
                    <React.Fragment key={index}>
                      <div className="text-muted-foreground">{label}</div>
                      <div
                        className={
                          typeof value === "string"
                            ? "font-medium font-mono"
                            : ""
                        }
                      >
                        {value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* === Invoices Tab === */}
            <TabsContent value="invoices">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Invoice Information</h4>
                {invoices.filter((inv) => inv.client_id === selectedCustomer.id)
                  .length > 0 ? (
                  <div className="space-y-4">
                    {invoices
                      .filter((inv) => inv.client_id === selectedCustomer.id)
                      .map((invoice) => (
                        <div
                          key={invoice.id}
                          className="bg-background p-4 rounded border"
                        >
                          <div className="flex justify-between flex-wrap gap-2">
                            <span className="font-medium">
                              #{invoice.invoice_number}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium",
                                invoice.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : invoice.status === "Unpaid"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              )}
                            >
                              {invoice.status}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {invoice.issue_date
                              ? format(
                                  new Date(invoice.issue_date),
                                  "MMM d, yyyy"
                                )
                              : "No issue date"}
                          </div>
                          <div className="mt-2 flex justify-between items-center flex-wrap gap-2">
                            <span>
                              {invoice.service_description || "Visa Services"}
                            </span>
                            <span className="font-medium">
                              {invoice.currency || "﷼"}
                              {invoice.amount}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No invoices found for this client
                  </div>
                )}
              </div>
            </TabsContent>

            {/* === Documents Tab === */}
            <TabsContent value="documents">
              {documentsFetching ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-6">
                  {[
                    {
                      title: "Client Documents",
                      files: clientDocuments,
                      keyPrefix: "doc",
                      type: "document",
                    },
                    {
                      title: "Passports",
                      files: applicationFiles.passportFiles,
                      keyPrefix: "passport",
                      type: "passport",
                    },
                    {
                      title: "Photos",
                      files: applicationFiles.photoFiles,
                      keyPrefix: "photo",
                      type: "photo",
                    },
                  ].map(
                    ({ title, files, keyPrefix, type }) =>
                      files.length > 0 && (
                        <div key={title} className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium mb-2">{title}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {files.map((file, index) => (
                              <div
                                key={`${keyPrefix}-${index}`}
                                className="bg-background p-3 rounded border flex justify-between items-center hover:bg-gray-50 transition-colors flex-wrap"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                                  <div className="truncate">
                                    <div className="font-medium truncate">
                                      {file.document_name ||
                                        `${title} Document`}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {file.document_type}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {format(
                                        new Date(file.uploaded_at || ""),
                                        "MMM d, yyyy"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handlePreviewDocument(
                                        file.url || file.public_url,
                                        file.document_name ||
                                          `File_${index + 1}.pdf`
                                      )
                                    }
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDownloadDocument(
                                        file.url || file.public_url,
                                        file.document_name ||
                                          `File_${index + 1}.pdf`
                                      )
                                    }
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      handleDeleteClick({
                                        url: file.url || file.public_url,
                                        name:
                                          file.document_name ||
                                          `File_${index + 1}`,
                                        path: file.storage_path,
                                        type: "document",
                                      })
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete File Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFile?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingFile}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFile}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingFile}
            >
              {deletingFile ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImageViewerModal
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        fileUrl={imageViewerFile?.url || ""}
        fileAlt={imageViewerFile?.name || ""}
        title={imageViewerFile?.name || "Document"}
        fileType={imageViewerFile?.type}
      />
    </>
  );
};
