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
  console.log("🚀 ~ ClientDetailsDialog ~ clientDocuments:", clientDocuments);
  const [applicationFiles, setApplicationFiles] = useState<{
    passportFiles: FileData[];
    photoFiles: FileData[];
    idFiles: FileData[];
    salaryProofs: FileData[];
  }>({ passportFiles: [], photoFiles: [], idFiles: [], salaryProofs: [] });
  console.log("🚀 ~ ClientDetailsDialog ~ applicationFiles:", applicationFiles)
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
    type?: "image" | "pdf";
  } | null>(null);
  console.log("🚀 ~ ClientDetailsDialog ~ imageViewerFile:", imageViewerFile);

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
          idFiles: Array.isArray(files.idFiles) ? files.idFiles : [],
          salaryProofs: Array.isArray(files.salaryProofs)
            ? files.salaryProofs
            : [],
        });
      } else {
        setApplicationFiles({
          passportFiles: [],
          photoFiles: [],
          idFiles: [],
          salaryProofs: [],
        });
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
      console.log("🚀 ~ handlePreviewDocument ~ validUrl:", validUrl);

      // Get file extension from URL or fileName
      const getFileExtension = (str: string) => {
        const match = str.match(/\.([^.?]+)(\?|$)/);
        return match ? match[1].toLowerCase() : "";
      };

      const fileExtension = getFileExtension(validUrl);
      console.log("🚀 ~ handlePreviewDocument ~ fileExtension:", fileExtension);

      const isImageFile = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "svg",
      ].includes(fileExtension);
      const isPdfFile = fileExtension === "pdf";

      console.log(
        "🚀 ~ handlePreviewDocument ~ isImageFile:",
        isImageFile,
        "isPdfFile:",
        isPdfFile
      );

      setImageViewerFile({
        url: validUrl,
        name: "Document",
        type: isPdfFile ? "pdf" : isImageFile ? "image" : "pdf", // Default to PDF for unknown types
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
    applicationFiles.photoFiles.length > 0 ||
    applicationFiles.idFiles.length > 0 ||
    applicationFiles.salaryProofs.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-6xl max-h-[95vh] p-0 min-h-[80vh] overflow-y-auto">
          <div className="flex flex-col h-full">
            <DialogHeader className="px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DialogTitle className="text-xl md:text-2xl font-semibold">
                Client Details
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <TabsTrigger value="details" className="text-xs sm:text-sm">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="text-xs sm:text-sm">
                    Invoices
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="relative text-xs sm:text-sm"
                    disabled={documentsFetching}
                  >
                    Documents
                    {hasFiles && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {clientDocuments.length +
                          applicationFiles.passportFiles.length +
                          applicationFiles.photoFiles.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* === Client Details Tab === */}
                <TabsContent value="details" className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border">
                    <Avatar className="h-16 w-16 bg-primary/10 text-primary border-2 border-primary/20">
                      <AvatarFallback className="text-lg font-semibold">
                        {`${selectedCustomer.first_name?.[0] || ""}${
                          selectedCustomer.last_name?.[0] || ""
                        }`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">{`${
                        selectedCustomer.first_name || ""
                      } ${selectedCustomer.last_name || ""}`}</h3>
                      <p className="text-muted-foreground text-sm">
                        {selectedCustomer.email}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {selectedCustomer.phone || "No phone provided"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-4 text-foreground">
                      Application Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {[
                        [
                          "Reference ID:",
                          selectedCustomer.reference_id || "N/A",
                        ],
                        [
                          "Status:",
                          <StatusBadge
                            key="status"
                            status={selectedCustomer.status || "Pending"}
                          />,
                        ],
                        ["Service Type:", selectedCustomer.service_type],
                        ["Country:", selectedCustomer.country],
                        [
                          "Visa Type:",
                          selectedCustomer.visa_type || "Standard",
                        ],
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
                        <div
                          key={index}
                          className="bg-background p-3 rounded border space-y-1"
                        >
                          <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            {label}
                          </div>
                          <div
                            className={cn(
                              "font-medium",
                              typeof value === "string" && "font-mono text-sm"
                            )}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* === Invoices Tab === */}
                <TabsContent value="invoices">
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-4 text-foreground">
                      Invoice Information
                    </h4>
                    {invoices.filter(
                      (inv) => inv.client_id === selectedCustomer.id
                    ).length > 0 ? (
                      <div className="space-y-4">
                        {invoices
                          .filter(
                            (inv) => inv.client_id === selectedCustomer.id
                          )
                          .map((invoice) => (
                            <div
                              key={invoice.id}
                              className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold text-lg">
                                      #{invoice.invoice_number}
                                    </span>
                                    <span
                                      className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium",
                                        invoice.status === "Paid"
                                          ? "bg-green-100 text-green-800 border border-green-200"
                                          : invoice.status === "Unpaid"
                                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                                          : "bg-red-100 text-red-800 border border-red-200"
                                      )}
                                    >
                                      {invoice.status}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {invoice.issue_date
                                      ? format(
                                          new Date(invoice.issue_date),
                                          "MMM d, yyyy"
                                        )
                                      : "No issue date"}
                                  </div>
                                  <div className="text-sm">
                                    {invoice.service_description ||
                                      "Visa Services"}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-xl font-bold text-primary">
                                    {invoice.currency || "﷼"}
                                    {invoice.amount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-lg">
                          No invoices found for this client
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Invoices will appear here once created
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* === Documents Tab === */}
                <TabsContent value="documents">
                  {documentsFetching ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">
                        Loading documents...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {[
                        {
                          title: "Client Documents",
                          files: clientDocuments,
                          keyPrefix: "doc",
                          type: "document",
                          icon: FileIcon,
                          color: "blue",
                        },
                        {
                          title: "Passports",
                          files: applicationFiles.passportFiles,
                          keyPrefix: "passport",
                          type: "passport",
                          icon: FileIcon,
                          color: "green",
                        },
                        {
                          title: "Photos",
                          files: applicationFiles.photoFiles,
                          keyPrefix: "photo",
                          type: "photo",
                          icon: ImageIcon,
                          color: "purple",
                        },
                        {
                          title: "ID Documents",
                          files: applicationFiles.idFiles,
                          keyPrefix: "id",
                          type: "id",
                          icon: ImageIcon,
                          color: "purple",
                        },
                        {
                          title: "Salary Proofs",
                          files: applicationFiles.salaryProofs,
                          keyPrefix: "salary",
                          type: "salary",
                          icon: ImageIcon,
                          color: "purple",
                        },
                      ].map(
                        ({
                          title,
                          files,
                          keyPrefix,
                          type,
                          icon: Icon,
                          color,
                        }) =>
                          files.length > 0 && (
                            <div
                              key={title}
                              className="bg-muted/50 p-4 rounded-lg border"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div
                                  className={cn(
                                    "p-2 rounded-lg",
                                    color === "blue" &&
                                      "bg-blue-100 text-blue-600",
                                    color === "green" &&
                                      "bg-green-100 text-green-600",
                                    color === "purple" &&
                                      "bg-purple-100 text-purple-600"
                                  )}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-foreground">
                                  {title}
                                </h4>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  {files.length} file
                                  {files.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {files.map((file, index) => (
                                  <div
                                    key={`${keyPrefix}-${index}`}
                                    className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 group"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <div className="font-medium text-sm truncate">
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
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 sm:flex-none"
                                        onClick={() =>
                                          handlePreviewDocument(
                                            file.url || file.public_url,
                                            file.document_name ||
                                              `File_${index + 1}.pdf`
                                          )
                                        }
                                      >
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 sm:flex-none"
                                        onClick={() =>
                                          handleDownloadDocument(
                                            file.url || file.public_url,
                                            file.document_name ||
                                              `File_${index + 1}.pdf`
                                          )
                                        }
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
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
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                      )}
                      {!hasFiles && (
                        <div className="text-center py-12">
                          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <FileIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground text-lg">
                            No documents found
                          </p>
                          <p className="text-muted-foreground text-sm mt-1">
                            Documents will appear here once uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete File Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Delete File</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{selectedFile?.name}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              disabled={deletingFile}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFile}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingFile}
            >
              {deletingFile ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete File
                </>
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
