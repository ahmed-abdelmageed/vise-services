
import React from "react";
import { Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
  const isMobile = useIsMobile();
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center max-w-[90%] sm:max-w-md mx-auto">
        <Loader className="h-8 sm:h-10 w-8 sm:w-10 animate-spin text-visa-gold mb-3 sm:mb-4" />
        <p className="text-visa-dark font-medium text-sm sm:text-base">Submitting your application...</p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Please don't close this window</p>
      </div>
    </div>
  );
};
