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

const tabs = tabList;

const comp = {
  PIN: Pin,
  OTP: Otp,
  QRCode: IDPQRCode,
  Biometrics: L1Biometrics,
};

function InitiateL1Biometrics(inst) {
  return React.createElement(comp[inst], { param: bioLoginFields });
}

function InitiatePin(inst) {
  return React.createElement(comp[inst], { param: pinFields });
}

function InitiateOtp(inst) {
  return React.createElement(comp[inst], { param: otpFields });
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
      <Header
        heading={t("login_heading")}
        paragraph="Have not registered for MOSIP yet? "
        linkName="Preregister"
        linkUrl="https://mec.mosip.io/preregister"
      />
      <Tabs color="cyan" tabs={tabs} block={tabCompInstance} />
    </>
  );
}
