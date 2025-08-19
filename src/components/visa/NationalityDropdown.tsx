
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GCC_NATIONALITIES, OTHER_NATIONALITIES } from "@/utils/visaConstants";
import { VisaType } from "@/types/visa";

interface NationalityDropdownProps {
  visaType: VisaType;
  nationality: string;
  onNationalityChange: (value: string) => void;
}

export const NationalityDropdown = ({
  visaType,
  nationality,
  onNationalityChange
}: NationalityDropdownProps) => {
  if (visaType === 'other') {
    return (
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
          Select Nationality <span className="text-red-500">*</span>
        </label>
        <Select onValueChange={onNationalityChange} value={nationality}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select nationality" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {/* Add Saudi at the top of the list */}
            <SelectItem value="Saudi">Saudi Arabia</SelectItem>
            {OTHER_NATIONALITIES.filter(nat => nat !== "Saudi").map(nationality => 
              <SelectItem key={nationality} value={nationality}>
                {nationality}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (visaType === 'gcc') {
    return (
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
          Nationality <span className="text-red-500">*</span>
        </label>
        <Select onValueChange={onNationalityChange} value={nationality}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select nationality" />
          </SelectTrigger>
          <SelectContent>
            {GCC_NATIONALITIES.map(nationality => 
              <SelectItem key={nationality.value} value={nationality.value}>
                {nationality.label}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return null;
};
