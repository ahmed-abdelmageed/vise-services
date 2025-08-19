
import { VisaApplication } from "@/types/crm";
import { toast } from "sonner";

export const useClientOperations = () => {
  const handleViewDetails = (customer: VisaApplication, setSelectedCustomer: (customer: VisaApplication | null) => void, setCustomerDetailsOpen: (open: boolean) => void) => {
    setSelectedCustomer(customer);
    setCustomerDetailsOpen(true);
  };
  
  const handleSendEmail = (clientId: string, customers: VisaApplication[]) => {
    // Find the client
    const client = customers.find(c => c.id === clientId);
    
    if (client) {
      toast.success(`Email sent to ${client.email}`);
    }
  };
  
  const handleEditClient = (clientId: string) => {
    toast.info('Edit client functionality coming soon');
  };
  
  const handleViewDocuments = (clientId: string, customers: VisaApplication[], setSelectedCustomer: (customer: VisaApplication | null) => void, setCustomerDetailsOpen: (open: boolean) => void) => {
    // Find the client and open details with focus on documents
    const client = customers.find(c => c.id === clientId);
    if (client) {
      setSelectedCustomer(client);
      setCustomerDetailsOpen(true);
    }
  };

  return {
    handleViewDetails,
    handleSendEmail,
    handleEditClient,
    handleViewDocuments
  };
};
