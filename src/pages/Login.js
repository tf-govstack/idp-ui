import React, { useEffect, useState } from "react";
import Otp from "../components/Otp";
import Pin from "../components/Pin";
import { otpFields, pinFields, bioLoginFields } from "../constants/formFields";
import L1Biometrics from "../components/L1Biometrics";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";
import { cryptoService } from "../services/cryptoService";
import { sbiService } from "../services/sbiService";
import Background from "../components/Background";
import SignInOptions from "../components/SignInOptions";
import { validAuthFactors } from "../constants/clientConstants";

//authFactorComponentMapping
const comp = {
  PIN: Pin,
  OTP: Otp,
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
    localStorageService: localStorageService,
  });
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

export default function LoginPage({ i18nKeyPrefix = "header" }) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const [compToShow, setCompToShow] = useState(null);
  const [showMoreOption, setShowMoreOption] = useState(false);
  const [clientLogoURL, setClientLogoURL] = useState(null);

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
      setClientLogoURL(oAuthDetails?.logoUrl);
      let authFactors = oAuthDetails?.authFactors;
      let validComponents = [];

      //checking for valid auth factors
      authFactors.forEach((authFactor) => {
        if (validAuthFactors[authFactor[0].type]) {
          validComponents.push(authFactor);
        }
      });

      let firstLoginOption = validComponents[0];
      let authFactor = firstLoginOption[0].type;
      setShowMoreOption(validComponents.length > 1);
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
        mosipLogoPath="logo.png"
        clientLogoPath={clientLogoURL}
        backgroundImgPath="images/illustration_one.png"
        component={compToShow}
        handleMoreWaysToSignIn={handleMoreWaysToSignIn}
        showMoreOption={showMoreOption}
      />
    </>
  );
}
