import { useState } from "react";
import { toast } from "sonner";
import { VisaConfig } from "@/types/visa";
import { DragEndEvent } from "@dnd-kit/core";
import {
  useVisaServices as useVisaServicesQuery,
  useToggleVisaServiceStatus,
  useUpdateVisaServiceOrder,
  useOptimisticReorder
} from "./useVisaServicesQuery";

export const useVisaServices = (onDataChanged?: () => Promise<void>) => {
  const [statusChangeProcessing, setStatusChangeProcessing] = useState<
    string | null
  >(null);

  // Use React Query hooks
  const { data: visaServicesData, isLoading: isLoadingServices, refetch: refetchVisaServices } = useVisaServicesQuery({ active_only: undefined });
  const toggleStatusMutation = useToggleVisaServiceStatus();
  const updateOrderMutation = useUpdateVisaServiceOrder();
  const { optimisticReorder, revertOptimisticUpdate } = useOptimisticReorder();

  // Transform the data to match the expected VisaConfig format
  const visaServices: VisaConfig[] = visaServicesData?.map(item => ({
    id: item.id,
    title: item.title,
    basePrice: item.baseprice,
    formTitle: item.formtitle,
    formDescription: item.formdescription,
    requiresMothersName: item.requiresmothersname || false,
    requiresNationalitySelection: item.requiresnationalityselection || false,
    requiresServiceSelection: item.requiresserviceselection || false,
    requiresAppointmentTypeSelection: item.requiresappointmenttypeselection || false,
    requiresLocationSelection: item.requireslocationselection || false,
    requiresVisaCitySelection: item.requiresvisacityselection || false,
    requiresSaudiIdIqama: item.requiressaudiidiqama || false,
    usaVisaCities: item.usavisacities,
    flag: item.flag,
    processingTime: item.processingtime,
    active: item.active,
    displayOrder: item.display_order,
    // Arabic translations
    title_ar: item.title_ar,
    formTitle_ar: item.formtitle_ar,
    formDescription_ar: item.formdescription_ar,
    processingTime_ar: item.processingtime_ar,
  })) || [];

  const fetchVisaServices = async () => {
    await refetchVisaServices();
    if (onDataChanged) {
      await onDataChanged();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    try {
      const oldIndex = visaServices.findIndex(
        (service) => service.id === active.id
      );
      const newIndex = visaServices.findIndex(
        (service) => service.id === over.id
      );

      const reorderedServices = [...visaServices];
      const [movedService] = reorderedServices.splice(oldIndex, 1);
      reorderedServices.splice(newIndex, 0, movedService);

      // Optimistic update
      const optimisticData = reorderedServices.map(item => ({
        id: item.id,
        title: item.title,
        formtitle: item.formTitle,
        formdescription: item.formDescription,
        baseprice: item.basePrice,
        flag: item.flag,
        processingtime: item.processingTime,
        active: item.active,
        requiresmothersname: item.requiresMothersName,
        requiresnationalityselection: item.requiresNationalitySelection,
        requiresserviceselection: item.requiresServiceSelection,
        requiresappointmenttypeselection: item.requiresAppointmentTypeSelection,
        requireslocationselection: item.requiresLocationSelection,
        requiresvisacityselection: item.requiresVisaCitySelection,
        requiressaudiidiqama: item.requiresSaudiIdIqama,
        usavisacities: item.usaVisaCities,
        display_order: 0, // Will be set below
        title_ar: item.title_ar,
        formtitle_ar: item.formTitle_ar,
        formdescription_ar: item.formDescription_ar,
        processingtime_ar: item.processingTime_ar,
      }));

      optimisticReorder(optimisticData);

      // Update display order in database
      const updates = reorderedServices.map((service, index) => ({
        id: service.id!,
        display_order: index + 1,
      }));

      await updateOrderMutation.mutateAsync(updates);

      toast.success("Service order updated");
      
      if (onDataChanged) {
        await onDataChanged();
      }
    } catch (error) {
      console.error("Error in handleDragEnd:", error);
      toast.error("Failed to update service order");
      revertOptimisticUpdate();
    }
  };

  const toggleServiceStatus = async (service: VisaConfig) => {
    if (!service.id) return;

    setStatusChangeProcessing(service.id);
    try {
      await toggleStatusMutation.mutateAsync({
        id: service.id,
        active: !service.active
      });

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
    toggleServiceStatus,
  };
};
