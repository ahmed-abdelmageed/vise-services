
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditVisaServiceFormValues } from "@/hooks/useEditVisaServiceForm";
import { FlagDropdown } from "../../FlagDropdown";
import { Fingerprint } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface GeneralFieldsProps {
  form: UseFormReturn<EditVisaServiceFormValues>;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const GeneralFields = ({ form, activeTab = "english", onTabChange }: GeneralFieldsProps) => {
  const { t } = useLanguage();
  // Check if this is the Home Fingerprints service based on the title
  const isHomeFingerprints = form.watch('title').toLowerCase().includes('home fingerprints');

  // Helper function to copy English content to Arabic fields
  const copyToArabic = () => {
    form.setValue("title_ar", form.getValues("title"));
    form.setValue("formTitle_ar", form.getValues("formTitle"));
    form.setValue("formDescription_ar", form.getValues("formDescription"));
    
    const processingTime = form.getValues("processingTime");
    if (processingTime) {
      form.setValue("processingTime_ar", processingTime.replace("Processing time", "وقت المعالجة"));
    }
  };

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="english">{t('english')}</TabsTrigger>
        <TabsTrigger value="arabic">{t('arabic')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="english" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('serviceTitle')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('serviceTitlePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('basePrice')}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="formTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('formTitle')}</FormLabel>
              <FormControl>
                <Input placeholder={t('formTitlePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('formTitleDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="formDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('formDescription')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('formDescriptionPlaceholder')} 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                {t('formDescriptionDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isHomeFingerprints ? (
          <FormItem>
            <FormLabel>{t('icon')}</FormLabel>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-[#001524] flex items-center justify-center text-[#00e5e0]">
                <Fingerprint size={32} />
              </div>
              <FormDescription>
                {t('homeFingerprints')}
              </FormDescription>
            </div>
          </FormItem>
        ) : (
          <FormField
            control={form.control}
            name="flag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('countryFlag')}</FormLabel>
                <FormControl>
                  <FlagDropdown
                    currentFlag={field.value}
                    onFlagSelected={(flagUrl) => field.onChange(flagUrl)}
                  />
                </FormControl>
                <FormDescription>
                  {t('countryFlagDesc')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="processingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('processingTime')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('processingTimePlaceholder')} 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="button" 
          variant="secondary"
          onClick={copyToArabic}
          className="w-full"
        >
          {t('copyToArabic')}
        </Button>
      </TabsContent>
      
      <TabsContent value="arabic" className="space-y-6">
        <FormField
          control={form.control}
          name="title_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('serviceTitleArabic')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('serviceTitleArabicPlaceholder')} 
                  {...field} 
                  className="text-right" 
                  dir="rtl"
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                {t('serviceTitleArabicDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="formTitle_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('formTitleArabic')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('formTitleArabicPlaceholder')} 
                  {...field} 
                  className="text-right" 
                  dir="rtl"
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                {t('formTitleArabicDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="formDescription_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('formDescriptionArabic')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('formDescriptionArabicPlaceholder')} 
                  {...field} 
                  rows={3}
                  className="text-right"
                  dir="rtl"
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                {t('formDescriptionArabicDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="processingTime_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('processingTimeArabic')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('processingTimeArabicPlaceholder')} 
                  {...field} 
                  value={field.value || ""}
                  className="text-right"
                  dir="rtl"
                />
              </FormControl>
              <FormDescription>
                {t('processingTimeArabicDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
};
