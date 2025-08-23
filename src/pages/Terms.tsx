
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
              {t('termsIntro')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">1. {t('services')}</h2>
            <p className="text-gray-700 mb-4">
              {t('servicesDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">2. {t('applicationProcess')}</h2>
            <p className="text-gray-700 mb-4">
              {t('applicationProcessDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">3. {t('feesAndPayments')}</h2>
            <p className="text-gray-700 mb-4">
              {t('feesAndPaymentsDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">4. {t('refundPolicy')}</h2>
            <p className="text-gray-700 mb-4">
              {t('refundPolicyDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">5. {t('liability')}</h2>
            <p className="text-gray-700 mb-4">
              {t('liabilityDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">6. {t('privacy')}</h2>
            <p className="text-gray-700 mb-4">
              {t('privacyDesc')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
