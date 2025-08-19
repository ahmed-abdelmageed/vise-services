
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface VisaServicesSectionHeaderProps {
  onAddNew: () => void;
}

export const VisaServicesSectionHeader = ({ onAddNew }: VisaServicesSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-visa-dark">Visa Services</h2>
      <Button onClick={onAddNew} className="bg-visa-gold hover:bg-visa-gold/90">
        <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
      </Button>
    </div>
  );
};
