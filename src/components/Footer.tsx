import React from "react";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Default footer settings - would be replaced by admin settings in a real implementation
const defaultFooterSettings = {
  websiteName: "Global Visa Services",
  email: "visa@gvsksa.com",
  phone: "053199242",
  vatNumber: "000000000",
  crNumber: "000000000",
  tradeName: "Global Visa Services",
  quickLinks: [
    { id: "about", label: "About Us", url: "/about" },
    { id: "contact", label: "Contact Us", url: "/contact" },
    { id: "terms", label: "Terms and Conditions", url: "/terms" },
    { id: "privacy", label: "Privacy Policy", url: "/privacy" },
  ],
};

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  // In a real implementation, this would fetch from the database
  const footerSettings = defaultFooterSettings;

  const openWhatsApp = () => {
    window.open(`https://wa.me/${footerSettings.phone}`, "_blank");
  };

  const openEmail = () => {
    window.open(`mailto:${footerSettings.email}`, "_blank");
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-center text-center">

          <div className="space-y-4">
            <h3 className="text-xl text-start font-bold text-visa-dark">
              {t("contactUs")}
            </h3>

            <button
              onClick={openEmail}
              className="flex gap-4 items-center text-gray-600 hover:text-visa-gold transition-colors"
            >
              <Mail className="w-5 h-5 mr-1 text-visa-gold" />
              {footerSettings.email}
            </button>

            <button
              onClick={openWhatsApp}
              className="flex gap-4 items-center text-gray-600 hover:text-visa-gold transition-colors"
            >
              <Phone className="w-5 h-5 mr-1 text-visa-gold" />
              {footerSettings.phone}
            </button>
          </div>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-visa-dark mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              {footerSettings.quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.url}
                    target="_blank"
                    className="text-gray-600 hover:text-visa-gold transition-colors flex items-center"
                  >
                    <span className="w-5 flex justify-start  ml-2">
                      <ExternalLink className="w-4 h-4 " />
                    </span>
                    <span className="ml-3">{t(link.id) || link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-visa-dark mb-4">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2">
              {footerSettings.quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.url}
                    target="_blank"
                    className="text-gray-600 hover:text-visa-gold transition-colors flex items-center"
                  >
                    <span className="w-5 flex justify-start  ml-2">
                      <ExternalLink className="w-4 h-4 " />
                    </span>{" "}
                    <span className="ml-2">{t(link.id) || link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} {footerSettings.websiteName}.{" "}
            {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
};
