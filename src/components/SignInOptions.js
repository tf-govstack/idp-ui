import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ErrorIndicator from "../common/ErrorIndicator";
import LoadingIndicator from "../common/LoadingIndicator";
import { LoadingStates as states } from "../constants/states";

export default function SignInOptions() {
  const { t } = useTranslation();

  const [status, setStatus] = useState({ state: states.LOADED, msg: "" });
  const [singinOptions, setSinginOptions] = useState(null);

  const modalityIconPath = {
    PIN: "images/sign_in_with_otp.png",
    Inji: "images/Sign in with Inji.png",
    Biometrics: "images/Sign in with fingerprint.png",
  };

  useEffect(() => {
    setStatus({ state: states.LOADING, msg: t("loading_msg") });

    //TODO integration with Auth factors
    // let oAuthDetails = JSON.parse(window.localStorage.getItem("oauth_details"));
    // let authFactors = oAuthDetails.authFactors;

    // if (authFactors === null || authFactors.size === 0) {
    //   setStatus({ state: ERROR, msg: "Options to signing not found!" });
    //   return;
    // }

    //dummy
    let loginOptions = [
      { value: "PIN", icon: modalityIconPath["PIN"], navigateTo: "login" },
      { value: "Inji", icon: modalityIconPath["Inji"], navigateTo: "login" },
      {
        value: "Biometrics",
        icon: modalityIconPath["Biometrics"],
        navigateTo: "login",
      },
    ];

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

      {status.state === states.ERROR && (
        <>
          <ErrorIndicator message={status.msg} />
        </>
      )}

      {status.state === states.LOADED && singinOptions && (
        <div className="divide-y-2">
          {singinOptions.map((option) => (
            <div>
              <Link
                class="text-gray-500 font-semibold text-base"
                to={option.navigateTo}
                replace="true"
              >
                <div class="flex items-center">
                  <img class="w-7" src={option.icon} />
                  <span class="ml-4 mb-4 mt-4">
                    {t("login_with", {
                      option: option.value,
                    })}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
