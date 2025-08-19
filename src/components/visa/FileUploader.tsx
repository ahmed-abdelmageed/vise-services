
import React from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TravellerData } from "@/types/visa";

interface FileUploaderProps {
  type: "passport" | "photo";
  index: number;
  traveller: TravellerData;
  file: File | null;
  inputRef: (el: HTMLInputElement | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number) => void;
  onRemoveFile: (type: string, index: number) => void;
}

export const FileUploader = ({
  type,
  index,
  traveller,
  file,
  inputRef,
  onFileUpload,
  onRemoveFile
}: FileUploaderProps) => {
  const isPassport = type === "passport";
  const title = isPassport ? "Passport Copy" : "Recent Photograph";
  const fileTypeText = isPassport ? "PDF, JPG or PNG (Max 5MB)" : "JPG or PNG (Max 2MB)";
  const description = isPassport ? "First and last page of passport" : "Passport-size photo with white background";
  const inputId = `${type}-upload-${index}`;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor={inputId} className="font-medium">
          {title} <span className="text-red-500">*</span>
        </Label>
        <span className="text-xs text-gray-500">{fileTypeText}</span>
      </div>
      
      {!file ? (
        <div className="flex items-center justify-center w-full">
          <label htmlFor={inputId} className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-6 h-6 mb-1 text-gray-400" />
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> {type}
              </p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <input 
              id={inputId} 
              type="file" 
              accept={isPassport ? ".jpg,.jpeg,.png,.pdf" : ".jpg,.jpeg,.png"} 
              className="hidden" 
              ref={inputRef}
              onChange={(e) => onFileUpload(e, type, index)} 
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <File className="h-5 w-5 text-visa-gold mr-2" />
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemoveFile(type, index)} 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
