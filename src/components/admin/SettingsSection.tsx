
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyInfoSettings } from "./settings/CompanyInfoSettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { AppearanceSettings } from "./settings/AppearanceSettings";
import { SettingsLoading } from "./settings/SettingsLoading";
import { useSettings } from "@/hooks/useSettings";

interface SettingsSectionProps {
  settings: Record<string, any> | null | undefined;
  isLoading: boolean;
  onUpdateSettings: (key: string, value: any) => void;
}

export const SettingsSection = ({ settings, isLoading, onUpdateSettings }: SettingsSectionProps) => {
  const {
    companyInfo,
    notificationPrefs,
    appearance,
    isSaving,
    handleCompanyInfoChange,
    handleNotificationToggle,
    handleAppearanceToggle,
    setColorTheme,
    saveSettings
  } = useSettings(settings, onUpdateSettings);

  if (isLoading) {
    return <SettingsLoading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-visa-dark">Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <CompanyInfoSettings
            companyInfo={companyInfo}
            isSaving={isSaving}
            onCompanyInfoChange={handleCompanyInfoChange}
            onSave={saveSettings}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings
            notificationPrefs={notificationPrefs}
            isSaving={isSaving}
            onNotificationToggle={handleNotificationToggle}
            onSave={saveSettings}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings
            appearance={appearance}
            isSaving={isSaving}
            onAppearanceToggle={handleAppearanceToggle}
            onThemeChange={setColorTheme}
            onSave={saveSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
