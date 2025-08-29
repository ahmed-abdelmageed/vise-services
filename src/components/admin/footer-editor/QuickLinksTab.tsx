import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuickLink } from "./types";
import { Plus, Trash2 } from "lucide-react";

interface QuickLinksTabProps {
  quickLinks: QuickLink[];
  handleLinkChange: (
    id: string,
    field: "label" | "labelAr" | "url",
    value: string
  ) => void;
  addQuickLink: () => void;
  removeQuickLink: (id: string) => void;
}

export const QuickLinksTab: React.FC<QuickLinksTabProps> = ({
  quickLinks,
  handleLinkChange,
  addQuickLink,
  removeQuickLink,
}) => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="flex flex-row-reverse justify-between items-center">
        <h3 className="text-lg font-medium">{t("quickLinks")}</h3>
        <Button
          onClick={addQuickLink}
          size="sm"
          className="bg-visa-gold hover:bg-visa-gold/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addLink")}
        </Button>
      </div>

      {quickLinks.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-md border-gray-300">
          <p className="text-muted-foreground">{t("noQuickLinksMessage")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quickLinks.map((link) => (
            <div
              key={link.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md relative"
            >
              <div className="space-y-2">
                <Label
                  htmlFor={`link-label-${link.id}`}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("linkLabelEn")}
                </Label>
                <Input
                  id={`link-label-${link.id}`}
                  value={link.label}
                  onChange={(e) =>
                    handleLinkChange(link.id, "label", e.target.value)
                  }
                  placeholder={language === "ar" ? undefined : undefined}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`link-label-ar-${link.id}`}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("linkLabelAr")}
                </Label>
                <Input
                  id={`link-label-ar-${link.id}`}
                  value={link.labelAr}
                  onChange={(e) =>
                    handleLinkChange(link.id, "labelAr", e.target.value)
                  }
                  dir="rtl"
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`link-url-${link.id}`}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("linkURL")}
                </Label>
                <Input
                  id={`link-url-${link.id}`}
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(link.id, "url", e.target.value)
                  }
                  placeholder="/about"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-full sm:w-fit sm:absolute top-1 right-2 text-gray-500 hover:text-red-500"
                onClick={() => removeQuickLink(link.id)}
                title={t("removeLink")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
