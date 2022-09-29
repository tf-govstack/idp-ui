import React from "react";
import Header from "../components/Header";
import Otp from "../components/Otp";
import Pin from "../components/Pin";
import Tabs from "../components/Tabs";
import {
  tabList,
  otpFields,
  bioLoginFields,
  pinFields,
  faceBioLoginFields,
  fingerBioLoginFields,
  irisBioLoginFields,
} from "../constants/formFields";
import IDPQRCode from "../components/IDPQRCode";
import SBIL1Biometrics from "../components/SBIL1Biometrics";
import L1Biometric from "../components/L1Biometric";

const tabs = tabList;

const comp = {
  PIN: Pin,
  OTP: Otp,
  QRCode: IDPQRCode,
  Biometric: SBIL1Biometrics,
  FaceBiometric: L1Biometric,
  FingerBiometric: L1Biometric,
  IrisBiometric: L1Biometric,
};

function InitiateL1IrisBiometric(inst) {
  return React.createElement(comp[inst], { param: irisBioLoginFields });
}

function InitiateL1FingerBiometric(inst) {
  return React.createElement(comp[inst], { param: fingerBioLoginFields });
}

function InitiateL1FaceBiometric(inst) {
  return React.createElement(comp[inst], { param: faceBioLoginFields });
}

function InitiateSBIL1Biometrics(inst) {
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

  if (comp[inst] === SBIL1Biometrics) {
    return InitiateSBIL1Biometrics(inst);
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

  if (comp[inst] === L1Biometric && inst === "FaceBiometric") {
    return InitiateL1FaceBiometric(inst);
  }

  if (comp[inst] === L1Biometric && inst === "FingerBiometric") {
    return InitiateL1FingerBiometric(inst);
  }

  if (comp[inst] === L1Biometric && inst === "IrisBiometric") {
    return InitiateL1IrisBiometric(inst);
  }

  return React.createElement(comp[inst]);
}

let tabCompInstance = new Map();

tabs.map((tab) => {
  return tabCompInstance.set(tab.icon, createDynamicLoginElements(tab.comp));
});

export default function LoginPage() {
  return (
    <>
      <Header
        heading="Login to your account"
        paragraph="Have not registered for MOSIP yet? "
        linkName="Preregister"
        linkUrl="https://mec.mosip.io/preregister"
      />
      <Tabs color="cyan" tabs={tabs} block={tabCompInstance} />
    </>
  );
}
