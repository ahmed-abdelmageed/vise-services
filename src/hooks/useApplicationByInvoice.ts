import { useQuery } from '@tanstack/react-query';
import { fetchApplicationByInvoiceClientId } from '@/api/invoices';

/**
 * Hook to fetch application data using invoice client_id
 */
export const useApplicationByInvoice = (clientId: string, enabled = true) => {
  return useQuery({
    queryKey: ['application', 'by-invoice', clientId],
    queryFn: () => fetchApplicationByInvoiceClientId(clientId),
    enabled: enabled && !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
