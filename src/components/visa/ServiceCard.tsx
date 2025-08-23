
import React from "react";
import { Card } from "@/components/ui/card";
import { VisaConfig, Service } from "@/types/visa";
import { Fingerprint, Clock, ArrowRight, Zap, Globe } from "lucide-react";
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
  
  // Get base price for display (fallback to 0 if not available)
  const basePrice = 'basePrice' in service ? service.basePrice : 0;
  
  return (
    // NEW MODERN CREATIVE DESIGN
    <div 
      className="group relative overflow-hidden cursor-pointer animate-fadeIn shadow-md"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onClick(service)}
    >
      {/* Main Card with Gradient Border */}
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-visa-gold/10 via-transparent to-visa-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-visa-gold/60 via-visa-gold/50 to-visa-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
        
        {/* Top Section with Flag/Icon */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            {/* Flag/Icon Container */}
            <div className="relative">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {isHomeFingerprints ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#001524] to-[#003d5c] text-[#00e5e0] relative">
                    <Fingerprint size={28} className="animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#00e5e0]/10" />
                  </div>
                ) : (
                  <img 
                    src={service.flag}
                    alt={`Icon for ${title}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      console.error(`Error loading image for ${title}:`, (e.target as HTMLImageElement).src);
                      (e.target as HTMLImageElement).src = 'https://flagcdn.com/w80/un.png';
                    }}
                  />
                )}
              </div>
              
              {/* Floating Badge */}
              {/* <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap size={12} className="text-white" />
              </div> */}
            </div>
            
            {/* Price Badge */}
            {basePrice > 0 && (
              <div className="bg-gradient-to-r from-visa-gold to-visa-gold/50 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {isArabic ? `${basePrice} ر.س` : `${basePrice} SAR`}
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-xl text-visa-gold mb-3 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        </div>
        
        {/* Bottom Section */}
        <div className="px-6 pb-6">
          {/* Processing Time */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-visa-gold to-visa-gold/50 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 font-medium">{processTime}</span>
          </div>
          
          {/* Action Button */}
          <div className="flex items-center justify-end">
            {/* <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Globe size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {isArabic ? "خدمة متاحة" : "Available Service"}
              </span>
            </div> */}
            
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-visa-gold group-hover:text-gray-900 transition-colors duration-300">
              <span className="text-sm font-semibold">
                {isArabic ? "ابدأ الآن" : "Start Now"}
              </span>
              <ArrowRight size={16} className={`group-hover:translate-x-1 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''} transition-transform duration-300`} />
            </div>
          </div>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  );

  // COMMENTED OUT ORIGINAL DESIGN:
  /*
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
  */
};
