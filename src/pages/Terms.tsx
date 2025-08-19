
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-visa-dark mb-6">{t('termsAndConditions')}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Welcome to Global Visa Services. By accessing or using our services, you agree to the following terms and conditions.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">1. Services</h2>
            <p className="text-gray-700 mb-4">
              Global Visa Services provides visa application assistance and processing services. We are not a government agency and do not issue visas directly. Our role is to facilitate the application process and provide guidance.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">2. Application Process</h2>
            <p className="text-gray-700 mb-4">
              By submitting an application through our service, you confirm that all information provided is accurate and complete. You understand that providing false information may result in application rejection and potential legal consequences.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">3. Fees and Payments</h2>
            <p className="text-gray-700 mb-4">
              Our fees are for service provision and are separate from government visa fees. All fees must be paid in advance. Refunds are subject to our refund policy outlined below.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">4. Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              Service fees are non-refundable once we have begun processing your application. If your visa application is rejected, government fees are not refundable through our service.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">5. Liability</h2>
            <p className="text-gray-700 mb-4">
              Global Visa Services is not responsible for visa rejections, delays in processing, or changes in visa requirements by government authorities. Our liability is limited to the service fees paid.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">6. Privacy</h2>
            <p className="text-gray-700 mb-4">
              We collect and process personal information as necessary for visa applications. By using our services, you consent to this processing. For details, please see our Privacy Policy.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
