
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
import { FlagImageUpload } from "../../FlagImageUpload";
import { Fingerprint } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface GeneralFieldsProps {
  form: UseFormReturn<EditVisaServiceFormValues>;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const GeneralFields = ({ form, activeTab = "english", onTabChange }: GeneralFieldsProps) => {
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
        
        {isHomeFingerprints ? (
          <FormItem>
            <FormLabel>Icon</FormLabel>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-[#001524] flex items-center justify-center text-[#00e5e0]">
                <Fingerprint size={32} />
              </div>
              <FormDescription>
                Home Fingerprints service uses a special fingerprint icon.
              </FormDescription>
            </div>
          </FormItem>
        ) : (
          <FormField
            control={form.control}
            name="flag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flag Image</FormLabel>
                <FormControl>
                  <FlagImageUpload
                    currentImage={field.value}
                    onImageUploaded={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormDescription>
                  Upload a flag image or country icon
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
        <FormField
          control={form.control}
          name="title_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title (Arabic)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="مثال: تأشيرة أمريكا" 
                  {...field} 
                  className="text-right" 
                  dir="rtl"
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Arabic translation of the service title.
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
              <FormLabel>Form Title (Arabic)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="مثال: طلب تأشيرة أمريكا" 
                  {...field} 
                  className="text-right" 
                  dir="rtl"
                  value={field.value || ""}
                />
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
                  value={field.value || ""}
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
  );
};
