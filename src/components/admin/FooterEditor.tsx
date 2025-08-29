
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Save, X } from "lucide-react";
import { useFooterEditor } from "./footer-editor/useFooterEditor";
import { GeneralInfoTab } from "./footer-editor/GeneralInfoTab";
import { QuickLinksTab } from "./footer-editor/QuickLinksTab";
import { LegalInfoTab } from "./footer-editor/LegalInfoTab";

export const FooterEditor = () => {
  const { t } = useLanguage();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const { 
    footerData, 
    isLoading, 
    hasChanges,
    handleInputChange, 
    handleLinkChange,
    addQuickLink,
    removeQuickLink,
    handleSave,
    handleCancel
  } = useFooterEditor();

  const onCancelClick = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      handleCancel();
    }
  };

  const confirmCancel = () => {
    handleCancel();
    setShowCancelDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('footerEditor')}</CardTitle>
        <CardDescription>{t('manageFooterContent')}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
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
        
        <div className="mt-6 flex justify-end gap-3">
          <Button 
            onClick={onCancelClick}
            disabled={isLoading || !hasChanges}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="mr-2 h-4 w-4" />
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="bg-visa-gold hover:bg-visa-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('saving') : t('saveChanges')}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmCancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('cancelConfirmationMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              {t('keepEditing')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('discardChanges')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
