import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

export interface VisaServiceItem {
  id?: string;
  title: string;
  formtitle: string;
  formdescription: string;
  baseprice: number;
  flag?: string | null;
  processingtime?: string | null;
  active?: boolean;
  requiresmothersname?: boolean;
  requiresnationalityselection?: boolean;
  requiresserviceselection?: boolean;
  requiresappointmenttypeselection?: boolean;
  requireslocationselection?: boolean;
  requiresvisacityselection?: boolean;
  requiressaudiidiqama?: boolean;
  usavisacities?: any;
  created_at?: string;
  updated_at?: string;
  display_order?: number;
  // Arabic translations
  title_ar?: string | null;
  formtitle_ar?: string | null;
  formdescription_ar?: string | null;
  processingtime_ar?: string | null;
}

export const fetchVisaServices = async (active_only?: boolean) => {
  try {
    let query = supabase
      .from("visa_services")
      .select("*");

    // Only apply the active filter if active_only is defined
    if (active_only !== undefined) {
      query = query.eq("active", active_only);
    }

    const { data, error } = await query.order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching visa services:", error);
      toast.error("Failed to load visa services");
      return;
    }
    return data;
  } catch (error) {
    console.error("Error in fetchVisaServices:", error);
    toast.error("An unexpected error occurred");
  }
};

export const createVisaService = async (
  visaServiceData: Partial<VisaServiceItem>
) => {
  try {
    const { data, error } = await supabase
      .from("visa_services")
      .insert([visaServiceData])
      .select()
      .single();

    if (error) {
      console.error("Error creating visa service:", error);
      toast.error("Failed to create visa service");
      throw error;
    }

    toast.success("Visa service created successfully");
    return data;
  } catch (error) {
    console.error("Error in createVisaService:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const updateVisaService = async (
  id: string,
  visaServiceData: Partial<VisaServiceItem>
) => {
  try {
    const { data, error } = await supabase
      .from("visa_services")
      .update(visaServiceData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating visa service:", error);
      toast.error("Failed to update visa service");
      throw error;
    }

    toast.success("Visa service updated successfully");
    return data;
  } catch (error) {
    console.error("Error in updateVisaService:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const deleteVisaService = async (id: string) => {
  try {
    const { error } = await supabase
      .from("visa_services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting visa service:", error);
      toast.error("Failed to delete visa service");
      throw error;
    }

    toast.success("Visa service deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteVisaService:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const toggleVisaServiceStatus = async (id: string, active: boolean) => {
  try {
    const { data, error } = await supabase
      .from("visa_services")
      .update({ active })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling visa service status:", error);
      toast.error("Failed to update visa service status");
      throw error;
    }

    toast.success(
      `Visa service ${active ? "activated" : "deactivated"} successfully`
    );
    return data;
  } catch (error) {
    console.error("Error in toggleVisaServiceStatus:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const updateVisaServiceOrder = async (
  updates: { id: string; display_order: number }[]
) => {
  try {
    const promises = updates.map((update) =>
      supabase
        .from("visa_services")
        .update({ display_order: update.display_order })
        .eq("id", update.id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      console.error("Error updating visa service order:", errors);
      toast.error("Failed to update visa service order");
      throw new Error("Failed to update order");
    }

    toast.success("Visa service order updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateVisaServiceOrder:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};
