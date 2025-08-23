import React from "react";
import { Mail, Phone, ExternalLink, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Default footer settings - would be replaced by admin settings in a real implementation
const defaultFooterSettings = {
  websiteName: "VISA Services",
  email: "visa@gvsksa.com",
  phone: "053199242",
  vatNumber: "000000000",
  crNumber: "000000000",
  tradeName: "VISA Services",
  quickLinks: [
    { id: "about", label: "About Us", url: "/about" },
    { id: "contact", label: "Contact Us", url: "/contact" },
    { id: "terms", label: "Terms and Conditions", url: "/terms" },
    { id: "privacy", label: "Privacy Policy", url: "/privacy" },
  ],
};

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  // In a real implementation, this would fetch from the database
  const footerSettings = defaultFooterSettings;

  const openWhatsApp = () => {
    window.open(`https://wa.me/${footerSettings.phone}`, "_blank");
  };

  const openEmail = () => {
    window.open(`mailto:${footerSettings.email}`, "_blank");
  };

  const isRTL = language === "ar";

  return (
    <footer className="relative bg-gradient-to-br from-visa-light via-visa-light to-visa-light text-visa-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-visa-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-visa-dark rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center w-full">
                <h1 className="text-2xl font-bold text-visa-dark truncate mt-2 w-full">
                  VISA<span className="text-visa-gold">Services</span>
                </h1>
              </div>
              <p className="text-visa-dark text-sm leading-relaxed">
                {language === "ar"
                  ? "خدماتك للحصول على التأشيرات بسهولة وسرعة"
                  : "Your trusted partner for visa services, making travel dreams come true."}
              </p>
            </div>

            {/* Legal Info */}
            {/* <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("vatNo")}:</span>
                <span>{footerSettings.vatNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("crNo")}:</span>
                <span>{footerSettings.crNumber}</span>
              </div>
            </div> */}
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-visa-dark flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-visa-gold to-yellow-400 rounded-full"></div>
              {t("getInTouch")}
            </h3>

            <div className="space-y-4 w-fit">
              <button
                onClick={openEmail}
                className="group flex items-center gap-3 text-visa-dark hover:text-visa-gold transition-all duration-300 w-full text-left"
              >
                <Mail className="w-5 h-5 group-hover:text-visa-gold transition-colors text-visa-dark" />
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                  {footerSettings.email}
                </span>
              </button>

              <button
                onClick={openWhatsApp}
                className="group flex items-center gap-3 text-visa-dark hover:text-visa-gold transition-all duration-300 w-full text-left"
              >
                <Phone className="w-5 h-5 group-hover:text-visa-gold transition-colors text-visa-dark" />
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                  {footerSettings.phone}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6 w-fit">
            <h3 className="text-lg font-semibold text-visa-dark flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-visa-gold to-visa-dark rounded-full"></div>
              {t("quickLinks")}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {footerSettings.quickLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.url}
                  className="group flex items-center gap-3 text-visa-dark hover:text-visa-gold transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 group-hover:text-visa-gold transition-colors" />

                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                    {t(link.id) || link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>
                &copy; {new Date().getFullYear()} {footerSettings.websiteName}.
              </span>
              <span>{t("allRightsReserved")}.</span>
            </div>

            {/* <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{t("builtWith")}</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>{t("by")}</span>
              <span className="text-visa-gold font-medium">
                Global Visa Services
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
