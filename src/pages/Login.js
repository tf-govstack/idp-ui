import React, { useEffect, useState } from "react";
import Otp from "../components/Otp";
import Pin from "../components/Pin";
import { otpFields, pinFields, bioLoginFields } from "../constants/formFields";
import IDPQRCode from "../components/IDPQRCode";
import L1Biometrics from "../components/L1Biometrics";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";
import { cryptoService } from "../services/cryptoService";
import { sbiService } from "../services/sbiService";
import Background from "../components/Background";
import SignInOptions from "../components/SignInOptions";

//authFactorComponentMapping
const comp = {
  PIN: Pin,
  OTP: Otp,
  QRCode: IDPQRCode,
  BIO: L1Biometrics,
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

function InitiateSignInOptions(handleSignInOptionClick) {
  return React.createElement(SignInOptions, {
    localStorageService: localStorageService,
    handleSignInOptionClick: handleSignInOptionClick,
  });
}

function InitiateInvalidAuthFactor(errorMsg) {
  return React.createElement(() => <div>{errorMsg}</div>);
}

function createDynamicLoginElements(inst) {
  if (typeof comp[inst] === "undefined") {
    return InitiateInvalidAuthFactor(
      "The component " + { inst } + " has not been created yet."
    );
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

export default function LoginPage() {
  const { t } = useTranslation("header");
  const [compToShow, setCompToShow] = useState(null);
  const [showMoreOption, setShowMoreOption] = useState(false);

  const handleSignInOptionClick = (authFactor) => {
    //TODO handle multifactor auth
    setShowMoreOption(true);
    setCompToShow(createDynamicLoginElements(authFactor[0].type));
  };

  const handleMoreWaysToSignIn = () => {
    setShowMoreOption(false);
    setCompToShow(InitiateSignInOptions(handleSignInOptionClick));
  };

  useEffect(() => {
    loadComponent();
  }, []);

  const loadComponent = () => {
    let oAuthDetails = JSON.parse(localStorageService.getOuthDetails());

    try {
      let authFactors = oAuthDetails?.authFactors;
      let firstLoginOption = authFactors[0];
      let authFactor = firstLoginOption[0].type;
      setShowMoreOption(authFactors.length > 1);
      setCompToShow(createDynamicLoginElements(authFactor));
    } catch (error) {
      setShowMoreOption(false);
      setCompToShow(InitiateInvalidAuthFactor(t("invalid_auth_factor")));
    }
  };

  return (
    <>
      <Background
        heading={t("login_heading")}
        logoPath="logo.png"
        backgroundImgPath="images/illustration_one.png"
        component={compToShow}
        handleMoreWaysToSignIn={handleMoreWaysToSignIn}
        showMoreOption={showMoreOption}
      />
    </>
  );
}
