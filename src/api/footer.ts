import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

export interface Link {
  label_ar: string;
  label_en: string;
  link: string;
}

export interface FooterItem {
  id?: string;
  created_at?: string;
  web_name?: string;
  email?: string;
  phone?: string;
  links: Link[];
  vat_num?: string;
  cr_num?: string;
  trade_name?: string;
  updated_at?: string;
}

export const fetchFooterInfo = async () => {
  try {
    const { data, error } = await supabase.from("Footer").select("*");

    if (error) {
      console.error("Error fetching footer info:", error);
      toast.error("Failed to load footer info");
      return;
    }
    return data;
  } catch (error) {
    console.error("Error in fetchFooterInfo:", error);
    toast.error("An unexpected error occurred");
  }
};

export const createFooterItem = async (footerData: Partial<FooterItem>) => {
  try {
    const { data, error } = await supabase
      .from("Footer")
      .insert([footerData])
      .select()
      .single();

    if (error) {
      console.error("Error creating footer item:", error);
      toast.error("Failed to create footer item");
      throw error;
    }

    toast.success("Footer item created successfully");
    return data;
  } catch (error) {
    console.error("Error in createFooterItem:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};

export const updateFooterItem = async (
  id: string,
  footerData: Partial<FooterItem>
) => {
  try {
    const { data, error } = await supabase
      .from("Footer")
      .update(footerData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating footer item:", error);
      toast.error("Failed to update footer item");
      throw error;
    }

    toast.success("Footer item updated successfully");
    return data;
  } catch (error) {
    console.error("Error in updateFooterItem:", error);
    toast.error("An unexpected error occurred");
    throw error;
  }
};
