import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvoiceStatusToPaidByOrderId } from '@/api/invoices';
import { toast } from 'sonner';

/**
 * Hook to update invoice status to paid by order_id
 */
export const useUpdateInvoiceStatusByOrderId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentData
    }: {
      orderId: string;
      paymentData: {
        payment_id?: string;
        transaction_id?: string;
      };
    }) => updateInvoiceStatusToPaidByOrderId(orderId, paymentData),
    onSuccess: () => {
      // Invalidate invoice queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'by-client'] });
    },
    onError: (error) => {
      console.error('Failed to update invoice status:', error);
      // Don't show error toast here as it's handled in the API function
    },
  });
};
