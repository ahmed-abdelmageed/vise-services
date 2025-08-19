
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AppearanceSettingsProps {
  appearance: {
    color_theme: string;
    compact_view: boolean;
    dark_mode: boolean;
  };
  isSaving: boolean;
  onAppearanceToggle: (key: 'compact_view' | 'dark_mode') => void;
  onThemeChange: (theme: string) => void;
  onSave: (settingKey: string, data: any) => Promise<void>;
}

export function AppearanceSettings({ 
  appearance, 
  isSaving, 
  onAppearanceToggle,
  onThemeChange,
  onSave 
}: AppearanceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Color Theme</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-10 h-10 rounded-full bg-visa-gold cursor-pointer ${appearance.color_theme === 'gold' ? 'border-2 border-visa-dark flex items-center justify-center text-white' : ''}`}
                onClick={() => onThemeChange('gold')}
              >
                {appearance.color_theme === 'gold' && '✓'}
              </div>
              <span>Gold</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-10 h-10 rounded-full bg-blue-500 cursor-pointer ${appearance.color_theme === 'blue' ? 'border-2 border-visa-dark flex items-center justify-center text-white' : ''}`}
                onClick={() => onThemeChange('blue')}
              >
                {appearance.color_theme === 'blue' && '✓'}
              </div>
              <span>Blue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-10 h-10 rounded-full bg-green-500 cursor-pointer ${appearance.color_theme === 'green' ? 'border-2 border-visa-dark flex items-center justify-center text-white' : ''}`}
                onClick={() => onThemeChange('green')}
              >
                {appearance.color_theme === 'green' && '✓'}
              </div>
              <span>Green</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="compact-view" className="text-base">Compact View</Label>
            <p className="text-sm text-gray-500">Display more information with less spacing.</p>
          </div>
          <Switch 
            id="compact-view" 
            checked={appearance.compact_view}
            onCheckedChange={() => onAppearanceToggle('compact_view')}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
            <p className="text-sm text-gray-500">Use dark theme for all screens.</p>
          </div>
          <Switch 
            id="dark-mode" 
            checked={appearance.dark_mode}
            onCheckedChange={() => onAppearanceToggle('dark_mode')}
          />
        </div>
        <Button 
          className="bg-visa-gold hover:bg-visa-gold/90 mt-4"
          onClick={() => onSave('appearance', appearance)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Apply Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
