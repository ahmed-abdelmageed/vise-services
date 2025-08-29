import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FooterData } from "./types";

interface LegalInfoTabProps {
  footerData: FooterData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LegalInfoTab: React.FC<LegalInfoTabProps> = ({
  footerData,
  handleInputChange,
}) => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-4 w-full flex md:flex-row flex-col md:space-x-4 md:space-y-0">
      <div className="space-y-2 w-full flex flex-col">
        <Label
          htmlFor="vatNumber"
          className={`${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("vatNumber")}
        </Label>
        <Input
          id="vatNumber"
          name="vatNumber"
          value={footerData.vatNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2 w-full flex flex-col">
        <Label
          htmlFor="crNumber"
          className={`${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("crNumber")}
        </Label>
        <Input
          id="crNumber"
          name="crNumber"
          value={footerData.crNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2 w-full flex flex-col">
        <Label
          htmlFor="tradeName"
          className={`${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("tradeName")}
        </Label>
        <Input
          id="tradeName"
          name="tradeName"
          value={footerData.tradeName}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
