
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { EditVisaServiceFormValues } from "@/hooks/useEditVisaServiceForm";
import { useLanguage } from "@/contexts/LanguageContext";

interface RequirementTogglesProps {
  form: UseFormReturn<EditVisaServiceFormValues>;
}

export const RequirementToggles = ({ form }: RequirementTogglesProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('activeStatus')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
          name="requiresNationalitySelection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('nationalitySelection')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
          name="requiresAppointmentTypeSelection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('appointmentSelection')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
        
        {/* <FormField
          control={form.control}
          name="requiresVisaCitySelection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('visaCitySelection')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
        /> */}
        
        <FormField
          control={form.control}
          name="idFilesRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('idFilesRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
                  {t('idFilesRequiredDesc')}
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
          name="photoFilesRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('photoFilesRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
                  {t('photoFilesRequiredDesc')}
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
      
      {/* Right Column */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="requiresMothersName"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('mothersNameRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
          name="requiresServiceSelection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('serviceSelectionRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
        
        <FormField
          control={form.control}
          name="requiresLocationSelection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('locationSelectionRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
          name="requiresSaudiIdIqama"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('saudiIdIqamaRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
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
        
        <FormField
          control={form.control}
          name="salaryProofRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('salaryProofRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
                  {t('salaryProofRequiredDesc')}
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
          name="passportFilesRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm h-20 min-h-[80px]">
              <div className="space-y-0.5 flex-1 pr-3">
                <FormLabel className="text-sm font-medium">{t('passportFilesRequired')}</FormLabel>
                <FormDescription className="text-xs text-muted-foreground line-clamp-2">
                  {t('passportFilesRequiredDesc')}
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
  );
};
