
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoSettingsProps {
  companyInfo: {
    name: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  isSaving: boolean;
  onCompanyInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (settingKey: string, data: any) => Promise<void>;
}

export function CompanyInfoSettings({ 
  companyInfo, 
  isSaving, 
  onCompanyInfoChange, 
  onSave 
}: CompanyInfoSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Update your company details and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input 
              id="name" 
              value={companyInfo.name} 
              onChange={onCompanyInfoChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={companyInfo.website} 
              onChange={onCompanyInfoChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input 
              id="email" 
              value={companyInfo.email} 
              onChange={onCompanyInfoChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={companyInfo.phone} 
              onChange={onCompanyInfoChange} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Input 
            id="address" 
            value={companyInfo.address} 
            onChange={onCompanyInfoChange} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              value={companyInfo.city} 
              onChange={onCompanyInfoChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              value={companyInfo.state} 
              onChange={onCompanyInfoChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input 
              id="zip" 
              value={companyInfo.zip} 
              onChange={onCompanyInfoChange} 
            />
          </div>
        </div>
        <Button 
          className="bg-visa-gold hover:bg-visa-gold/90 mt-4"
          onClick={() => onSave('company_info', companyInfo)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
