
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EditVisaServiceDialog } from "./modals/EditVisaServiceDialog";
import { AddVisaServiceDialog } from "./modals/AddVisaServiceDialog";
import { DeleteVisaServiceDialog } from "./modals/DeleteVisaServiceDialog";
import { VisaConfig } from "@/types/visa";
import { useVisaServices } from "@/hooks/useVisaServices";
import { VisaServicesSectionHeader } from "./visa-services/VisaServicesSectionHeader";
import { VisaServicesList } from "./visa-services/VisaServicesList";

interface VisaServicesSectionProps {
  isLoading: boolean;
  onDataChanged: () => Promise<void>;
}

export const VisaServicesSection = ({ isLoading, onDataChanged }: VisaServicesSectionProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<VisaConfig | null>(null);

  const {
    visaServices,
    isLoadingServices,
    statusChangeProcessing,
    fetchVisaServices,
    handleDragEnd,
    toggleServiceStatus
  } = useVisaServices(onDataChanged);

  const handleAddService = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditService = (service: VisaConfig) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = (service: VisaConfig) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleServiceUpdated = async () => {
    await fetchVisaServices();
    if (onDataChanged) {
      await onDataChanged();
    }
  };

  if (isLoadingServices) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VisaServicesSectionHeader onAddNew={handleAddService} />

      <div className="bg-white rounded-lg shadow p-6">
        <VisaServicesList
          services={visaServices}
          onDragEnd={handleDragEnd}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onStatusChange={toggleServiceStatus}
          onAddNew={handleAddService}
          statusChangeProcessing={statusChangeProcessing}
        />
      </div>

      <EditVisaServiceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        service={selectedService}
        onServiceUpdated={handleServiceUpdated}
      />

      <AddVisaServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onServiceAdded={handleServiceUpdated}
      />

      <DeleteVisaServiceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        service={selectedService}
        onServiceDeleted={handleServiceUpdated}
      />
    </div>
  );
};
