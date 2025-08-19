
import { useState } from "react";
import { toast } from "sonner";
import { FooterData, QuickLink } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";
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
    { id: "about", label: "About Us", url: "/about" },
    { id: "contact", label: "Contact Us", url: "/contact" },
    { id: "terms", label: "Terms and Conditions", url: "/terms" },
    { id: "privacy", label: "Privacy Policy", url: "/privacy" }
  ]
};

export const useFooterEditor = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  
  // In a real implementation, this would fetch data from Supabase on component mount
  // useEffect(() => {
  //   const fetchFooterData = async () => {
  //     const { data, error } = await supabase
  //       .from('footer_settings')
  //       .select('*')
  //       .single();
  //
  //     if (data) setFooterData(data);
  //   };
  //
  //   fetchFooterData();
  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFooterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (id: string, field: 'label' | 'url', value: string) => {
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
      // In a real implementation, this would save to Supabase
      // const { error } = await supabase
      //   .from('footer_settings')
      //   .upsert(footerData);
      //
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('footerSettingsSaved'));
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error(t('errorSavingFooterSettings'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    footerData,
    isLoading,
    handleInputChange,
    handleLinkChange,
    addQuickLink,
    removeQuickLink,
    handleSave
  };
};
