
import React from "react";
import { Loader } from "lucide-react";

export function SettingsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
      <p className="text-visa-dark">Loading settings data...</p>
    </div>
  );
}
