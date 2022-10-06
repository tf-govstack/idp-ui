import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Error404 } from "../common/Errors";
import LoadingIndicator from "../common/LoadingIndicator";
import { post_OauthDetails } from "../services/AuthService";
const AuthorizePage = () => {
  const [status, setStatus] = useState("LOADING");
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
            setError(new Error("Unable to parse claims! Please try again."));
            setStatus("ERROR");
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
        setStatus("LOADED");
      } catch (errormsg) {
        setOAuthDetailResponse(null);
        setError(errormsg);
        setStatus("ERROR");
      }
    };

    callAuthorize();
  }, []);

  useEffect(() => {
    if (status === "LOADED") {
      redirectToLogin();
    }
  }, [status]);

  const redirectToLogin = async () => {
    if (oAuthDetailResponse === null) {
      return;
    }

    const { response, errors } = oAuthDetailResponse;

    if (errors != null && errors.length > 0) {
      return;
    } else {
      let redirectUri = searchParams.get("redirect_uri");
      let nonce = searchParams.get("nonce");
      let state = searchParams.get("state");

      window.localStorage.setItem("redirect_uri", redirectUri);
      window.localStorage.setItem("nonce", nonce);
      window.localStorage.setItem("state", state);

      window.localStorage.setItem("oauth_details", JSON.stringify(response));
      navigate("/login?transactionId=" + response.transactionId, {
        replace: true,
      });
    }
  };

  let el;

  switch (status) {
    case "LOADING":
      el = (
        <LoadingIndicator size="medium" message="Loading. Please wait...." />
      );
      break;
    case "LOADED":
      if (oAuthDetailResponse === null) {
        el = <Error404 />;
        break;
      }

      const { errors } = oAuthDetailResponse;

      if (errors != null && errors.length > 0) {
        el = errors?.map(({ errorCode, errorMessage }, idx) => (
          <div
            key={idx}
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            {errorMessage}
          </div>
        ));
      }
      break;
    case "ERROR":
      let msg = error?.message ?? "";

      if (msg?.indexOf("404") > -1) {
        el = <Error404 />;
      } else {
        el = (
          <div
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            Error: {error?.message}
          </div>
        );
      }
      break;
  }

  return el;
};

export default AuthorizePage;
