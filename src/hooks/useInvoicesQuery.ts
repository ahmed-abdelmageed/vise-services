import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  bulkUpdateInvoiceStatus,
  bulkDeleteInvoices,
  fetchInvoicesByClient,
  InvoiceItem
} from '../api/invoices';

// Query keys for React Query
export const invoicesKeys = {
  all: ['invoices'] as const,
  list: () => [...invoicesKeys.all, 'list'] as const,
  filtered: (status?: string) => [...invoicesKeys.all, 'filtered', status] as const,
  byClient: (clientId: string) => [...invoicesKeys.all, 'by-client', clientId] as const,
  detail: (id: string) => [...invoicesKeys.all, 'detail', id] as const,
};

// Hook to fetch all invoices
export const useInvoices = ({ status_filter }: { status_filter?: string } = {}) => {
  return useQuery({
    queryKey: invoicesKeys.filtered(status_filter),
    queryFn: () => fetchInvoices(status_filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch invoices by client
export const useInvoicesByClient = (clientId: string, enabled = true) => {
  return useQuery({
    queryKey: invoicesKeys.byClient(clientId),
    queryFn: () => fetchInvoicesByClient(clientId),
    enabled: enabled && !!clientId,
  });
};

// Hook to create a new invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      // Invalidate and refetch invoices
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
    },
  });
};

// Hook to update an existing invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InvoiceItem> }) =>
      updateInvoice(id, data),
    onSuccess: (data, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(invoicesKeys.list(), (old: InvoiceItem[] | undefined) => {
        if (!old) return old;
        return old.map((item) => (item.id === variables.id ? { ...item, ...data } : item));
      });
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
    onError: (error) => {
      console.error('Error updating invoice:', error);
    },
  });
};

// Hook to delete an invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: (_, deletedId) => {
      // Remove the item from cache
      queryClient.setQueryData(invoicesKeys.list(), (old: InvoiceItem[] | undefined) => {
        if (!old) return old;
        return old.filter((item) => item.id !== deletedId);
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
    onError: (error) => {
      console.error('Error deleting invoice:', error);
    },
  });
};

// Hook to update invoice status
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateInvoiceStatus(id, status),
    onSuccess: (data, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(invoicesKeys.list(), (old: InvoiceItem[] | undefined) => {
        if (!old) return old;
        return old.map((item) => 
          item.id === variables.id ? { ...item, status: variables.status } : item
        );
      });
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
    onError: (error) => {
      console.error('Error updating invoice status:', error);
    },
  });
};

// Hook for bulk status update
export const useBulkUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceIds, status }: { invoiceIds: string[]; status: string }) =>
      bulkUpdateInvoiceStatus(invoiceIds, status),
    onSuccess: () => {
      // Invalidate and refetch to get updated data
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
    onError: (error) => {
      console.error('Error bulk updating invoice status:', error);
    },
  });
};

// Hook for bulk delete
export const useBulkDeleteInvoices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteInvoices,
    onSuccess: () => {
      // Invalidate and refetch to get updated data
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
    onError: (error) => {
      console.error('Error bulk deleting invoices:', error);
    },
  });
};

// Optimistic update hook for invoice operations
export const useOptimisticInvoiceUpdate = () => {
  const queryClient = useQueryClient();

  const optimisticUpdate = (invoiceId: string, updates: Partial<InvoiceItem>) => {
    queryClient.setQueryData(invoicesKeys.list(), (old: InvoiceItem[] | undefined) => {
      if (!old) return old;
      return old.map((item) => 
        item.id === invoiceId ? { ...item, ...updates } : item
      );
    });
  };

  const revertOptimisticUpdate = () => {
    queryClient.invalidateQueries({ queryKey: invoicesKeys.list() });
  };

  return { optimisticUpdate, revertOptimisticUpdate };
};

// Hook for prefetching invoices (useful for preloading)
export const usePrefetchInvoices = () => {
  const queryClient = useQueryClient();

  const prefetchInvoices = (status_filter?: string) => {
    queryClient.prefetchQuery({
      queryKey: invoicesKeys.filtered(status_filter),
      queryFn: () => fetchInvoices(status_filter),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchInvoicesByClient = (clientId: string) => {
    queryClient.prefetchQuery({
      queryKey: invoicesKeys.byClient(clientId),
      queryFn: () => fetchInvoicesByClient(clientId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchInvoices, prefetchInvoicesByClient };
};

// Custom hook for single invoice by ID (if needed for invoice details)
export const useInvoice = (id: string, enabled = true) => {
  return useQuery({
    queryKey: invoicesKeys.detail(id),
    queryFn: async () => {
      const invoices = await fetchInvoices();
      return invoices?.find((invoice) => invoice.id === id);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for invoice statistics
export const useInvoiceStats = () => {
  return useQuery({
    queryKey: [...invoicesKeys.all, 'stats'],
    queryFn: async () => {
      const invoices = await fetchInvoices();
      if (!invoices) return null;

      const stats = {
        total: invoices.length,
        paid: invoices.filter(inv => inv.status === 'Paid').length,
        unpaid: invoices.filter(inv => inv.status === 'Unpaid').length,
        overdue: invoices.filter(inv => inv.status === 'Overdue').length,
        totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        paidAmount: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
        unpaidAmount: invoices.filter(inv => inv.status === 'Unpaid').reduce((sum, inv) => sum + inv.amount, 0),
      };

      return stats;
    },
    staleTime: 5 * 60 * 1000,
  });
};
