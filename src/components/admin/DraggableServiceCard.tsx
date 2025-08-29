import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { GripVertical, Fingerprint } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { VisaConfig } from "@/types/visa";
import { useIsMobile } from "@/hooks/use-mobile";

interface DraggableServiceCardProps {
  service: VisaConfig;
  onEdit: (service: VisaConfig) => void;
  onDelete: (service: VisaConfig) => void;
  onStatusChange: (service: VisaConfig) => void;
  statusChangeProcessing: string | null;
}

export const DraggableServiceCard = ({
  service,
  onEdit,
  onDelete,
  onStatusChange,
  statusChangeProcessing,
}: DraggableServiceCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: service.id || "" });

  const isMobile = useIsMobile();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Check if this is the home fingerprints service
  const isHomeFingerprints = service.title
    .toLowerCase()
    .includes("home fingerprints");

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="p-4">
        {isMobile ? (
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center justify-center gap-4 w-full">
              <div
                {...attributes}
                {...listeners}
                className="absolute top-1 left-1 cursor-grab hover:text-visa-gold"
              >
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="w-12 h-12 rounded-lg overflow-hidden bg-visa-light flex items-center justify-center">
                {isHomeFingerprints ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#001524] text-[#00e5e0]">
                    <Fingerprint size={26} />
                  </div>
                ) : service.flag ? (
                  <img
                    src={service.flag}
                    alt={`Flag for ${service.title}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error(
                        `Error loading image for ${service.title}:`,
                        (e.target as HTMLImageElement).src
                      );
                      (e.target as HTMLImageElement).src =
                        "https://flagcdn.com/w80/un.png";
                    }}
                  />
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-base truncate text-center">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                {service.formDescription}
              </p>
            </div>

            <div className="flex justify-center items-center gap-4">
              <Switch
                checked={service.active}
                onCheckedChange={() => onStatusChange(service)}
                disabled={statusChangeProcessing === service.id}
                className="h-7 min-h-4 w-16"
                thumbClassName="data-[state=unchecked]:-translate-x-9"
              />
              <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(service)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-4">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:text-visa-gold"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            <div className="w-12 h-12 rounded-lg overflow-hidden bg-visa-light flex items-center justify-center">
              {isHomeFingerprints ? (
                <div className="w-full h-full flex items-center justify-center bg-[#001524] text-[#00e5e0]">
                  <Fingerprint size={26} />
                </div>
              ) : service.flag ? (
                <img
                  src={service.flag}
                  alt={`Flag for ${service.title}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error(
                      `Error loading image for ${service.title}:`,
                      (e.target as HTMLImageElement).src
                    );
                    (e.target as HTMLImageElement).src =
                      "https://flagcdn.com/w80/un.png";
                  }}
                />
              ) : null}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-base sm:text-lg truncate">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 line-clamp-2 sm:line-clamp-none">
                {service.formDescription}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={service.active}
                onCheckedChange={() => onStatusChange(service)}
                disabled={statusChangeProcessing === service.id}
              />
              <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(service)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
