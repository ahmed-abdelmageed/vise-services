
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FooterData } from "./types";

interface GeneralInfoTabProps {
  footerData: FooterData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  footerData,
  handleInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="websiteName">Website Name</Label>
        <Input 
          id="websiteName" 
          name="websiteName" 
          value={footerData.websiteName} 
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          value={footerData.email} 
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={footerData.phone} 
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
