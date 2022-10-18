import React from "react";
import Header from "../components/Header";
import Otp from "../components/Otp";
import Pin from "../components/Pin";
import Tabs from "../components/Tabs";
import {
  tabList,
  otpFields,
  pinFields,
  bioLoginFields,
} from "../constants/formFields";
import IDPQRCode from "../components/IDPQRCode";
import L1Biometrics from "../components/L1Biometrics";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";
import { cryptoService } from "../services/cryptoService";
import { sbiService } from "../services/sbiService";
import Background from "../components/Background";

const tabs = tabList;

const comp = {
  PIN: Pin,
  OTP: Otp,
  QRCode: IDPQRCode,
  Biometrics: L1Biometrics,
};

function InitiateL1Biometrics(inst) {
  return React.createElement(comp[inst], {
    param: bioLoginFields,
    authService: authService,
    localStorageService: localStorageService,
    cryptoService: cryptoService,
    sbiService: sbiService,
  });
}

function InitiatePin(inst) {
  return React.createElement(comp[inst], {
    param: pinFields,
    authService: authService,
    localStorageService: localStorageService,
  });
}

function InitiateOtp(inst) {
  return React.createElement(comp[inst], {
    param: otpFields,
    authService: authService,
  });
}

function InitiateQRCode(inst) {
  return React.createElement(comp[inst]);
}

function createDynamicLoginElements(inst) {
  if (typeof comp[inst] === "undefined") {
    return React.createElement(() => (
      <div>The component {inst} has not been created yet.</div>
    ));
  }

  if (comp[inst] === IDPQRCode) {
    return InitiateQRCode(inst);
  }

  if (comp[inst] === Otp) {
    return InitiateOtp(inst, otpFields);
  }

  if (comp[inst] === Pin) {
    return InitiatePin(inst, otpFields);
  }

  if (comp[inst] === L1Biometrics) {
    return InitiateL1Biometrics(inst);
  }

  return React.createElement(comp[inst]);
}

let tabCompInstance = new Map();

tabs.map((tab) => {
  return tabCompInstance.set(tab.icon, createDynamicLoginElements(tab.comp));
});

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* <Background
        heading="Login with MOSIP"
        logoPath="logo.png"
        backgroundImgPath="images/illustration_one.png"
        component={createDynamicLoginElements(tabs[0].comp)}
      /> */}

      {/* <Background
        heading="Login with MOSIP"
        logoPath="logo.png"
        backgroundImgPath="images/illustration_one.png"
        component={React.createElement(Tabs, {
          color: "cyan",
          tabs: tabs,
          block: tabCompInstance,
        })}
      /> */}
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Header
            heading={t("login_heading")}
            paragraph={t("login_paragraph")}
            linkName={t("login_linkName")}
            linkUrl="https://mec.mosip.io/preregister"
          />
          <Tabs color="cyan" tabs={tabs} block={tabCompInstance} />
        </div>
      </div>
    </>
  );
}
