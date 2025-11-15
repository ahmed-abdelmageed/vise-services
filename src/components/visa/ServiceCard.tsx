
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { VisaConfig, Service } from "@/types/visa";
import { Fingerprint, Clock, ArrowRight, Zap, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { getHighQualityFlagUrl, getFlagFallbacks, optimizeImageRendering } from "@/utils/flagUtils";

interface ServiceCardProps {
  service: VisaConfig | Service;
  index: number;
  onClick: (service: VisaConfig | Service) => void;
}

export const ServiceCard = ({ service, index, onClick }: ServiceCardProps) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [currentFlagUrl, setCurrentFlagUrl] = useState(() => getHighQualityFlagUrl(service.flag || ''));
  const [fallbackIndex, setFallbackIndex] = useState(0);
  
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
    // ENHANCED PROFESSIONAL DESIGN WITH SMOOTH ANIMATIONS
    <div 
      className="group relative overflow-hidden cursor-pointer animate-fadeIn transform-gpu will-change-transform shadow-xl hover:shadow-2xl drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-700 ease-out rounded-2xl"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onClick={() => onClick(service)}
    >
      {/* Main Card with Enhanced Animations */}
      <div className="relative bg-white rounded-2xl border border-gray-200/50 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 overflow-hidden backdrop-blur-sm">
        
        {/* Animated Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-visa-gold/30 via-visa-gold/20 to-visa-gold/30 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out blur-lg scale-110 -z-10" />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -top-4 -left-4 w-8 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-[400px] transition-all duration-1000 ease-out pointer-events-none" />
        
        {/* Full-Width Image Header with Enhanced Effects */}
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-150 group-hover:from-gray-100 group-hover:via-gray-50 group-hover:to-gray-100 transition-all duration-700">
          {isHomeFingerprints ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#001524] via-[#002642] to-[#003d5c] text-[#00e5e0] relative overflow-hidden">
              {/* Animated Background Particles */}
              <div className="absolute inset-0">
                <div className="absolute top-4 left-4 w-2 h-2 bg-[#00e5e0]/30 rounded-full animate-ping animation-delay-100"></div>
                <div className="absolute top-12 right-8 w-1 h-1 bg-[#00e5e0]/40 rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-[#00e5e0]/20 rounded-full animate-ping animation-delay-500"></div>
              </div>
              
              {/* Enhanced Fingerprint Icon */}
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-700 ease-out">
                <Fingerprint size={56} className="animate-pulse text-[#00e5e0] drop-shadow-lg" />
                <div className="absolute inset-0 bg-[#00e5e0]/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#00e5e0]/5 to-transparent group-hover:via-[#00e5e0]/10 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : (
            <>
              {/* Image Container with Smooth Scaling */}
              <div className="relative w-full h-full overflow-hidden">
                <img 
                  src={currentFlagUrl}
                  alt={`Flag of ${title}`}
                  className="w-full h-full object-cover object-center group-hover:scale-125 transition-all duration-1000 ease-out filter group-hover:brightness-110 group-hover:contrast-105"
                  style={{
                    imageRendering: 'auto' as const,
                    msInterpolationMode: 'bicubic' as any,
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  } as React.CSSProperties}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    console.error(`Error loading flag image for ${title}:`, img.src);
                    
                    // Get fallback URLs for this flag
                    const fallbacks = getFlagFallbacks(service.flag || '', title);
                    
                    // Try next fallback if available
                    if (fallbackIndex < fallbacks.length - 1) {
                      const nextIndex = fallbackIndex + 1;
                      setFallbackIndex(nextIndex);
                      setCurrentFlagUrl(fallbacks[nextIndex]);
                    } else {
                      // Last resort: show a colored placeholder
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector('.flag-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'flag-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-visa-gold/20 via-visa-gold/30 to-visa-gold/20 text-visa-gold text-lg font-bold backdrop-blur-sm';
                        placeholder.textContent = title.split(' ')[0];
                        parent.appendChild(placeholder);
                      }
                    }
                  }}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    optimizeImageRendering(img);
                    // Hide any placeholder that might exist
                    const parent = img.parentElement;
                    const placeholder = parent?.querySelector('.flag-placeholder');
                    if (placeholder) {
                      placeholder.remove();
                    }
                    img.style.display = 'block';
                  }}
                />
              </div>
              
              {/* Enhanced Professional Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/40 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-visa-gold/15 via-transparent to-visa-gold/10 opacity-60 group-hover:opacity-80 transition-all duration-700" />
              
              {/* Floating Light Effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </>
          )}
          
          {/* Price Badge - Positioned on Image */}
          {basePrice > 0 && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-visa-gold px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-visa-gold/20">
              {isArabic ? `${basePrice} ر.س` : `${basePrice} SAR`}
            </div>
          )}
          
          {/* Premium Badge */}
          {/* <div className="absolute top-4 left-4 bg-visa-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {isArabic ? "خدمة متميزة" : "Premium Service"}
          </div> */}
        </div>
        
        {/* Content Section */}
        <div className="relative p-6">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-visa-gold/5 via-transparent to-visa-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Title */}
          <h3 className="relative font-bold text-2xl text-gray-900 mb-3 group-hover:text-visa-gold transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          
          {/* Description */}
          <p className="relative text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
            {description}
          </p>
          
          {/* Processing Time */}
          <div className="relative flex items-center space-x-3 rtl:space-x-reverse mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-visa-gold to-visa-gold/70 rounded-xl flex items-center justify-center shadow-md">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 block">
                {isArabic ? "وقت المعالجة" : "Processing Time"}
              </span>
              <span className="text-xs text-gray-500">{processTime}</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Globe size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">
                {isArabic ? "خدمة متاحة الآن" : "Available Now"}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-visa-gold to-visa-gold/80 text-white px-4 py-2 rounded-lg group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 shadow-md">
              <span className="text-sm font-semibold">
                {isArabic ? "ابدأ الآن" : "Start Now"}
              </span>
              <ArrowRight size={16} className={`group-hover:translate-x-1 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''} transition-transform duration-300`} />
            </div>
          </div>
        </div>
        
        {/* Professional Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-visa-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
