
import React from "react";
import { Card } from "@/components/ui/card";
import { VisaConfig, Service } from "@/types/visa";
import { Fingerprint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceCardProps {
  service: VisaConfig | Service;
  index: number;
  onClick: (service: VisaConfig | Service) => void;
}

export const ServiceCard = ({ service, index, onClick }: ServiceCardProps) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  
  // Use Arabic or English content based on the selected language
  const isArabic = language === 'ar';
  
  // Determine which title to use based on the language and service type
  const title = isArabic && service.title_ar ? service.title_ar : service.title;
  
  // Determine which description field to use based on the language and service type
  let description = '';
  if (isArabic) {
    if ('formDescription_ar' in service && service.formDescription_ar) description = service.formDescription_ar;
    else if (service.description_ar) description = service.description_ar;
    else if ('formDescription' in service && service.formDescription) description = service.formDescription;
    else if (service.description) description = service.description;
  } else {
    if ('formDescription' in service && service.formDescription) description = service.formDescription;
    else if (service.description) description = service.description;
  }

  // Determine which time/processing field to use based on the language and service type
  let processTime = '';
  if (isArabic) {
    if ('processingTime_ar' in service && service.processingTime_ar) processTime = service.processingTime_ar;
    else if (service.time_ar) processTime = service.time_ar;
    else if ('processingTime' in service && service.processingTime) processTime = service.processingTime;
    else if (service.time) processTime = service.time;
  } else {
    if ('processingTime' in service && service.processingTime) processTime = service.processingTime;
    else if (service.time) processTime = service.time;
  }
  
  // Default processing time if none is provided
  if (!processTime) {
    processTime = isArabic ? "وقت المعالجة: 3-5 أيام" : "Processing time: 3-5 days";
  }
    
  // Check if this is the home fingerprints service
  const isHomeFingerprints = service.title?.toLowerCase().includes('home fingerprints');
  
  return (
    <Card
      key={index}
      className={`p-4 md:p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white/80 backdrop-blur-sm animate-fadeIn ${isMobile ? 'mobile-card' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onClick(service)}
    >
      <div className={`flex items-start ${isMobile ? 'space-x-3' : 'space-x-4'} rtl:space-x-reverse ${isArabic ? 'rtl-text-right' : ''}`}>
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-visa-light flex-shrink-0 flex items-center justify-center">
          {isHomeFingerprints ? (
            <div className="w-full h-full flex items-center justify-center bg-[#001524] text-[#00e5e0]">
              <Fingerprint size={32} className="animate-pulse" />
            </div>
          ) : (
            <img 
              src={service.flag}
              alt={`Icon for ${title}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error(`Error loading image for ${title}:`, (e.target as HTMLImageElement).src);
                (e.target as HTMLImageElement).src = 'https://flagcdn.com/w80/un.png';
              }}
            />
          )}
        </div>
        <div className={isMobile ? 'flex-1' : ''}>
          <h3 className="font-semibold text-lg text-visa-dark mb-2">
            {title}
          </h3>
          <p className={`text-gray-600 mb-3 ${isMobile ? 'text-sm' : ''}`}>{description}</p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>{processTime}</p>
        </div>
      </div>
    </Card>
  );
};
