import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VisaConfig } from "@/types/visa";

export const formSchema = z.object({
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

export type EditVisaServiceFormValues = z.infer<typeof formSchema>;

// دالة لتحويل القيم الفارغة إلى null
const normalizeEmpty = (val: string | undefined | null) =>
  val?.trim() === "" ? null : val;

const defaultValues: EditVisaServiceFormValues = {
  title: "",
  formTitle: "",
  formDescription: "",
  basePrice: 0,
  flag: "",
  processingTime: "",
  active: true,
  requiresMothersName: false,
  requiresNationalitySelection: false,
  requiresServiceSelection: false,
  requiresAppointmentTypeSelection: false,
  requiresLocationSelection: false,
  requiresVisaCitySelection: false,
  requiresSaudiIdIqama: false,
  title_ar: "",
  formTitle_ar: "",
  formDescription_ar: "",
  processingTime_ar: "",
};

export const useEditVisaServiceForm = (
  service: VisaConfig | null,
  onServiceUpdated: () => void,
  onOpenChange: (open: boolean) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditVisaServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (service) {
      console.log("Setting form values from service:", service);

      form.reset({
        ...defaultValues,
        title: service.title ?? "",
        formTitle: service.formTitle ?? "",
        formDescription: service.formDescription ?? "",
        basePrice: Number(service.basePrice) || 0,
        flag: service.flag ?? "", // ← هنا بنعالج المشكلة
        processingTime: service.processingTime ?? "",
        active: service.active ?? true,
        requiresMothersName: service.requiresMothersName ?? false,
        requiresNationalitySelection: service.requiresNationalitySelection ?? false,
        requiresServiceSelection: service.requiresServiceSelection ?? false,
        requiresAppointmentTypeSelection: service.requiresAppointmentTypeSelection ?? false,
        requiresLocationSelection: service.requiresLocationSelection ?? false,
        requiresVisaCitySelection: service.requiresVisaCitySelection ?? false,
        requiresSaudiIdIqama: service.requiresSaudiIdIqama ?? false,
        title_ar: service.title_ar ?? "",
        formTitle_ar: service.formTitle_ar ?? "",
        formDescription_ar: service.formDescription_ar ?? "",
        processingTime_ar: service.processingTime_ar ?? "",
      });
    }
  }, [service, form]);

  const onSubmit = async (data: EditVisaServiceFormValues) => {
    if (!service?.id) {
      toast.error("Service ID is missing");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('visa_services')
        .update({
          title: data.title,
          formtitle: data.formTitle,
          formdescription: data.formDescription,
          baseprice: data.basePrice,
          flag: normalizeEmpty(data.flag),
          processingtime: normalizeEmpty(data.processingTime),
          active: data.active,
          requiresmothersname: data.requiresMothersName,
          requiresnationalityselection: data.requiresNationalitySelection,
          requiresserviceselection: data.requiresServiceSelection,
          requiresappointmenttypeselection: data.requiresAppointmentTypeSelection,
          requireslocationselection: data.requiresLocationSelection,
          requiresvisacityselection: data.requiresVisaCitySelection,
          requiressaudiidiqama: data.requiresSaudiIdIqama,
          title_ar: normalizeEmpty(data.title_ar),
          formtitle_ar: normalizeEmpty(data.formTitle_ar),
          formdescription_ar: normalizeEmpty(data.formDescription_ar),
          processingtime_ar: normalizeEmpty(data.processingTime_ar),
          updated_at: new Date().toISOString(),
        })
        .eq('id', service.id);

      if (error) {
        console.error("Error updating visa service:", error);
        toast.error(`Failed to update visa service: ${error.message}`);
        return;
      }

      toast.success("Visa service updated successfully");
      onServiceUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(
        `An unexpected error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};
