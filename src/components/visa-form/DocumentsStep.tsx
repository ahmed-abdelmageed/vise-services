import React, { useState, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Check,
  AlertCircle,
  FileText,
  Image,
  Loader2,
  User,
  IdCardIcon,
  PanelTopInactiveIcon,
} from "lucide-react";
import { toast } from "sonner";
import { StepProps } from "./types";
// import { uploadToVisaDocuments } from "@/utils/googleCloudService";
import {
  useUploadImage,
  useDeleteImage,
  UPLOAD_FOLDERS,
} from "@/hooks/useUpload";
import { useLanguage } from "@/contexts/LanguageContext";

export const DocumentsStep = ({
  formData,
  setFormData,
  travellers,
  setTravellers,
  travelDate,
  setTravelDate,
  uploadedFiles,
  setUploadedFiles,
  handleNextStep,
  handlePrevStep,
  visaType,
  selectedService,
  serviceType,
  appointmentType,
  setAppointmentType,
  userLocation,
  setUserLocation,
  visaConfig,
  basePrice,
  totalPrice,
  requiredDocs,
}: StepProps) => {
  const { t } = useLanguage();

  const [uploading, setUploading] = useState<{
    passports: boolean[];
    photos: boolean[];
    ids_photos: boolean[];
    salary_proofs: boolean[];
  }>({
    passports: Array(formData.numberOfTravellers).fill(false),
    photos: Array(formData.numberOfTravellers).fill(false),
    ids_photos: Array(formData.numberOfTravellers).fill(false),
    salary_proofs: Array(formData.numberOfTravellers).fill(false),
  });

  const [uploadErrors, setUploadErrors] = useState<{
    passports: (string | null)[];
    photos: (string | null)[];
    ids_photos: (string | null)[];
    salary_proofs: (string | null)[];
  }>({
    passports: Array(formData.numberOfTravellers).fill(null),
    photos: Array(formData.numberOfTravellers).fill(null),
    ids_photos: Array(formData.numberOfTravellers).fill(null),
    salary_proofs: Array(formData.numberOfTravellers).fill(null),
  });

  const { mutate: uploadDocument, isPending: isUploading } = useUploadImage();
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteImage();

  const [deletingFiles, setDeletingFiles] = useState<{
    passports: boolean[];
    photos: boolean[];
    ids_photos: boolean[];
    salary_proofs: boolean[];
  }>({
    passports: Array(formData.numberOfTravellers).fill(false),
    photos: Array(formData.numberOfTravellers).fill(false),
    ids_photos: Array(formData.numberOfTravellers).fill(false),
    salary_proofs: Array(formData.numberOfTravellers).fill(false),
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: "passports" | "photos" | "ids_photos" | "salary_proofs",
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("uploadInvalidType"));
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("uploadTooLarge"));
      return;
    }

    // Update uploading status
    const newUploading = { ...uploading };
    newUploading[fileType][index] = true;
    setUploading(newUploading);

    // Clear previous error for this file
    const newUploadErrors = { ...uploadErrors };
    newUploadErrors[fileType][index] = null;
    setUploadErrors(newUploadErrors);

    // Try uploading the file to Supabase Storage
    uploadDocument(
      { file },
      {
        onSuccess: async (data) => {
          console.log("Upload successful:", data);
          const newFiles = [...uploadedFiles[fileType]];
          // Add preview URL property
          const fileWithPreview = Object.assign(file, {
            preview: data,
            dataUrl: await fileToDataUrl(file),
          });
          newFiles[index] = fileWithPreview;

          setUploadedFiles({
            ...uploadedFiles,
            [fileType]: newFiles,
          });

          newUploading[fileType][index] = false;
          setUploading(newUploading);

          // Show success message
          toast.success(
            `${t(fileType === "passports" ? "passport" : "photo")} ${t(
              "forTraveller"
            )} ${index + 1} ${t("uploadSuccess")}`
          );
        },
        onError: async (error) => {
          console.error("Upload failed:", error);
          toast.error(
            `${t("uploadError")} ${t(
              fileType === "passports" ? "passport" : "photo"
            )}: ${error.message}`
          );

          const newFiles = [...uploadedFiles[fileType]];
          const fileWithPreview = Object.assign(file, {
            preview: URL.createObjectURL(file),
            dataUrl: await fileToDataUrl(file),
            isLocalPreview: true,
          });
          newFiles[index] = fileWithPreview;

          setUploadedFiles({
            ...uploadedFiles,
            [fileType]: newFiles,
          });

          // Set error message but don't stop the form flow - we'll handle the actual upload later
          newUploadErrors[fileType][index] = t("uploadLocalWarning");
          setUploadErrors(newUploadErrors);

          // Show warning toast but don't block the user
          toast.warning(t("uploadLocalWarning"));

          newUploading[fileType][index] = false;
          setUploading(newUploading);
        },
      }
    );
  };

  // Helper function to convert file to data URL for preview and backup
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const isDocumentsSectionValid = useCallback(() => {
    // Check if at least one traveller has uploaded a passport and a photo
    for (let i = 0; i < formData.numberOfTravellers; i++) {
      if (uploadedFiles.passports[i] && uploadedFiles.photos[i]) {
        return true;
      }
    }
    return false;
  }, [
    formData.numberOfTravellers,
    uploadedFiles.passports,
    uploadedFiles.photos,
  ]);

  const renderFileUploader = (
    fileType: "passports" | "photos" | "ids_photos" | "salary_proofs",
    index: number,
    label: string,
    icon: React.ReactNode
  ) => {
    const file = uploadedFiles[fileType][index];
    const isUploading = uploading[fileType][index];
    const isCurrentlyDeleting = deletingFiles[fileType][index];
    const error = uploadErrors[fileType][index];

    return (
      <div className="w-full">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div
          className={`border-2 border-dashed rounded-lg overflow-hidden ${
            error
              ? "border-red-300 bg-red-50"
              : file
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-visa-gold"
          }`}
        >
          {file ? (
            <div className="relative">
              {/* Show deleting overlay if file is being deleted */}
              {isCurrentlyDeleting && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center text-white">
                    <Loader2 className="h-8 sm:h-12 w-8 sm:w-12 animate-spin mb-2" />
                    <span className="text-xs sm:text-sm font-medium">
                      {t("deleting")}
                    </span>
                  </div>
                </div>
              )}

              {file.type.startsWith("image/") && file.preview && (
                <div className="relative h-28 sm:h-36 w-full">
                  <img
                    src={file.preview}
                    alt={`${
                      fileType === "passports" ? "Passport" : "Photo"
                    } preview`}
                    className="h-full w-full object-contain"
                  />

                  {/* Show local preview indicator if needed */}
                  {file.isLocalPreview && (
                    <div className="absolute bottom-0 right-0 text-2xs sm:text-xs bg-yellow-400 text-black px-1 py-0.5 rounded">
                      {t("localPreview")}
                    </div>
                  )}
                </div>
              )}

              {file.type === "application/pdf" && (
                <div className="h-28 sm:h-36 w-full flex items-center justify-center bg-gray-100">
                  <FileText className="h-8 sm:h-12 w-8 sm:w-12 text-visa-gold" />
                  <span className="ml-2 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                    {file.name}
                  </span>
                </div>
              )}

              <div className="p-1 sm:p-2 bg-white border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1" />
                    <span className="text-2xs sm:text-xs truncate max-w-[80px] sm:max-w-[150px]">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-2xs sm:text-xs h-5 sm:h-6 px-1 sm:px-2"
                    disabled={isCurrentlyDeleting || isUploading}
                    onClick={() => {
                      const currentFile = uploadedFiles[fileType][index];

                      // If there's a file with a preview URL and it's not a local preview, delete from Supabase
                      if (currentFile?.preview && !currentFile.isLocalPreview) {
                        console.log(
                          `🗑️ Deleting file from Supabase: ${currentFile.preview}`
                        );

                        // Set deleting state for this specific file
                        const newDeletingFiles = { ...deletingFiles };
                        newDeletingFiles[fileType][index] = true;
                        setDeletingFiles(newDeletingFiles);

                        deleteDocument(currentFile.preview, {
                          onSuccess: () => {
                            console.log(
                              `✅ Successfully deleted file from Supabase`
                            );

                            // Only remove file from local state after successful deletion
                            const newFiles = [...uploadedFiles[fileType]];
                            newFiles[index] = null as any;
                            setUploadedFiles({
                              ...uploadedFiles,
                              [fileType]: newFiles,
                            });

                            // Clear error
                            const newErrors = { ...uploadErrors };
                            newErrors[fileType][index] = null;
                            setUploadErrors(newErrors);

                            // Clear deleting state
                            newDeletingFiles[fileType][index] = false;
                            setDeletingFiles(newDeletingFiles);

                            toast.success(
                              `${t(
                                fileType === "passports" ? "passport" : "photo"
                              )} ${t("deleteSuccess")}`
                            );
                          },
                          onError: (error) => {
                            console.error("Error deleting file:", error);

                            // Clear deleting state on error
                            newDeletingFiles[fileType][index] = false;
                            setDeletingFiles(newDeletingFiles);

                            toast.error(
                              `${t("deleteError")}: ${error.message}`
                            );
                          },
                        });
                      } else {
                        // For local files, just remove immediately
                        const newFiles = [...uploadedFiles[fileType]];
                        newFiles[index] = null as any;
                        setUploadedFiles({
                          ...uploadedFiles,
                          [fileType]: newFiles,
                        });

                        // Clear error
                        const newErrors = { ...uploadErrors };
                        newErrors[fileType][index] = null;
                        setUploadErrors(newErrors);

                        toast.success(
                          `${t(
                            fileType === "passports" ? "passport" : "photo"
                          )} ${t("fileRemoved")}`
                        );
                      }
                    }}
                  >
                    {isCurrentlyDeleting ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        {t("deleting")}
                      </>
                    ) : (
                      t("replace")
                    )}
                  </Button>
                </div>

                {/* Show error message if any */}
                {error && (
                  <div className="text-2xs sm:text-xs text-yellow-700 mt-1 flex items-center">
                    <AlertCircle className="h-2 sm:h-3 w-2 sm:w-3 mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-28 sm:h-36 w-full cursor-pointer p-2 sm:p-4">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-6 sm:h-8 w-6 sm:w-8 text-visa-gold animate-spin" />
                  <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                    {t("uploading")}...
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    {icon}
                    <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                      {t("clickToUpload")} {label.toLowerCase()}
                    </span>
                    <span className="mt-1 text-2xs sm:text-xs text-gray-400">
                      {t("fileFormats")}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, fileType, index)}
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={isUploading || isCurrentlyDeleting}
                  />
                </>
              )}
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-visa-dark mb-1">
          {t("uploadDocuments")}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          {t("uploadDocumentsDesc")}
        </p>
        <p className="text-amber-600 text-2xs sm:text-xs mt-1">
          <AlertCircle className="h-2 sm:h-3 w-2 sm:w-3 inline mr-1" />
          {t("uploadFailWarning")}
          later.
        </p>
      </div>

      {Array.from({ length: formData.numberOfTravellers }).map((_, index) => (
        <Card
          key={index}
          className={`mb-4 sm:mb-6 ${
            index > 0 ? "border-t-4 border-visa-light" : ""
          }`}
        >
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="mb-3 sm:mb-4">
              <h3 className="font-medium text-sm sm:text-base text-visa-dark">
                {t("traveller")} {index + 1}:{" "}
                {travellers[index]?.firstName || t("unnamedTraveller")}{" "}
                {travellers[index]?.lastName || ""}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              {requiredDocs.passport_files_required &&
                renderFileUploader(
                  "passports",
                  index,
                  t("passportCopy"),
                  <FileText className="h-6 sm:h-8 w-6 sm:w-8 text-visa-gold" />
                )}

              {requiredDocs.photo_files_required &&
                renderFileUploader(
                  "photos",
                  index,
                  t("passportPhoto"),
                  <User className="h-6 sm:h-8 w-6 sm:w-8 text-visa-gold" />
                )}

              {requiredDocs.id_files_required &&
                renderFileUploader(
                  "ids_photos",
                  index,
                  t("idPhoto"),
                  <IdCardIcon className="h-6 sm:h-8 w-6 sm:w-8 text-visa-gold" />
                )}

              {requiredDocs.salary_proof_required &&
                renderFileUploader(
                  "salary_proofs",
                  index,
                  t("salaryPhoto"),
                  <PanelTopInactiveIcon className="h-6 sm:h-8 w-6 sm:w-8 text-visa-gold" />
                )}
            </div>
          </CardContent>
        </Card>
      ))}

      <CardFooter className="px-0 pb-0 pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 form-buttons">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          className="w-full sm:w-auto"
        >
          {t("back")}
        </Button>
        <Button
          type="button"
          onClick={handleNextStep}
          className="w-full sm:w-auto bg-visa-gold hover:bg-visa-gold/90"
        >
          {t("continueToAccount")}
        </Button>
      </CardFooter>
    </div>
  );
};

export default DocumentsStep;
