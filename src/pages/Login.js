import React, { useEffect, useState } from "react";
import Otp from "../components/Otp";
import Pin from "../components/Pin";
import { otpFields, pinFields, bioLoginFields } from "../constants/formFields";
import L1Biometrics from "../components/L1Biometrics";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";
import sbiService from "../services/sbiService";
import Background from "../components/Background";
import SignInOptions from "../components/SignInOptions";
import {
  configurationKeys,
  validAuthFactors,
} from "../constants/clientConstants";
import { linkAuthService } from "../services/linkAuthService";
import IDPQRCode from "../components/IDPQRCode";
import { useSearchParams } from "react-router-dom";
import { Buffer } from "buffer";
import oAuthDetailsService from "../services/oAuthDetailsService";


//authFactorComponentMapping
const comp = {
  PIN: Pin,
  OTP: Otp,
  BIO: L1Biometrics,
};

function InitiateL1Biometrics(oAuthDetailsService) {
  return React.createElement(L1Biometrics, {
    param: bioLoginFields,
    authService: authService,
    localStorageService: localStorageService,
    oAuthDetailsService: oAuthDetailsService,
    sbiService: new sbiService(oAuthDetailsService),
  });
}

function InitiatePin(oAuthDetailsService) {
  return React.createElement(Pin, {
    param: pinFields,
    authService: authService,
    oAuthDetailsService: oAuthDetailsService,
  });
}

function InitiateOtp(oAuthDetailsService) {
  return React.createElement(Otp, {
    param: otpFields,
    authService: authService,
    oAuthDetailsService: oAuthDetailsService,
  });
}

function InitiateSignInOptions(handleSignInOptionClick, oAuthDetailsService) {
  return React.createElement(SignInOptions, {
    oAuthDetailsService: oAuthDetailsService,
    handleSignInOptionClick: handleSignInOptionClick,
  });
}

function InitiateLinkedWallet(oAuthDetailsService) {
  return React.createElement(IDPQRCode, {
    oAuthDetailsService: oAuthDetailsService,
    linkAuthService: linkAuthService,
  });
}

function InitiateInvalidAuthFactor(errorMsg) {
  return React.createElement(() => <div>{errorMsg}</div>);
}

function createDynamicLoginElements(inst, oAuthDetailsService) {
  if (typeof comp[inst] === "undefined") {
    return InitiateInvalidAuthFactor(
      "The component " + { inst } + " has not been created yet."
    );
  }

  if (comp[inst] === Otp) {
    return InitiateOtp(oAuthDetailsService);
  }

  if (comp[inst] === Pin) {
    return InitiatePin(oAuthDetailsService);
  }

  if (comp[inst] === L1Biometrics) {
    return InitiateL1Biometrics(oAuthDetailsService);
  }

  return React.createElement(comp[inst]);
}

export default function LoginPage({ i18nKeyPrefix = "header" }) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const [compToShow, setCompToShow] = useState(null);
  const [showMoreOption, setShowMoreOption] = useState(false);
  const [clientLogoURL, setClientLogoURL] = useState(null);
  const [clientName, setClientName] = useState(null);
  const [injiDownloadURI, setInjiDownloadURI] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  var decodeOAuth = Buffer.from(searchParams.get("response"), 'base64')?.toString();
  const oAuthDetails = new oAuthDetailsService(JSON.parse(decodeOAuth));

  let value = oAuthDetails.getIdpConfiguration(
    configurationKeys.signInWithInjiEnable
  ) ?? process.env.REACT_APP_INJI_ENABLE

  const [injiEnable, setInjiEnable] = useState(value?.toString().toLowerCase() === "true");

  const handleSignInOptionClick = (authFactor) => {
    //TODO handle multifactor auth
    setShowMoreOption(true);
    setCompToShow(createDynamicLoginElements(authFactor[0].type, oAuthDetails));
  };

  const handleMoreWaysToSignIn = () => {
    setShowMoreOption(false);
    setCompToShow(InitiateSignInOptions(handleSignInOptionClick, oAuthDetails));
  };

  useEffect(() => {
    loadComponent();
  }, []);

  const loadComponent = () => {
    setInjiDownloadURI(
      oAuthDetails.getIdpConfiguration(
        configurationKeys.injiAppDownloadURI
      ) ?? process.env.REACT_APP_INJI_DOWNLOAD_URI
    );

    let oAuthDetailResponse = oAuthDetails.getOuthDetails();

    try {
      setClientLogoURL(oAuthDetailResponse?.logoUrl);
      setClientName(oAuthDetailResponse?.clientName);
      let authFactors = oAuthDetailResponse?.authFactors;
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
      setCompToShow(createDynamicLoginElements(authFactor, oAuthDetails));
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
        clientLogoPath={clientLogoURL}
        clientName={clientName}
        backgroundImgPath="images/illustration_one.png"
        component={compToShow}
        handleMoreWaysToSignIn={handleMoreWaysToSignIn}
        showMoreOption={showMoreOption}
        linkedWalletComp={InitiateLinkedWallet(oAuthDetails)}
        injiAppDownloadURI={injiDownloadURI}
        injiEnable={injiEnable}
      />
    </>
  );
}
