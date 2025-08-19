
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface CompanyInfo {
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface NotificationPreferences {
  new_client: boolean;
  invoice_paid: boolean;
  application_status: boolean;
  payment_reminder: boolean;
}

interface AppearanceSettings {
  color_theme: string;
  compact_view: boolean;
  dark_mode: boolean;
}

export interface AdminSettings {
  company_info?: CompanyInfo;
  notification_preferences?: NotificationPreferences;
  appearance?: AppearanceSettings;
}

export function useSettings(
  initialSettings: Record<string, any> | null | undefined,
  onUpdateSettings: (key: string, value: any) => void
) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    new_client: false,
    invoice_paid: false,
    application_status: false,
    payment_reminder: false
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    color_theme: "gold",
    compact_view: false,
    dark_mode: false
  });

  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (initialSettings) {
      if (initialSettings.company_info) {
        setCompanyInfo(initialSettings.company_info);
      }
      if (initialSettings.notification_preferences) {
        setNotificationPrefs(initialSettings.notification_preferences);
      }
      if (initialSettings.appearance) {
        setAppearance(initialSettings.appearance);
      }
    }
  }, [initialSettings]);

  const handleCompanyInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const handleNotificationToggle = useCallback((key: keyof NotificationPreferences) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const handleAppearanceToggle = useCallback((key: keyof AppearanceSettings) => {
    if (key === 'color_theme') return; // Handle theme selection separately
    setAppearance(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const setColorTheme = useCallback((theme: string) => {
    setAppearance(prev => ({
      ...prev,
      color_theme: theme
    }));
  }, []);

  const saveSettings = useCallback(async (settingKey: string, data: any) => {
    setIsSaving(true);
    
    try {
      // Update settings using the passed function
      await onUpdateSettings(settingKey, data);
      toast.success(`${settingKey.replace('_', ' ')} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(`Failed to save ${settingKey.replace('_', ' ')} settings`);
    } finally {
      setIsSaving(false);
    }
  }, [onUpdateSettings]);

  return {
    companyInfo,
    notificationPrefs,
    appearance,
    isSaving,
    handleCompanyInfoChange,
    handleNotificationToggle,
    handleAppearanceToggle,
    setColorTheme,
    saveSettings
  };
}
