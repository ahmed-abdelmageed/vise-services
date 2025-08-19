
import React from "react";
import { Input } from "@/components/ui/input";
import { TravellerData } from "@/types/visa";

interface TravellerFieldsProps {
  travellers: TravellerData[];
  handleTravellerChange: (index: number, field: keyof TravellerData, value: string) => void;
}

export const TravellerFields = ({
  travellers,
  handleTravellerChange
}: TravellerFieldsProps) => {
  return (
    <>
      {travellers.map((traveller, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <h4 className="font-medium">Traveller {index + 1}</h4>
          
          <div>
            <label htmlFor={`fullName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (as on passport) <span className="text-red-500">*</span>
            </label>
            <Input 
              id={`fullName-${index}`} 
              value={traveller.fullName} 
              onChange={e => handleTravellerChange(index, 'fullName', e.target.value)} 
              className="w-full" 
              required 
            />
          </div>
        </div>
      ))}
    </>
  );
};
