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
