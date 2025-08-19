
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-visa-dark mb-6">{t('aboutUs')}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Global Visa Services is a leading provider of visa and immigration services, specializing in helping clients navigate the complex visa application process.
            </p>
            
            <p className="text-lg text-gray-700 mb-4">
              Our team of experienced professionals is dedicated to delivering personalized service and expert guidance to ensure a smooth and successful visa application experience.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              Our mission is to simplify the visa application process and provide exceptional service to our clients, ensuring they can travel without stress or complications.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 mb-4">
              To be the most trusted and reliable visa service provider, known for our expertise, efficiency, and commitment to client satisfaction.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
