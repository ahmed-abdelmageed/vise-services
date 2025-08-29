
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FooterData, QuickLink } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFooterInfo, useUpdateFooterItem, useCreateFooterItem } from "@/hooks/useFooterInfo";
import { FooterItem } from "@/api/footer";
import { v4 as uuidv4 } from 'uuid';

// Default footer settings - would be replaced by database values
const defaultFooterData: FooterData = {
  websiteName: "Global Visa Services",
  email: "visa@gvsksa.com",
  phone: "053199242",
  vatNumber: "000000000",
  crNumber: "000000000",
  tradeName: "Global Visa Services",
  quickLinks: [
    { id: "about", label: "About Us", labelAr: "من نحن", url: "/about" },
    { id: "contact", label: "Contact Us", labelAr: "اتصل بنا", url: "/contact" },
    { id: "terms", label: "Terms and Conditions", labelAr: "الشروط والأحكام", url: "/terms" },
    { id: "privacy", label: "Privacy Policy", labelAr: "سياسة الخصوصية", url: "/privacy" }
  ]
};

export const useFooterEditor = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [originalData, setOriginalData] = useState<FooterData>(defaultFooterData);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Fetch footer data from Supabase
  const { data: supabaseFooterData, isLoading: isFetching } = useFooterInfo();
  const updateFooterMutation = useUpdateFooterItem();
  const createFooterMutation = useCreateFooterItem();

  // Load data from Supabase when available
  useEffect(() => {
    if (supabaseFooterData && supabaseFooterData.length > 0) {
      const footerItem = supabaseFooterData[0]; // Assuming we use the first item
      
      // Map Supabase data to FooterData format
      const mappedData: FooterData = {
        websiteName: footerItem.web_name || defaultFooterData.websiteName,
        email: footerItem.email || defaultFooterData.email,
        phone: footerItem.phone || defaultFooterData.phone,
        vatNumber: footerItem.vat_num || defaultFooterData.vatNumber,
        crNumber: footerItem.cr_num || defaultFooterData.crNumber,
        tradeName: footerItem.trade_name || defaultFooterData.tradeName,
        quickLinks: footerItem.links ? footerItem.links.map(link => ({
          id: uuidv4(),
          label: link.label_en,
          labelAr: link.label_ar,
          url: link.link
        })) : defaultFooterData.quickLinks
      };
      
      setFooterData(mappedData);
      setOriginalData(mappedData);
      setHasChanges(false);
    }
  }, [supabaseFooterData]);

  // Check for changes whenever footerData changes
  useEffect(() => {
    const dataChanged = JSON.stringify(footerData) !== JSON.stringify(originalData);
    setHasChanges(dataChanged);
  }, [footerData, originalData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFooterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (id: string, field: 'label' | 'labelAr' | 'url', value: string) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  const addQuickLink = () => {
    const newLink: QuickLink = {
      id: uuidv4(),
      label: "",
      labelAr: "",
      url: "",
    };
    
    setFooterData(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, newLink]
    }));
    
    toast.success(t('newLinkAdded'));
  };
  
  const removeQuickLink = (id: string) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter(link => link.id !== id)
    }));
    
    toast.success(t('linkRemoved'));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Map FooterData to Supabase FooterItem format
      const footerItemData: Partial<FooterItem> = {
        web_name: footerData.websiteName,
        email: footerData.email,
        phone: footerData.phone,
        vat_num: footerData.vatNumber,
        cr_num: footerData.crNumber,
        trade_name: footerData.tradeName,
        links: footerData.quickLinks.map(link => ({
          label_ar: link.labelAr,
          label_en: link.label,
          link: link.url
        }))
      };

      // If we have existing data, update it; otherwise create new
      if (supabaseFooterData && supabaseFooterData.length > 0) {
        const existingId = supabaseFooterData[0].id;
        if (existingId) {
          await updateFooterMutation.mutateAsync({
            id: existingId,
            data: footerItemData
          });
        }
      } else {
        // Create new footer item
        await createFooterMutation.mutateAsync(footerItemData);
      }
      
      // Reset change tracking after successful save
      setOriginalData(footerData);
      setHasChanges(false);
      
      toast.success(t('footerSettingsSaved'));
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error(t('errorSavingFooterSettings'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFooterData(originalData);
    setHasChanges(false);
    toast.success(t('changesDiscarded'));
  };

  return {
    footerData,
    isLoading: isLoading || isFetching || updateFooterMutation.isPending || createFooterMutation.isPending,
    hasChanges,
    handleInputChange,
    handleLinkChange,
    addQuickLink,
    removeQuickLink,
    handleSave,
    handleCancel
  };
};
