
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
import { ApplicationStatusType } from "@/types/crm";
import { useLanguage } from "@/contexts/LanguageContext";

interface BulkStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  bulkStatus: ApplicationStatusType;
  setBulkStatus: (status: ApplicationStatusType) => void;
  selectedItemsCount: number;
}

export const BulkStatusDialog = ({
  open,
  onOpenChange,
  onConfirm,
  bulkStatus,
  setBulkStatus,
  selectedItemsCount,
}: BulkStatusDialogProps) => {
  const { t } = useLanguage();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('updateStatus')} ({selectedItemsCount})</AlertDialogTitle>
          <AlertDialogDescription>
            {t('updateStatusDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <select
            className="w-full p-2 border rounded-md"
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as ApplicationStatusType)}
          >
            <option value="Pending">{t('pending')}</option>
            <option value="In Progress">{t('inProgress')}</option>
            <option value="Document Review">{t('documentReview')}</option>
            <option value="Interview Scheduled">{t('interviewScheduled')}</option>
            <option value="Approved">{t('approved')}</option>
            <option value="Rejected">{t('rejected')}</option>
            <option value="Completed">{t('completed')}</option>
          </select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('updateStatus')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
