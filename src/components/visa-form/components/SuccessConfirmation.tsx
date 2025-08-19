
import React from "react";
import { CheckCircle, ChevronRight, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SuccessConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string | null;
  onClose: () => void;
}

export const SuccessConfirmation = ({ open, onOpenChange, applicationId, onClose }: SuccessConfirmationProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-yellow-200 mx-3 sm:mx-auto">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="h-12 sm:h-16 w-12 sm:w-16 rounded-full bg-gradient-to-r from-green-400 to-yellow-400 flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle className="h-7 sm:h-10 w-7 sm:w-10 text-white" />
            </div>
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-green-800">Application Submitted Successfully!</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-center space-y-1 sm:space-y-2 mt-2">
            <p className="text-xs sm:text-sm text-gray-700">
              Your file has been successfully submitted, and your user account has been created.
            </p>
            {applicationId && (
              <div className="mt-2 sm:mt-3 mb-2 sm:mb-3">
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Your Application Reference Number:</p>
                <div className="bg-white py-1 sm:py-2 px-3 sm:px-4 rounded-md border border-yellow-300 font-mono font-medium text-yellow-800 inline-block text-xs sm:text-sm break-all max-w-[100%] overflow-x-auto">
                  {applicationId}
                </div>
              </div>
            )}
            <p className="text-xs sm:text-sm text-gray-700">
              You can now track your progress, and we will contact you soon.
            </p>
            <div className="mt-3 sm:mt-4 flex items-center justify-center text-gray-500 text-2xs sm:text-sm">
              <Mail className="h-3 sm:h-4 w-3 sm:w-4 mr-1" /> A confirmation email has been sent to your inbox
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex sm:justify-center mt-3 sm:mt-4">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white text-sm w-full sm:w-auto min-h-[48px]"
          >
            <span>Go to Services</span>
            <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
