import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Eye, Star, Users, Award, Shield } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Award,
      title: t("valueExcellence"),
      description: t("valueExcellenceDesc"),
      color: "from-visa-gold to-yellow-500",
    },
    {
      icon: Shield,
      title: t("valueTrust"),
      description: t("valueTrustDesc"),
      color: "from-[#bdc3c7] to-[#2c3e50]",
    },
    {
      icon: Star,
      title: t("valueInnovation"),
      description: t("valueInnovationDesc"),
      color: "from-[#0F2027] via-[#203A43] to-[#2C5364]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-visa-dark via-slate-800 to-visa-dark py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-1/4 w-64 h-64 bg-visa-gold rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("aboutUs")}
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              {t("aboutDescription1")}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Description Section */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("aboutDescription2")}
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <div className="bg-gradient-to-br from-visa-gold/5 to-yellow-100/50 rounded-2xl p-8 border border-visa-gold/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-visa-gold to-yellow-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-visa-dark">
                  {t("ourMission")}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("missionDescription")}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-[#bdc3c7]/20 to-[#2c3e50]/20 rounded-2xl p-8 border border-[#2c3e50]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-visa-dark">
                  {t("ourVision")}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("visionDescription")}
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-visa-dark mb-4">
                {t("ourValues")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-visa-gold to-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-visa-dark mb-3">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-visa-gold to-yellow-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("whyChooseUs")}
              </h2>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed">
              {t("whyChooseUsDesc")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
