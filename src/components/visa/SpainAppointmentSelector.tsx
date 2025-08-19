import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VISA_LOCATIONS } from "@/utils/visaConstants";

interface SpainAppointmentSelectorProps {
  location: string;
  setLocation: (location: string) => void;
  appointmentType: string;
  setAppointmentType: (type: string) => void;
}

export const SpainAppointmentSelector: React.FC<SpainAppointmentSelectorProps> = ({
  location,
  setLocation,
  appointmentType,
  setAppointmentType,
}) => {
  const appointmentTypes = [
    { id: "standard", name: "Standard", price: 0 },
    { id: "premium", name: "Premium", price: 150 },
    { id: "vip", name: "VIP", price: 300 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Select Appointment Details</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Select Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[100%]">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {VISA_LOCATIONS.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="appointmentType">Select Appointment Type</Label>
          <Select value={appointmentType} onValueChange={setAppointmentType}>
            <SelectTrigger className="w-[100%]">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
