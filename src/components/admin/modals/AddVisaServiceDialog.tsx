
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { FlagDropdown } from "../FlagDropdown";

interface AddVisaServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceAdded: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  formTitle: z.string().min(1, "Form title is required"),
  formDescription: z.string().min(1, "Form description is required"),
  basePrice: z.coerce.number().positive("Price must be positive"),
  flag: z.string().optional(),
  processingTime: z.string().optional(),
  active: z.boolean().default(true),
  requiresMothersName: z.boolean().default(false),
  requiresNationalitySelection: z.boolean().default(false),
  requiresServiceSelection: z.boolean().default(false),
  requiresAppointmentTypeSelection: z.boolean().default(false),
  requiresLocationSelection: z.boolean().default(false),
  requiresVisaCitySelection: z.boolean().default(false),
  requiresSaudiIdIqama: z.boolean().default(false),
  idFilesRequired: z.boolean().default(false),
  salaryProofRequired: z.boolean().default(false),
  photoFilesRequired: z.boolean().default(false),
  passportFilesRequired: z.boolean().default(false),
  // Arabic translations
  title_ar: z.string().optional(),
  formTitle_ar: z.string().optional(),
  formDescription_ar: z.string().optional(),
  processingTime_ar: z.string().optional(),
});

export const AddVisaServiceDialog = ({
  open,
  onOpenChange,
  onServiceAdded,
}: AddVisaServiceDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      formTitle: "",
      formDescription: "",
      basePrice: 450,
      flag: "",
      processingTime: "Processing time: 5-7 days",
      active: true,
      requiresMothersName: false,
      requiresNationalitySelection: false,
      requiresServiceSelection: false,
      requiresAppointmentTypeSelection: false,
      requiresLocationSelection: false,
      requiresVisaCitySelection: false,
      requiresSaudiIdIqama: false,
      idFilesRequired: false,
      salaryProofRequired: false,
      photoFilesRequired: false,
      passportFilesRequired: false,
      // Arabic translations
      title_ar: "",
      formTitle_ar: "",
      formDescription_ar: "",
      processingTime_ar: "وقت المعالجة: 5-7 أيام",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Create default visa cities for USA visas
      const usaVisaCities = data.requiresVisaCitySelection ? ["Riyadh", "Jeddah", "Dhahran"] : null;
      
      // Map form fields to database column names
      const { error } = await supabase
        .from('visa_services')
        .insert({
          title: data.title,
          formtitle: data.formTitle,
          formdescription: data.formDescription,
          baseprice: data.basePrice,
          flag: data.flag,
          processingtime: data.processingTime || "Processing time: 5-7 days",
          active: data.active,
          requiresmothersname: data.requiresMothersName,
          requiresnationalityselection: data.requiresNationalitySelection,
          requiresserviceselection: data.requiresServiceSelection,
          requiresappointmenttypeselection: data.requiresAppointmentTypeSelection,
          requireslocationselection: data.requiresLocationSelection,
          requiresvisacityselection: data.requiresVisaCitySelection,
          requiressaudiidiqama: data.requiresSaudiIdIqama,
          id_files_required: data.idFilesRequired,
          salary_proof_required: data.salaryProofRequired,
          photo_files_required: data.photoFilesRequired,
          passport_files_required: data.passportFilesRequired,
          usavisacities: usaVisaCities,
          // Arabic translations
          title_ar: data.title_ar || data.title,
          formtitle_ar: data.formTitle_ar || data.formTitle,
          formdescription_ar: data.formDescription_ar || data.formDescription,
          processingtime_ar: data.processingTime_ar || "وقت المعالجة: 5-7 أيام",
        });

      if (error) {
        console.error("Error adding visa service:", error);
        toast.error("Failed to add visa service");
        return;
      }

      toast.success("Visa service added successfully");
      form.reset();
      onServiceAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to copy English content to Arabic fields
  const copyToArabic = () => {
    form.setValue("title_ar", form.getValues("title"));
    form.setValue("formTitle_ar", form.getValues("formTitle"));
    form.setValue("formDescription_ar", form.getValues("formDescription"));
    form.setValue("processingTime_ar", form.getValues("processingTime").replace("Processing time", "وقت المعالجة"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addNewVisaService')}</DialogTitle>
          <DialogDescription>
            {t('createNewVisaService')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
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
                        <FormDescription>
                          {t('serviceTitleDesc')}
                        </FormDescription>
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
                        <textarea
                          placeholder={t('formDescriptionPlaceholder')}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('formDescriptionDesc')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="flag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Flag</FormLabel>
                        <FormControl>
                          <FlagDropdown
                            currentFlag={field.value}
                            onFlagSelected={(flagUrl) => field.onChange(flagUrl)}
                          />
                        </FormControl>
                        <FormDescription>
                          Select a country flag from the dropdown
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                </div>
                
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={copyToArabic}
                  className="w-full"
                >
                  {t('copyEnglishToArabic')}
                </Button>
              </TabsContent>
              
              <TabsContent value="arabic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('serviceTitleArabic')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('serviceTitleArabicPlaceholder')} {...field} className="text-right" dir="rtl" />
                        </FormControl>
                        <FormDescription>
                          {t('serviceTitleArabicDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="formTitle_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formTitleArabic')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('formTitleArabicPlaceholder')} {...field} className="text-right" dir="rtl" />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('activeStatus')}</FormLabel>
                        <FormDescription>
                          {t('activeStatusDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresMothersName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('mothersNameRequired')}</FormLabel>
                        <FormDescription>
                          {t('mothersNameRequiredDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresNationalitySelection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('nationalitySelection')}</FormLabel>
                        <FormDescription>
                          {t('nationalitySelectionDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresServiceSelection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('serviceSelectionRequired')}</FormLabel>
                        <FormDescription>
                          {t('serviceSelectionRequiredDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requiresAppointmentTypeSelection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('appointmentSelection')}</FormLabel>
                        <FormDescription>
                          {t('appointmentSelectionDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresLocationSelection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('locationSelectionRequired')}</FormLabel>
                        <FormDescription>
                          {t('locationSelectionRequiredDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresVisaCitySelection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('visaCitySelection')}</FormLabel>
                        <FormDescription>
                          {t('visaCitySelectionDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresSaudiIdIqama"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{t('saudiIdIqamaRequired')}</FormLabel>
                        <FormDescription>
                          {t('saudiIdIqamaRequiredDesc')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-visa-gold hover:bg-visa-gold/90"
              >
                {isSubmitting ? (
                  <><Loader className="mr-2 h-4 w-4 animate-spin" /> {t('adding')}</>
                ) : (
                  <><PlusCircle className="mr-2 h-4 w-4" /> {t('addService')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
