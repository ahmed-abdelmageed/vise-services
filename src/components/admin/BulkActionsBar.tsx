
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, AlertTriangle, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface BulkActionsBarProps {
  selectedItemsCount: number;
  onUpdateStatus: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onFilter?: (filter: string) => void;
  isProcessing?: boolean;
  showFilters?: boolean;
}

export const BulkActionsBar = ({
  selectedItemsCount,
  onUpdateStatus,
  onDelete,
  onCancel,
  onFilter,
  isProcessing = false,
  showFilters = false,
}: BulkActionsBarProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-primary-50 border border-primary/20 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <CheckSquare className="h-5 w-5 text-primary" />
        <span className="font-medium">{selectedItemsCount} {t('clientsSelected')}</span>
      </div>
      
      {showFilters && onFilter && (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Select onValueChange={onFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="Pending">{t('pending')}</SelectItem>
              <SelectItem value="In Progress">{t('inProgress')}</SelectItem>
              <SelectItem value="Document Review">{t('documentReview')}</SelectItem>
              <SelectItem value="Completed">{t('completed')}</SelectItem>
              <SelectItem value="Rejected">{t('rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onUpdateStatus}
          disabled={isProcessing}
          className="whitespace-nowrap"
        >
          {t('setStatus')}
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDelete}
          disabled={isProcessing}
          className="whitespace-nowrap"
        >
          {isProcessing ? t('processing') : t('delete')}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onCancel}
          disabled={isProcessing}
          className="whitespace-nowrap"
        >
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
};
