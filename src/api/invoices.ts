import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

export interface InvoiceItem {
  id?: string;
  invoice_number: string;
  client_id?: string | null;
  amount: number;
  currency?: string | null;
  status: string;
  issue_date?: string | null;
  due_date?: string | null;
  payment_date?: string | null;
  service_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
  order_id?: string | null;
  trans_id?: string | null;
}

export const fetchInvoices = async (status_filter?: string) => {
  try {
    let query = supabase.from("client_invoices").select("*");

    // Only apply the status filter if status_filter is defined
    if (status_filter !== undefined) {
      query = query.eq("status", status_filter);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
      return;
    }
    return data;
  } catch (error) {
    console.error("Error in fetchInvoices:", error);
    toast.error("An unexpected error occurred");
  }
};

export const createInvoice = async (invoiceData: Partial<InvoiceItem>) => {
  try {
    // Generate invoice number if not provided
    const invoiceNumber =
      invoiceData.invoice_number ||
      `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;

    const dataToInsert = {
      ...invoiceData,
      invoice_number: invoiceNumber,
      currency: invoiceData.currency || "﷼",
      status: invoiceData.status || "Unpaid",
      issue_date: invoiceData.issue_date || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("client_invoices")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
      throw error;
    }

    toast.success("Invoice created successfully");
    return data;
  } catch (error) {
    console.error("Error in createInvoice:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const updateInvoice = async (
  id: string,
  invoiceData: Partial<InvoiceItem>
) => {
  try {
    const { data, error } = await supabase
      .from("client_invoices")
      .update(invoiceData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
      throw error;
    }

    toast.success("Invoice updated successfully");
    return data;
  } catch (error) {
    console.error("Error in updateInvoice:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const { error } = await supabase
      .from("client_invoices")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
      throw error;
    }

    toast.success("Invoice deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteInvoice:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const updateInvoiceStatus = async (id: string, status: string) => {
  try {
    const updateData: Partial<InvoiceItem> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add payment date if status is being set to Paid
    if (status === "Paid") {
      updateData.payment_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("client_invoices")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
      throw error;
    }

    toast.success(`Invoice marked as ${status.toLowerCase()} successfully`);
    return data;
  } catch (error) {
    console.error("Error in updateInvoiceStatus:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const bulkUpdateInvoiceStatus = async (
  invoiceIds: string[],
  status: string
) => {
  try {
    const updateData: Partial<InvoiceItem> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add payment date if status is being set to Paid
    if (status === "Paid") {
      updateData.payment_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from("client_invoices")
      .update(updateData)
      .in("id", invoiceIds);

    if (error) {
      console.error("Error bulk updating invoice status:", error);
      toast.error("Failed to update invoice status");
      throw error;
    }

    toast.success(
      `${
        invoiceIds.length
      } invoice(s) marked as ${status.toLowerCase()} successfully`
    );
    return true;
  } catch (error) {
    console.error("Error in bulkUpdateInvoiceStatus:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const bulkDeleteInvoices = async (invoiceIds: string[]) => {
  try {
    const { error } = await supabase
      .from("client_invoices")
      .delete()
      .in("id", invoiceIds);

    if (error) {
      console.error("Error bulk deleting invoices:", error);
      toast.error("Failed to delete invoices");
      throw error;
    }

    toast.success(`${invoiceIds.length} invoice(s) deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error in bulkDeleteInvoices:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const fetchInvoicesByClient = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("client_invoices")
      .select("*")
      .eq("user_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client invoices:", error);
      toast.error("Failed to load client invoices");
      return;
    }
    return data;
  } catch (error) {
    console.error("Error in fetchInvoicesByClient:", error);
    toast.error("An unexpected error occurred");
  }
};

/**
 * Fetch application data by invoice client_id
 */
