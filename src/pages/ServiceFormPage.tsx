import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Service } from "@/types/visa";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/visa-form/ServiceForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const ServiceFormPage = () => {
  const { serviceTitle: routeServiceTitle } = useParams<{ serviceTitle: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isArabic = language === 'ar';

  useEffect(() => {
    const fetchService = async () => {
      if (!routeServiceTitle) return;

      try {
        setIsLoading(true);
        const decodedTitle = decodeURIComponent(routeServiceTitle);

        const { data: exactMatches } = await supabase
          .from('visa_services')
          .select('*')
          .eq(isArabic ? 'title_ar' : 'title', decodedTitle)
          .eq('active', true);

        if (exactMatches?.length) {
          setSelectedService(transformDbServiceToService(exactMatches[0]));
          return;
        }

        const { data: allServices } = await supabase
          .from('visa_services')
          .select('*')
          .eq('active', true);

        const matchedService = allServices?.find(s =>
          (s.title?.toLowerCase() === decodedTitle.toLowerCase()) ||
          (s.title_ar === decodedTitle)
        );

        if (matchedService) {
          setSelectedService(transformDbServiceToService(matchedService));
        } else {
          navigate("/");
        }

      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [routeServiceTitle, navigate, language]);

  const transformDbServiceToService = (dbService: any): Service => ({
    id: dbService.id,
    title: dbService.title,
    title_ar: dbService.title_ar,
    basePrice: dbService.baseprice,
    formTitle: dbService.formtitle,
    formTitle_ar: dbService.formtitle_ar,
    formDescription: dbService.formdescription,
    formDescription_ar: dbService.formdescription_ar,
    description: dbService.formdescription,
    description_ar: dbService.formdescription_ar,
    flag: dbService.flag,
    time: dbService.processingtime,
    time_ar: dbService.processingtime_ar,
    processingTime: dbService.processingtime,
    processingTime_ar: dbService.processingtime_ar,
    requiresMothersName: dbService.requiresmothersname,
    requiresNationalitySelection: dbService.requiresnationalityselection,
    requiresServiceSelection: dbService.requiresserviceselection,
    requiresAppointmentTypeSelection: dbService.requiresappointmenttypeselection,
    requiresLocationSelection: dbService.requireslocationselection,
    requiresVisaCitySelection: dbService.requiresvisacityselection,
    requiresSaudiIdIqama: dbService.requiressaudiidiqama,
    active: dbService.active,
  });

  const handleBackClick = () => navigate("/");

  const displayServiceTitle = isArabic ? selectedService?.title_ar : selectedService?.title;
  const serviceDescription = isArabic ? selectedService?.description_ar : selectedService?.description;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <p className="text-gray-500">{t('noData')}</p>
          <Button variant="outline" className="mt-4" onClick={handleBackClick}>
            {t('backToServices')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? "rtl" : "ltr"}>
      <Header />
      <div className="container mx-auto px-4 py-4 sm:py-8 form-container">
        <Button
          variant="ghost"
          className={`mb-4 sm:mb-6 flex items-center ${isArabic ? "flex-row-reverse" : "flex-row"}`}
          onClick={handleBackClick}
        >
          <ArrowLeft className={`${isArabic ? "ml-2" : "mr-2"}`} />
          {t('backToServices')}
        </Button>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-6 sm:mb-8 form-card">
          {/* <div className={`flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-visa-light flex items-center justify-center">
              <img
                src={selectedService.flag}
                alt={`Flag of ${displayServiceTitle?.split(' ')[0]}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://flagcdn.com/w80/un.png';
                }}
              />
            </div>
            <div className={`${isArabic ? "text-right" : ""}`}>
              <h1 className="text-xl sm:text-2xl font-bold text-visa-dark">
                {displayServiceTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">{serviceDescription}</p>
            </div>
          </div> */}

          <ServiceForm
            selectedService={selectedService}
            onBack={handleBackClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceFormPage;
