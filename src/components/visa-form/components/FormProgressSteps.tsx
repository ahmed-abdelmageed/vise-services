import React, { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/language";
import { useAuthentication } from "@/components/user-account/useAuthentication";

interface FormProgressStepsProps {
  formStep: number;
  serviceTitle?: string;
}

export const FormProgressSteps = ({
  formStep,
  serviceTitle = "",
}: FormProgressStepsProps) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const { isLoggedIn } = useAuthentication();

  const isEuropeanVisa = [
    "Spain Visa",
    "France Visa",
    "Germany Visa",
    "Austria Visa",
    "Czech Republic Visa",
    "Greece Visa",
    "Italy Visa",
    "Ireland Visa",
    "Norway Visa",
    "Portugal Visa",
    "Poland Visa",
    "Switzerland Visa",
  ].includes(serviceTitle);

  const steps = useMemo(
    () => [
      { step: 1, label: t("personal") },
      { step: 2, label: t("documents") },
      { step: 3, label: isLoggedIn ? t("confirm") : t("account") },
    ],
    [isLoggedIn, t]
  );

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex justify-between mb-1 sm:mb-2">
        {steps.map(({ step, label }) => (
          <div
            key={step}
            className={`flex flex-col items-center space-y-0 sm:space-y-1 ${
              step <= formStep ? "text-visa-gold" : "text-gray-400"
            }`}
          >
            <div
              className={`
              ${isEuropeanVisa ? "rounded-lg" : "rounded-full"} 
              w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center 
              ${
                step < formStep
                  ? "bg-visa-gold text-white"
                  : step === formStep
                  ? "border-2 border-visa-gold text-visa-gold"
                  : "border-2 border-gray-200 text-gray-400"
              }`}
            >
              <span className="text-xs sm:text-sm">{step}</span>
            </div>
            <span className="text-2xs sm:text-xs">{label}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-1 mt-1 sm:mt-2">
        <div
          className="bg-visa-gold h-1 transition-all duration-300"
          style={{
            width: `${((formStep - 1) / 2) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
