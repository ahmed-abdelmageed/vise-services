
import React, { useState } from "react";
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
import { VisaConfig } from "@/types/visa";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteVisaServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: VisaConfig | null;
  onServiceDeleted: () => void;
}

export const DeleteVisaServiceDialog = ({
  open,
  onOpenChange,
  service,
  onServiceDeleted,
}: DeleteVisaServiceDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!service?.id) {
      toast.error("Service ID is missing");
      return;
    }

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('visa_services')
        .delete()
        .eq('id', service.id);

      if (error) {
        console.error("Error deleting visa service:", error);
        toast.error("Failed to delete visa service");
        return;
      }

      toast.success("Visa service deleted successfully");
      onServiceDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the visa service{" "}
            <strong>{service?.title}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
