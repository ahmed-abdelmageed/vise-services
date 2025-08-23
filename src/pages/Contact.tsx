import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, this would send the form data to a server
    console.log("Form submitted");
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("email"),
      value: "visa@gvsksa.com",
      color: "bg-visa-gold",
    },
    {
      icon: Phone,
      title: t("phone"),
      value: "053199242",
      color: "bg-visa-gold",
    },
    {
      icon: MapPin,
      title: t("address"),
      value: "Global Visa Services\nRiyadh, Saudi Arabia",
      color: "bg-visa-gold",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-visa-dark to-slate-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("getInTouch")}
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto">
              {t("contactFormDesc")}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-visa-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form and Info */}
          <div className="grid grid-cols-1">
            {/* Contact Form */}

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-visa-gold rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-visa-dark">
                  {t("sendUsAMessage")}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-start block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("fullName")}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={t("fullName")}
                      className="h-12 border-gray-300 focus:border-visa-gold focus:ring-visa-gold"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-start block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("email")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("email")}
                      className="h-12 border-gray-300 focus:border-visa-gold focus:ring-visa-gold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="text-start block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("subject")}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder={t("subject")}
                    className="h-12 border-gray-300 focus:border-visa-gold focus:ring-visa-gold"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-start block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder={t("message")}
                    className="border-gray-300 focus:border-visa-gold focus:ring-visa-gold resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-visa-gold hover:bg-visa-gold/90 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {t("submit")}
                    </div>
                  )}
                </Button>
              </form>
            </div>

            {/* Additional Info Sidebar */}
            {/* <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-visa-dark">
                    {t("officeHours")}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{t("officeHoursTime")}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-visa-dark">
                    {t("responseTime")}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm">{t("responseTimeDesc")}</p>
              </div>

              <div className="bg-gradient-to-br from-visa-gold/10 to-yellow-100/50 rounded-2xl p-6 border border-visa-gold/20">
                <h3 className="text-lg font-semibold text-visa-dark mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:visa@gvsksa.com`}
                    className="flex items-center gap-3 text-gray-700 hover:text-visa-gold transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">visa@gvsksa.com</span>
                  </a>
                  <a
                    href={`https://wa.me/053199242`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-green-500 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">053199242</span>
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
