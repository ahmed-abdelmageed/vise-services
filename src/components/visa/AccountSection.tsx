import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VISA_LOCATIONS } from "@/utils/visaConstants";

interface AccountSectionProps {
  nationality: string;
  setNationality: (nationality: string) => void;
  location: string;
  setLocation: (location: string) => void;
  mothersName: string;
  setMothersName: (mothersName: string) => void;
  requiresNationalitySelection?: boolean;
  requiresLocationSelection?: boolean;
  requiresMothersName?: boolean;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  nationality,
  setNationality,
  mothersName,
  setMothersName,
  location,
  setLocation,
  requiresNationalitySelection = false,
  requiresLocationSelection = false,
  requiresMothersName = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Account Information</h3>
      <div className="grid gap-4">
        {requiresNationalitySelection && (
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              placeholder="Enter your nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>
        )}
        {requiresMothersName && (
          <div className="space-y-2">
            <Label htmlFor="mothersName">Mother's Name</Label>
            <Input
              id="mothersName"
              placeholder="Enter your mother's name"
              value={mothersName}
              onChange={(e) => setMothersName(e.target.value)}
            />
          </div>
        )}
        {requiresLocationSelection && (
          <div className="space-y-2">
            <Label htmlFor="location">Select Location</Label>
            <Select onValueChange={setLocation} defaultValue={location}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {VISA_LOCATIONS.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