export const fetchApplicationByInvoiceClientId = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("visa_applications")
      .select("*")
      .eq("id", clientId)
      .single();

    if (error) {
      console.error("Error fetching application by client_id:", error);
      toast.error("Failed to load application details");
      return null;
    }

    console.log("Fetched application data by client_id:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchApplicationByInvoiceClientId:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

/**
 * Create invoice for visa application after successful payment
 */
export const createVisaInvoice = async (
  paymentData: {
    payment_id: string;
    order_id: string;
    transaction_id?: string;
    amount: number;
    currency: string;
  },
  applicationData: {
    user_id: string;
    client_id?: string;
    service_description: string;
    customer_email: string;
    customer_name: string;
  }
) => {
  try {
    const invoiceData: Partial<InvoiceItem> = {
      invoice_number: `INV-${paymentData.order_id}`,
      client_id: applicationData.client_id || applicationData.user_id,
      user_id: applicationData.user_id,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: "Paid",
      issue_date: new Date().toISOString(),
      payment_date: new Date().toISOString(),
      service_description: applicationData.service_description,
    };

    const { data, error } = await supabase
      .from("client_invoices")
      .insert([invoiceData])
      .select()
      .single();

    if (error) {
      console.error("Error creating visa invoice:", error);
      toast.error("Failed to create invoice for visa application");
      throw error;
    }

    console.log("Visa invoice created successfully:", data);
    toast.success("Invoice created for your visa application");
    return data;
  } catch (error) {
    console.error("Error in createVisaInvoice:", error);
    toast.error("Failed to create invoice");
    throw error;
  }
};

/**
 * Create pending invoice for visa application (before payment)
 */
export const createPendingVisaInvoice = async (applicationData: {
  user_id: string;
  client_id?: string;
  service_description: string;
  customer_email: string;
  customer_name: string;
  amount: number;
  currency?: string;
  order_id?: string;
}) => {
  try {
    const invoiceData: Partial<InvoiceItem> = {
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )}`,
      client_id: applicationData.client_id || applicationData.user_id,
      user_id: applicationData.user_id,
      amount: applicationData.amount,
      currency: applicationData.currency || "SAR",
      status: "Pending",
      issue_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      service_description: applicationData.service_description,
      order_id: applicationData.order_id,
    };

    const { data, error } = await supabase
      .from("client_invoices")
      .insert([invoiceData])
      .select()
      .single();

    if (error) {
      console.error("Error creating pending visa invoice:", error);
      toast.error("Failed to create invoice for visa application");
      throw error;
    }

    console.log("Pending visa invoice created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createPendingVisaInvoice:", error);
    toast.error("Failed to create invoice");
    throw error;
  }
};

/**
 * Update invoice status to paid after successful payment
 */
export const updateInvoiceStatusToPaid = async (
  invoiceId: string,
  paymentData: {
    payment_id: string;
    transaction_id?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from("client_invoices")
      .update({
        status: "Paid",
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single();

    if (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
      throw error;
    }

    console.log("Invoice status updated to paid:", data);
    return data;
  } catch (error) {
    console.error("Error in updateInvoiceStatusToPaid:", error);
    throw error;
  }
};

/**
 * Update invoice status to paid by order_id after successful payment
 */
export const updateInvoiceStatusToPaidByOrderId = async (
  orderId: string,
  paymentData: {
    payment_id?: string;
    transaction_id?: string;
  }
) => {
  try {
    console.log("🚀 ~ Updating invoice status to Paid for order_id:", orderId);

    // First find the invoice by order_id (it's stored in invoice_number or we need to find via visa_applications)
    const { data: invoice, error: findError } = await supabase
      .from("client_invoices")
      .select("*")
      .or(`invoice_number.eq.INV-${orderId},invoice_number.like.%${orderId}%`)
      .single();

    if (findError || !invoice) {
      console.warn(
        "Invoice not found by order_id, trying to find via visa applications..."
      );

      // Try to find via visa applications table
      const { data: application, error: appError } = await supabase
        .from("visa_applications")
        .select("id, invoice_id")
        .eq("order_id", orderId)
        .single();

      if (appError || !application) {
        console.error(
          "Could not find invoice or application for order_id:",
          orderId
        );
        toast.error("Invoice not found for this order");
        return null;
      }

      if (application.invoice_id) {
        // Update using the invoice_id from application
        const { data, error } = await supabase
          .from("client_invoices")
          .update({
            status: "Paid",
            payment_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", application.invoice_id)
          .select()
          .single();

        if (error) {
          console.error("Error updating invoice status:", error);
          toast.error("Failed to update invoice status");
          throw error;
        }

        console.log("Invoice status updated to paid via application:", data);
        toast.success("Invoice marked as paid successfully");
        return data;
      } else {
        console.error("Application found but no invoice_id");
        toast.error("No invoice found for this application");
        return null;
      }
    } else {
      // Update the found invoice
      const { data, error } = await supabase
        .from("client_invoices")
        .update({
          status: "Paid",
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoice.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating invoice status:", error);
        toast.error("Failed to update invoice status");
        throw error;
      }

      console.log("Invoice status updated to paid:", data);
      toast.success("Invoice marked as paid successfully");
      return data;
    }
  } catch (error) {
    console.error("Error in updateInvoiceStatusToPaidByOrderId:", error);
    toast.error("Failed to update invoice status");
    throw error;
  }
};

/**
 * Get invoice by order_id
 */
export const getInvoiceByOrderId = async (orderId: string): Promise<InvoiceItem | null> => {
  try {
    console.log("🚀 ~ Getting invoice for order_id:", orderId);

    // First try to find the invoice by order_id (it's stored in invoice_number)
    const { data: invoice, error: findError } = await supabase
      .from("client_invoices")
      .select("*")
      .or(`invoice_number.eq.INV-${orderId},invoice_number.like.%${orderId}%`)
      .single();

    if (!findError && invoice) {
      console.log("Invoice found by order_id:", invoice);
      return invoice;
    }

    console.warn("Invoice not found by order_id, trying to find via visa applications...");

    // Try to find via visa applications table
    const { data: application, error: appError } = await supabase
      .from("visa_applications")
      .select("id, invoice_id")
      .eq("order_id", orderId)
      .single();

    if (appError || !application) {
      console.error("Could not find invoice or application for order_id:", orderId);
      return null;
    }

    if (application.invoice_id) {
      // Get the invoice using the invoice_id from application
      const { data: invoiceData, error } = await supabase
        .from("client_invoices")
        .select("*")
        .eq("id", application.invoice_id)
        .single();

      if (error) {
        console.error("Error getting invoice:", error);
        return null;
      }

      console.log("Invoice found via application:", invoiceData);
      return invoiceData;
    } else {
      console.error("Application found but no invoice_id");
      return null;
    }
  } catch (error) {
    console.error("Error in getInvoiceByOrderId:", error);
    return null;
  }
};
