import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Auth } from "@/components/Auth";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AuthDialog = ({ open, onOpenChange, onSuccess }: AuthDialogProps) => {
  const { t, language } = useLanguage(); 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 border border-gray-200 hover:bg-visa-light transition-colors"
        >
          <User className="w-4 h-4 mr-2 text-visa-gold" />
          <span className="text-visa-dark font-medium">{t("signIn")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg border border-gray-100 bg-white">
        <DialogHeader
          className={`mb-4 ${language === "ar" ? "text-right" : "text-left"}`}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <DialogTitle className="text-lg font-bold text-visa-dark tracking-wide">
            {t("clientAuthentication")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {t("signInAccessAccount")}
          </DialogDescription>
        </DialogHeader>

        <div className="px-1 pb-2">
          <Auth onSuccess={onSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
