import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorIndicator from "../common/ErrorIndicator";
import LoadingIndicator from "../common/LoadingIndicator";
import { LoadingStates as states } from "../constants/states";

export default function Authorize({ authService, localStorageService }) {
  const { t, i18n } = useTranslation("authorize");

  const { post_OauthDetails } = { ...authService };
  const { storeOauthDetails, storeTransactionId } = { ...localStorageService };

  const [status, setStatus] = useState(states.LOADING);
  const [oAuthDetailResponse, setOAuthDetailResponse] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const callAuthorize = async () => {
      try {
        let nonce = searchParams.get("nonce");
        let state = searchParams.get("state");

        let client_id = searchParams.get("client_id");
        let redirect_uri = searchParams.get("redirect_uri");
        let response_type = searchParams.get("response_type");
        let scope = searchParams.get("scope");
        let acr_values = searchParams.get("acr_values");
        let claims = searchParams.get("claims");
        let claimsLocales = searchParams.get("claims_locales");
        let display = searchParams.get("display");
        let maxAge = searchParams.get("max_age");
        let prompt = searchParams.get("prompt");
        let uiLocales = searchParams.get("ui_locales");

        let claimsDecoded;
        if (claims == null) {
          claimsDecoded = null;
        } else {
          try {
            claimsDecoded = JSON.parse(decodeURI(claims));
          } catch {
            setError(t("parsing_error_msg"));
            setStatus(states.ERROR);
            return;
          }
        }

        const response = await post_OauthDetails(
          nonce,
          state,
          client_id,
          redirect_uri,
          response_type,
          scope,
          acr_values,
          claimsDecoded,
          claimsLocales,
          display,
          maxAge,
          prompt,
          uiLocales
        );

        setOAuthDetailResponse(response);
        setStatus(states.LOADED);
      } catch (error) {
        setOAuthDetailResponse(null);
        setError(error.message);
        setStatus(states.ERROR);
      }
    };

    callAuthorize();
  }, []);

  useEffect(() => {
    if (status === states.LOADED) {
      let uiLocales = searchParams.get("ui_locales");
      if (uiLocales) changeLanguage(uiLocales);
      redirectToLogin();
    }
  }, [status]);

  const changeLanguage = async (uiLocales) => {
    //TODO logic for lang change
    let langs = uiLocales.split(" ");

    i18n.changeLanguage(langs[0]);
  };

  const redirectToLogin = async () => {
    if (oAuthDetailResponse === null) {
      return;
    }

    const { response, errors } = oAuthDetailResponse;

    if (errors != null && errors.length > 0) {
      return;
    } else {
      let transactionId = response.transactionId;
      let redirectUri = searchParams.get("redirect_uri");
      let nonce = searchParams.get("nonce");
      let state = searchParams.get("state");

      storeTransactionId(transactionId);
      storeOauthDetails(redirectUri, nonce, state, response);

      navigate("/login", {
        replace: true,
      });
    }
  };

  let el;

  switch (status) {
    case states.LOADING:
      el = <LoadingIndicator size="medium" message={t("loading_msg")} />;
      break;
    case states.LOADED:
      if (oAuthDetailResponse === null) {
        el = (
          <ErrorIndicator
            errorCode="no_response_msg"
            defaultMsg="No response"
          />
        );
        break;
      }

      const { errors } = oAuthDetailResponse;

      if (errors != null && errors.length > 0) {
        el = errors?.map(({ errorCode, errorMessage }, idx) => (
          <div key={idx}>
            <ErrorIndicator errorCode={errorCode} defaultMsg={errorMessage} />
          </div>
        ));
      }
      break;
    case states.ERROR:
      el = <ErrorIndicator errorCode={error} defaultMsg={error} />;
      break;
  }

  return el;
}
