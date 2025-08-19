
import React, { useState } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface DevicePreviewProps {
  className?: string;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({ className = "" }) => {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const isMobile = useIsMobile();
  
  // Apply the preview only when a user explicitly changes it
  const handleDeviceChange = (device: "desktop" | "tablet" | "mobile") => {
    setActiveDevice(device);
    document.documentElement.classList.remove("preview-desktop", "preview-tablet", "preview-mobile");
    document.documentElement.classList.add(`preview-${device}`);
  };

  if (isMobile) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-1 z-50 ${className}`}>
      <div className="flex items-center space-x-1">
        <Button
          variant={activeDevice === "desktop" ? "default" : "ghost"}
          size="sm"
          className={`rounded-full px-3 ${activeDevice === "desktop" ? "bg-visa-gold hover:bg-visa-gold/90" : ""}`}
          onClick={() => handleDeviceChange("desktop")}
          title="Desktop view"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={activeDevice === "tablet" ? "default" : "ghost"}
          size="sm"
          className={`rounded-full px-3 ${activeDevice === "tablet" ? "bg-visa-gold hover:bg-visa-gold/90" : ""}`}
          onClick={() => handleDeviceChange("tablet")}
          title="Tablet view"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={activeDevice === "mobile" ? "default" : "ghost"}
          size="sm"
          className={`rounded-full px-3 ${activeDevice === "mobile" ? "bg-visa-gold hover:bg-visa-gold/90" : ""}`}
          onClick={() => handleDeviceChange("mobile")}
          title="Mobile view"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
