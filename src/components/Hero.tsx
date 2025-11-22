
import React from "react";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const Hero = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="relative min-h-[60vh] md:min-h-[47vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-visa-light to-white">
      <div className="absolute inset-0 bg-gradient-to-r from-visa-gold/20 to-visa-dark/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/header-img.jpg')] bg-cover bg-center opacity-20 mix-blend-multiply"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8 animate-fadeIn">
          <h1 className="text-3xl md:text-6xl font-bold text-visa-dark">
            {t('journey')}
          </h1>
          <p className="text-base md:text-xl text-gray-600">
            {t('fastSecure')}
          </p>
        </div>
      </div>
    </div>
  );
};
