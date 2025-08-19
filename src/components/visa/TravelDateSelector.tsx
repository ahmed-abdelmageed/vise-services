
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TravelDateSelectorProps {
  travelDate: Date | undefined;
  setTravelDate: (date: Date | undefined) => void;
}

export const TravelDateSelector = ({
  travelDate,
  setTravelDate
}: TravelDateSelectorProps) => {
  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
        Travel Date <span className="text-red-500">*</span>
      </label>
      <div className="border rounded-md p-1 bg-white w-full max-w-md mx-auto">
        <div className="flex justify-center">
          <Calendar 
            mode="single" 
            selected={travelDate} 
            onSelect={setTravelDate} 
            disabled={date => date < new Date()} 
            className="mx-auto" 
          />
        </div>
        {travelDate && (
          <div className="px-4 py-2 text-sm text-gray-600 border-t text-center">
            Selected: <span className="font-medium">{format(travelDate, 'PPP')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
