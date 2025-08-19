
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VisaConfig } from "@/types/visa";
import { DragEndEvent } from "@dnd-kit/core";

export const useVisaServices = (onDataChanged?: () => Promise<void>) => {
  const [visaServices, setVisaServices] = useState<VisaConfig[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [statusChangeProcessing, setStatusChangeProcessing] = useState<string | null>(null);

  const fetchVisaServices = async () => {
    try {
      setIsLoadingServices(true);
      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error("Error fetching visa services:", error);
        toast.error("Failed to load visa services");
        return;
      }

      // Transform database fields to match VisaConfig interface
      const transformedData = data.map(item => ({
        id: item.id,
        title: item.title,
        basePrice: item.baseprice,
        formTitle: item.formtitle,
        formDescription: item.formdescription,
        requiresMothersName: item.requiresmothersname,
        requiresNationalitySelection: item.requiresnationalityselection,
        requiresServiceSelection: item.requiresserviceselection,
        requiresAppointmentTypeSelection: item.requiresappointmenttypeselection,
        requiresLocationSelection: item.requireslocationselection,
        requiresVisaCitySelection: item.requiresvisacityselection,
        requiresSaudiIdIqama: item.requiressaudiidiqama,
        usaVisaCities: item.usavisacities,
        flag: item.flag,
        processingTime: item.processingtime,
        active: item.active,
        displayOrder: item.display_order,
        // Arabic translations
        title_ar: item.title_ar,
        formTitle_ar: item.formtitle_ar,
        formDescription_ar: item.formdescription_ar,
        processingTime_ar: item.processingtime_ar
      })) as VisaConfig[];

      setVisaServices(transformedData);
    } catch (error) {
      console.error("Error in fetchVisaServices:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchVisaServices();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    try {
      const oldIndex = visaServices.findIndex(service => service.id === active.id);
      const newIndex = visaServices.findIndex(service => service.id === over.id);
      
      const reorderedServices = [...visaServices];
      const [movedService] = reorderedServices.splice(oldIndex, 1);
      reorderedServices.splice(newIndex, 0, movedService);
      
      setVisaServices(reorderedServices);
      
      // Update display order in database
      const updates = reorderedServices.map((service, index) => ({
        id: service.id,
        display_order: index + 1,
        title: service.title,
        formtitle: service.formTitle,
        formdescription: service.formDescription,
        // Include Arabic translations to avoid them being reset
        title_ar: service.title_ar,
        formtitle_ar: service.formTitle_ar,
        formdescription_ar: service.formDescription_ar,
        processingtime_ar: service.processingTime_ar
      }));
      
      const { error } = await supabase
        .from('visa_services')
        .upsert(updates);
        
      if (error) {
        console.error("Error updating service order:", error);
        toast.error("Failed to save new order");
        await fetchVisaServices(); // Reload original order
        return;
      }
      
      toast.success("Service order updated");
    } catch (error) {
      console.error("Error in handleDragEnd:", error);
      toast.error("Failed to update service order");
      await fetchVisaServices(); // Reload original order
    }
  };

  const toggleServiceStatus = async (service: VisaConfig) => {
    if (!service.id) return;
    
    setStatusChangeProcessing(service.id);
    try {
      const { error } = await supabase
        .from('visa_services')
        .update({ active: !service.active })
        .eq('id', service.id);
      
      if (error) {
        console.error("Error updating service status:", error);
        toast.error("Failed to update service status");
        return;
      }
      
      toast.success(`Service ${service.active ? 'deactivated' : 'activated'} successfully`);
      
      // Refresh data after status change
      await fetchVisaServices();
      if (onDataChanged) {
        await onDataChanged();
      }
    } catch (error) {
      console.error("Error in toggleServiceStatus:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setStatusChangeProcessing(null);
    }
  };

  return {
    visaServices,
    isLoadingServices,
    statusChangeProcessing,
    fetchVisaServices,
    handleDragEnd,
    toggleServiceStatus
  };
};
