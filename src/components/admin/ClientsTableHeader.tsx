
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClientsTableHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
}

export const ClientsTableHeader = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ClientsTableHeaderProps) => {
  const { t } = useLanguage();
  
  const statuses = [
    { id: 'All', label: t('allStatuses') },
    { id: 'Pending', label: t('pending') },
    { id: 'In Progress', label: t('inProgress') },
    { id: 'Document Review', label: t('documentReview') },
    { id: 'Interview Scheduled', label: t('interviewScheduled') },
    { id: 'Approved', label: t('approved') },
    { id: 'Rejected', label: t('rejected') },
    { id: 'Completed', label: t('completed') }
  ];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('clients')}</h2>
        <p className="text-muted-foreground">
          {t('manageClients')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchClients')}
            className="pl-8 rtl:pr-8 rtl:pl-4 w-[200px] md:w-[250px]"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('filter')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>{t('filterByStatus')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((status) => (
              <DropdownMenuItem 
                key={status.id}
                className="flex items-center gap-2"
                onClick={() => onStatusFilterChange(status.id === 'All' ? null : status.id)}
              >
                {status.id === statusFilter || (status.id === 'All' && statusFilter === null) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <div className="w-4" />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
