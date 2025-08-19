import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Service, VisaType } from "@/types/visa";
import { useLanguage } from "@/contexts/language";

interface NationalitySelectionProps {
  selectedService: Service;
  visaConfig: any;
  onBack: () => void;
  setVisaType: (type: 'gcc' | 'other' | null) => void;
  countryName: string;
}

export const NationalitySelection = ({
  selectedService,
  visaConfig,
  onBack,
  setVisaType,
  countryName
}: NationalitySelectionProps) => {
    const { t } = useLanguage();
  
  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button onClick={onBack} className="mb-6 flex items-center text-visa-dark hover:text-visa-gold transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to services
        </button>
        
        <Card className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg animate-fadeIn">
          <CardHeader className="border-b border-gray-100 bg-visa-light">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/50 flex items-center justify-center">
                <img src={selectedService.flag} alt={`${countryName} Flag`} className="h-6 w-8 object-cover" />
              </div>
              <div>
                <CardTitle className="text-visa-dark">{visaConfig.formTitle}</CardTitle>
                <p className="text-gray-600 text-sm mt-1">Provide Below Details For Your E-Visa Process</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium text-visa-dark mb-8">{t("selectNationalityType")}</h3>
              
              <div className="flex flex-wrap justify-center gap-8 mt-4">
                {/* GCC Nationals Circle */}
                <div className="group cursor-pointer" onClick={() => setVisaType('gcc')}>
                  <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#9b87f5] to-white flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:border-visa-gold">
                    <div className="text-center p-4">
                      <h3 className="text-xl font-bold text-visa-dark mb-2">GCC Nationals</h3>
                      <p className="text-sm text-gray-600">E-Visa For GCC Nationals Only</p>
                    </div>
                  </div>
                </div>

                {/* Other Nationals Circle */}
                <div className="group cursor-pointer" onClick={() => setVisaType('other')}>
                  <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#D3E4FD] to-white flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:border-visa-gold">
                    <div className="text-center p-4">
                      <h3 className="text-xl font-bold text-visa-dark mb-2">Other Nationals</h3>
                      <p className="text-sm text-gray-600">For all other nationalities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
