import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorIndicator from "../common/ErrorIndicator";
import LoadingIndicator from "../common/LoadingIndicator";
import {
  configurationKeys,
  deepLinkParamPlaceholder,
} from "../constants/clientConstants";
import { LoadingStates as states } from "../constants/states";

export default function IDPQRCode({
  linkAuthService,
  localStorageService,
  i18nKeyPrefix = "IDPQRCode",
}) {
  const { post_GenerateLinkCode, post_LinkStatus, post_AuthorizationCode } = {
    ...linkAuthService,
  };

  const { getTransactionId, getIdpConfiguration } = {
    ...localStorageService,
  };

  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState({ state: states.LOADED, msg: "" });
  const [error, setError] = useState(null);
  const [downloadURI, setDownloadURI] = useState(null);
  const timeoutInSeconds =
    getIdpConfiguration(configurationKeys.linkCodeWaitTimeInSec) ??
    process.env.REACT_APP_LINK_CODE_TIMEOUT_IN_SEC;

  const GenerateQRCode = (text) => {
    QRCode.toDataURL(
      text,
      {
        width: 500,
        margin: 2,
        color: {
          dark: "#000000",
        },
      },
      (err, text) => {
        if (err) {
          setError({
            errorCode: "link_code_refresh_failed",
          });
          return;
        }
        setQr(text);
      }
    );
  };

  useEffect(() => {
    fetchQRCode();
    setDownloadURI(
      getIdpConfiguration(configurationKeys.injiAppDownloadURI) ??
        process.env.REACT_APP_INJI_DOWNLOAD_URI
    );
  }, []);

  const fetchQRCode = async () => {
    setQr("");
    setError(null);
    try {
      setStatus({
        state: states.LOADING,
        msg: t("loading_msg"),
      });
      let { response, errors } = await post_GenerateLinkCode(
        getTransactionId()
      );

      if (errors != null && errors.length > 0) {
        setError({
          errorCode: errors[0].errorCode,
          defaultMsg: errors[0].errorMessage,
        });
      } else {
        let injiDeepLinkURI =
          getIdpConfiguration(configurationKeys.injiDeepLinkURI) ??
          process.env.REACT_APP_INJI_DEEP_LINK_URI;

        injiDeepLinkURI = injiDeepLinkURI.replace(
          deepLinkParamPlaceholder.linkCode,
          response.linkCode
        );

        injiDeepLinkURI = injiDeepLinkURI.replace(
          deepLinkParamPlaceholder.linkExpiryDate,
          response.expireDateTime
        );
        GenerateQRCode(injiDeepLinkURI);
        setStatus({ state: states.LOADED, msg: "" });
        triggerLinkStatus(response.transactionId, response.linkCode);
      }
    } catch (error) {
      setError({
        prefix: t("link_code_refresh_failed"),
        errorCode: error.message,
        defaultMsg: error.message,
      });
    }
  };

  const triggerLinkStatus = async (transactionId, linkCode) => {
    try {
      let timeLeft = timeoutInSeconds;
      let timePassed = 0;
      let interval = setInterval(function () {
        timePassed++;
        timeLeft = timeoutInSeconds - timePassed;
        if (timeLeft === 0) {
          clearInterval(interval);
        }
      }, 1000);

      let linkStatusResponse;
      while (timeLeft > 0) {
        try {
          linkStatusResponse = await post_LinkStatus(transactionId, linkCode);
        } catch {
          //ignore
        }

        //return if invalid transactionId;
        if (linkStatusResponse?.errors[0] === "invalid_transaction") {
          clearInterval(interval);
          setError({
            errorCode: linkStatusResponse.errors[0].errorCode,
            defaultMsg: linkStatusResponse.errors[0].errorMessage,
          });
          return;
        }

        //Break if response is returned
        if (linkStatusResponse?.response) {
          clearInterval(interval);
          break;
        }
      }

      //No response
      if (!linkStatusResponse || !linkStatusResponse?.response) {
        setError({
          errorCode: t("qr_code_expired"),
          defaultMsg: t("qr_code_expired"),
        });
        return;
      }

      if (
        linkStatusResponse?.errors != null &&
        linkStatusResponse?.length > 0
      ) {
        setError({
          errorCode: linkStatusResponse.errors[0].errorCode,
          defaultMsg: linkStatusResponse.errors[0].errorMessage,
        });
      } else {
        let response = linkStatusResponse.response;
        if (response.linkStatus != "LINKED") {
          setError({
            errorCode: t("failed_to_link"),
          });
        } else {
          setQr(null);
          setStatus({
            state: states.LOADING,
            msg: t("link_auth_waiting"),
          });
          triggerLinkAuth(response.transactionId, linkCode);
        }
      }
    } catch (error) {
      setError({
        prefix: t("link_code_refresh_failed"),
        errorCode: error.message,
        defaultMsg: error.message,
      });
    }
  };

  const triggerLinkAuth = async (transactionId, linkedCode) => {
    try {
      let timeLeft = timeoutInSeconds;
      let timePassed = 0;
      let interval = setInterval(function () {
        timePassed++;
        timeLeft = timeoutInSeconds - timePassed;
        if (timeLeft === 0) {
          clearInterval(interval);
        }
      }, 1000);

      let linkAuthResponse;
      while (timeLeft > 0) {
        try {
          linkAuthResponse = await post_AuthorizationCode(
            transactionId,
            linkedCode
          );
        } catch {
          //ignore
        }

        //return if invalid transactionId;
        if (linkAuthResponse?.errors[0] === "invalid_transaction") {
          clearInterval(interval);
          setError({
            errorCode: linkAuthResponse.errors[0].errorCode,
            defaultMsg: linkAuthResponse.errors[0].errorMessage,
          });
          return;
        }

        //Break if response is returned
        if (linkAuthResponse?.response) {
          clearInterval(interval);
          break;
        }
      }

      //No response
      if (!linkAuthResponse || !linkAuthResponse?.response) {
        setError({
          errorCode: t("authorization_failed"),
          defaultMsg: t("authorization_failed"),
        });
        return;
      }

      if (
        linkAuthResponse?.errors != null &&
        linkAuthResponse?.errors.length > 0
      ) {
        setError({
          errorCode: linkAuthResponse.errors[0].errorCode,
          defaultMsg: linkAuthResponse.errors[0].errorMessage,
        });
      } else {
        setStatus({
          state: states.LOADING,
          msg: t("redirecting_msg"),
        });

        let response = linkAuthResponse.response;
        //Redirect
        let params = "?";
        if (response.nonce) {
          params = params + "nonce=" + response.nonce + "&";
        }

        if (response.state) {
          params = params + "state=" + response.state + "&";
        }

        window.location.replace(
          response.redirectUri + params + "code=" + response.code
        );
      }
    } catch (error) {
      setError({
        prefix: t("link_code_status_failed"),
        errorCode: error.message,
        defaultMsg: error.message,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-6 items-center">
        <div className="flex justify-center col-start-2 col-span-4">
          <h1 className="text-center text-sky-600 font-semibold">
            {t("sign_in_with_inji")}
          </h1>
        </div>
      </div>
      <p className="text-center text-black-600 font-semibold my-2">
        {t("scan_with_inji")}
      </p>
      <div className="app flex justify-center">
        {status.state === states.LOADING && error === null && (
          <div>
            <LoadingIndicator size="medium" message={status.msg} />
          </div>
        )}
        {error && (
          <div className="w-full">
            <ErrorIndicator
              prefix={error.prefix}
              errorCode={error.errorCode}
              defaultMsg={error.defaultMsg}
            />
            <div className="flex w-full justify-center">
              <button
                type="button"
                className="flex justify-center w-2/3 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={fetchQRCode}
              >
                {t("refresh")}
              </button>
            </div>
          </div>
        )}
        {qr && !error && (
          <div className="border border-4 border-sky-600 rounded-3xl p-2 w-52 h-52">
            <img src={qr} />
            <div className="flex justify-center">
              <p className=" w-22 bg-[#F8F8F8] text-center">{t("inji_app")}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-black-600 font-semibold mt-6 mb-2">
        {t("dont_have_inji")}&nbsp;
        <a href={downloadURI} className="text-sky-600">
          {t("download_now")}
        </a>
      </p>
    </>
  );
}
