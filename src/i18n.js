import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importing translation files

import translationEN from "./locales/en.json";
import translationHE from "./locales/hn.json";
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
  },
  hn: {
    consent: translationHE.consent,
    l1Biometrics: translationHE.l1Biometrics,
    pin: translationHE.pin,
    signInOption: translationHE.signInOption,
    header: translationHE.header,
    authorize: translationEN.authorize,
  },
  ar: {
    translation: translationAr,
  },
};

//i18N Initialization

i18n.use(initReactI18next).init({
  resources,
  lng: window["envConfigs"].defaultLang, //default language
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
