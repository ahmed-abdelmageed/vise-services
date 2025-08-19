
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-visa-dark mb-6">{t('privacyPolicy')}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Global Visa Services is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect personal information required for visa applications, including but not limited to names, addresses, passport details, travel history, employment information, and financial information as required by specific visa applications.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your information to process visa applications, provide customer service, improve our services, and comply with legal obligations. We do not sell or rent your personal information to third parties.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We share your information with relevant government authorities as required for visa applications. We may also share information with service providers who assist us in our operations, subject to confidentiality agreements.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and regular security assessments.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to access, correct, or delete your personal information, subject to certain limitations. Contact us at visa@gvsksa.com to exercise these rights.
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically. We will notify you of significant changes by posting a notice on our website or sending you an email.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
