
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobilePaddingWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MobilePaddingWrapper: React.FC<MobilePaddingWrapperProps> = ({
  children,
  className,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "px-3 sm:px-0 pb-16 sm:pb-0", // Add bottom padding for mobile navigation
      isMobile && "mobile-optimize",
      className
    )}>
      {children}
    </div>
  );
};
