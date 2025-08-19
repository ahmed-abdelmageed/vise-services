
import React from "react";
import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, FileText, Mail, Trash, Edit } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { VisaApplication, ClientInvoice } from "@/types/crm";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClientRowProps {
  customer: VisaApplication;
  customerInvoices: ClientInvoice[];
  selected: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (customer: VisaApplication) => void;
  onViewDocuments: (id: string) => void;
  onEditClient: (id: string) => void;
  onSendEmail: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const ClientRow = ({
  customer,
  customerInvoices,
  selected,
  onSelect,
  onViewDetails,
  onViewDocuments,
  onEditClient,
  onSendEmail,
  onDeleteClick,
}: ClientRowProps) => {
  const { t } = useLanguage();
  const hasUnpaidInvoice = customerInvoices.some(inv => inv.status === 'Unpaid');

  return (
    <TableRow key={customer.id} className="group">
      <TableCell className="pl-4">
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={selected}
            onCheckedChange={() => onSelect(customer.id)}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="hidden sm:flex bg-primary/10 text-primary">
            <AvatarFallback>
              {`${customer.first_name?.charAt(0) || ''}${customer.last_name?.charAt(0) || ''}`}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{`${customer.first_name || ''} ${customer.last_name || ''}`}</div>
            <div className="text-sm text-muted-foreground">{customer.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
          {customer.reference_id || 'N/A'}
        </div>
      </TableCell>
      <TableCell>
        {customer.country}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {customer.service_type === 'prepare-file-only' ? 'Document Prep' : customer.service_type}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {customer.created_at ? format(new Date(customer.created_at), 'MMM d, yyyy') : 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <StatusBadge status={customer.status || 'Pending'} />
        {hasUnpaidInvoice && (
          <span className="ml-2 rtl:mr-2 rtl:ml-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            {t('unpaid')}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right rtl:text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">{t('actions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(customer)}>
              <Eye className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
              {t('viewDetails')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDocuments(customer.id)}>
              <FileText className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
              {t('viewDocuments')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditClient(customer.id)}>
              <Edit className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
              {t('editClient')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSendEmail(customer.id)}>
              <Mail className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
              {t('sendEmail')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDeleteClick(customer.id)}>
              <Trash className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
              {t('deleteClientBtn')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
