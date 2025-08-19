
import { TranslationDictionary } from '../types';
import { headerTranslations } from './header';
import { formTranslations } from './form';
import { serviceTranslations } from './service';
import { successTranslations } from './success';
import { adminDashboardTranslations } from './adminDashboard';
import { clientDashboardTranslations } from './clientDashboard';
import { customerSupportTranslations } from './customerSupport';
import { invoiceTranslations } from './invoice';
import { requestTranslations } from './request';
import { loginTranslations } from './login';
import { commonTranslations } from './common';
import { footerTranslations } from './footer';
import { pageTranslations } from './page';
import { authTranslations } from './auth';

// Merge all translations
export const translations: TranslationDictionary = {
  en: {
    ...headerTranslations.en,
    ...formTranslations.en,
    ...serviceTranslations.en,
    ...successTranslations.en,
    ...adminDashboardTranslations.en,
    ...clientDashboardTranslations.en,
    ...customerSupportTranslations.en,
    ...invoiceTranslations.en,
    ...requestTranslations.en,
    ...loginTranslations.en,
    ...commonTranslations.en,
    ...footerTranslations.en,
    ...pageTranslations.en,
    ...authTranslations.en
  },
  ar: {
    ...headerTranslations.ar,
    ...formTranslations.ar,
    ...serviceTranslations.ar,
    ...successTranslations.ar,
    ...adminDashboardTranslations.ar,
    ...clientDashboardTranslations.ar,
    ...customerSupportTranslations.ar,
    ...invoiceTranslations.ar,
    ...requestTranslations.ar,
    ...loginTranslations.ar,
    ...commonTranslations.ar,
    ...footerTranslations.ar,
    ...pageTranslations.ar,
    ...authTranslations.ar
  }
};
