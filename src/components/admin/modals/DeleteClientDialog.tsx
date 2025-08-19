
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DeleteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  singleClient?: boolean;
  clientCount?: number;
  isDeleting?: boolean;
}

export const DeleteClientDialog = ({
  open,
  onOpenChange,
  onConfirm,
  singleClient = true,
  clientCount = 0,
  isDeleting = false,
}: DeleteClientDialogProps) => {
  const { t } = useLanguage();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {singleClient ? t('deleteClient') : `${t('deleteClients')} (${clientCount})`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteWarning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting && <Loader className="h-4 w-4 animate-spin" />}
            {isDeleting ? t('processing') : singleClient ? t('delete') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
