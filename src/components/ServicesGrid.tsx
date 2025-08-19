import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceCard } from "@/components/visa/ServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { Service, VisaConfig } from "@/types/visa";
import { Input } from "@/components/ui/input";
import { Search, Loader } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServicesGridProps {
  onSelectService?: (service: Service | VisaConfig) => void;
  services?: (Service | VisaConfig)[];
}

export const ServicesGrid = ({ onSelectService, services: providedServices }: ServicesGridProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [visaServices, setVisaServices] = useState<VisaConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisaServices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("visa_services")
          .select("*")
          .eq("active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching visa services:", error);
          return;
        }

        const transformedData = data.map(item => ({
          id: item.id,
          title: item.title,
          basePrice: item.baseprice,
          formTitle: item.formtitle,
          formDescription: item.formdescription,
          requiresMothersName: item.requiresmothersname,
          requiresNationalitySelection: item.requiresnationalityselection,
          requiresServiceSelection: item.requiresserviceselection,
          requiresAppointmentTypeSelection: item.requiresappointmenttypeselection,
          requiresLocationSelection: item.requireslocationselection,
          requiresVisaCitySelection: item.requiresvisacityselection,
          requiresSaudiIdIqama: item.requiressaudiidiqama,
          usaVisaCities: item.usavisacities,
          flag: item.flag,
          processingTime: item.processingtime,
          active: item.active,
          displayOrder: item.display_order,
          description: item.formdescription,
          time: item.processingtime,
          title_ar: item.title_ar,
          formTitle_ar: item.formtitle_ar,
          formDescription_ar: item.formdescription_ar,
          processingTime_ar: item.processingtime_ar,
          description_ar: item.formdescription_ar,
          time_ar: item.processingtime_ar,
        })) as VisaConfig[];

        setVisaServices(transformedData);
      } catch (error) {
        console.error("Error in fetchVisaServices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!providedServices) {
      fetchVisaServices();
    }
  }, [providedServices, language]);

  const handleSelectService = (service: Service | VisaConfig) => {
    if (onSelectService) {
      onSelectService(service);
    } else {
      const serviceTitle = language === "ar" && service.title_ar ? service.title_ar : service.title;
      navigate(`/service/${encodeURIComponent(serviceTitle)}`);
    }
  };

  const displayServices = providedServices || visaServices;

  const filteredServices = displayServices.filter(service => {
    const isArabic = language === "ar";
    const title = isArabic && service.title_ar ? service.title_ar : service.title;

    let description = "";
    if (isArabic) {
      description =
        service.formDescription_ar || service.description_ar || service.formDescription || service.description || "";
    } else {
      description = service.formDescription || service.description || "";
    }

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.flag && service.flag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fadeIn">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-visa-dark mb-3">
            {t("services")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {t("fastSecure")}
          </p>

          {/* Search input */}
          <div className="relative max-w-md mx-auto mt-5">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 rtl:left-auto rtl:right-0 rtl:pr-3 rtl:pl-0 pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder={t("searchServices")}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 text-sm sm:text-base h-10 sm:h-11"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-visa-gold" />
            <span className="ml-2 rtl:mr-2 rtl:ml-0 text-visa-dark">{t("loading")}</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base sm:text-lg text-gray-500">{t("noData")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id || service.title}
                service={service}
                index={index}
                onClick={handleSelectService}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Exports
export { services } from "@/data/visaServices";
export { VISA_CONFIGS, DEFAULT_VISA_CONFIG } from "@/config/visaConfig";
export type { Service, VisaConfig } from "@/types/visa";
