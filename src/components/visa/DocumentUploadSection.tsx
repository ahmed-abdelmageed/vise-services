
import React from "react";
import { FileUploader } from "./FileUploader";
import { TravellerData, UploadedFiles } from "@/types/visa";
import { PriceDisplay } from "./PriceDisplay";
import { Button } from "@/components/ui/button";
import { SPAIN_APPOINTMENT_TYPES } from "@/utils/visaConstants";
import { useLanguage } from "@/contexts/language";

interface DocumentUploadSectionProps {
  travellers: TravellerData[];
  numberOfTravellers: number;
  uploadedFiles: UploadedFiles;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number) => void;
  removeFile: (type: string, index: number) => void;
  passportInputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  photoInputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  isSpainVisa: boolean;
  appointmentType: string;
  basePrice: number;
  totalPrice: number;
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

export const DocumentUploadSection = ({
  travellers,
  numberOfTravellers,
  uploadedFiles,
  handleFileUpload,
  removeFile,
  passportInputRefs,
  photoInputRefs,
  isSpainVisa,
  appointmentType,
  basePrice,
  totalPrice,
  handlePrevStep,
  handleNextStep
}: DocumentUploadSectionProps) => {

    const { t } = useLanguage();
  
  return (
    <div className="space-y-5 animate-fadeIn">
      <h3 className="text-lg font-medium text-visa-dark">Document Upload</h3>
      <p className="text-sm text-gray-600">
        Please upload clear scanned copies or photos of the required documents for each traveller.
      </p>
      
      {/* Dynamic file uploads based on number of travellers */}
      {Array.from({ length: numberOfTravellers }).map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Traveller {index + 1} - {travellers[index]?.fullName || "Unknown"}</h4>
          
          {/* Passport Upload */}
          <FileUploader
            type="passport"
            index={index}
            traveller={travellers[index]}
            file={uploadedFiles.passports[index]}
            inputRef={(el) => {
              passportInputRefs.current[index] = el;
            }}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
          />
          
          {/* Photo Upload */}
          <FileUploader
            type="photo"
            index={index}
            traveller={travellers[index]}
            file={uploadedFiles.photos[index]}
            inputRef={(el) => {
              photoInputRefs.current[index] = el;
            }}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
          />
        </div>
      ))}

      {/* Add prominent note for Spain Visa */}
      {isSpainVisa && (
        <div className="mt-4 p-3 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600 font-bold text-center">
          {t("serviceIncludesAppointmentAndFilesOnly")}           </p>

         
        </div>
      )}
      
      {/* Price display */}
      <PriceDisplay
        isSpainVisa={isSpainVisa}
        appointmentType={appointmentType}
        appointmentTypes={SPAIN_APPOINTMENT_TYPES}
        basePrice={basePrice}
        totalPrice={totalPrice}
        numberOfTravellers={numberOfTravellers}
      />
      
      <div className="pt-4 flex gap-3">
        <Button type="button" onClick={handlePrevStep} variant="outline" className="w-1/2">
          Previous
        </Button>
        <Button 
          type="button" 
          onClick={handleNextStep} 
          className="w-1/2 bg-visa-gold hover:bg-visa-gold/90 text-white"
        >
          Next: Create Account
        </Button>
      </div>
    </div>
  );
};
