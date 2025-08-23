
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
              {t('privacyIntro')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">1. {t('informationWeCollect')}</h2>
            <p className="text-gray-700 mb-4">
              {t('informationWeCollectDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">2. {t('howWeUseInfo')}</h2>
            <p className="text-gray-700 mb-4">
              {t('howWeUseInfoDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">3. {t('informationSharing')}</h2>
            <p className="text-gray-700 mb-4">
              {t('informationSharingDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">4. {t('dataSecurity')}</h2>
            <p className="text-gray-700 mb-4">
              {t('dataSecurityDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">5. {t('dataRetention')}</h2>
            <p className="text-gray-700 mb-4">
              {t('dataRetentionDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">6. {t('yourRights')}</h2>
            <p className="text-gray-700 mb-4">
              {t('yourRightsDesc')}
            </p>
            
            <h2 className="text-2xl font-semibold text-visa-dark mt-8 mb-4">7. {t('policyChanges')}</h2>
            <p className="text-gray-700 mb-4">
              {t('policyChangesDesc')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
