
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface TravellerCounterProps {
  numberOfTravellers: number;
  incrementTravellers: () => void;
  decrementTravellers: () => void;
}

export const TravellerCounter = ({
  numberOfTravellers,
  incrementTravellers,
  decrementTravellers
}: TravellerCounterProps) => {
  return (
    <div>
      <label htmlFor="numberOfTravellers" className="block text-sm font-medium text-gray-700 mb-1">
        No. of Travellers <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center justify-center space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className={`rounded-full h-8 w-8 ${numberOfTravellers <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={decrementTravellers} 
          disabled={numberOfTravellers <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium w-8 text-center">{numberOfTravellers}</span>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="rounded-full h-8 w-8" 
          onClick={incrementTravellers}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
