
import React from "react";
import { useLanguage } from "@/contexts/language";

interface FormProgressProps {
  currentStep: number;
  isSpainVisa: boolean;
}  


export const FormProgress = ({ currentStep, isSpainVisa }: FormProgressProps) => {
  const { t } = useLanguage();
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {[1, 2, 3].map(step => (
          <div 
            key={step} 
            className={`flex flex-col items-center space-y-1 ${step <= currentStep ? "text-visa-gold" : "text-gray-400"}`}
          >
            <div className={`
              ${isSpainVisa ? 'rounded-lg' : 'rounded-full'} 
              w-8 h-8 flex items-center justify-center 
              ${step < currentStep ? "bg-visa-gold text-white" : step === currentStep ? "border-2 border-visa-gold text-visa-gold" : "border-2 border-gray-200 text-gray-400"}`}
            >
              {step}
            </div>
            <span className="text-xs">
              {step === 1 ? t("personal") : step === 2 ? t("documents") : t("account")}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-1 mt-2">
        <div 
          className="bg-visa-gold h-1 transition-all duration-300" 
          style={{ width: `${(currentStep - 1) / 2 * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
