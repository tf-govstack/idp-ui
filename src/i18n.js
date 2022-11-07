import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importing translation files

import translationEN from "./locales/en.json";
import translationHI from "./locales/hi.json";
import translationAr from "./locales/ar.json";

//Creating object with the variables of imported translation files
const resources = {
  en: {
    consent: translationEN.consent,
    l1Biometrics: translationEN.l1Biometrics,
    pin: translationEN.pin,
    signInOption: translationEN.signInOption,
    header: translationEN.header,
    authorize: translationEN.authorize,
    tabs: translationEN.tabs,
    errors: translationEN.errors,
    idpDetails: translationEN.idpDetails,
    otp: translationEN.otp,
  },
  hi: {
    consent: translationHI.consent,
    l1Biometrics: translationHI.l1Biometrics,
    pin: translationHI.pin,
    signInOption: translationHI.signInOption,
    header: translationHI.header,
    authorize: translationHI.authorize,
    tabs: translationHI.tabs,
    errors: translationHI.errors,
    idpDetails: translationHI.idpDetails,
    otp: translationHI.otp,
  },
  ar: {
    translation: translationAr,
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    debug: false,
    resources: resources,
    fallbackLng: window["envConfigs"].defaultLang, //default language
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
