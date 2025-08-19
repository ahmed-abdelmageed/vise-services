
import React from "react";
import { VisaConfig } from "@/types/visa";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableServiceCard } from "../DraggableServiceCard";
import { EmptyState } from "../EmptyState";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface VisaServicesListProps {
  services: VisaConfig[];
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (service: VisaConfig) => void;
  onDelete: (service: VisaConfig) => void;
  onStatusChange: (service: VisaConfig) => void;
  onAddNew: () => void;
  statusChangeProcessing: string | null;
}

export const VisaServicesList = ({
  services,
  onDragEnd,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNew,
  statusChangeProcessing
}: VisaServicesListProps) => {
  if (services.length === 0) {
    return (
      <EmptyState
        title="No visa services yet"
        description="Add your first visa service to get started"
        action={
          <Button onClick={onAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Service
          </Button>
        }
      />
    );
  }

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext 
        items={services.map(s => s.id || '')}
        strategy={verticalListSortingStrategy}
      >
        {services.map((service) => (
          <DraggableServiceCard
            key={service.id}
            service={service}
            onEdit={() => onEdit(service)}
            onDelete={() => onDelete(service)}
            onStatusChange={() => onStatusChange(service)}
            statusChangeProcessing={statusChangeProcessing}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
