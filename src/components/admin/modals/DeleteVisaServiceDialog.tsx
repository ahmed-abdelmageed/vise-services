
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!service?.id) {
      toast.error(t('serviceIdMissing'));
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
        toast.error(t('failedToDeleteVisaService'));
        return;
      }

      toast.success(t('visaServiceDeletedSuccessfully'));
      onServiceDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error(t('unexpectedErrorOccurred'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteVisaServiceWarning')}{" "}
            <strong>{service?.title}</strong>. {t('thisActionCannotBeUndone')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? t('deleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
