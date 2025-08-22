
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisaConfig } from "@/types/visa";
import { useEditVisaServiceForm } from "@/hooks/useEditVisaServiceForm";
import { EditVisaServiceContent } from "./visa-service/EditVisaServiceContent";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditVisaServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: VisaConfig | null;
  onServiceUpdated: () => void;
}

export const EditVisaServiceDialog = ({
  open,
  onOpenChange,
  service,
  onServiceUpdated,
}: EditVisaServiceDialogProps) => {
  const { t } = useLanguage();
  const { form, isSubmitting, onSubmit } = useEditVisaServiceForm(
    service,
    onServiceUpdated,
    onOpenChange
  );

  const handleCancelClick = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editVisaService')}</DialogTitle>
          <DialogDescription>
            {t('updateVisaServiceDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <EditVisaServiceContent
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancelClick={handleCancelClick}
        />
      </DialogContent>
    </Dialog>
  );
};
