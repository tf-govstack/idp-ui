import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "../common/LoadingIndicator";
import { LoadingStates as states } from "../constants/states";

export default function Consent({
  authService,
  localStorageService,
  i18nKeyPrefix = "consent",
}) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });

  const { post_AuthCode } = { ...authService };
  const {
    getTransactionId,
    getRedirectUri,
    getNonce,
    getState,
    getOuthDetails,
  } = { ...localStorageService };

  const [status, setStatus] = useState(states.LOADED);
  const [claims, setClaims] = useState([]);
  const [scope, setScope] = useState([]);

  const handleScopeChange = (e) => {
    let id = e.target.id;

    let resultArray = [];
    if (e.target.checked) {
      //if checked (true), then add this id into checkedList
      resultArray = scope.filter((CheckedId) => CheckedId !== id);
      resultArray.push(id);
    } //if not checked (false), then remove this id from checkedList
    else {
      resultArray = scope.filter((CheckedId) => CheckedId !== id);
    }

    setScope(resultArray);
  };

  const handleClaimChange = (e) => {
    let id = e.target.id;

    let resultArray = [];
    if (e.target.checked) {
      //if checked (true), then add this id into checkedList
      resultArray = claims.filter((CheckedId) => CheckedId !== id);
      resultArray.push(id);
    } //if not checked (false), then remove this id from checkedList
    else {
      resultArray = claims.filter((CheckedId) => CheckedId !== id);
    }

    setClaims(resultArray);
  };

  useEffect(() => {
    const enableEssentialClaims = async () => {
      let oAuthDetails = JSON.parse(getOuthDetails());
      let claims = oAuthDetails?.essentialClaims;
      setClaims(claims);
    };
    enableEssentialClaims();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitConsent();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onError("consent_request_rejected", t("consent_request_rejected"));
  };

  let oAuthDetails = JSON.parse(getOuthDetails());

  let authorizeScopes = oAuthDetails?.authorizeScopes;
  let essentialClaims = oAuthDetails?.essentialClaims;
  let voluntaryClaims = oAuthDetails?.voluntaryClaims;
  let clientName = oAuthDetails?.clientName;
  let logoUrl = oAuthDetails?.logoUrl;

  //Handle Login API Integration here
  const submitConsent = async () => {
    try {
      let transactionId = getTransactionId();
      let acceptedClaims = claims;
      let permittedAuthorizeScopes = scope;

      setStatus(states.LOADING);

      const authCodeResponse = await post_AuthCode(
        transactionId,
        acceptedClaims,
        permittedAuthorizeScopes
      );

      setStatus(states.LOADED);

      const { response, errors } = authCodeResponse;

      let params = "?";
      if (response.nonce !== null && response.nonce !== undefined) {
        params = params + "nonce=" + response.nonce + "&";
      }

      if (response.state !== null && response.state !== undefined) {
        params = params + "state=" + response.state + "&";
      }

      //TODO redirect with server response
      if (errors != null && errors.length > 0) {
        onError(errors[0].errorCode, t(errors[0].errorCode));
        return;
      }

      window.location.replace(
        response.redirectUri + params + "code=" + response.code
      );
    } catch (error) {
      onError("authorization_failed_msg", error.message);
    }
  };

  //errorCode is REQUIRED, errorDescription is OPTIONAL
  const onError = async (errorCode, errorDescription) => {
    let nonce = getNonce();
    let state = getState();
    let redirect_uri = getRedirectUri();

    if (!redirect_uri) {
      return;
    }

    let params = "?";
    if (nonce) {
      params = params + "nonce=" + nonce + "&";
    }

    if (errorDescription) {
      params = params + "error_description=" + errorDescription + "&";
    }

    //REQUIRED
    params = params + "state=" + state + "&";

    //REQUIRED
    params = params + "error=" + errorCode;

    window.location.replace(redirect_uri + params);
  };

  return (
    <div
      className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
      style={{ background: "#F2F4F4" }}
    >
      <div className="px-4 py-4 flex-auto">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <img src={logoUrl}></img>
          </div>

          <div className="flex justify-center">
            <b>
              {t("consent_request_msg", {
                clientName: clientName,
              })}
            </b>
          </div>

          {authorizeScopes?.length > 0 && (
            <>
              <h2>{t("authorize_scope")}</h2>
              <div className="divide-y">
                {authorizeScopes?.map((item) => (
                  <div key={item}>
                    <div class="grid grid-cols-2 gap-4">
                      <div className="flex justify-start relative items-center mb-1 mt-1 cursor-pointer">
                        <span className="ml-3 text-sm font-medium text-black-900">
                          {t(item)}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <label
                          labelfor={item}
                          className="inline-flex relative items-center mb-1 mt-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value=""
                            id={item}
                            className="sr-only peer"
                            onChange={handleScopeChange}
                          />
                          <div className="w-9 h-5 border border-neutral-400 bg-white rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border after:border-neutral-400 peer-checked:after:border-sky-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-sky-500 peer-checked:after:bg-sky-500 peer-checked:border-sky-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {essentialClaims?.length > 0 && (
            <>
              <h2>{t("essential_claims")}</h2>
              <div className="divide-y">
                {essentialClaims?.map((item) => (
                  <div key={item}>
                    <div class="grid grid-cols-2 gap-4">
                      <div className="flex justify-start relative items-center mb-1 mt-1 cursor-pointer">
                        <span className="ml-3 text-sm font-medium text-black-900">
                          {t(item)}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <label
                          labelfor={item}
                          className="inline-flex relative items-center mb-1 mt-1 cursor-pointer text-gray-400"
                        >
                          {t("required")}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {voluntaryClaims?.length > 0 && (
            <>
              <h2>{t("voluntary_claims")}</h2>
              <div className="divide-y">
                {voluntaryClaims?.map((item) => (
                  <div key={item}>
                    <div class="grid grid-cols-2 gap-4">
                      <div className="flex justify-start relative items-center mb-1 mt-1 cursor-pointer">
                        <span className="ml-3 text-sm font-medium text-black-900">
                          {t(item)}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <label
                          labelfor={item}
                          className="inline-flex relative items-center mb-1 mt-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value=""
                            id={item}
                            className="sr-only peer"
                            onChange={handleClaimChange}
                          />
                          <div className="w-9 h-5 border border-neutral-400 bg-white rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border after:border-neutral-400 peer-checked:after:border-sky-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-sky-500 peer-checked:after:bg-sky-500 peer-checked:border-sky-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {
            <div>
              {status === "LOADING" && (
                <LoadingIndicator
                  size="medium"
                  message={t("redirecting_msg")}
                />
              )}
            </div>
          }
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              class="flex justify-center w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 light:bg-gray-800 light:text-white light:border-gray-600 light:hover:bg-gray-700 light:hover:border-gray-600 light:focus:ring-gray-700"
              onClick={handleCancel}
            >
              {t("cancel")}
            </button>

            <div className="flex justify-end">
              <button
                type="button"
                class="flex justify-center w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={handleSubmit}
              >
                {t("allow")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
