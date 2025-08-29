
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuickLink } from "./types";
import { Plus, Trash2 } from "lucide-react";

interface QuickLinksTabProps {
  quickLinks: QuickLink[];
  handleLinkChange: (id: string, field: 'label' | 'labelAr' | 'url', value: string) => void;
  addQuickLink: () => void;
  removeQuickLink: (id: string) => void;
}

export const QuickLinksTab: React.FC<QuickLinksTabProps> = ({
  quickLinks,
  handleLinkChange,
  addQuickLink,
  removeQuickLink,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quick Links</h3>
        <Button 
          onClick={addQuickLink} 
          size="sm" 
          className="bg-visa-gold hover:bg-visa-gold/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>
      
      {quickLinks.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-md border-gray-300">
          <p className="text-muted-foreground">No quick links added yet. Click the button above to add your first link.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quickLinks.map((link) => (
            <div key={link.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md relative">
              <div className="space-y-2">
                <Label htmlFor={`link-label-${link.id}`}>Link Label (English)</Label>
                <Input 
                  id={`link-label-${link.id}`}
                  value={link.label}
                  onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                  placeholder="About Us"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`link-label-ar-${link.id}`}>Link Label (Arabic)</Label>
                <Input 
                  id={`link-label-ar-${link.id}`}
                  value={link.labelAr}
                  onChange={(e) => handleLinkChange(link.id, 'labelAr', e.target.value)}
                  placeholder="من نحن"
                  dir="rtl"
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`link-url-${link.id}`}>Link URL</Label>
                <Input 
                  id={`link-url-${link.id}`}
                  value={link.url}
                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                  placeholder="/about"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                onClick={() => removeQuickLink(link.id)}
                title="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
