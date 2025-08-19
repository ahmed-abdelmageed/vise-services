// components/FlagImageUpload.tsx

import React, { useRef } from "react";
import { Button } from "../ui/button";

interface FlagImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
}

export const FlagImageUpload = ({
  currentImage,
  onImageUploaded,
}: FlagImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // simulate uploading by creating a URL (replace with actual upload if needed)
      const url = URL.createObjectURL(file);

      // You can replace the line above with actual upload logic to your server or cloud storage
      // Example: const url = await uploadFileToServer(file);

      onImageUploaded(url);
    }
  };

  return (
    <div className="flex items-center gap-5">
      {currentImage && (
        <img
          src={currentImage}
          alt="Flag Preview"
          className="w-20 h-20 object-cover rounded border"
        />
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="py-2 px-4 rounded bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100"
      >
        {currentImage ? "Change Image" : "Upload Image"}
      </Button>
    </div>
  );
};
