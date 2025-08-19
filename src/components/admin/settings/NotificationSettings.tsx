
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notificationPrefs: {
    new_client: boolean;
    invoice_paid: boolean;
    application_status: boolean;
    payment_reminder: boolean;
  };
  isSaving: boolean;
  onNotificationToggle: (key: 'new_client' | 'invoice_paid' | 'application_status' | 'payment_reminder') => void;
  onSave: (settingKey: string, data: any) => Promise<void>;
}

export function NotificationSettings({ 
  notificationPrefs, 
  isSaving, 
  onNotificationToggle,
  onSave 
}: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you receive notifications and alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="new-client" className="text-base">New Client Notifications</Label>
            <p className="text-sm text-gray-500">Receive alerts when a new client registers.</p>
          </div>
          <Switch 
            id="new-client" 
            checked={notificationPrefs.new_client} 
            onCheckedChange={() => onNotificationToggle('new_client')} 
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="invoice-paid" className="text-base">Invoice Payment Notifications</Label>
            <p className="text-sm text-gray-500">Get notified when an invoice is paid.</p>
          </div>
          <Switch 
            id="invoice-paid" 
            checked={notificationPrefs.invoice_paid} 
            onCheckedChange={() => onNotificationToggle('invoice_paid')} 
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="application-status" className="text-base">Application Status Updates</Label>
            <p className="text-sm text-gray-500">Receive updates when visa application status changes.</p>
          </div>
          <Switch 
            id="application-status" 
            checked={notificationPrefs.application_status} 
            onCheckedChange={() => onNotificationToggle('application_status')} 
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="reminder" className="text-base">Payment Reminders</Label>
            <p className="text-sm text-gray-500">Send automatic reminders for upcoming or overdue payments.</p>
          </div>
          <Switch 
            id="reminder" 
            checked={notificationPrefs.payment_reminder} 
            onCheckedChange={() => onNotificationToggle('payment_reminder')} 
          />
        </div>
        <Button 
          className="bg-visa-gold hover:bg-visa-gold/90 mt-4"
          onClick={() => onSave('notification_preferences', notificationPrefs)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
