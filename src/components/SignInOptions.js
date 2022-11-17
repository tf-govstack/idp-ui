import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "../common/LoadingIndicator";
import { LoadingStates as states } from "../constants/states";

export default function SignInOptions({
  localStorageService,
  handleSignInOptionClick,
  i18nKeyPrefix = "signInOption",
}) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });

  const { getOuthDetails } = {
    ...localStorageService,
  };

  const [status, setStatus] = useState({ state: states.LOADED, msg: "" });
  const [singinOptions, setSinginOptions] = useState(null);

  const modalityIconPath = {
    PIN: "images/sign_in_with_otp.png",
    OTP: "images/sign_in_with_otp.png",
    WALLET: "images/Sign in with Inji.png",
    BIO: "images/Sign in with fingerprint.png",
  };

  useEffect(() => {
    setStatus({ state: states.LOADING, msg: t("loading_msg") });

    let oAuthDetails = JSON.parse(getOuthDetails());
    let authFactors = oAuthDetails.authFactors;

    let loginOptions = [];

    authFactors.forEach((authFactor) => {
      loginOptions.push({
        label: authFactor[0].type,
        value: authFactor,
        icon: modalityIconPath[authFactor[0].type],
      });
    });

    setSinginOptions(loginOptions);
    setStatus({ state: states.LOADED, msg: "" });
  }, []);

  return (
    <>
      <h1 class="text-center text-black-600 mb-10 font-bold text-lg">
        {t("login_option_heading")}
      </h1>

      {status.state === states.LOADING && (
        <div>
          <LoadingIndicator size="medium" message={status.msg} />
        </div>
      )}

      {status.state === states.LOADED && singinOptions && (
        <div className="divide-y-2">
          {singinOptions.map((option, idx) => (
            <div key={idx}>
              <button
                class="text-gray-500 font-semibold text-base"
                onClick={(e) => handleSignInOptionClick(option.value)}
              >
                <div class="flex items-center">
                  <img class="w-7" src={option.icon} />
                  <span class="ml-4 mb-4 mt-4">
                    {t("login_with", {
                      option: t(option.label),
                    })}
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
