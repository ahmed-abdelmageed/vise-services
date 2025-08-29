import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FooterData } from "./types";

interface GeneralInfoTabProps {
  footerData: FooterData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  footerData,
  handleInputChange,
}) => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-4 flex md:flex-row flex-col md:space-x-4 md:space-y-0">
      <div className="space-y-2 w-full flex flex-col">
        <Label
          htmlFor="websiteName"
          className={`${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("websiteName")}
        </Label>
        <Input
          id="websiteName"
          name="websiteName"
          value={footerData.websiteName}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2 w-full flex flex-col">
        <Label
          htmlFor="email"
          className={`${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("emailLabel")}
        </Label>
        <Input
          id="email"
          name="email"
          value={footerData.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2 w-full flex flex-col">
        <Label
          htmlFor="phone"
          className={`${language === "ar" ? "text-right" : "text-left"}`}
        >
          {t("phoneLabel")}
        </Label>
        <Input
          id="phone"
          name="phone"
          value={footerData.phone}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
