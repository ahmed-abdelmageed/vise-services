
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { useFooterEditor } from "./footer-editor/useFooterEditor";
import { GeneralInfoTab } from "./footer-editor/GeneralInfoTab";
import { QuickLinksTab } from "./footer-editor/QuickLinksTab";
import { LegalInfoTab } from "./footer-editor/LegalInfoTab";

export const FooterEditor = () => {
  const { t } = useLanguage();
  const { 
    footerData, 
    isLoading, 
    handleInputChange, 
    handleLinkChange,
    addQuickLink,
    removeQuickLink,
    handleSave 
  } = useFooterEditor();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('footerEditor')}</CardTitle>
        <CardDescription>{t('manageFooterContent')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">{t('generalInfo')}</TabsTrigger>
            <TabsTrigger value="links">{t('quickLinks')}</TabsTrigger>
            <TabsTrigger value="legal">{t('legalInfo')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralInfoTab 
              footerData={footerData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
          
          <TabsContent value="links">
            <QuickLinksTab 
              quickLinks={footerData.quickLinks}
              handleLinkChange={handleLinkChange}
              addQuickLink={addQuickLink}
              removeQuickLink={removeQuickLink}
            />
          </TabsContent>
          
          <TabsContent value="legal">
            <LegalInfoTab 
              footerData={footerData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-visa-gold hover:bg-visa-gold/90"
          >
            {isLoading ? t('saving') : t('saveChanges')}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
