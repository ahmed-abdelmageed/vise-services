
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
      
      // If the title includes a country name, attempt to set a default flag
      const countryName = data.title.split(' ')[0].toLowerCase();
      const defaultFlag = data.flag || `https://flagcdn.com/w80/${countryName.slice(0, 2)}.png`;
      
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
          flag: defaultFlag,
          processingtime: data.processingTime || "Processing time: 5-7 days",
          active: data.active,
          requiresmothersname: data.requiresMothersName,
          requiresnationalityselection: data.requiresNationalitySelection,
          requiresserviceselection: data.requiresServiceSelection,
          requiresappointmenttypeselection: data.requiresAppointmentTypeSelection,
          requireslocationselection: data.requiresLocationSelection,
          requiresvisacityselection: data.requiresVisaCitySelection,
          requiressaudiidiqama: data.requiresSaudiIdIqama,
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
          <DialogTitle>Add New Visa Service</DialogTitle>
          <DialogDescription>
            Create a new visa service to be displayed on the website.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">العربية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., USA Visa" {...field} />
                        </FormControl>
                        <FormDescription>
                          Country name followed by "Visa" (e.g., USA Visa).
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
                        <FormLabel>Base Price (SAR)</FormLabel>
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
                      <FormLabel>Form Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., USA Visa Application" {...field} />
                      </FormControl>
                      <FormDescription>
                        This title appears at the top of the application form.
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
                      <FormLabel>Form Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide your information to apply for a USA Visa" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description shown below the form title.
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
                        <FormLabel>Flag URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://flagcdn.com/w80/us.png" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          URL to the country flag image. Will be auto-generated if left empty.
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
                        <FormLabel>Processing Time</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Processing time: 3-5 days" 
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
                  Copy English Content to Arabic Fields
                </Button>
              </TabsContent>
              
              <TabsContent value="arabic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Title (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: تأشيرة أمريكا" {...field} className="text-right" dir="rtl" />
                        </FormControl>
                        <FormDescription>
                          Arabic translation of the service title.
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
                      <FormLabel>Form Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: طلب تأشيرة أمريكا" {...field} className="text-right" dir="rtl" />
                      </FormControl>
                      <FormDescription>
                        Arabic translation of the form title.
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
                      <FormLabel>Form Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="قدم معلوماتك للتقديم على تأشيرة أمريكا" 
                          {...field} 
                          rows={3}
                          className="text-right"
                          dir="rtl"
                        />
                      </FormControl>
                      <FormDescription>
                        Arabic translation of the form description.
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
                      <FormLabel>Processing Time (Arabic)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="وقت المعالجة: 3-5 أيام" 
                          {...field} 
                          value={field.value || ""}
                          className="text-right"
                          dir="rtl"
                        />
                      </FormControl>
                      <FormDescription>
                        Arabic translation of the processing time.
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
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Display this visa service on the website.
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
                        <FormLabel>Mother's Name Required</FormLabel>
                        <FormDescription>
                          Require mother's name in the application form.
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
                        <FormLabel>Nationality Selection</FormLabel>
                        <FormDescription>
                          Show nationality selection page (e.g., GCC or Others).
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
                        <FormLabel>Service Selection Required</FormLabel>
                        <FormDescription>
                          Allow selecting between different service options.
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
                        <FormLabel>Appointment Selection</FormLabel>
                        <FormDescription>
                          Enable selection of appointment types.
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
                        <FormLabel>Location Selection Required</FormLabel>
                        <FormDescription>
                          Allow selecting application location.
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
                        <FormLabel>Visa City Selection</FormLabel>
                        <FormDescription>
                          Allow selecting visa application city.
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
                        <FormLabel>Saudi ID/Iqama Required</FormLabel>
                        <FormDescription>
                          Require Saudi ID or Iqama number.
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-visa-gold hover:bg-visa-gold/90"
              >
                {isSubmitting ? (
                  <><Loader className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                ) : (
                  <><PlusCircle className="mr-2 h-4 w-4" /> Add Service</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
