import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  initiatePayment, 
  checkPaymentStatus, 
  generateOrderId,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusResponse
} from '@/api/payment';
import { createVisaInvoice } from '@/api/invoices';
import { toast } from 'sonner';

// Query keys
export const paymentQueryKeys = {
  all: ['payment'] as const,
  status: (paymentId: string, orderId: string) => [...paymentQueryKeys.all, 'status', paymentId, orderId] as const,
};

/**
 * Hook to initiate payment
 */
export const useInitiatePayment = () => {
  return useMutation<PaymentInitiateResponse, Error, PaymentInitiateRequest>({
    mutationFn: initiatePayment,
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast.success('Payment link generated successfully');
      } else {
        toast.error(data.error_message || 'Failed to initiate payment');
      }
    },
    onError: (error) => {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
    },
  });
};

/**
 * Hook to check payment status
 */
export const useCheckPaymentStatus = (paymentId: string, orderId: string, enabled = false) => {
  return useQuery<PaymentStatusResponse>({
    queryKey: paymentQueryKeys.status(paymentId, orderId),
    queryFn: () => checkPaymentStatus(paymentId, orderId),
    enabled: enabled && !!paymentId && !!orderId,
    refetchInterval: (data) => {
      // Stop refetching if payment is completed or failed
      if (data?.state?.data?.payment_status === 'completed' || 
          data?.state?.data?.payment_status === 'failed' || 
          data?.state?.data?.payment_status === 'cancelled') {
        return false;
      }
      return 5000; // Refetch every 5 seconds while pending
    },
    staleTime: 0, // Always refetch
  });
};

/**
 * Hook to manually check payment status
 */
export const useManualCheckPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentStatusResponse, Error, { paymentId: string; orderId: string }>({
    mutationFn: ({ paymentId, orderId }) => checkPaymentStatus(paymentId, orderId),
    onSuccess: (data, variables) => {
      // Update the query cache
      queryClient.setQueryData(paymentQueryKeys.status(variables.paymentId, variables.orderId), data);
      
      if (data.payment_status === 'completed') {
        toast.success('Payment completed successfully!');
      } else if (data.payment_status === 'failed' || data.payment_status === 'cancelled') {
        toast.error('Payment failed or was cancelled');
      } else {
        toast.info('Payment is still pending');
      }
    },
    onError: (error) => {
      console.error('Payment status check error:', error);
      toast.error('Failed to check payment status');
    },
  });
};

/**
 * Hook to create invoice after successful payment
 */
export const useCreateVisaInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, {
    paymentData: {
      payment_id: string;
      order_id: string;
      transaction_id?: string;
      amount: number;
      currency: string;
    };
    applicationData: {
      user_id: string;
      client_id?: string;
      service_description: string;
      customer_email: string;
      customer_name: string;
    };
  }>({
    mutationFn: ({ paymentData, applicationData }) => createVisaInvoice(paymentData, applicationData),
    onSuccess: () => {
      // Invalidate invoice queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: (error) => {
      console.error('Invoice creation error:', error);
      toast.error('Failed to create invoice');
    },
  });
};

/**
 * Utility function to generate order ID
 */
export const useGenerateOrderId = () => {
  return (applicationId?: string) => generateOrderId(applicationId);
};
