
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FooterData } from "./types";

interface LegalInfoTabProps {
  footerData: FooterData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LegalInfoTab: React.FC<LegalInfoTabProps> = ({
  footerData,
  handleInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vatNumber">VAT Number</Label>
        <Input 
          id="vatNumber" 
          name="vatNumber" 
          value={footerData.vatNumber} 
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="crNumber">CR Number</Label>
        <Input 
          id="crNumber" 
          name="crNumber" 
          value={footerData.crNumber} 
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tradeName">Trade Name</Label>
        <Input 
          id="tradeName" 
          name="tradeName" 
          value={footerData.tradeName} 
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
